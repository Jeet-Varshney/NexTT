import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, ArrowLeft, Clock } from 'lucide-react';
import ItemCard from './ItemCard';
import Cart from './Cart';
import OrderTracker from './OrderTracker';
import RecentOrders from './RecentOrders';
import './NexCafe.css';
import API_BASE from '../../config/api.js';

const CATEGORIES = ['All', 'Snacks', 'Meals', 'Beverages', 'Combos'];

const MOCK_MENU = [
  { _id: 'm1', name: 'Masala Maggi',    description: 'Spicy noodles with veggies',         price: 40,  category: 'Snacks',    prepTime: 7,  emoji: '🍜' },
  { _id: 'm2', name: 'Veg Burger',       description: 'Crispy patty with sauce',             price: 60,  category: 'Snacks',    prepTime: 10, emoji: '🍔' },
  { _id: 'm3', name: 'French Fries',     description: 'Golden salted fries',                 price: 45,  category: 'Snacks',    prepTime: 8,  emoji: '🍟' },
  { _id: 'm4', name: 'Paneer Rice',      description: 'Cottage cheese fried rice',           price: 90,  category: 'Meals',     prepTime: 15, emoji: '🍚' },
  { _id: 'm5', name: 'Dal & Roti',       description: 'Lentil curry with 3 rotis',           price: 70,  category: 'Meals',     prepTime: 12, emoji: '🫓' },
  { _id: 'm6', name: 'Cold Coffee',      description: 'Thick iced coffee with cream',        price: 50,  category: 'Beverages', prepTime: 5,  emoji: '☕' },
  { _id: 'm7', name: 'Masala Chai',      description: 'Classic spiced tea',                  price: 20,  category: 'Beverages', prepTime: 3,  emoji: '🍵' },
  { _id: 'm8', name: 'Fresh Lime Soda',  description: 'Refreshing sweet & salty soda',       price: 30,  category: 'Beverages', prepTime: 3,  emoji: '🥤' },
  { _id: 'm9', name: 'Student Combo',    description: 'Burger + Cold Coffee + Fries',        price: 120, category: 'Combos',    prepTime: 15, emoji: '🎯' },
  { _id: 'm10', name: 'Snack Box',       description: 'Samosa ×2 + Chai + Biscuits',        price: 80,  category: 'Combos',    prepTime: 10, emoji: '📦' },
];

const NexCafeDashboard = ({ onBack }) => {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [tab, setTab] = useState('menu'); // 'menu' | 'orders'
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cafe/menu`);
        const data = await res.json();
        setMenu(data);
      } catch {
        setMenu(MOCK_MENU);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === id);
      if (existing.quantity === 1) return prev.filter(i => i._id !== id);
      return prev.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const handleCheckout = async (orderData) => {
    // POST to /api/cafe/orders
    try {
      const res = await fetch(`${API_BASE}/api/cafe/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', ...orderData })
      });
      const data = await res.json();
      setActiveOrder({ ...orderData, orderId: data.orderId });
    } catch {
      setActiveOrder({ ...orderData, orderId: `ORD-${Date.now()}` });
    }
    setCart([]);
    setCartOpen(false);
  };

  const handleReorder = (items) => {
    items.forEach(i => {
      const menuItem = menu.find(m => m.name === i.name);
      if (menuItem) for (let x = 0; x < i.quantity; x++) addToCart(menuItem);
    });
    setTab('menu');
  };

  const filtered = menu.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalItemsInCart = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="nexcafe-container">
      {/* Header */}
      <div className="cafe-topbar">
        <button onClick={onBack} style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <ArrowLeft size={20} /> Back
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '28px', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🍽️ NexCafe</h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Smart Cafeteria Ordering</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={`chip ${tab === 'menu' ? 'active' : ''}`} onClick={() => setTab('menu')}>Menu</button>
          <button className={`chip ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders</button>
        </div>
      </div>

      {/* Active Order Tracker */}
      <AnimatePresence>
        {activeOrder && (
          <div style={{ padding: '24px' }}>
            <OrderTracker order={activeOrder} onClose={() => setActiveOrder(null)} />
          </div>
        )}
      </AnimatePresence>

      {tab === 'menu' && (
        <>
          {/* Search + Filters */}
          <div style={{ padding: '0 24px 0 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="cafe-search-wrap">
              <Search className="cafe-search-icon" size={18} />
              <input className="cafe-search-input" placeholder="Search food items…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="category-chips">
              {CATEGORIES.map(c => (
                <button key={c} className={`chip ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading menu…</p>
          ) : (
            <div className="menu-grid">
              {filtered.map(item => (
                <ItemCard
                  key={item._id}
                  item={item}
                  quantity={cart.find(i => i._id === item._id)?.quantity || 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
              {filtered.length === 0 && (
                <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', paddingTop: '40px' }}>No items found</p>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'orders' && <RecentOrders onReorder={handleReorder} />}

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItemsInCart > 0 && !cartOpen && (
          <motion.button
            className="cart-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={20} />
            {totalItemsInCart} item{totalItemsInCart > 1 ? 's' : ''} ·  ₹{cart.reduce((s, i) => s + i.price * i.quantity, 0)}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <Cart
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
        />
      </div>
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />
      )}
    </div>
  );
};

export default NexCafeDashboard;
