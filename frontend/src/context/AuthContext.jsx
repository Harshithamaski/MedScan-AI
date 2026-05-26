import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('medscan_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api
        .get('/auth/me')
        .then((res) => setUser(res.user))
        .catch(() => {
          localStorage.removeItem('medscan_token')
          delete api.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('medscan_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('medscan_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
