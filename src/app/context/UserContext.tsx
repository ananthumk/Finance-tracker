"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AppContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  month: number | null;
  setMonth: (month: number | null) => void;
  year: number | null;
  setYear: (year: number | null) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function syncTokenToCookie(token: string | null){
  if (token) {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; 
  } else {
    document.cookie = `token=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setIsToken] = useState<string | null>(null);
  const [month, setIsMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [year, setIsYear] = useState<number | null>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedMonth = localStorage.getItem("month");
    const storedYear = localStorage.getItem("year");

    const now = new Date()

    if(storedToken){
      setIsToken(storedToken)
      syncTokenToCookie(storedToken)
    }

    setIsMonth(storedMonth ? parseInt(storedMonth) : now.getMonth() + 1);
    setIsYear(storedYear ? parseInt(storedYear) : now.getFullYear());

    setIsLoading(false);
  }, []);
  
  const setToken = (newToken: string | null) => {
    setIsToken(newToken);
    if(newToken){
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
      
      localStorage.removeItem("month");
      localStorage.removeItem("year");
    }

    syncTokenToCookie(newToken)
  }

  const setMonth = (newMonth: number | null) => {
    setIsMonth(newMonth);
    if (newMonth !== null) localStorage.setItem("month", String(newMonth))
  }

  const setYear = (newYear: number | null) => {
    setIsYear(newYear);
    if (newYear !== null) localStorage.setItem("year", String(newYear))
  }

  return (
    <AppContext.Provider value={{ token, setToken, month, setMonth, year, setYear, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useToken() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useToken must be used inside AppProvider");
  return context;
}
