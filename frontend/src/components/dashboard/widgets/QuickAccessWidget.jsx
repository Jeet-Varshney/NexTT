import { Dumbbell, ShieldQuestion, Coffee, CalendarHeart, Zap, Search, Package, Handshake, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickAccessWidget = ({ onNavigate }) => {
  const actions = [
    { name: 'Study Planner', icon: <Brain size={24} />,            route: 'nexplanner' },
    { name: 'Stationary',  icon: <Package size={24} />,          route: 'nexkit'    },
    { name: 'Cafeteria',   icon: <Coffee size={24} />,           route: 'nexcafe'   },
    { name: 'Lost & Found',icon: <Search size={24} />,           route: 'nexlocate' },
    { name: 'Marketplace', icon: <Handshake size={24} />,        route: 'nextrade'  },
  ];

  return (
    <motion.div
      className="widget-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{ background: 'linear-gradient(145deg, rgba(20,20,25,0.4) 0%, rgba(20,20,25,0.8) 100%)', borderColor: 'rgba(255,0,51,0.2)' }}
    >
      <div className="widget-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <h3 className="widget-title">Quick Access</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '12px', marginTop: '12px' }}>
        {actions.map((action, i) => (
          <div
            key={i}
            onClick={() => action.route && onNavigate && onNavigate(action.route)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {action.icon}
            <span style={{ fontSize: '11px', textAlign: 'center', fontWeight: '500' }}>{action.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickAccessWidget;
