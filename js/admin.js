document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('admin-username').textContent = '👑 ' + user.username;

  // Seed default products if none exist yet
  if (!localStorage.getItem('techshop_products')) {
    const defaults = [
      { id: 1,  name: 'Intel Core i9-13900K',       category: 'Процессор',          price: 145000, emoji: '🔵', desc: '24 ядра, 5.8 GHz, LGA1700' },
      { id: 2,  name: 'AMD Ryzen 9 7950X',           category: 'Процессор',          price: 128000, emoji: '🔴', desc: '16 ядер, 5.7 GHz, AM5' },
      { id: 3,  name: 'ASUS ROG Strix Z790-E',       category: 'Материнская плата',  price: 98000,  emoji: '🖥️', desc: 'Intel Z790, DDR5, PCIe 5.0' },
      { id: 4,  name: 'MSI MEG X670E ACE',           category: 'Материнская плата',  price: 112000, emoji: '🖥️', desc: 'AMD X670E, DDR5, PCIe 5.0' },
      { id: 5,  name: 'Corsair Vengeance DDR5 32GB', category: 'Оперативная память', price: 45000,  emoji: '💾', desc: 'DDR5-6000, 2×16 ГБ' },
      { id: 6,  name: 'G.Skill Trident Z5 64GB',    category: 'Оперативная память', price: 89000,  emoji: '💾', desc: 'DDR5-6400, 2×32 ГБ' },
      { id: 7,  name: 'Samsung 980 PRO 2TB',         category: 'SSD',               price: 52000,  emoji: '💿', desc: 'NVMe PCIe 4.0, 7000 МБ/с' },
      { id: 8,  name: 'WD Black SN850X 1TB',         category: 'SSD',               price: 38000,  emoji: '💿', desc: 'NVMe PCIe 4.0, 7300 МБ/с' },
      { id: 9,  name: 'Noctua NH-D15',               category: 'Охлаждение',        price: 28000,  emoji: '❄️', desc: '2×140 мм, TDP 250W' },
      { id: 10, name: 'Corsair iCUE H150i ELITE',   category: 'Охлаждение',        price: 55000,  emoji: '🌊', desc: 'СЖО 360 мм, ARGB' },
      { id: 11, name: 'NZXT H7 Flow',                category: 'Корпус',            price: 42000,  emoji: '📦', desc: 'Mid-Tower, ATX' },
      { id: 12, name: 'be quiet! Dark Power 12 1000W', category: 'Блок питания',   price: 65000,  emoji: '⚡', desc: '1000 Вт, 80+ Titanium' },
    ];
    localStorage.setItem('techshop_products', JSON.stringify(defaults));
  }

  showPanel('dashboard');
});

function showPanel(name) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelector('[data-panel="' + name + '"]').classList.add('active');

  if (name === 'dashboard') renderDashboard();
  if (name === 'products')  renderProductsTable();
  if (name === 'users')     renderUsersTable();
}

function renderDashboard() {
  const products = getAdminProducts();
  const users    = JSON.parse(localStorage.getItem('techshop_users') || '[]');
  const cart     = JSON.parse(localStorage.getItem('techshop_cart')  || '[]');
  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('stat-products').textContent = products.length;
  document.getElementById('stat-users').textContent    = users.length;
  document.getElementById('stat-cart').textContent     = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('stat-total').textContent    = total.toLocaleString() + ' сом';
}

function getAdminProducts() {
  return JSON.parse(localStorage.getItem('techshop_products') || '[]');
}

function renderProductsTable() {
  const products = getAdminProducts();
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2rem;">Нет товаров. Добавьте первый товар.</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td><strong>${Number(p.price).toLocaleString()} сом</strong></td>
      <td><button class="btn-del" onclick="deleteProduct(${p.id})">Удалить</button></td>
    </tr>
  `).join('');
}

function renderUsersTable() {
  const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:2rem;">Нет зарегистрированных пользователей</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td><strong>${u.username}</strong></td>
      <td>${u.email}</td>
      <td>${u.fullname || '—'}</td>
    </tr>
  `).join('');
}

function deleteProduct(id) {
  if (!confirm('Удалить этот товар?')) return;
  const products = getAdminProducts().filter(p => p.id !== id);
  localStorage.setItem('techshop_products', JSON.stringify(products));
  renderProductsTable();
  renderDashboard();
  showToast('Товар удалён');
}

function openAddModal() {
  document.getElementById('add-modal').classList.add('open');
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('open');
  document.getElementById('add-form').reset();
}

function submitAddProduct(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name     = fd.get('name').trim();
  const category = fd.get('category');
  const price    = parseInt(fd.get('price'));
  const desc     = fd.get('desc').trim();

  if (!name || !category || !price) {
    showToast('Заполните все обязательные поля');
    return;
  }

  const emojiMap = {
    'Процессор': '🔵', 'Материнская плата': '🖥️',
    'Оперативная память': '💾', 'SSD': '💿',
    'Охлаждение': '❄️', 'Корпус': '📦', 'Блок питания': '⚡'
  };

  const products = getAdminProducts();
  products.push({
    id: Date.now(),
    name,
    category,
    price,
    desc,
    emoji: emojiMap[category] || '📦'
  });
  localStorage.setItem('techshop_products', JSON.stringify(products));
  closeAddModal();
  renderProductsTable();
  renderDashboard();
  showToast('✅ Товар добавлен!');
}
