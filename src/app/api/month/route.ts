

import { verifyToken } from "@/lib/auth";
import mongoose from 'mongoose'
import connect from "@/lib/mongoose";
import { Types } from 'mongoose';
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connect()
        const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization")
        if (!authHeader) return NextResponse.json({ message: 'Authorization is required' }, { status: 401 })

        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
        if(!token) return NextResponse.json({message: "Token is required"}, {status: 401})
        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 })

        const userId = decoded.userId || decoded.id
        if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 })

        const transactionMonth = await Transaction.aggregate([
             { $match: { userId: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ])

        return NextResponse.json(transactionMonth, { status: 200 })
    } catch (error: any) {
        console.log('/month/api', error.message)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
} 