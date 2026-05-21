export const PRODUCTS_KEY = 'techshop_products'

export const defaultProducts = [
  { id: 1,  name: 'Intel Core i9-13900K',          category: 'Процессор',          price: 145000, emoji: '🔵', desc: '24 ядра (8P+16E), 5.8 GHz, сокет LGA1700, TDP 125W' },
  { id: 2,  name: 'AMD Ryzen 9 7950X',              category: 'Процессор',          price: 128000, emoji: '🔴', desc: '16 ядер, 5.7 GHz, сокет AM5, архитектура Zen 4' },
  { id: 3,  name: 'ASUS ROG Strix Z790-E',          category: 'Материнская плата',  price: 98000,  emoji: '🖥️', desc: 'Intel Z790, DDR5, PCIe 5.0, Wi-Fi 6E, ATX' },
  { id: 4,  name: 'MSI MEG X670E ACE',              category: 'Материнская плата',  price: 112000, emoji: '🖥️', desc: 'AMD X670E, DDR5, PCIe 5.0, 2.5G LAN, E-ATX' },
  { id: 5,  name: 'Corsair Vengeance DDR5 32GB',    category: 'Оперативная память', price: 45000,  emoji: '💾', desc: 'DDR5-6000, 2×16 ГБ, CL30, RGB подсветка' },
  { id: 6,  name: 'G.Skill Trident Z5 64GB',        category: 'Оперативная память', price: 89000,  emoji: '💾', desc: 'DDR5-6400, 2×32 ГБ, CL32, RGB' },
  { id: 7,  name: 'Samsung 980 PRO 2TB',            category: 'SSD',                price: 52000,  emoji: '💿', desc: 'NVMe PCIe 4.0, скорость 7000 МБ/с, M.2 2280' },
  { id: 8,  name: 'WD Black SN850X 1TB',            category: 'SSD',                price: 38000,  emoji: '💿', desc: 'NVMe PCIe 4.0, скорость 7300 МБ/с, M.2' },
  { id: 9,  name: 'Noctua NH-D15',                  category: 'Охлаждение',         price: 28000,  emoji: '❄️', desc: 'Двухбашенный, 2×140 мм вентилятора, TDP 250W' },
  { id: 10, name: 'Corsair iCUE H150i ELITE',       category: 'Охлаждение',         price: 55000,  emoji: '🌊', desc: 'СЖО 360 мм, 3×120 мм, ARGB, LCD дисплей' },
  { id: 11, name: 'NZXT H7 Flow',                   category: 'Корпус',             price: 42000,  emoji: '📦', desc: 'Mid-Tower, ATX, сетчатая панель, 2×140мм + 1×120мм' },
  { id: 12, name: 'be quiet! Dark Power 12 1000W',  category: 'Блок питания',       price: 65000,  emoji: '⚡', desc: '1000 Вт, 80+ Titanium, полностью модульный' },
]

export const catColors = {
  'Процессор':          '#2563eb',
  'Материнская плата':  '#4f46e5',
  'Оперативная память': '#7c3aed',
  'SSD':                '#0891b2',
  'Охлаждение':         '#0e7490',
  'Корпус':             '#475569',
  'Блок питания':       '#ea580c',
}

export function getProducts() {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
    return defaultProducts
  }
  return JSON.parse(stored)
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}
