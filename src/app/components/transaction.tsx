"use client"
import { FaSearch, FaBusAlt, FaShieldAlt } from "react-icons/fa";
import { GiCoffeeCup } from "react-icons/gi";
import { BsThreeDots } from "react-icons/bs";
import { MdLocalGroceryStore, MdLocalDining, MdHealthAndSafety } from "react-icons/md";
import { BiSolidParty } from "react-icons/bi";
import { TiShoppingCart } from "react-icons/ti";
import { IoSchool } from "react-icons/io5";
import { FaHouse, FaMoneyBills } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useToken } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ColorRing } from "react-loader-spinner";

const apiStatus = {
  loading: 'loading',
  success: 'success',
  error: 'error'
}

const colors = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Teal Blue  
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint Green
  "#FFEAA7", // Soft Yellow
  "#DDA0DD", // Plum Purple
  "#98D8C8", // Seafoam
  "#F7DC6F", // Golden Yellow
  "#BB8FCE", // Lavender
  "#F8C471", // Sandy Orange
  "#82CCDD", // Ice Blue
  "#F1948A"  // Peach Red
];

export default function Transaction({ setAddTransaction, setUpdatedId, setUpdatedDetails, setEditTransaction }) {
  const [transaction, setTransaction] = useState([])
  const [openSettingsId, setOpenSettingsId] = useState(null)
  const [status, setStatus] = useState(apiStatus.loading)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    itemsPerPage: 0,
    itemsRetrieved: 0,
    text: "0 out of 0"
  })
  const [type, setType] = useState('')
  const [filterTransaction, setFilterTransaction] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const { token, year, month } = useToken()

  const fetchData = async () => {
    try {
      setStatus(apiStatus.loading)
      const response = await axios.get(`/api/icome/all?month=${month}&year=${year}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        const updatedTransactions = response.data.transactions.map((t: any) => ({
          ...t,
          settings: false
        }))
        setTransaction(updatedTransactions)
        setPagination(response.data.pagination)
        setStatus(apiStatus.success)
      } else {
        setStatus(apiStatus.error)
        console.log(response)
      }
    } catch (error: any) {
      console.log('Error on transaction.tsx: ', error.message)
      setStatus(apiStatus.error)
    }
  }

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token, month, page, year])

  useEffect(() => {
    const filtered = transaction.filter((item: any) =>
      item.category.toLowerCase().includes(searchValue.toLowerCase()) &&
      item.type.toLowerCase().includes(type.toLowerCase())
    )
    setFilterTransaction(filtered)
  }, [type, transaction, searchValue])

  const renderIcon = (category: string) => {
    switch (category) {
      case "Groceries": return <MdLocalGroceryStore size={20} />;
      case "Rent": return <FaHouse size={20} />;
      case "Utilities": return <FaMoneyBills size={20} />;
      case "Dining Out": return <MdLocalDining size={20} />;
      case "Education": return <IoSchool size={20} />;
      case "Shopping": return <TiShoppingCart size={20} />;
      case "Transportation": return <FaBusAlt size={20} />;
      case "Transport": return <FaBusAlt size={20} />;
      case "Entertainment": return <BiSolidParty size={20} />;
      case "Healthcare": return <MdHealthAndSafety size={20} />;
      case "Insurance": return <FaShieldAlt size={20} />;
      default: return <GiCoffeeCup size={20} />;
    }
  };

  const handleSettings = (id: string) => {
    setOpenSettingsId((prev) => prev === id ? null : id)
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await axios.delete(`/api/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200 || response.status === 201) {
        toast.success("Transaction deleted successfully")
        setTransaction(prev => prev.filter(t => t._id !== id))
      } else {
        toast.error("Failed to delete the transaction")
      }
    } catch (error: any) {
      console.log('While Deleting transaction: ', error.message)
      toast.error("Failed to delete the transaction")
    }
  }

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value)
  }

  const renderFailure = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500 mb-4">OOps! Something went wrong</p>
        <button
          onClick={() => fetchData()}
          className="w-[120px] py-1.5 px-auto text-sm text-white bg-blue-500 rounded-sm border-0 outline-0 font-medium">
          Try again
        </button>
      </div>
    )
  }

  const renderNoTransaction = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500">No transactions found for this month.</p>
        <button
          onClick={() => setAddTransaction(true)}
          className="mt-4 py-1.5 px-auto text-sm text-white bg-blue-500 rounded-sm border-0 outline-0 font-medium">
          Add Transaction
        </button>
      </div>
    )
  }

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Recent Transactions</h2>
        <div className="flex mt-3 md:mt-0 items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-sm px-2 py-1 gap-1">
            <FaSearch size={13} className="text-gray-400" />
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search..."
              className="outline-0 text-[13px] font-medium"
            />
          </div>
          <select
            onChange={(e) => setType(e.target.value)}
            className="py-1.5 outline-0 text-[13px] font-medium rounded-sm px-3 border border-gray-500">
            <option value="">All</option>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[13px] text-gray-500">Result Showing {pagination?.text}</p>
      </div>

      {status === apiStatus.loading && (
        <div className="flex justify-center py-10">
          <ColorRing visible={true} height="60" width="60" />
        </div>
      )}

      {status === apiStatus.error && renderFailure()}

      {status === apiStatus.success && transaction.length === 0 && renderNoTransaction()}

      {status === apiStatus.success && transaction.length > 0 && (
        <div className="flex flex-col gap-2">
          {(filterTransaction.length > 0 ? filterTransaction : transaction)?.map((item, i) => (
            <div key={item._id} className="group flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}>
                  {renderIcon(item.category)}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {item.category} <span className={`text-xs rounded-md px-1 border-0 ${item.type === 'income' ? 'bg-green-400' : 'bg-red-400'} text-white`}>{item.type}</span>
                  </p>
                  <p className="text-xs text-gray-400">{item.note}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold text-[#000]`}>
                  ₹{item.amount}
                </p>
                <div className="relative">
                  <button
                    onClick={() => handleSettings(item._id)}
                    className="p-2 lg:hidden lg:group-hover:block cursor-pointer rounded-sm hover:bg-neutral-300">
                    {openSettingsId === item._id ? <IoMdClose size={16} /> : <BsThreeDots size={16} />}
                  </button>
                  {openSettingsId === item._id && (
                    <div className="absolute right-0 top-8 bg-white shadow-md rounded-md z-10 w-24 py-1">
                      <p
                        onClick={() => {
                          setUpdatedDetails(item)
                          setUpdatedId(item._id)
                          setEditTransaction(true)
                        }}
                        className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                        Edit
                      </p>
                      <p
                        onClick={() => handleDeleteTransaction(item._id)}
                        className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                        Delete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={pagination.currentPage === 1}
          className="px-3 py-1 rounded bg-gray-300 text-gray-600 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium">{pagination.currentPage} / {pagination.totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-3 py-1 rounded bg-gray-300 text-gray-600 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}