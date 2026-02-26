"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToken } from "../context/UserContext"

interface User {
  name: string
  email?: string
}

export default function Navbar({user}: {user: User | null}){
    const [showPopup, setShowPopup] = useState<Boolean>(false)

    const { setToken } = useToken()
    const router = useRouter()

    const handleLogout = () => {
        console.log('Logging out...')
        setToken(null)
        localStorage.removeItem("token")
        router.push('/login')
    }

    return(
    <div className="w-full relative py-2 flex justify-between px-10 items-center border-1 border-gray-300">
        <h1 className="text-xl font-extrabold text-neutral-800">Finance Tracker</h1>
        <div className="relative">
        <div onClick={() => {setShowPopup(prev => !prev)}} className="flex cursor-pointer justify-center items-center bg-emerald-950 rounded-full w-10 h-10">
           <h3 className="text-xl text-white font-medium uppercase">
            {user?.name ? user.name[0] : '?'}
           </h3>
        </div>
        {showPopup && <div className="bg-white py-0.5 px-1.5 min-w-[100px] absolute top-full right-0 mt-2 rounded shadow-md border-2 border-gray-500 flex flex-col gap-1">
            <p onClick={() => {router.push('/profile')}} className="text-md font-medium text-gray-500 cursor-pointer hover:bg-gray-200 py-0.5 px-1">Profile</p>
            <hr className="text-gray-500" />
            <p onClick={handleLogout} className="text-md font-medium text-gray-500 cursor-pointer hover:bg-gray-200 py-0.5 px-1">Logout</p>
        </div>}
        </div>
    </div>
    )
}