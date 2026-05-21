import { createContext, useContext, useState } from 'react'

const USERS_KEY = 'techshop_users'
const SESSION_KEY = 'techshop_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'))

  function login(username, password) {
    if (username === 'admin' && password === 'admin123') {
      const u = { id: 0, username: 'admin', email: 'admin@techshop.kg', fullname: 'Администратор', role: 'admin' }
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      setUser(u)
      return { ok: true, user: u }
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find(u => u.username === username && u.password === password)
    if (!found) return { ok: false, error: 'Неверный логин или пароль' }
    localStorage.setItem(SESSION_KEY, JSON.stringify(found))
    setUser(found)
    return { ok: true, user: found }
  }

  function register({ username, email, password, fullname }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (users.find(u => u.username === username)) return { ok: false, error: 'Логин уже занят' }
    if (users.find(u => u.email === email)) return { ok: false, error: 'Email уже используется' }
    const newUser = { id: Date.now(), username, email, password, fullname, role: 'user' }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
