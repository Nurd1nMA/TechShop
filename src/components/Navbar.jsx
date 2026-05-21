import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count, setIsOpen } = useCart()

  return (
    <nav className="navbar">
      <Link to="/" className="logo">⚡ TechShop</Link>
      <div className="nav-menu">
        <Link to="/">Главная</Link>
        <Link to="/about">О нас</Link>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#fcd34d', fontWeight: 700 }}>⚙️ Панель</Link>
            )}
            <a href="#" onClick={e => { e.preventDefault(); logout() }} style={{ color: 'rgba(255,255,255,0.7)' }}>
              Выйти ({user.username})
            </a>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register" style={{ background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.9rem', borderRadius: '6px' }}>
              Регистрация
            </Link>
          </>
        )}
      </div>
      <button className="cart-btn" onClick={() => setIsOpen(true)}>
        🛒 Корзина <span className="cart-count">{count}</span>
      </button>
    </nav>
  )
}
