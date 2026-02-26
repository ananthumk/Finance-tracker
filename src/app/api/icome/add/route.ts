import { verifyToken } from "@/lib/auth";
import connect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        await connect()

        // Robust Authorization parsing (accept "Bearer <token>" or raw token)
        const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
        if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        if (!token) return NextResponse.json({ message: "Token is required" }, { status: 401 });

        // verify token and extract userId reliably
        const decoded: any = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        const userId = decoded?.userId ?? decoded?.id;
        if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

        // parse and validate body
        const body = await req.json();
        const { type, amount, category, note, date } = body;
        if (!type || amount === undefined || !category || !date) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        if (type !== "income" && type !== "expense") {
            return NextResponse.json({ message: "Invalid type" }, { status: 400 });
        }

        const parsedAmount = typeof amount === "string" ? Number(amount) : amount;
        if (!Number.isFinite(parsedAmount)) return NextResponse.json({ message: "Invalid amount" }, { status: 400 });

        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return NextResponse.json({ message: "Invalid date" }, { status: 400 });

        // Create transaction with userId (fixes the required field error)
        const tx = await Transaction.create({
            type,
            amount: parsedAmount,
            category,
            note,
            date: parsedDate,
            userId: userId
        });

        return NextResponse.json({ message: `Transaction of ${type} added`, transaction: tx }, { status: 201 });
    } catch (error: any) {
        console.error("add.ts", error?.message ?? error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}