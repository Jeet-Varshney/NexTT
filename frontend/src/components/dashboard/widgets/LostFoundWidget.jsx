import { Archive, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const RECENT_ITEMS = [
  { emoji: '🔑', title: 'Lost Keys',       loc: 'Near Cafeteria' },
  { emoji: '👜', title: 'Found Wallet',    loc: 'Library – 2nd Floor' },
  { emoji: '🎧', title: 'Lost Earphones',  loc: 'Computer Lab' },
];

const LostFoundWidget = ({ onNavigate }) => {
  return (
    <motion.div
      className="widget-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{ cursor: 'default' }}
    >
      <div className="widget-header">
        <h3 className="widget-title"><Archive className="widget-icon" size={20} /> Lost &amp; Found</h3>
        <button
          onClick={() => onNavigate && onNavigate('nexlocate')}
          style={{
            background: 'none', border: 'none', color: 'var(--primary-light)',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'var(--font-family)',
          }}
        >
          Open <ExternalLink size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
        {RECENT_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: '12px', alignItems: 'center',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,0,79,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </p>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <MapPin size={10} /> {item.loc}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate && onNavigate('nexlocate')}
        style={{
          width: '100%', padding: '11px', marginTop: '12px',
          background: 'transparent',
          border: '1px dashed var(--primary)',
          color: 'var(--primary)',
          borderRadius: '12px', fontWeight: '600',
          fontFamily: 'var(--font-family)', fontSize: '13px',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,0,79,0.08)'; e.currentTarget.style.borderStyle = 'solid'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderStyle = 'dashed'; }}
      >
        🔍 View All &amp; Report Item
      </button>
    </motion.div>
  );
};

export default LostFoundWidget;
