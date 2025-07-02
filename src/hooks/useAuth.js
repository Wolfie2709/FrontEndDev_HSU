"use client"

import { useState, useEffect } from "react"
import { userAPI } from "../services/api"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const userData = await userAPI.login(email, password)
      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setError(null)
      return userData
    } catch (err) {
      setError("Invalid email or password")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const newUser = await userAPI.create({
        ...userData,
        favorites: [],
      })
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      setError(null)
      return userWithoutPassword
    } catch (err) {
      setError("Failed to create account")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateUser = async (userData) => {
    try {
      const updatedUser = await userAPI.update(user.id, userData)
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      return updatedUser
    } catch (err) {
      setError("Failed to update profile")
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
  }
}
