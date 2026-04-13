import { useState, useEffect } from 'react';
import { Package, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nextrade`;

const MyListings = ({ currentUser }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/items/${currentUser}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleDelete = async (id) => {
    // In a full app, call DELETE. We will just filter it for demo mapping.
    setItems(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: 'var(--text-main)' }}>My Listings</h2>
      
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading listings...</div>
      ) : items.length === 0 ? (
        <div className="nl-empty">
          <Tag size={48} style={{ opacity: 0.3 }} />
          <h3>No Active Listings</h3>
          <p>You haven't posted any items yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(item => (
            <motion.div key={item._id} className="nt-order-card" style={{ background: 'var(--glass-bg)', padding: 16, borderRadius: 16, border: '1px solid var(--glass-border)', display: 'flex', gap: 16, alignItems: 'center' }}>
               <div style={{ width: 80, height: 80, background: 'var(--input-bg)', borderRadius: 12, backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                 {!item.imageUrl.startsWith('mock') && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>📦</div>}
               </div>

               <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800 }}>{item.category}</div>
                  <h4 style={{ margin: '4px 0', fontSize: 16, color: 'white' }}>{item.title}</h4>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>₹{item.price} - <span style={{ color: item.status === 'sold' ? '#00d68f' : '#f59e0b' }}>{item.status.toUpperCase()}</span></div>
               </div>

               <button className="nt-btn" style={{ background: 'rgba(245,0,79,0.1)', color: '#f5004f', border: 'none', padding: 10 }} onClick={() => handleDelete(item._id)}>
                 <Trash2 size={18} />
               </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
