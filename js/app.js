const PRODUCTS_KEY = 'techshop_products';

const defaultProducts = [
  { id: 1,  name: 'Intel Core i9-13900K', category: 'Процессор',        price: 145000, emoji: '🔵', desc: '24 ядра (8P+16E), 5.8 GHz, сокет LGA1700, TDP 125W' },
  { id: 2,  name: 'AMD Ryzen 9 7950X',    category: 'Процессор',        price: 128000, emoji: '🔴', desc: '16 ядер, 5.7 GHz, сокет AM5, архитектура Zen 4' },
  { id: 3,  name: 'ASUS ROG Strix Z790-E', category: 'Материнская плата', price: 98000, emoji: '🖥️', desc: 'Intel Z790, DDR5, PCIe 5.0, Wi-Fi 6E, ATX' },
  { id: 4,  name: 'MSI MEG X670E ACE',    category: 'Материнская плата', price: 112000, emoji: '🖥️', desc: 'AMD X670E, DDR5, PCIe 5.0, 2.5G LAN, E-ATX' },
  { id: 5,  name: 'Corsair Vengeance DDR5 32GB', category: 'Оперативная память', price: 45000, emoji: '💾', desc: 'DDR5-6000, 2×16 ГБ, CL30, RGB подсветка' },
  { id: 6,  name: 'G.Skill Trident Z5 64GB',    category: 'Оперативная память', price: 89000, emoji: '💾', desc: 'DDR5-6400, 2×32 ГБ, CL32, RGB' },
  { id: 7,  name: 'Samsung 980 PRO 2TB',  category: 'SSD',              price: 52000, emoji: '💿', desc: 'NVMe PCIe 4.0, скорость 7000 МБ/с, M.2 2280' },
  { id: 8,  name: 'WD Black SN850X 1TB',  category: 'SSD',              price: 38000, emoji: '💿', desc: 'NVMe PCIe 4.0, скорость 7300 МБ/с, M.2' },
  { id: 9,  name: 'Noctua NH-D15',        category: 'Охлаждение',       price: 28000, emoji: '❄️', desc: 'Двухбашенный, 2×140 мм вентилятора, TDP 250W' },
  { id: 10, name: 'Corsair iCUE H150i ELITE', category: 'Охлаждение',   price: 55000, emoji: '🌊', desc: 'СЖО 360 мм, 3×120 мм, ARGB, LCD дисплей' },
  { id: 11, name: 'NZXT H7 Flow',         category: 'Корпус',           price: 42000, emoji: '📦', desc: 'Mid-Tower, ATX, сетчатая панель, 2×140мм + 1×120мм' },
  { id: 12, name: 'be quiet! Dark Power 12 1000W', category: 'Блок питания', price: 65000, emoji: '⚡', desc: '1000 Вт, 80+ Titanium, полностью модульный' },
];

function getProducts() {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

const catColors = {
  'Процессор':          '#2563eb',
  'Материнская плата':  '#4f46e5',
  'Оперативная память': '#7c3aed',
  'SSD':                '#0891b2',
  'Охлаждение':         '#0e7490',
  'Корпус':             '#475569',
  'Блок питания':       '#ea580c',
};

function productCardHTML(p) {
  const color = catColors[p.category] || '#2563eb';
  return `
    <div class="product-card">
      <div class="product-img-wrap" style="background:${color}20;">
        <span style="font-size:3.5rem;">${p.emoji || '📦'}</span>
      </div>
      <div class="product-body">
        <span class="product-cat">${p.category}</span>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc || p.description || ''}</div>
        <div class="product-footer">
          <span class="product-price">${Number(p.price).toLocaleString()} сом</span>
          <button class="btn-cart" onclick="addToCart(${p.id})">В корзину</button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(filter = 'Все') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const products = getProducts();
  const list = filter === 'Все' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = list.length
    ? list.map(productCardHTML).join('')
    : '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:2rem;">Нет товаров в этой категории</p>';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function addToCart(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product) return;
  Cart.add(product);
  showToast(`"${product.name}" добавлен в корзину`);
}

let _apiCache = [];

function addApiToCart(index) {
  const p = _apiCache[index];
  if (!p) return;
  Cart.add({ id: 'api_' + p.id, name: p.title, price: p.price, emoji: '💻' });
  showToast('"' + p.title + '" добавлен в корзину');
}

async function loadApiProducts() {
  const container = document.getElementById('api-products');
  if (!container) return;
  container.innerHTML = '<div class="loader">⏳ Загрузка данных из API...</div>';

  try {
    const res = await fetch('https://dummyjson.com/products/category/laptops?limit=4');
    if (!res.ok) throw new Error('Ошибка сети');
    const data = await res.json();
    _apiCache = data.products;

    container.innerHTML = data.products.map((p, i) => `
      <div class="product-card">
        <img class="product-img" src="${p.thumbnail}" alt=""
             onerror="this.style.display='none';this.nextSibling.style.display='flex'">
        <div class="product-img-wrap" style="display:none;background:#f1f5f9;"><span style="font-size:2.5rem;">💻</span></div>
        <div class="product-body">
          <span class="product-cat" style="color:#0891b2;">Ноутбук</span>
          <div class="product-name">${p.title}</div>
          <div class="product-desc">${p.description.slice(0, 90)}…</div>
          <div class="product-footer">
            <span class="product-price">$${p.price}</span>
            <button class="btn-cart" onclick="addApiToCart(${i})">В корзину</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:1rem;">⚠️ Не удалось загрузить данные из API. Проверьте интернет-соединение.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  Cart.updateUI();
  renderProducts();
  loadApiProducts();
});
