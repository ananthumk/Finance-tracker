import { verifyToken } from "@/lib/auth";
import connect from "@/lib/mongoose";
import Budget from "@/models/Budget";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        await connect();
        
        const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
        if(!authHeader) return NextResponse.json({ message: "Authorization header required" }, { status: 401 });

        // Accept either "Bearer <token>" or raw token
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        if(!token) return NextResponse.json({ message: "Token is required" }, { status: 401 });

        const decoded: any = verifyToken(token);
        if(!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        
        const userId = decoded.userId || decoded.id;
        if(!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams
        const monthParam = searchParams.get("month")
        const yearParam = searchParams.get("year")
        
        const now = new Date()
        const month = monthParam ? parseInt(monthParam) : now.getMonth() + 1
        const year = yearParam ? parseInt(yearParam) : now.getFullYear()
        
        // Format for budget query
        const formattedMonth = `${year}-${String(month).padStart(2, '0')}`

        // Create date range for transaction query
        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0)
        const endDate = new Date(year, month, 0, 23, 59, 59, 999)

        // Find transactions within the date range
        const transactions = await Transaction.find({ 
            userId, 
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Find budget for the month
        const budgetDoc = await Budget.findOne({ userId, month: formattedMonth }); 

        const expenseTransactions = transactions.filter(t => t.type === "expense");
        const incomeTransactions = transactions.filter(t => t.type === "income");

        const totalExpense = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        const budgetLimit = budgetDoc ? (budgetDoc.totalLimit ?? budgetDoc.limit ?? 0) : 0;
        const remaining = budgetLimit - totalExpense;
        const percentageUsed = budgetLimit > 0 ? ((totalExpense / budgetLimit) * 100).toFixed(2) : 0;

        return NextResponse.json({
            summary: {
                totalExpense,
                totalIncome,
                budgetLimit,
                remaining,
                percentageUsed: parseFloat(percentageUsed as string),
                balance: totalIncome - totalExpense, // Net balance
                month: formattedMonth
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('summary.ts:', error?.message || error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}