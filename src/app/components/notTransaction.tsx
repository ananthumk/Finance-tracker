import React from 'react'
import { CreditCard, Plus, TrendingUp } from 'lucide-react';
import { BiSolidCircleThreeQuarter } from "react-icons/bi";

const NotTransaction = ({ setAddTransaction }: { setAddTransaction: (value: boolean) => void }) => {
    return (
        <div className='h-[60vh] rounded-md bg-white gap-6 flex flex-col justify-center items-center border-4 border-dotted border-[#4a5759]'>

            <div className='p-2 rounded-full bg-[#7d8597]'>
                <CreditCard className='w-7 h-7 md:w-9 md:h-9 text-[#2d3142]' />
            </div>

            <div className='flex flex-col gap-2 justify-center items-center'>
                <h1 className='text-lg md:text-xl lg:text-2xl text-black font-semibold '>Start tracking your finances</h1>
                <p className='text-sm md:text-md lg:text-lg text-center text-[#212529]'>Add your first transaction to see your spending overview, charts, and insights.
                    It only takes a few seconds!</p>
                <button onClick={() => 
                    setAddTransaction(true)
                   
                }
                    className='flex cursor-pointer items-center gap-2 border-0 outline-0 rounded-sm justify-center
                 py-1 px-4 bg-[#3d405b] text-[#f8edeb] text-sm md:text-md'>
                    <Plus className='w-4 h-4' /> <span>Add Transaction</span>
                </button>
            </div>

            <div className='flex mt-4 justify-evenly w-full items-center'>

                <div className='flex flex-col items-center gap-1'>
                    <div className='p-2 rounded-full bg-[#7d8597]'>
                        <BiSolidCircleThreeQuarter className='w-4 h-4 md:w-6 md:h-6 text-[#2d3142]' />
                    </div>
                    <p className='text-[12px] md:text-sm text-[#161a1d] text-center'>Track spending by category</p>
                </div>

                <div className='flex flex-col items-center gap-1'>
                    <div className='p-2 rounded-full bg-[#7d8597]'>
                        <TrendingUp className='w-4 h-4 md:w-6 md:h-6 text-[#2d3142]' />
                    </div>
                    <p className='text-[12px] md:text-sm text-[#161a1d] text-center'>Monitor monthly trends</p>
                </div>

                <div className='flex flex-col items-center gap-1'>
                    <div className='p-2 rounded-full bg-[#7d8597]'>
                        <CreditCard className='w-4 h-4 md:w-6 md:h-6 text-[#2d3142]' />
                    </div>
                    <p className='text-[12px] md:text-sm text-[#161a1d] text-center'>Manage family expenses</p>
                </div>

            </div>

        </div>
    )
}

export default NotTransaction
