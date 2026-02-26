import { verifyToken } from "@/lib/auth";
import connect from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'


export async function GET(req: NextRequest){
    try {
        await connect()
        const authHeader = req.headers.get("authorization")
        if(!authHeader) return NextResponse.json({ message: 'token is required' }, { status: 401 })

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 })

        // token payload may be JwtPayload or string; login uses { userId: ... }
        const userId = typeof decoded === 'string' ? undefined : (decoded as any).userId || (decoded as any).id
        if (!userId) return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 })

        const user = await User.findById(userId).select('-password')
        if(!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

        return NextResponse.json({ user }, { status: 200 })

    } catch (error: any) {
        console.error('me.ts: ', error.message)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "Token is required" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    // Extract userId from token payload
    const userId =
      typeof decoded === "string"
        ? undefined
        : (decoded as any).userId || (decoded as any).id;

    if (!userId)
      return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

    // Parse request body
    const body = await req.json();
    const { email, name, password } = body as {
      email?: string;
      name?: string;
      password?: string;
    };

    // If no fields provided
    if (!email && !name && !password)
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });

    // Prepare update data
    const updatedData: Record<string, any> = {};
    if (email) updatedData.email = email;
    if (name) updatedData.name = name;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    // ✅ Correct Mongoose syntax — must pass (id, data, options)
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, select: "-password" }
    );

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/me.ts error:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}