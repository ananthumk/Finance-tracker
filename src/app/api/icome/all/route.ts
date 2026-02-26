import { verifyToken } from "@/lib/auth";
import connect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        await connect()
        
        const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
        if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        if (!token) return NextResponse.json({ message: "Token is required" }, { status: 401 });
        
        const decoded: any = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        
        const userId = decoded?.userId ?? decoded?.id;
        if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams
        const monthParam = searchParams.get("month")
        const yearParam = searchParams.get("year")
        
        const page = parseInt(searchParams.get("page") || "1")
        const limit = 10 

        const skip = (page - 1) * limit 

        const now = new Date()
        const month = monthParam ? parseInt(monthParam) -1 : now.getMonth()
        const year = yearParam ? parseInt(yearParam) : now.getFullYear()
        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)
        console.log('startDate: ', startDate);
        console.log('endDate: ', endDate);

        
        const transactions = await Transaction.find({ userId, date: {$gte: startDate, $lte: endDate}}).sort({ date: -1 })
        .skip(skip).limit(limit);

        const total = await Transaction.countDocuments({ userId, date: {$gte: startDate, $lte: endDate} })

        const totalPages = Math.ceil(total / limit)
        
        const itemsShownSoFar = Math.min(skip + transactions.length, total)
        const displayText = `${itemsShownSoFar} out of ${total}`

        console.log('transaction all success: ', transactions.length);
        
        return NextResponse.json({ transactions, pagination: {
         totalItems: total,
         currentPage: page,
         totalPages: totalPages,
         itemsPerPage: limit,
         itemsRetrieved: transactions.length,
         text: displayText
        } }, { status: 200 })
 
     } catch (error: any) {
        console.error('income - all.ts: ', error?.message ?? error)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
     }
}