import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, XCircle, Printer } from 'lucide-react';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nexkit`;

const MyKitOrders = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => setOrders(prev => [...prev]), 30000); // Trigger re-renders for timeago
    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders/${currentUser}`);
      setOrders(await res.json());
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      const res = await fetch(`${API}/orders/${orderId}/cancel`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled', isCancelled: true } : o));
      } else {
        alert(data.message);
      }
    } catch {
       alert("Error cancelling order");
    } finally {
      setCancellingId(null);
    }
  };

  const isCancelable = (createdAt) => {
    const ageMs = Date.now() - new Date(createdAt).getTime();
    return ageMs < 180000; // 3 minutes
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 24px', color: 'var(--text-main)' }}>📦 Order History</h2>
      
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Package size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>No orders yet</h3>
          <p>Your stationary and print orders will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
             const cancelable = !order.isCancelled && order.status === 'Pending' && isCancelable(order.createdAt);
             return (
               <motion.div key={order._id} className="nk-order-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <div className="nk-order-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ fontSize: '15px', fontWeight: '800' }}>
                           {order.type === 'PrintJob' ? <Printer size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }}/> : '📦 '}
                           #{order._id.slice(-6).toUpperCase()}
                         </span>
                         <span className={`nk-badge-status nk-badge-${order.status.toLowerCase()}`}>
                           {order.status}
                         </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                         {new Date(order.createdAt).toLocaleString()} • {order.deliveryMethod} ({order.paymentMethod})
                      </p>
                    </div>
                    {cancelable && (
                      <button 
                        className="nk-cancel-btn" 
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                      >
                        {cancellingId === order._id ? 'Cancelling...' : <><XCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }}/> Cancel Order</>}
                      </button>
                    )}
                 </div>

                 <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', fontSize: '13px' }}>
                    {order.type === 'Stationary' && order.items && order.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                         <span>{it.quantity}x {it.name}</span>
                         <span>₹{it.price * it.quantity}</span>
                      </div>
                    ))}

                    {order.type === 'PrintJob' && order.printDetails && (
                      <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>📄 {order.printDetails.fileName}</div>
                        <div>Pages: {order.printDetails.pageSelection} ({order.printDetails.colorType})</div>
                        <div>Copies: {order.printDetails.copies}</div>
                      </div>
                    )}
                    
                    <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: 'var(--text-main)' }}>
                       <span>Total Check</span>
                       <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                    </div>
                 </div>
               </motion.div>
             )
          })}
        </div>
      )}
    </div>
  );
};

export default MyKitOrders;
