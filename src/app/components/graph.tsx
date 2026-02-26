"use client"
import { useEffect, useState } from "react";
import CategoryGraph from "./categoryGraph"
import { FaArrowTrendUp } from "react-icons/fa6";
import { ComposedChart, Bar, Legend, Tooltip, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import axios from "axios";
import { useToken } from "../context/UserContext";
import Loader from "./Loader";

const apiStatus = {
    loading: 'loading',
    success: 'success',
    error: 'error'
}

export default function Graph() {
    const [expenses, setExpenses] = useState<any[]>([])
    const [status, setStatus] = useState<string>(apiStatus.loading)
    const { token } = useToken()

    useEffect(() => {
        if (!token) return

        const fetchData = async () => {
            try {
                const response = await axios.get('/api/transition/month', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    setExpenses(response.data.monthlyExpenses ?? [])
                    setStatus(apiStatus.success)
                } else {
                    setStatus(apiStatus.error)
                }
            } catch (error: any) {
                console.log('Month Limit: ', error)
                setStatus(apiStatus.error)
            }
        }

        fetchData()
    }, [token])

    const renderError = () => {
        return (
            <div className='h-full w-full flex flex-col justify-center items-center gap-2'>
                <p className='text-center text-lg text-gray-800 font-semibold'>Failed to Load data. Try again later.</p>
                <button className='ml-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600'>Retry</button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryGraph />
            <div className="w-full py-4 px-2 md:p-4 flex flex-col gap-4 bg-white rounded min-h-[200px]">
                <div className="flex items-center gap-3">
                    <FaArrowTrendUp className="w-6 h-6 text-green-700" />
                    <h2 className="text-lg font-medium">Monthly Trend</h2>
                </div>
                {status === apiStatus.loading && <Loader />}
                {status === apiStatus.success && expenses.length > 0 && (
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={expenses}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="totalExpense" fill="#8884d8" name="Total Expense" />
                            <Line yAxisId="right" type="monotone" dataKey="transactionCount" stroke="#82ca9d" name="Transaction Count" />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
                {status === apiStatus.success && expenses.length === 0 && (
                    <div className="h-full w-full flex justify-center items-center">
                        <p className="text-center text-lg text-gray-800 font-semibold">No data available for the selected month.</p>
                    </div>
                )}
                {status === apiStatus.error && renderError()}
            </div>
        </div>
    )
}