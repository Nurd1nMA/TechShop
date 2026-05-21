import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { getProducts, catColors } from '../utils/products'

const CATEGORIES = ['Все', 'Процессор', 'Материнская плата', 'Оперативная память', 'SSD', 'Охлаждение', 'Корпус', 'Блок питания']

function ProductCard({ product: p, onAdd }) {
  const color = catColors[p.category] || '#2563eb'
  return (
    <div className="product-card">
      <div className="product-img-wrap" style={{ background: color + '20' }}>
        <span style={{ fontSize: '3.5rem' }}>{p.emoji || '📦'}</span>
      </div>
      <div className="product-body">
        <span className="product-cat">{p.category}</span>
        <div className="product-name">{p.name}</div>
        <div className="product-desc">{p.desc || ''}</div>
        <div className="product-footer">
          <span className="product-price">{Number(p.price).toLocaleString()} сом</span>
          <button className="btn-cart" onClick={() => onAdd(p)}>В корзину</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [filter, setFilter] = useState('Все')
  const [products] = useState(getProducts)
  const [apiProducts, setApiProducts] = useState([])
  const [apiLoading, setApiLoading] = useState(true)
  const { add } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    fetch('https://dummyjson.com/products/category/laptops?limit=4')
      .then(r => r.json())
      .then(data => { setApiProducts(data.products); setApiLoading(false) })
      .catch(() => setApiLoading(false))
  }, [])

  const filtered = filter === 'Все' ? products : products.filter(p => p.category === filter)

  function handleAdd(product) {
    add(product)
    showToast(`"${product.name}" добавлен в корзину`)
  }

  return (
    <Layout>
      <section className="hero">
        <h1>Компьютерная периферия</h1>
        <p>Процессоры, материнские платы, оперативная память, SSD и многое другое по лучшим ценам</p>
        <a href="#catalog" className="btn-hero">Смотреть каталог ↓</a>
      </section>

      <div className="section" id="catalog">
        <h2 className="section-title">Каталог товаров</h2>
        <p className="section-sub">Выберите категорию для фильтрации</p>
        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`filter-btn${filter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {filtered.length === 0
            ? <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Нет товаров в этой категории</p>
            : filtered.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)
          }
        </div>
      </div>

      <div className="section">
        <div className="api-box">
          <h2 className="section-title">Ноутбуки от партнёров</h2>
          <div className="products-grid">
            {apiLoading ? (
              <div className="loader">⏳ Загрузка данных из API...</div>
            ) : apiProducts.length > 0 ? (
              apiProducts.map(p => (
                <div key={p.id} className="product-card">
                  <img className="product-img" src={p.thumbnail} alt={p.title} onError={e => e.target.style.display = 'none'} />
                  <div className="product-body">
                    <span className="product-cat" style={{ color: '#0891b2' }}>Ноутбук</span>
                    <div className="product-name">{p.title}</div>
                    <div className="product-desc">{p.description.slice(0, 90)}…</div>
                    <div className="product-footer">
                      <span className="product-price">${p.price}</span>
                      <button className="btn-cart" onClick={() => {
                        add({ id: 'api_' + p.id, name: p.title, price: p.price, emoji: '💻' })
                        showToast(`"${p.title}" добавлен в корзину`)
                      }}>В корзину</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--muted)', padding: '1rem' }}>⚠️ Не удалось загрузить данные из API</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
