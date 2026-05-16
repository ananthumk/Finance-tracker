"use client"

import { useEffect, useState } from "react"
import Graph from "../components/graph"
import Navbar from "../components/navbar"
import Summary from "../components/summary"
import Transaction from "../components/transaction"
import axios from "axios"
import { FaPlus } from "react-icons/fa6";
import AddTransaction from "../components/addTransaction"
import { IoCloseSharp } from "react-icons/io5";
import UpdateTransaction from "../components/updateTransaction"
import { useToken } from "../context/UserContext"
import NotTransaction from '../components/notTransaction'
import ProtectedRoute from "../components/ProtectedRoute"

interface User {
    name: string
    email: string,
    createdAt?: string,
    familyId?: string
    role: string
    _id: string
    __v: number
}

interface UserResponse {
    user: User
}

interface MonthYearId {
    month: number
    year: number
}

interface MonthResponse {
    _id: MonthYearId
}

type TransactionState = 'loading' | 'empty' | 'error' | 'has-data'

function DashBoardContent() {
    const [user, setUser] = useState<User | null>(null)
    const [addTransaction, setAddTransaction] = useState<boolean>(false)
    const [editTranscation, setEditTransaction] = useState<boolean>(false)
    const [updateId, setUpdatedId] = useState<string | null>(null)
    const [updateDetails, setUpdatedDetails] = useState(null)
    const [dates, setDates] = useState<MonthResponse[]>([])
    const [transactionState, setTransactionState] = useState<TransactionState>('loading')
    const [change, hasChange] = useState(0)

    const { token, month, year, setMonth, setYear } = useToken()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<UserResponse>('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    setUser(response.data.user)
                } else {
                    // Failed to fetch user
                }
            } catch (error: any) {
                // Error fetching user
            }

        }
        fetchData()
    }, [token])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<MonthResponse[]>('/api/month', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    setDates(response.data)
                } else {
                    // Failed
                }
            } catch (error: any) {
                // Error
            }
        }

        fetchData()
    }, [token, change])

    const handleMonthDate = (date: string) => {
        const months = ["", "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return months[Number(date)] || "";
    };

    return (
        <>
            <div className="min-h-screen w-full 
            absolute bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                <Navbar user={user} />
                <div className="flex flex-col gap-5 py-4 px-10">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-neutral-900">Welcome! {user?.name}</h1>
                            <p className="text-md text-gray-600">Track your Finance!</p>
                        </div>
                        {dates.length > 0 && (
                            <select
                                value={`${month}-${year}`}
                                onChange={(e) => {
                                    const [m, y] = e.target.value.split('-')
                                    setMonth(Number(m))
                                    setYear(Number(y))
                                }}
                                className="max-w-[140px] py-2 px-1.5 border-0 rounded text-[13px] font-medium text-white bg-gray-600"
                            >
                                {dates.map((d) => (
                                    <option
                                        key={`${d._id.month}-${d._id.year}`}
                                        value={`${d._id.month}-${d._id.year}`}
                                    >
                                        {`${handleMonthDate(String(d._id.month))} ${d._id.year}`}
                                    </option>
                                ))}
                            </select>
                        )}

                    </div>
                    <Summary change={change} />
                    
                    {transactionState === 'empty' && (
                        <NotTransaction setAddTransaction={setAddTransaction} />
                    )}

                    {transactionState === 'has-data' && (
                        <Graph change={change} />
                    )}

                    <div className={transactionState === 'empty' ? 'hidden' : ''}>
                        <Transaction
                            setAddTransaction={setAddTransaction}
                            setUpdatedId={setUpdatedId}
                            setUpdatedDetails={setUpdatedDetails}
                            setEditTransaction={setEditTransaction}
                            onDataLoaded={() => {}}
                            onStateChange={setTransactionState}
                            hasChange={hasChange}
                            change={change}
                        />
                    </div>
                </div>
                <div style={{ zIndex: 1000 }} onClick={() => {
                    setAddTransaction(prev => !prev)
                }} className={`h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-12 lg:w-12 mt-10 rounded-2xl z-1 cursor-pointer flex justify-center items-center ${addTransaction ? "bg-neutral-50" : "bg-gray-400"} fixed bottom-4 right-4 sm:right-6 md:right-10`}>
                    {addTransaction ? <IoCloseSharp className="w-5 h-5 sm:w-6 sm:h-6" /> : <FaPlus className="text-lg sm:text-xl md:text-2xl" />}
                </div>

            </div>
            {addTransaction && <AddTransaction hasChange={hasChange} setAddTransaction={setAddTransaction} />}
            {editTranscation && <UpdateTransaction hasChange={hasChange} updateDetails={updateDetails} updateId={updateId} setEditTransaction={setEditTransaction} />}
        </>
    )
}

export default function DashBoard() {
    return (
        <ProtectedRoute>
            <DashBoardContent />
        </ProtectedRoute>
    )
}