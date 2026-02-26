import { verifyToken } from "@/lib/auth"
import connect from "@/lib/mongoose"
import Budget from "@/models/Budget"
import { NextRequest, NextResponse } from "next/server"


function formatDate(year: string, month: string) {
    const normalizedMonth = String(Number(month)).padStart(2, '0')
    return `${year}-${normalizedMonth}`
}

export async function POST(req: NextRequest) {
    try {
        await connect()

        const authHeader = req.headers.get("authorization")
        if (!authHeader) return NextResponse.json({ message: 'token is required' }, { status: 400 })

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 400 })

        const userId = decoded.userId || decoded.id
        if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 400 })

        const body = await req.json()
        const { limit, month, year } = body

        if (!limit || !month || !year) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
        }

        // Validate month is between 1-12
        const monthNum = Number(month)
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return NextResponse.json({ message: 'Month must be between 1 and 12' }, { status: 400 })
        }

        // Validate year
        const yearNum = Number(year)
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
            return NextResponse.json({ message: 'Invalid year' }, { status: 400 })
        }

        const numericLimit = typeof limit === 'string' ? Number(limit) : limit
        
        // Validate limit is a positive number
        if (isNaN(numericLimit) || numericLimit <= 0) {
            return NextResponse.json({ message: 'Limit must be a positive number' }, { status: 400 })
        }

        const formattedDate = formatDate(year, month)

        // Check if budget already exists for this month and year
        const existingBudget = await Budget.findOne({ 
            userId, 
            month: formattedDate 
        })

        if (existingBudget) {
            return NextResponse.json({ 
                message: `Budget already set for ${formattedDate}. Current limit is ${existingBudget.totalLimit}`,
                alreadyExists: true
            }, { status: 409 }) // 409 Conflict status
        }

        // Create new budget since it doesn't exist
        const budget = await Budget.create({
            userId,
            month: formattedDate,
            totalLimit: numericLimit,
            categories: [],
            createdAt: new Date(),
            updatedAt: new Date()
        })

        console.log(budget)

        return NextResponse.json({ 
            message: `Limit set to ${numericLimit} for ${formattedDate}`, 
            budget: budget,
            alreadyExists: false
        }, { status: 201 }) // 201 Created status

    } catch (error: any) {
        console.log('POST /limit.ts: ', error.message)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connect()

        const authHeader = req.headers.get("authorization")
        if (!authHeader) return NextResponse.json({ message: 'token is required' }, { status: 400 })

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 400 })

        const userId = decoded.userId || decoded.id
        if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 400 })

        const body = await req.json()
        const { limit, month, year } = body

        if (!limit || !month || !year) return NextResponse.json({ message: 'No fields to update' }, { status: 400 })

        const numericLimit = typeof limit === 'string' ? Number(limit) : limit
        const formattedDate = formatDate(year, month)

        const budgetLimits = await Budget.findOneAndUpdate(
            { userId, month: formattedDate },
            { $set: { totalLimit: numericLimit } },
            { new: true }
        );


        return NextResponse.json({ message: `Updated budget for ${formattedDate}`, budget: budgetLimits }, { status: 200 })

    } catch (error: any) {
        console.log('GET limit.ts: ', error.message)
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        await connect()

        const authHeader = req.headers.get("authorization")
        if (!authHeader) return NextResponse.json({ message: 'token is required' }, { status: 400 })

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 400 })

        const userId = decoded.userId || decoded.id
        if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 400 })

        const searchParams = req.nextUrl.searchParams
        const monthParam = searchParams.get("month")
        const yearParam = searchParams.get("year")

        const now = new Date()

        const month = monthParam ? Number(monthParam) : now.getMonth() + 1
        const year = yearParam ? Number(yearParam) : now.getFullYear()

        const formattedDate = `${year}-${String(month).padStart(2, '0')}`


        const budgetDetails = await Budget.find({ userId, month: formattedDate }).sort({ createdAt: -1 })
        if (budgetDetails.length === 0) return NextResponse.json({ message: "No budget is found" }, { status: 400 })

        return NextResponse.json({ budget: budgetDetails }, { status: 200 })
    } catch (error: any) {
        console.log('GET limit.ts: ', error.message)
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}