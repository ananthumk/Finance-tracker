"use client"
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { BiSolidShow } from "react-icons/bi";
import { PiEyeClosed } from "react-icons/pi";
import axios from 'axios'
import { useRouter } from "next/navigation"

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '', 
        email: '', 
        password: ''
    });
    const [viewPassword, setViewPassword] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [login, setLogin] = useState(false)
    const [register, setRegister] = useState(false)

    const router = useRouter()

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            console.log('Inputs: ', userDetails)
            const response = await axios.post(endpoint, userDetails)
            if(response.status === 200 || response.status === 201){
                localStorage.setItem('token', response.data.token)
                setUserDetails({
                    name: '', email: "", password: ''
                })
                router.push("/dashBoard")
            } else {
                setErrMsg(response.data.message)
            }
        } catch (err: any) {
            console.log(err);
            setErrMsg(err.message)
        }
    };
   
    const handleRegister = () => {
        setIsRegister(prev => !prev)
    }

    const btnName = isRegister ? 'Create Account' : 'Login'
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
            <div className="flex flex-col justify-center gap-3 items-center bg-white rounded-md px-7 py-5 md:py-8 md:px-10 shadow">
                  <h1 className='text-xl font-medium text-gray-500'>{`${isRegister ? 'Create An Account': "Login"}`}</h1>
                  <div className='flex justify-center w-full gap-2 items-center border border-gray-400 py-2 px-4 rounded-xl'>
                       <h2 className='text-gray-600 font-medium text-md'>Continue with</h2>
                       <FaGoogle className='w-4 h-4 text-gray-700' />
                  </div>
                  <div className="flex flex-col  text-sm text-gray-400 text-center">
                    <p className="">or</p>
                    <p>Sign in with your email and password</p>
                  </div>
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 items-start min-w-[300px]">
                      {isRegister && <div className="flex flex-col w-full gap-1">
                         <label className="text-gray-600 font-medium text-[14px]">Name</label>
                         <input type="text" placeholder="Enter Your Full Name" value={userDetails.name} name='name' onChange={handleInput}
                          className="w-full py-2 px-4 text-sm text-gray-400 outline-none border rounded-sm border-gray-300" required/>
                      </div>}
                      <div className="flex flex-col w-full gap-1">
                         <label className="text-gray-600 font-medium text-[14px]">Email</label>
                         <input type="email" placeholder="Enter Your Email" value={userDetails.email} name='email' onChange={handleInput}
                          className="w-full py-2 px-4 text-sm text-gray-400 outline-none border rounded-sm border-gray-300" required/>
                      </div>
                      <div className="flex flex-col w-full gap-1">
                         <label className="text-gray-600 font-medium text-[14px]">Password</label>
                          <div className="w-full px-4  flex justify-between items-center outline-none border rounded-sm border-gray-300">
                          <input type={`${viewPassword ? 'text': 'password'}`} value={userDetails.password} name='password' onChange={handleInput} placeholder="Enter Your Password"
                           className="w-full py-2 text-sm text-gray-400 border-none outline-none" required/>
                           {viewPassword ? <PiEyeClosed onClick={() => setViewPassword(false)} className="w-5 h-5 cursor-pointer text-gray-400" /> :
                           <BiSolidShow onClick={() => setViewPassword(true)} className="w-5 h-5 cursor-pointer text-gray-400" />}
                         </div>
                      </div>
                      <button type="submit" className="w-full flex justify-center items-center py-1 text-md font-medium 
                      bg-gray-600 text-white rounded cursor-pointer">{btnName}</button>
                      <p className="text-sm text-gray-500">
                        {`${isRegister ? 'Already have a account?' : "Don't have a account?"}`}  
                        <span onClick={handleRegister} className="font-medium text-gray-700 cursor-pointer hover:underline"> Click here</span></p>
                  </form>
                  {errMsg && <p className="text-red-600 text-sm text-center">{errMsg}</p>}
            </div>
        </div>
    );
}