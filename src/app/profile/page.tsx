"use client"

import { useRouter } from "next/navigation";
import { IoPersonSharp, IoSettings, IoPerson, IoClose, IoLogOutSharp } from "react-icons/io5";
import { FaLock, FaCalendarAlt, FaRupeeSign, FaSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { BsGraphUpArrow } from "react-icons/bs";
import { FcApproval } from "react-icons/fc";
import { FaCheck, FaCalendarCheck, FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToken } from "../context/UserContext";
import { X, Plus } from 'lucide-react';

interface User {
  name: string;
  email: string;
  password: string;
}

interface Summary {
  balance: number;
  budgetLimit: number;
  month: string;
  percentageUsed: number;
  remaining: number;
  totalExpense: number;
  totalIncome: number;
}

interface BudgetInfo {
  categories: string[];
  totalLimit: number;
  month: string;
  userId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<User>({ name: '', email: '', password: '' });
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);
  const [expense, setExpense] = useState<Summary | null>(null);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editBudgetLimit, setEditBudgetLimit] = useState(false);

  const [addLimit, setAddLimit] = useState<boolean>(false)

  const router = useRouter();
  const { token, month, year } = useToken();
  const [budgetDetails, setBudgetDetails] = useState({ month: month, limit: '', year: year });

  const [limitDetails, setLimitDetails] = useState({ month: '', year: '', limit: '' })

  const backToDashBoard = () => {
    router.push('/dashBoard');
  };


  useEffect(() => {
    if (user?.name && user?.email) {
      setUserInfo({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200 || response.status === 201) {
          console.log('Success at fetching user at profile: ', response.data);
          setUser(response.data.user);
        } else {
          console.log('Failed to fetch user at profile: ', response.data);
        }
      } catch (error) {
        console.log('Error at fetch user in profile: ', error);
      }
    };
    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axios.get(`/api/budget/limit?month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200 || response.status === 201) {
          console.log('Success at fetching budget: ', response.data);
          setBudgetInfo(response.data.budget[0]);
        } else {
          console.log('Failed at fetching budget: ', response.data);
        }
      } catch (e: any) {
        console.log('Error at fetching budget: ', e.message);
      }
    };
    if (token && month && year) fetchBudget();
  }, [token, month, year]);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`/api/budget/summary?month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200 || response.status === 201) {
          console.log('budget summary: ', response);
          setExpense(response.data.summary);
        } else {
          console.log('Failed on fetching expense: ', response.data);
        }
      } catch (error: any) {
        console.log(`Error while fetching Expense: `, error.message);
      }
    };
    if (token && month && year) fetchExpense();
  }, [token, month, year]);

  const handletoggle = (value: string) => {
    if (value === "name") {
      setEditName(prev => !prev);
    } else if (value === "email") {
      setEditEmail(prev => !prev);
    } else if (value === "password") {
      setEditPassword(prev => !prev);
    } else if (value === "budget") {
      setEditBudgetLimit(prev => !prev);
    }
  };


  const updateUserInfo = async () => {
    try {
      const response = await axios.put('/api/auth/me', userInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        console.log('Success at updating user: ', response);
        setUser({ ...user, ...userInfo });
        setEditName(false);
        setEditEmail(false);
        setEditPassword(false);
      } else {
        console.log('Failed while updating user: ', response);
      }
    } catch (error: any) {
      console.log('Error while updating user: ', error);
    }
  };


  const updateBudgetLimit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/budget/limit', budgetDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        console.log('Success at update budget limit: ', response);
        setEditBudgetLimit(false);
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error: any) {
      console.log('Error while updating budget limit: ', error);
    }
  };

  const handleMonthDate = (d: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[d - 1] || "";
  };

  // percentage calculation
  const totalExpense = expense?.totalExpense || 0;
  const totalLimit = budgetInfo?.totalLimit || 0;
  const percentage = totalLimit ? Math.min((totalExpense * 100) / totalLimit, 100) : 0;
  const remainPercentage = Math.round(100 - percentage);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 6 }, (_, i) => 2020 + i);

  const handleLimitChanges = (e: any) => {
    const { value, name } = e.target
    setLimitDetails(prev => ({
      [name]: value,
      ...prev
    }))
  }

  const handlePostLimit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await axios.post(`/api/budget/limit`, limitDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 201) {
        setAddLimit(false)
      }
      else if (response.status === 409) {
        console.log(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderAddBudget = () => {
    return (
      <form onSubmit={handlePostLimit} className="bg-white z-1 shadow-xl min-w-[270px]  rounded-sm py-2.5 px-4 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <select className="border-2 outline-0 border-gray-300 py-1.5 px-1 rounded-sm text-[13px] font-medium"
            onChange={handleLimitChanges}
            name="month"
            required>
            <option value="">Select Month</option>
            {months.map((m, i) => (
              <option className="py-1.5 px-2 text-sm font-medium" key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select className="border-2 outline-0 ] border-gray-300 py-1.5 px-1 rounded-sm text-[13px] font-medium"
            onChange={handleLimitChanges}
            name="year"
            required>
            <option value="">Select Year</option>
            {years.map((y) => (
              <option className="py-1.5 px-2 text-sm font-medium" key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <input type="number" placeholder="eg: 100" required onChange={handleLimitChanges} name="limit"
          className="border-2 py-1.5 px-4 border-gray-300 outline-0 text-sm font-medium bg-transparent rounded-sm text-gray-700" />
        <button type="submit" className="py-1.5 px-5 rounded-sm border-0 outline-0 bg-gradient-to-r from-gray-400 to-gray-500 text-md font-medium
        hover:from-gray-500 hover:to-gray-600 text-white">Set Month Limit</button>
      </form>
    )
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* Header */}
      <div className="flex items-center w-full shadow bg-white mx-auto py-3">
        <div className="w-[80%] mx-auto">
          <button
            onClick={backToDashBoard}
            className="flex justify-center bg-neutral-50 text-amber-500 hover:bg-neutral-100 transition-colors cursor-pointer font-semibold items-center py-2 px-5 rounded"
          >
            Go To Dashboard
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="w-[80%] mx-auto flex flex-col gap-4 py-5">
        <div className="bg-white rounded-lg shadow-sm min-h-[200px] max-h-[300px] flex flex-col justify-center items-center gap-3 py-8 px-4">
          {/* Avatar with Badge */}
          <div className="relative mb-2">
            <div className="w-20 h-20 flex justify-center items-center rounded-full bg-gradient-to-b from-violet-500 to-blue-500 shadow-lg">
              <IoPersonSharp className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
              <FcApproval className="w-5 h-5" />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">{user?.name || 'Loading...'}</h2>
            <p className="text-sm text-gray-600 font-medium">{user?.email || 'Loading...'}</p>
          </div>
        </div>

        {/* Account & monthy Expense Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm min-h-[200px] py-4 px-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-blue-300 to-blue-500 flex justify-center items-center">
                <IoSettings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#003049]">Account Settings</h2>
            </div>

            {/* Username Field */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2">
                <IoPerson className="w-3 h-3 text-blue-400" />
                <p className="text-md font-medium text-[#003049]">Username</p>
              </label>
              {editName ? (
                <div className="flex items-center gap-2">
                  <input
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="py-2 px-4 text-md font-medium text-gray-500 w-full rounded bg-white border border-blue-400"
                    placeholder={user?.name}
                    value={userInfo?.name}
                  />
                  <div onClick={() => setEditName(false)} className="w-8 h-8 flex justify-center items-center bg-[#9c0b0b] rounded cursor-pointer hover:bg-[#630404]">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div onClick={updateUserInfo} className="w-8 h-8 flex justify-center items-center bg-[#03045e] rounded cursor-pointer hover:bg-[#001f3f]">
                    <FaCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between py-2 px-4 bg-gradient-to-r from-neutral-100 rounded to-blue-100">
                  <p className="text-md font-medium text-gray-400">{user?.name || 'Loading...'}</p>
                  <div className="w-8 h-8 rounded shadow bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <RiEdit2Fill onClick={() => handletoggle('name')} className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2">
                <MdEmail className="w-3 h-3 text-violet-400" />
                <p className="text-md font-medium text-[#003049]">Email</p>
              </label>
              {editEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="py-2 px-4 text-md font-medium text-gray-500 w-full rounded bg-white border border-blue-400"
                    placeholder={user?.email}
                    value={userInfo.email}
                  />
                  <div onClick={() => setEditEmail(false)} className="w-8 h-8 flex justify-center items-center bg-[#9c0b0b] rounded cursor-pointer hover:bg-[#630404]">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div onClick={updateUserInfo} className="w-8 h-8 flex justify-center items-center bg-[#03045e] rounded cursor-pointer hover:bg-[#001f3f]">
                    <FaCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between py-2 px-4 bg-gradient-to-r from-neutral-100 rounded to-blue-100">
                  <p className="text-md font-medium text-gray-400">{user?.email || 'Loading...'}</p>
                  <div className="w-8 h-8 rounded shadow bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <RiEdit2Fill onClick={() => handletoggle('email')} className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2">
                <FaLock className="w-3 h-3 text-red-400" />
                <p className="text-md font-medium text-[#003049]">Password</p>
              </label>
              {editPassword ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    className="py-2 px-4 text-md font-medium text-gray-500 w-full rounded bg-white border border-blue-400"
                    placeholder="Enter new password"
                    value={userInfo.password}
                  />
                  <div onClick={() => setEditPassword(false)} className="w-8 h-8 flex justify-center items-center bg-[#9c0b0b] rounded cursor-pointer hover:bg-[#630404]">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div onClick={updateUserInfo} className="w-8 h-8 flex justify-center items-center bg-[#03045e] rounded cursor-pointer hover:bg-[#001f3f]">
                    <FaCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between py-2 px-4 bg-gradient-to-r from-neutral-100 rounded to-blue-100">
                  <p className="text-lg font-medium text-gray-400">••••••••</p>
                  <div className="w-8 h-8 rounded shadow bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <RiEdit2Fill onClick={() => handletoggle('password')} className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-white rounded-lg shadow-sm min-h-[200px] py-4 px-5 flex flex-col gap-3">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-green-300 to-green-500 flex justify-center items-center">
                  <BsGraphUpArrow className="w-4 h-4 text-white font-extrabold" />
                </div>
                <h2 className="text-md font-bold text-[#003049]">Monthly Spending Limit</h2>
              </div>
              <div className="relative">
                <button onClick={() => { setAddLimit(prev => !prev) }}
                  className="p-1 relative cursor-pointer rounded-sm font-medium bg-blue-500 text-white hover:bg-blue-700"
                >{addLimit ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}</button>
                {addLimit && <div className="absolute top-0 right-full mr-2 z-10">{renderAddBudget()}</div>}
              </div>
            </div>

            <div className="w-full rounded min-h-[100px] flex flex-col gap-3 py-2 px-3 bg-gradient-to-l from-green-50 to-green-100">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Current Monthly Limit</p>
                  <p className="text-[12px] flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3 text-green-500" />
                    {handleMonthDate(month ?? 0)} {year}
                  </p>
                </div>
                <div className="flex flex-col text-end gap-1">
                  <h2 className="text-lg font-bold text-green-600">₹{budgetInfo?.totalLimit || 0}</h2>
                  <p className="text-[13px] text-green-600">+12% from last month</p>
                </div>
              </div>


              <div className="relative">
                <div className="w-full absolute h-2 rounded bg-gray-300"></div>
                <div
                  className={`w-[${percentage}%] relative h-2 bg-gradient-to-l rounded ${totalExpense > totalLimit
                    ? "from-red-400 to-red-600"
                    : "from-green-400 to-blue-400"
                    }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                  <p className="text-[12px] text-gray-500">₹{totalExpense.toLocaleString()} spent</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`${totalExpense > totalLimit ? 'bg-red-500' : 'bg-blue-500'} order-2 w-2 h-2 rounded-full`}></div>
                  {totalExpense > totalLimit ? (
                    <p className="text-[12px] text-red-500">Exceeded limit!</p>
                  ) : (
                    <p className="text-[12px] text-green-500">{remainPercentage}% remaining</p>
                  )}
                </div>
              </div>
            </div>

            {editBudgetLimit ? (
              <form onSubmit={updateBudgetLimit} className="flex flex-col gap-2">
                {/* <div className="flex flex-col gap-1">
                  <label htmlFor="date" className="text-[12px] flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3 text-blue-600" /> Select Month
                  </label>
                  <input
                    onChange={(e) => {
                      const value = e.target.value;
                      const [y, m] = value.split("-");
                      setBudgetDetails({ ...budgetDetails, month: m, year: y });
                    }}
                    id="date"
                    type="month"
                    className="text-[14px] rounded border border-gray-400 text-gray-500 outline-blue-300 py-2 px-4"
                  />
                </div> */}

                <div className="flex flex-col gap-1">
                  <label htmlFor="limit" className="text-[12px] flex items-center gap-1">
                    <FaRupeeSign className="w-3 h-3 text-green-500" /> Amount Limit
                  </label>
                  <input
                    onChange={(e) => setBudgetDetails({ ...budgetDetails, limit: e.target.value })}
                    id="limit"
                    type="number"
                    className="text-[14px] rounded border border-gray-400 outline-blue-300 text-gray-500 py-2 px-4"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 text-sm text-white py-1.5 px-2 rounded-sm bg-gradient-to-l from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 flex justify-center items-center gap-2 cursor-pointer transition-all"
                  >
                    <FaSave className="w-4 h-4" /> Save Changes
                  </button>
                  <div
                    onClick={() => handletoggle('budget')}
                    className="w-10 h-10 bg-neutral-100 rounded flex justify-center items-center hover:bg-neutral-200 cursor-pointer transition-colors"
                  >
                    <IoClose className="w-5 h-5" />
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full py-2 px-3 bg-blue-200 rounded">
                  <div className="flex items-center gap-2">
                    <FaCalendarCheck className="w-4 h-4 text-blue-600" />
                    <p className="text-[12px] font-medium">Selected Month</p>
                  </div>
                  <h2 className="text-md mt-1 font-semibold">{month ? handleMonthDate(month) : ''} {year}</h2>
                </div>
                <div className="w-full py-2 px-3 bg-blue-200 rounded">
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="w-4 h-4 text-green-600" />
                    <p className="text-[12px] font-medium">Limit Amount</p>
                  </div>
                  <h2 className="text-md mt-1 font-semibold">₹{totalLimit.toLocaleString()}</h2>
                </div>
              </div>
            )}
            {!editBudgetLimit && (
              <button
                onClick={() => handletoggle('budget')}
                className="w-full py-3 rounded text-white cursor-pointer font-medium text-sm px-4 flex justify-center gap-2 items-center bg-gradient-to-l from-blue-500 via-violet-500 to-fuchsia-500 hover:from-blue-600 hover:via-violet-600 hover:to-fuchsia-600 transition-all"
              >
                <RiEdit2Fill className="w-4 h-4 text-white" />
                Edit Monthly Limit
                <FaArrowRightLong className="w-5 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center pb-6 md:pb-8">
        <button className="max-w-[300px] rounded cursor-pointer py-2 px-6 text-[15px] hover:shadow-lg hover:shadow-red-500/50 font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex justify-center items-center gap-2 transition-all duration-200">
          <IoLogOutSharp className="w-4 h-4" /> Logout from Account
        </button>
      </div>
    </div>
  );
}
