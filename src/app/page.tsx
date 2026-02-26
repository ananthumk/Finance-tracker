"use client";
import Image from "next/image";
import LoginPage from "./login/page";
import Link from "next/link"
import DashBoard from "./dashBoard/page";
import ProfilePage from "./profile/page";
import { useToken } from "./context/UserContext";

export default function Home() {
  const { token } = useToken();

  return (
    <div className="font-sans w-full">
      {token ? <DashBoard /> : <LoginPage />}
    </div>
  );
}
