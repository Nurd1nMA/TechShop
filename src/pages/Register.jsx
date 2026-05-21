import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (user) { navigate('/'); return null }

  function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const fullname = fd.get('fullname').trim()
    const email = fd.get('email').trim()
    const username = fd.get('username').trim()
    const password = fd.get('password')
    const password2 = fd.get('password2')
    if (username.length < 3) { setError('Логин должен содержать минимум 3 символа'); return }
    if (password.length < 6) { setError('Пароль должен содержать минимум 6 символов'); return }
    if (password !== password2) { setError('Пароли не совпадают'); return }
    const result = register({ fullname, email, username, password })
    if (!result.ok) { setError(result.error); return }
    setSuccess('Регистрация прошла успешно! Перенаправление на вход…')
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link to="/" className="auth-logo">⚡ TechShop</Link>
        <h2>Создать аккаунт</h2>
        <p className="auth-sub">Зарегистрируйтесь, чтобы делать покупки</p>
        {error && <div className="alert alert-error show">{error}</div>}
        {success && <div className="alert alert-success show">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Полное имя</label><input name="fullname" placeholder="Имя Фамилия" required /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" placeholder="example@mail.com" required autoComplete="email" /></div>
          <div className="form-group"><label>Логин</label><input name="username" placeholder="Минимум 3 символа" required autoComplete="username" /></div>
          <div className="form-group"><label>Пароль</label><input type="password" name="password" placeholder="Минимум 6 символов" required autoComplete="new-password" /></div>
          <div className="form-group"><label>Повторите пароль</label><input type="password" name="password2" placeholder="Введите пароль ещё раз" required autoComplete="new-password" /></div>
          <button type="submit" className="btn-submit">Зарегистрироваться</button>
        </form>
        <div className="auth-switch">Уже есть аккаунт? <Link to="/login">Войти</Link></div>
        <div className="auth-switch" style={{ marginTop: '0.5rem' }}><Link to="/">← Вернуться в магазин</Link></div>
      </div>
    </div>
  )
}
