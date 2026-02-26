import connect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // App Router POST handler
    try {
        await connect();

        const body = await req.json();
        const { name, email, password } = body ?? {};

        // validation
        if (!name || !email || !password) {
            return NextResponse.json({ message: "All input details are required!" }, { status: 400 });
        }

        // existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        // hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        // sign token
        const token = await signToken({ userId: user._id });

        return NextResponse.json(
            {
                token,
                user: { id: user._id, name: user.name, email: user.email },
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("register route error:", err?.message || err);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}