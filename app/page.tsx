"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import HomePage from "@/components/home-page"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen">
      {!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <HomePage onLogout={handleLogout} />}
    </div>
  )
}
