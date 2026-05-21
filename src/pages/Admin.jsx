import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getProducts, saveProducts, defaultProducts, PRODUCTS_KEY } from '../utils/products'

const USERS_KEY = 'techshop_users'
const CART_KEY = 'techshop_cart'

export default function Admin() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [panel, setPanel] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [cart, setCart] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return }
    if (!localStorage.getItem(PRODUCTS_KEY)) saveProducts(defaultProducts)
    loadData()
  }, [user])

  function loadData() {
    setProducts(getProducts())
    setUsers(JSON.parse(localStorage.getItem(USERS_KEY) || '[]'))
    setCart(JSON.parse(localStorage.getItem(CART_KEY) || '[]'))
  }

  function deleteProduct(id) {
    if (!confirm('Удалить этот товар?')) return
    const updated = products.filter(p => p.id !== id)
    saveProducts(updated)
    setProducts(updated)
    showToast('Товар удалён')
  }

  function handleAddProduct(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name').trim()
    const category = fd.get('category')
    const price = parseInt(fd.get('price'))
    const desc = fd.get('desc').trim()
    if (!name || !category || !price) { showToast('Заполните все обязательные поля'); return }
    const emojiMap = { 'Процессор': '🔵', 'Материнская плата': '🖥️', 'Оперативная память': '💾', 'SSD': '💿', 'Охлаждение': '❄️', 'Корпус': '📦', 'Блок питания': '⚡' }
    const updated = [...products, { id: Date.now(), name, category, price, desc, emoji: emojiMap[category] || '📦' }]
    saveProducts(updated)
    setProducts(updated)
    setShowModal(false)
    e.target.reset()
    showToast('✅ Товар добавлен!')
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  if (!user || user.role !== 'admin') return null

  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div className="admin-side-logo">⚡ Tech<span>Shop</span></div>
        <nav className="admin-nav">
          <button className={panel === 'dashboard' ? 'active' : ''} onClick={() => setPanel('dashboard')}>📊 Дашборд</button>
          <button className={panel === 'products' ? 'active' : ''} onClick={() => setPanel('products')}>📦 Товары</button>
          <button className={panel === 'users' ? 'active' : ''} onClick={() => setPanel('users')}>👥 Пользователи</button>
          <button onClick={() => navigate('/')}>🏠 На сайт</button>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <h1>Панель администратора</h1>
          <div className="admin-user-badge">
            <span>👑 {user.username}</span>
            <a href="#" onClick={e => { e.preventDefault(); logout(); navigate('/login') }}>Выйти</a>
          </div>
        </div>

        {panel === 'dashboard' && (
          <div className="stats-row">
            <div className="stat-card"><div className="stat-val">{products.length}</div><div className="stat-lbl">📦 Товаров в каталоге</div></div>
            <div className="stat-card"><div className="stat-val">{users.length}</div><div className="stat-lbl">👥 Пользователей</div></div>
            <div className="stat-card"><div className="stat-val">{cartCount}</div><div className="stat-lbl">🛒 Товаров в корзинах</div></div>
            <div className="stat-card"><div className="stat-val">{cartTotal.toLocaleString()} сом</div><div className="stat-lbl">💰 Сумма в корзинах</div></div>
          </div>
        )}

        {panel === 'products' && (
          <div className="admin-box">
            <div className="admin-box-head">
              <h3>📦 Управление товарами</h3>
              <button className="btn-add" onClick={() => setShowModal(true)}>+ Добавить товар</button>
            </div>
            <table>
              <thead><tr><th>Название</th><th>Категория</th><th>Цена</th><th>Действия</th></tr></thead>
              <tbody>
                {products.length === 0
                  ? <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Нет товаров</td></tr>
                  : products.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category}</td>
                      <td><strong>{Number(p.price).toLocaleString()} сом</strong></td>
                      <td><button className="btn-del" onClick={() => deleteProduct(p.id)}>Удалить</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

        {panel === 'users' && (
          <div className="admin-box">
            <div className="admin-box-head"><h3>👥 Зарегистрированные пользователи</h3></div>
            <table>
              <thead><tr><th>Логин</th><th>Email</th><th>Полное имя</th></tr></thead>
              <tbody>
                {users.length === 0
                  ? <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Нет пользователей</td></tr>
                  : users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.username}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.fullname || '—'}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-bg open">
          <div className="modal">
            <h3>➕ Добавить новый товар</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-group"><label>Название товара *</label><input name="name" placeholder="Например: AMD Ryzen 5 7600X" required /></div>
              <div className="form-group">
                <label>Категория *</label>
                <select name="category" required>
                  <option value="">— Выберите категорию —</option>
                  <option>Процессор</option>
                  <option>Материнская плата</option>
                  <option>Оперативная память</option>
                  <option>SSD</option>
                  <option>Охлаждение</option>
                  <option>Корпус</option>
                  <option>Блок питания</option>
                </select>
              </div>
              <div className="form-group"><label>Цена (сом) *</label><input type="number" name="price" placeholder="Например: 75000" min="1" required /></div>
              <div className="form-group"><label>Описание</label><textarea name="desc" placeholder="Краткое описание товара…" /></div>
              <div className="modal-btns">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Отмена</button>
                <button type="submit" className="btn-add">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
