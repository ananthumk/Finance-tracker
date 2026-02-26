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


interface User {
    name: string
    email?: string
}

export default function DashBoard() {
    const [user, setUser] = useState<User | null>(null)
    const [addTransaction, setAddTransaction] = useState(false)
    const [editTranscation, setEditTransaction] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [updateId, setUpdatedId] = useState(null)
    const [updateDetails, setUpdatedDetails] = useState(null)
    const [dates, setDates] = useState([])
    
    const { token, month, year, setMonth, setYear } = useToken()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<User>('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Fetch user in Dashboard', response)
                if (response.status === 200 || response.status === 201) {
                    setUser(response.data.user)
                    console.log('Success in fetch user in dashboard: ', response.data)
                } else {
                    console.log('Failed To fetch User: ', response)
                }
            } catch (error: any) {
                console.log('Fetch user in Dashboard', error)
            }

        }
        fetchData()
    }, [token])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/month', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    setDates(response.data)
                    console.log('Date month: ', response)
                } else {
                    console.log('date month: ', response)
                }
            } catch (error: any) {
                console.log('Date month: ', error.message)
            }
        }

        fetchData()
    }, [token])

    console.log(updateId, updateDetails)


    const handleMonthDate = (date) => {
        switch (date) {
            case "1":
                return "January"
            case "2":
                return "Feburary"
            case "3":
                return "March"
            case "4":
                return "April"
            case "5":
                return "May"
            case "6":
                return "June"
            case "7":
                return "July"
            case "8":
                return "August"
            case "9":
                return "September"
            case "10":
                return "Octcber"
            case "11":
                return "November"
            case "12":
                return "December"
        }
    }

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
                    <Summary />
                    <Graph />
                    <Transaction  setAddTransaction={setAddTransaction} setUpdatedId={setUpdatedId} setUpdatedDetails={setUpdatedDetails} setEditTransaction={setEditTransaction} />
                </div>
                <div style={{ zIndex: 1000 }} onClick={() => {
                    setAddTransaction(prev => !prev)
                }} className={`h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-12 lg:w-12 mt-10 rounded-2xl z-1 cursor-pointer flex justify-center items-center ${addTransaction ? "bg-neutral-50" : "bg-gray-400"} fixed bottom-4 right-4 sm:right-6 md:right-10`}>
                    {addTransaction ? <IoCloseSharp className="w-5 h-5 sm:w-6 sm:h-6" /> : <FaPlus className="text-lg sm:text-xl md:text-2xl" />}
                </div>

            </div>
            {addTransaction && <AddTransaction setAddTransaction={setAddTransaction} />}
            {editTranscation && <UpdateTransaction updateDetails={updateDetails} updateId={updateId} setEditTransaction={setEditTransaction} />}
        </>
    )
}