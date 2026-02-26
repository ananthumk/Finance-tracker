import { signToken } from "@/lib/auth";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // App Router POST handler
    try {
        await connect();

        // parse JSON safely
        let body: any;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
        }

        // sanitize inputs
        const rawEmail = (body?.email ?? "").toString();
        const rawPassword = (body?.password ?? "").toString();
        const email = rawEmail.trim().toLowerCase();
        const password = rawPassword;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and Password are required" }, { status: 400 });
        }

        // basic email format check
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
        }

        // check for user (include password)
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 401 });
        }

        // matching password
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return NextResponse.json({ message: "Invalid Password" }, { status: 401 });
        }

        // sign token
        const token = await signToken({ userId: existingUser._id.toString() });

        return NextResponse.json(
            {
                token,
                user: { id: existingUser._id, name: existingUser.name, email: existingUser.email },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login error:", error?.message || error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}