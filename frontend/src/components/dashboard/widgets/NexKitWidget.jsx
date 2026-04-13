import { motion } from 'framer-motion';
import { Package, CalendarCheck, Sparkles } from 'lucide-react';

const NexKitWidget = ({ onNavigate }) => {
  return (
    <motion.div
      className="widget-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{ background: 'linear-gradient(145deg, rgba(20,20,25,0.45) 0%, rgba(20,20,25,0.85) 100%)', borderColor: 'rgba(255,0,51,0.2)' }}
    >
      <div className="widget-header">
        <div>
          <h3 className="widget-title">NexKit</h3>
          <p className="widget-subtitle">Stationery & print orders in one place</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={22} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', marginTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
          <Sparkles size={18} />
          <span>Fast campus delivery & print pickup</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
          <CalendarCheck size={18} />
          <span>Order tracking and reorder support</span>
        </div>
      </div>

      <button
        onClick={() => onNavigate && onNavigate('nexkit')}
        className="auth-button"
        style={{ marginTop: '18px' }}
      >
        Open NexKit
      </button>
    </motion.div>
  );
};

export default NexKitWidget;
