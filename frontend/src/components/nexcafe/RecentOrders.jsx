import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const MOCK_ORDERS = [
  { _id: 'o1', orderId: 'ORD-1001', items: [{ name: 'Masala Maggi', quantity: 1 }, { name: 'Masala Chai', quantity: 2 }], totalAmount: 80, status: 'Completed', orderType: 'Pickup', createdAt: new Date(Date.now() - 3600000) },
  { _id: 'o2', orderId: 'ORD-1002', items: [{ name: 'Student Combo', quantity: 1 }], totalAmount: 120, status: 'Completed', orderType: 'Delivery', createdAt: new Date(Date.now() - 86400000) },
];

const statusColor = { Pending: '#f59e0b', Preparing: '#3b82f6', Ready: '#10b981', OutForDelivery: '#8b5cf6', Completed: '#6b7280', Cancelled: '#ef4444' };

const RecentOrders = ({ onReorder }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <h2 style={{ margin: '0 0 8px 0' }}>Recent Orders</h2>
      {MOCK_ORDERS.map((order, i) => (
        <motion.div
          key={order._id}
          className="widget-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{ padding: '20px', gap: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}>#{order.orderId}</p>
            <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: `${statusColor[order.status]}22`, color: statusColor[order.status] }}>
              {order.status}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ fontWeight: 700, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{order.totalAmount}</span>
            <button
              onClick={() => onReorder(order.items)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-family)' }}
            >
              <RefreshCw size={13} /> Reorder
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentOrders;
