import { createContext, useContext, useState } from 'react'

const CART_KEY = 'techshop_cart'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || '[]'))
  const [isOpen, setIsOpen] = useState(false)

  function save(next) {
    setCart(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }

  function add(product) {
    const exists = cart.find(i => i.id === product.id)
    if (exists) {
      save(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      save([...cart, { id: product.id, name: product.name, price: product.price, emoji: product.emoji || '📦', qty: 1 }])
    }
  }

  function remove(id) {
    save(cart.filter(i => i.id !== id))
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id)
    if (!item) return
    if (item.qty + delta <= 0) return remove(id)
    save(cart.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i))
  }

  function checkout() {
    localStorage.removeItem(CART_KEY)
    setCart([])
    setIsOpen(false)
  }

  const count = cart.reduce((s, i) => s + i.qty, 0)
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, add, remove, changeQty, checkout, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
