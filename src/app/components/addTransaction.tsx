"use client"
import axios from "axios";
import { useContext, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AppProvider, useToken } from "../context/UserContext";

interface INfo {
   type: string,
   amount: number,
   category: string,
   note: string,
   date: string
}

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

export default function AddTransaction({ setAddTransaction }: { setAddTransaction: (value: boolean) => void }) {

   const [info, setInfo] = useState<INfo>({
      type: 'expense',
      amount: 0,
      category: '',
      note: '',
      date: ''
   })

   const [successMsg, setSuccessMsg] = useState('')
   const [errMsg, setErrMsg] = useState('')


   const handleChanges = (e: any) => {
      const { name, value } = e.target
      setInfo((prev: any) => ({
         ...prev,
         [name]: value
      }))
   }

   const { token } = useToken()

   const handleSubmit = async (e: any) => {
      e.preventDefault()
      if (!info.type || !info.amount || !info.category || !info.date) {
         setErrMsg('All fields are required')
         return
      }
      if (Number(info.amount) <= 0) {
         setErrMsg('Amount must be greater than 0')
         return
      }
      try {
         const response = await axios.post('/api/icome/add', info, { headers: { Authorization: `Bearer ${token}` } })
         if (response.status === 200 || response.status === 201) {
            setSuccessMsg('Transaction Added Successfully')
            setErrMsg('')
            setTimeout(() => {
               setAddTransaction(false)
            }, 2000)
         } else {
            setErrMsg(response.data.message)
            setSuccessMsg('')
         }
      } catch (error: any) {
         console.log('Error at adding transaction: ', error.message)
         setSuccessMsg('')
         setErrMsg(error.message)
      }
   }

   const categoriesOption = info.type === 'income' ? income_category : expense_category
   return (
      <div className="min-w-full z-10 fixed  min-h-screen bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
         <div className="bg-white flex flex-col gap-3 min-w-[300px] md:min-w-[400px] md:max-w-[370px] p-5 rounded">
            <div className="flex justify-between w-full items-center">
               <h2 className="text-lg font-medium">Add New Transaction</h2>
               <IoCloseSharp onClick={() => setAddTransaction(false)} className="w-4 h-4 cursor-pointer" />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
               <div className="flex flex-col gap-1">
                  <label htmlFor="type" className="text-[13px] text-gray-500">Type</label>
                  <select name="type" onChange={handleChanges} id="type" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0">
                     <option value='expense' className="text-[12px] py-0.5 px-4">Expense</option>
                     <option value='income' className="text-[12px] py-0.5 px-4">Income</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1">
                  <label htmlFor="amount" className="text-[13px] text-gray-500">Amount</label>
                  <input name="amount" onChange={handleChanges} id="amount" type="number" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0" placeholder="Enter your amount" />
               </div>
               <div className="flex flex-col gap-1">
                  <label htmlFor="category" className="text-[13px] text-gray-500">Category</label>
                  <select name="category" onChange={handleChanges} id="category" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0">
                     <option value="text-[12px] py-0.5 px-4" disabled>
                        Select Category
                     </option>
                     {categoriesOption.map((cat) => (
                        <option key={cat} value={cat} className="text-[12px] py-0.5 px-4">
                           {cat}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="flex flex-col gap-1">
                  <label htmlFor="note" className="text-[13px] text-gray-500">Note</label>
                  <textarea name="note" onChange={handleChanges} id="note" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0 min-h-[100px]" />
               </div>
               <div className="flex flex-col gap-1">
                  <label htmlFor="date" className="text-[13px] text-gray-500">Date</label>
                  <input name="date" onChange={handleChanges} id="date" type="date" className="w-full py-1.5 px-4 text-[12px] rounded-sm border-1 border-gray-200 outline-0" placeholder="Enter your amount" />
               </div>
               <div className="grid grid-cols-2 gap-10">
                  <button type="submit" className="py-1.5 md:py-2 px-4 rounded-sm cursor-pointer bg-blue-500 text-white text-md">
                     Submit
                  </button>
                  <button onClick={() => setAddTransaction(false)} className="py-1.5 md:py-2 px-4 bg-gray-300 rounded-md cursor-pointer text-neutral-600 text-md">
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