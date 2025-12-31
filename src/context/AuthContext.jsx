import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('medicalAI_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const demoUser = {
      id: Date.now().toString(),
      email: email,
      name: email.split('@')[0],
      role: 'doctor'
    }
    setUser(demoUser)
    localStorage.setItem('medicalAI_user', JSON.stringify(demoUser))
    return Promise.resolve()
  }

  const signup = async (email, password, name) => {
    const demoUser = {
      id: Date.now().toString(),
      email: email,
      name: name,
      role: 'doctor'
    }
    setUser(demoUser)
    localStorage.setItem('medicalAI_user', JSON.stringify(demoUser))
    return Promise.resolve()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('medicalAI_user')
  }

  const value = { user, login, signup, logout }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}