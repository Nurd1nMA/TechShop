import Navbar from './Navbar'
import CartSidebar from './CartSidebar'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <CartSidebar />
      <footer>
        <p>© 2025 TechShop — Ваш магазин компьютерной периферии</p>
      </footer>
    </>
  )
}
