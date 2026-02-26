import { verifyToken } from "@/lib/auth";
import connect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        await connect()

        const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization")
        if(!authHeader) return NextResponse.json({message: 'Authorization is required'}, {status: 401})

        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader 
        if(!token) return NextResponse.json({message: "Token is required"}, {status: 401})

        const decoded: any = verifyToken(token)
        if(!decoded) return NextResponse.json({message: "Invalid Token"}, {status: 401})

        const userId = decoded?.userId ?? decoded?.id 
        if(!userId) return NextResponse.json({message: 'Invalid token Payload'}, {status: 401})

        const searchParams = req.nextUrl.searchParams
        const monthParam = searchParams.get("month")
        const yearParam = searchParams.get("year")

        const now = new Date()
        const month = monthParam ? parseInt(monthParam) -1 : now.getMonth()
        const year = yearParam ? parseInt(yearParam) : now.getFullYear()

        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)

        const expenses = await Transaction.find({ userId, type: 'expense', date: {$gte: startDate, $lte: endDate}})
        if(!expenses || expenses.length === 0) return NextResponse.json({message: "No transaction to show", expenses:[]}, {status: 200})

        return NextResponse.json({expenses}, {status: 200})
    } catch (error: any) {
        console.log('Error on transition/expense: ', error.message)
        return NextResponse.json({message: 'Something went wrong! Try again later'}, {status: 500})
    }
}