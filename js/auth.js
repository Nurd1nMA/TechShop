const USERS_KEY = 'techshop_users';
const SESSION_KEY = 'techshop_session';

const Auth = {
  getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  },

  login(username, password) {
    if (username === 'admin' && password === 'admin123') {
      const user = { id: 0, username: 'admin', email: 'admin@techshop.kz', fullname: 'Администратор', role: 'admin' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { ok: true, user };
    }
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return { ok: false, error: 'Неверный логин или пароль' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { ok: true, user };
  },

  register({ username, email, password, fullname }) {
    const users = this.getUsers();
    if (users.find(u => u.username === username))
      return { ok: false, error: 'Логин уже занят' };
    if (users.find(u => u.email === email))
      return { ok: false, error: 'Email уже используется' };
    const user = { id: Date.now(), username, email, password, fullname, role: 'user' };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }
};

function initNavbar() {
  const user = Auth.getCurrentUser();
  const el = document.getElementById('nav-auth');
  if (!el) return;
  if (user) {
    el.innerHTML = `
      ${user.role === 'admin' ? '<a href="admin.html" style="color:#fcd34d;font-weight:700;">⚙️ Панель</a>' : ''}
      <a href="#" onclick="Auth.logout()" style="color:rgba(255,255,255,0.7);">Выйти (${user.username})</a>
    `;
  } else {
    el.innerHTML = `
      <a href="login.html">Войти</a>
      <a href="register.html" style="background:rgba(255,255,255,0.15);padding:0.35rem 0.9rem;border-radius:6px;">Регистрация</a>
    `;
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}
