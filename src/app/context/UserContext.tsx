"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AppContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  month: number | null;
  setMonth: (month: number | null) => void;
  year: number | null;
  setYear: (year: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [month, setMonth] = useState<number | null>(9);
  const [year, setYear] = useState<number | null>(2025);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);

    const storedMonth = localStorage.getItem("month");
    if (storedMonth) setMonth(Number(storedMonth));

    const storedYear = localStorage.getItem("year");
    if (storedYear) setYear(Number(storedYear));
  }, []);

  useEffect(() => {
    if (month !== null) localStorage.setItem("month", String(month));
  }, [month]);

  useEffect(() => {
    if (year !== null) localStorage.setItem("year", String(year));
  }, [year]);

  return (
    <AppContext.Provider value={{ token, setToken, month, setMonth, year, setYear }}>
      {children}
    </AppContext.Provider>
  );
}

export function useToken() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useToken must be used inside AppProvider");
  return context;
}
