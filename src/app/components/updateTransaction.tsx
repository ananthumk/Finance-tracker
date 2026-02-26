"use client"

import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5";
import { AppProvider, useToken } from "../context/UserContext";

const income_category = [
    "Salary",
    "Freelance",
    "Business",
    "Bonus",
    "Investment",
    "Interest",
    "Gift",
    "Other"
];

const expense_category = [
    "Food",
    "Rent",
    "Transport",
    "Utilities",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Education",
    "Travel",
    "EMI",
    "Other"
]

interface TransactionDetails {
    type: string;
    amount: number;
    category: string; 
    note: string;
    date: string;
}

export default function UpdateTransaction({ updateDetails, updateId, setEditTransaction }: 
    { updateDetails: any, updateId: any, setEditTransaction: (value: boolean) => void }) {
    const [details, setDetails] = useState<TransactionDetails | null>(null)
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setDetails((prev: any) => {
    if (name === "type") {
      return {
        ...prev,
        type: value,
        category: "", 
      };
    }

    return {
      ...prev,
      [name]: value,
    };
  });
    }

    const { token } = useToken()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const response = await axios.put(`/api/icome/${updateId}`, details, { headers: { Authorization: `Bearer ${token}` } })
            if (response.status === 200 || response.status === 201) {
                setSuccessMsg('Transaction updated successfully')
                setErrMsg('')
                setTimeout(() => {
                    setEditTransaction(false)
                }, 2000);
            } else {
                setErrMsg(response.data.message)
                setSuccessMsg('')
            }
        } catch (error: any) {
            console.log('Error at updating transcation: ', error.message)
            setErrMsg(error.message)
        }
    }

    useEffect(() => {
        setDetails(updateDetails)
    }, [updateDetails, updateId])

    const categoriesOptions = details?.type === 'expense' ? expense_category : income_category
    return (
        <div className="min-w-full z-10 fixed  min-h-screen bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <div className="bg-white flex flex-col gap-3 min-w-[300px] md:min-w-[400px] md:max-w-[370px] p-5 rounded">
                <div className="flex justify-between w-full items-center">
                    <h2 className="text-lg font-medium">Update Transaction</h2>
                    <IoCloseSharp onClick={() => { setEditTransaction(false) }} className="w-4 h-4 cursor-pointer" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="type" className="text-[13px] text-gray-500">Type</label>
                        <select onChange={handleChange} name="type" value={details?.type} id="type" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0">
                            <option value='expense' className="text-[12px] py-0.5 px-4">Expense</option>
                            <option value='income' className="text-[12px] py-0.5 px-4">Income</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="amount" className="text-[13px] text-gray-500">Amount</label>
                        <input name="amount" onChange={handleChange} value={details?.amount} id="amount" type="number" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0" placeholder="Enter your amount" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="category" className="text-[13px] text-gray-500">Category</label>
                        <select name="category" onChange={handleChange} value={details?.category} id="category" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0">
                            <option value="text-[12px] py-0.5 px-4" disabled>
                                Select Category
                            </option>
                            {categoriesOptions.map((cat) => (
                                <option key={cat} value={cat} className="text-[12px] py-0.5 px-4">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="note" className="text-[13px] text-gray-500">Note</label>
                        <textarea name="note" onChange={handleChange} value={details?.note} id="note" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0 min-h-[100px]" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="date" className="text-[13px] text-gray-500">Date</label>
                        <input name="date" onChange={handleChange} value={details?.date} id="date" type="date" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0" placeholder="Enter your amount" />
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <button type="submit" className="py-1.5 md:py-2 px-4 rounded-sm cursor-pointer bg-blue-500 text-white text-md">
                            Submit
                        </button>
                        <button onClick={() => { setEditTransaction(false) }}
                        className="py-1.5 md:py-2 px-4 bg-gray-300 rounded-sm cursor-pointer text-neutral-600 text-md">
                            Cancel
                        </button>
                    </div>
                    {successMsg && <p className="text-[13px] text-center text-green-400">{successMsg}</p>}
                    {errMsg && <p className="text-[13px] text-center text-red-500">{errMsg}</p>}
                </form>
            </div>
        </div>
    )
}