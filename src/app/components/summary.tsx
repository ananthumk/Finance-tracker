"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useToken } from "../context/UserContext"

interface Summary {
  balance: number
  budgetLimit: number
  month: string
  percentageUsed: number
  remaining: number
  totalExpense: number
  totalIncome: number
}

interface SummaryResponse {
  summary: Summary
}

export default function Summary(){
    const [summary, setSummary] = useState<Summary | null>(null)
    const {token, year, month} = useToken()
    console.log(month)
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const response = await axios.get<SummaryResponse>(`/api/budget/summary?month=${month}&year=${year}`, {headers: {Authorization: `Bearer ${token}`}})
                if(response.status === 200 || response.status === 201){
                     setSummary(response.data.summary)
                     console.log('Fetch Summary success: ', response.data)
                }else{
                    console.log('Failed to summary: ', response.data)
                }
            } catch (error) {
                console.log('Error on summary: ', error)
            }
        }
        fetchData()
    }, [token,month])
    return(
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="bg-white p-4 rounded shadow-md">
                <p className="text-md text-gray-500">Total Expense</p>
                <h3 className="text-xl text-black font-bold">₹{summary?.totalExpense || 0}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
                <p className="text-md text-gray-500">Total Income</p>
                <h3 className="text-xl text-black font-bold">₹{summary?.totalIncome ||0}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
                <p className="text-md text-gray-500">Budget Limit</p>
                <h3 className="text-xl text-black font-bold">₹{summary?.budgetLimit || 0}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
                <p className="text-md text-gray-500">Balance</p>
                <h3 className="text-xl text-black font-bold">₹{summary?.balance || 0}</h3>
            </div>
        </div>
    )
}