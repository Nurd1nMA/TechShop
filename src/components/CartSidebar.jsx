import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function CartSidebar() {
  const { cart, isOpen, setIsOpen, remove, changeQty, checkout, total } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  function handleCheckout() {
    if (cart.length === 0) { showToast('Корзина пуста'); return }
    if (!user) {
      showToast('Войдите для оформления заказа')
      setTimeout(() => navigate('/login'), 1500)
      return
    }
    checkout()
    showToast('✅ Заказ оформлен! Спасибо за покупку')
  }

  return (
    <>
      <div className={`cart-overlay${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`cart-sidebar${isOpen ? ' open' : ''}`}>
        <div className="cart-head">
          <h3>🛒 Корзина</h3>
          <button className="cart-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-msg">Корзина пуста</div>
          ) : cart.map(item => (
            <div key={item.id} className="c-item">
              <div className="c-thumb" style={{ background: 'var(--bg)' }}>{item.emoji}</div>
              <div className="c-info">
                <div className="c-name">{item.name}</div>
                <div className="c-price">{(item.price * item.qty).toLocaleString()} сом</div>
              </div>
              <div className="c-qty">
                <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                <span className="qty-val">{item.qty}</span>
                <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
              </div>
              <button className="c-del" onClick={() => remove(item.id)}>✕</button>
            </div>
          ))}
        </div>
        <div className="cart-foot">
          <div className="cart-total-row">
            <span>Итого:</span>
            <span>{total.toLocaleString()} сом</span>
          </div>
          <button className="btn-checkout" onClick={handleCheckout}>Оформить заказ</button>
        </div>
      </div>
    </>
  )
}
