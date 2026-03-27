"use client";

import { useToken } from "./context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { token, isLoading } = useToken();
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return 
    if (token) {
      router.replace("/dashBoard")
    } else {
      router.replace("/login")
    }
  }, [token, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
