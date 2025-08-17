import { createContext, useEffect, useState } from 'react'
import api from '../api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token') 

  useEffect(() => {
    if (token && !user) {
      // no /me endpoint; just mark as authed
      setUser({ email: localStorage.getItem('email') || '' })
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.user.email)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/signup', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.user.email)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error || 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setUser(null)
  }

  const value = { user, loading, login, signup, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
