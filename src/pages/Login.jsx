import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (user) { navigate('/'); return null }

  function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const username = fd.get('username').trim()
    const password = fd.get('password')
    if (!username || !password) { setError('Заполните все поля'); return }
    const result = login(username, password)
    if (!result.ok) { setError(result.error); return }
    setSuccess(`Добро пожаловать, ${result.user.username}! Перенаправление…`)
    setTimeout(() => navigate(result.user.role === 'admin' ? '/admin' : '/'), 800)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link to="/" className="auth-logo">⚡ TechShop</Link>
        <h2>Добро пожаловать!</h2>
        <p className="auth-sub">Войдите в свой аккаунт</p>
        {error && <div className="alert alert-error show">{error}</div>}
        {success && <div className="alert alert-success show">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input name="username" placeholder="Введите логин" required autoComplete="username" />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" name="password" placeholder="Введите пароль" required autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-submit">Войти</button>
        </form>
        <div className="auth-switch">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></div>
        <div className="auth-switch" style={{ marginTop: '0.5rem' }}><Link to="/">← Вернуться в магазин</Link></div>
      </div>
    </div>
  )
}
