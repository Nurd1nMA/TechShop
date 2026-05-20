const CART_KEY = 'techshop_cart';

const Cart = {
  get() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  },

  _save(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.updateUI();
  },

  add(product) {
    const cart = this.get();
    const item = cart.find(i => i.id === product.id);
    if (item) item.qty++;
    else cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji || '📦', qty: 1 });
    this._save(cart);
  },

  remove(id) {
    this._save(this.get().filter(i => i.id !== id));
  },

  changeQty(id, delta) {
    const cart = this.get();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) return this.remove(id);
    this._save(cart);
  },

  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },

  total() {
    return this.get().reduce((s, i) => s + i.price * i.qty, 0);
  },

  updateUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = this.count();
    renderCartItems();
  }
};

function renderCartItems() {
  const el = document.getElementById('cart-items');
  if (!el) return;
  const cart = Cart.get();

  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty-msg">🛒 Корзина пуста</div>';
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = '0 сом';
    return;
  }

  el.innerHTML = cart.map(item => {
    const id = typeof item.id === 'string' ? `'${item.id}'` : item.id;
    return `
    <div class="c-item">
      <div class="c-thumb" style="background:var(--bg);">${item.emoji || '📦'}</div>
      <div class="c-info">
        <div class="c-name">${item.name}</div>
        <div class="c-price">${(item.price * item.qty).toLocaleString()} сом</div>
      </div>
      <div class="c-qty">
        <button class="qty-btn" onclick="Cart.changeQty(${id}, -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="Cart.changeQty(${id}, 1)">+</button>
      </div>
      <button class="c-del" onclick="Cart.remove(${id})" title="Удалить">✕</button>
    </div>`;
  }).join('');

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = Cart.total().toLocaleString() + ' сом';
}

function toggleCart() {
  document.getElementById('cart-overlay').classList.toggle('open');
  document.getElementById('cart-sidebar').classList.toggle('open');
  renderCartItems();
}

function checkout() {
  if (Cart.count() === 0) { showToast('Корзина пуста'); return; }
  const user = Auth.getCurrentUser();
  if (!user) {
    showToast('Войдите для оформления заказа');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  localStorage.removeItem(CART_KEY);
  Cart.updateUI();
  toggleCart();
  showToast('✅ Заказ оформлен! Спасибо за покупку');
}
