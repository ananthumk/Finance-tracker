import { verifyToken } from "@/lib/auth";
import connect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

//DELETE - Delete transaction
export async function DELETE(req: NextRequest, {params} : {params: Promise<{id: string}>}){
   try {
      await connect()

      const authHeader = req.headers.get("authorization")
      if(!authHeader) return NextResponse.json({message: 'Token is required'}, {status: 400})

      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)
      if(!decoded) return NextResponse.json({message: 'Invalid Token'}, {status: 400})
    
      const userId = decoded.userId || decoded.id 
      if(!userId) return NextResponse.json({message: 'Inavlid token payload'}, {status: 404})

      const transactionId = params.id
      const result = await Transaction.findOneAndDelete({
        _id: transactionId,
        userId: userId,
      })  

      if(!result) return NextResponse.json({message: 'Transaction not found'}, {status: 404})

      return NextResponse.json({message: 'Transaction deleted'}, {status: 200})
      
   } catch (error: any) {
      console.log('/income-delete-[id].ts', error.message)
      return NextResponse.json({message: 'Server Error'}, {status: 500})
   }
}

//PUT - Update transaction
export async function PUT(req: NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        await connect()

      const authHeader = req.headers.get("authorization")
      if(!authHeader) return NextResponse.json({message: 'Token is required'}, {status: 400})

      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)
      if(!decoded) return NextResponse.json({message: 'Invalid Token'}, {status: 400})
    
      const userId = decoded.userId || decoded.id 
      if(!userId) return NextResponse.json({message: 'Inavlid token payload'}, {status: 400})

      const {id: transactionId} = await params
      const body = await req.json()

      interface UpdateTransition {
        type?: string, 
        amount?: number | string, 
        category?: string,
        note?: string, 
        date?: string
      }

      const {type,amount, category, note, date}: UpdateTransition = body 

      const updateData: Partial<{
        type: string;
        amount: number;
        category: string;
        note: string; 
        date: Date;
      }>= {}

      if (type !== undefined) updateData.type = type 
      if (amount !== undefined) updateData.amount = typeof amount === "string" ? Number(amount) : amount 
      if (category !== undefined) updateData.category = category
      if (note !== undefined) updateData.note = note 
      if (date !== undefined) updateData.date = new Date(date)

      if (Object.keys(updateData).length === 0){
        return NextResponse.json({message: "No field to updated"}, {status: 400})
      }

      const updatedTs = await Transaction.findOneAndUpdate(
        {_id: transactionId, userId: userId},
        {$set: updateData},
        {new: true}
      )

      if(!updatedTs) return NextResponse.json({message: 'Transcation not found'}, {status: 400})
    
      return NextResponse.json({message:'Updated successfully', transaction: updatedTs}, {status: 200})
        
    } catch (error: any) {
        console.log('ivome-update-[id].ts: ', error.message)
        return NextResponse.json({message: 'Server Error'}, {status: 500})
    }
}