import { createContext, useState } from 'react'

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  const login = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue)
    setToken(tokenValue)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  return (
    <Context.Provider value={{ token, user, login, logout }}>
      {children}
    </Context.Provider>
  )
}