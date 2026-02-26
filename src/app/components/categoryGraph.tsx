"use client"
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts'
import { BiSolidCircleThreeQuarter } from "react-icons/bi";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../context/UserContext';
import Loader from './Loader';

interface DataPoint {
    name: string;
    value: number;
}

interface CustomLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}

interface TooltipPayload {
    payload: DataPoint;
    name: string;
    value: number;
    dataKey: string;
    color: string;
}

const apiStatus = {
    loading: 'loading',
    success: 'success',
    error: 'error'
}

export default function CategoryGraph() {

    const [ expenses, setExpense ] = useState<any[]>([])
    const [ status, setStatus ] = useState<string>(apiStatus.loading)

    const {token, year, month} = useToken()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/transition/expense?month=${month}&year=${year}`, 
                    { headers: { Authorization: `Bearer ${token}` } })
                if (response.status === 200 || response.status === 201) {
                    console.log('success at category graph :', response)
                    setExpense(response.data.expenses)
                    setStatus(apiStatus.success)
                } else {
                    console.log('Failed Category Graph: ', response)
                    setStatus(apiStatus.error)
                }
            } catch (error: any) {
                console.log('Error at categoryGraph: ', error)
                setStatus(apiStatus.error)
            }
        }
        fetchData()
    }, [token, month])

    const categoryValues = expenses.reduce((acc: Record<string, number>, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount
        return acc
    }, {})

    const data: DataPoint[] = Object.entries(categoryValues).map(([name, value]) => ({
        name,
        value
    }))

    const colors = ['#BF4F51', '#8A2BE2', '#FF0800', '#FDEE00', '#00FFBF', '#007FFF', '#2f3e46', '#5f0f40', '#6a994e', '#e29578',
        '#d8a48f', '#b08968', '#104911', '#e8f1f2', '#ff7b00'
    ]

    const customizedLabels = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor='middle'
                dominantBaseline='central'
                fontSize={14}
                fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>
        )
    }

    const renderError = () => {
        return(
            <div className='h-full w-full flex flex-col justify-center gap-2 items-center'>
                <p className='text-center text-lg text-gray-800 font-semibold'>Failed to Load data. Try again later.</p>
                <button className='ml-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600'>Retry</button>
            </div>
        )
    }
    return (
        <div className="bg-white p-4 rounded flex gap-2 flex-col shadow-sm">
            <div className='flex items-center gap-3'>
                <BiSolidCircleThreeQuarter className='w-6 h-6 text-gray-500' />
                <h2 className='text-lg font-medium text-gray-500'>Spending Overview</h2>
            </div>
            {status === apiStatus.loading && <Loader />}
            {status === apiStatus.success && data.length === 0 && (
                <p className='text-center my-10'>No expense data available for this month.</p>
            )}
            {status === apiStatus.success && data.length > 0 && <>
                <PieChart className='self-center' width={250} height={250}>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={customizedLabels}
                        stroke="none"
                        strokeWidth={0}
                        isAnimationActive={true}

                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>

                    {/* <Tooltip
                        formatter={(value: number, name: string, props: TooltipPayload) => [
                            `₹${value.toLocaleString()}`,
                            `${props.payload.name}`
                        ]}
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            border: '1px solid #ddd',
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15"
                        }}
                    />
                        <Legend /> */}
                
                </PieChart>
                <div className='grid grid-cols-1 mx-auto md:grid-cols-2 gap-3 md:gap-5'>
                    {Object.entries(categoryValues).map(([category, amount], i) => (
                        <div key={i} className='flex items-center gap-2'>
                            <div style={{ backgroundColor: colors[i % colors.length] }} className='w-3 h-3 rounded-full'></div>
                            <p className='text-md'>{category}</p>
                            <p className='text-md'>₹{amount}</p>
                        </div>
                    ))}


                </div>
            </>}
            {status === apiStatus.error && renderError()}
            
        </div>
    )
}