import { createContext, useContext, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token  = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    return token ? { token, userId } : null
  })

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setUser({ token: data.token, userId: data.userId })
  }

  async function register(nombre, email, password) {
    const data = await api.post('/auth/register', { nombre, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setUser({ token: data.token, userId: data.userId })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
