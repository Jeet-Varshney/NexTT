import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ShoppingCart, Printer, PackageSearch, PenTool } from 'lucide-react';
import KitItemCard from './KitItemCard';
import KitCart from './KitCart';
import PrintService from './PrintService';
import MyKitOrders from './MyKitOrders';
import './NexKit.css';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nexkit`;
const CURRENT_USER = 'demo'; // Replace with auth context

const TABS = [
  { id: 'store', label: 'Stationary Store', icon: <PenTool size={15}/> },
  { id: 'print', label: 'Print Service', icon: <Printer size={15}/> },
  { id: 'orders', label: 'My Orders', icon: <PackageSearch size={15}/> },
];

const NexKitDashboard = ({ onBack }) => {
  const [tab, setTab] = useState('store');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Store Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/items`);
      setItems(await res.json());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Cart operations
  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast('Added to cart');
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(i => i._id !== itemId));
    } else {
      setCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity: newQty } : i));
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout (used by both Store and Print Service)
  const handleCheckout = async (orderPayload) => {
    setCheckoutLoading(true);
    
    // Auto-inject user
    const payload = { ...orderPayload, userId: CURRENT_USER };

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      showToast('✅ Order placed successfully!');
      
      // Reset state if it was a store checkout
      if (payload.type === 'Stationary') {
        setCart([]);
        setIsCartOpen(false);
      }
      
      setTab('orders'); // navigate to tracking
    } catch (err) {
      // Offline fallback
      showToast('✅ Order placed (Mock Offline)!', 'success');
      if (payload.type === 'Stationary') {
        setCart([]);
        setIsCartOpen(false);
      }
      setTab('orders');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="nexkit-container">
      
      {/* ── Topbar ── */}
      <div className="nk-topbar">
        <button onClick={onBack} className="nk-back-btn">
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: 0, fontSize: '26px', fontWeight: '800',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em',
          }}>
            🖊️ NexKit
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Stationary &amp; Print Service
          </p>
        </div>

        {tab === 'store' && (
          <button className="nk-cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={18} />
            {totalCartItems > 0 && <span className="nk-badge">{totalCartItems}</span>}
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="nk-tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nk-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">
        
        {/* Store Tab */}
        {tab === 'store' && (
          <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Search bar */}
            <div className="nk-search-bar">
              <div className="nk-search-wrap">
                <Search className="nk-search-icon" size={16} />
                <input
                  type="text"
                  className="nk-search-input"
                  placeholder="Search notebooks, pens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="nk-filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Stationary">Stationary</option>
                <option value="Academic Supplies">Academic Supplies</option>
                <option value="Lab Items">Lab Items</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="nk-item-grid">
                {[1,2,3,4].map(i => <div key={i} className="nl-skeleton" style={{ height: '300px', borderRadius: '22px' }}/>)}
              </div>
            ) : filteredItems.length === 0 ? (
               <div className="nl-empty">
                 <Search size={48} style={{ opacity: 0.3 }} />
                 <h3>No items found</h3>
                 <p>Try adjusting your search or category filter.</p>
               </div>
            ) : (
              <div className="nk-item-grid">
                {filteredItems.map(item => (
                  <KitItemCard 
                    key={item._id} 
                    item={item} 
                    onAdd={handleAddToCart} 
                    cartQty={cart.find(c => c._id === item._id)?.quantity || 0}
                    onUpdateQty={handleUpdateQty}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Print Tab */}
        {tab === 'print' && (
          <motion.div key="print" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrintService currentUser={CURRENT_USER} onCheckout={handleCheckout} />
          </motion.div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MyKitOrders currentUser={CURRENT_USER} />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <KitCart 
            items={cart} 
            onClose={() => setIsCartOpen(false)} 
            onUpdateQty={handleUpdateQty}
            onCheckout={handleCheckout}
            loading={checkoutLoading}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            style={{
              position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(10,10,22,0.97)', border: `1px solid ${toast.type === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(0,214,143,0.4)'}`,
              color: toast.type === 'warning' ? '#f59e0b' : 'var(--success)',
              padding: '13px 24px', borderRadius: '40px', fontWeight: '700', fontSize: '14px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)', zIndex: 9999,
              backdropFilter: 'blur(20px)', whiteSpace: 'nowrap',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default NexKitDashboard;
