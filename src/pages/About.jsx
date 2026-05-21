import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <section className="about-hero">
        <h1>О нас</h1>
        <p>TechShop — ваш надёжный магазин компьютерной периферии с 2020 года. Мы предлагаем лучшие комплектующие по честным ценам.</p>
      </section>
      <div className="about-content">
        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">🎯</div>
            <h3>Наша миссия</h3>
            <p>Обеспечить каждого покупателя качественными компьютерными комплектующими с гарантией и поддержкой 24/7.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">✅</div>
            <h3>Гарантия качества</h3>
            <p>Все товары проходят проверку перед отправкой. Официальная гарантия производителя на каждый продукт.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">🚀</div>
            <h3>Быстрая доставка</h3>
            <p>Доставка по всему Кыргызстану в течение 1–3 рабочих дней. Курьерская доставка по Бишкеку — в день заказа.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">💬</div>
            <h3>Поддержка</h3>
            <p>Наши специалисты помогут выбрать совместимые комплектующие и ответят на все технические вопросы.</p>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Контакты</h3>
          <p style={{ color: 'var(--muted)' }}>📧 info@techshop.kg &nbsp;|&nbsp; 📞 +996 (312) 45-67-89 &nbsp;|&nbsp; 📍 г. Бишкек, ул. Чуй 114</p>
        </div>
      </div>
    </Layout>
  )
}
