import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Printer, TrendingUp } from 'lucide-react';
import API_BASE from '../../../config/api.js';

const NexKitStatusWidget = () => {
  const [stats, setStats] = useState({ orders: 0, prints: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const userId = 'demo-user';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, printsRes] = await Promise.all([
          fetch(`${API_BASE}/api/nexkit/orders/${userId}`),
          fetch(`${API_BASE}/api/nexkit/print/jobs/${userId}`)
        ]);

        const orders = ordersRes.ok ? await ordersRes.json() : [];
        const prints = printsRes.ok ? await printsRes.json() : [];

        const activeOrders = orders.filter(o => !o.isCancelled && o.status !== 'Delivered').length;
        const activePrints = prints.filter(p => p.status !== 'Delivered' && p.status !== 'Cancelled').length;

        setStats({ orders: activeOrders, prints: activePrints, total: activeOrders + activePrints });
      } catch (error) {
        setStats({ orders: 0, prints: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="widget-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      style={{ background: 'linear-gradient(145deg, rgba(20,20,25,0.4) 0%, rgba(20,20,25,0.8) 100%)', borderColor: 'rgba(245,0,79,0.15)' }}
    >
      <div className="widget-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
        <h3 className="widget-title">NexKit Status</h3>
        <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ padding: '12px 14px', background: 'rgba(255,0,51,0.08)', borderRadius: '14px', border: '1px solid rgba(255,0,51,0.15)' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={14} /> Stationery Orders
          </p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
            {loading ? '—' : stats.orders}
          </p>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(124,58,237,0.08)', borderRadius: '14px', border: '1px solid rgba(124,58,237,0.15)' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={14} /> Print Jobs
          </p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
            {loading ? '—' : stats.prints}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
          {stats.total > 0 ? `${stats.total} active item${stats.total !== 1 ? 's' : ''}` : 'All caught up! 🎉'}
        </p>
      </div>
    </motion.div>
  );
};

export default NexKitStatusWidget;
