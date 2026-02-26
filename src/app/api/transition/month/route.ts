import { NextRequest, NextResponse } from "next/server";
import connect, { mongoose } from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const authHeader =
      req.headers.get("authorization") ?? req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json({ message: "Authorization is required" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    if (!token)
      return NextResponse.json({ message: "Token is required" }, { status: 401 });

    const decoded: any = verifyToken(token);
    const userId = decoded?.userId ?? decoded?.id;
    if (!userId)
      return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
        },
      },
      {
        $project: {
          amount: 1,
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalExpense: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
            ],
          },
          totalExpense: 1,
          transactionCount: 1,
        },
      },
    ]);

    if (!monthlyExpenses.length)
      return NextResponse.json({ message: "No Expense to show" }, { status: 200 });

    return NextResponse.json({ monthlyExpenses }, { status: 200 });
  } catch (error: any) {
    console.error("Error at transition/month:", error.message);
    return NextResponse.json(
      { message: "Something went wrong! Try again later" },
      { status: 500 }
    );
  }
}
