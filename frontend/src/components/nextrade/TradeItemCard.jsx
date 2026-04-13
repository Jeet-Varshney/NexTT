import { motion } from 'framer-motion';
import { MessageCircle, Tag } from 'lucide-react';

const TradeItemCard = ({ item, onOpenChat }) => {
  return (
    <motion.div className="nt-item-card" layout>
      <div className="nt-card-img" style={{ backgroundImage: `url(${item.imageUrl})` }}>
        {!item.imageUrl.startsWith('mock') && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: 'rgba(255,0,79,0.1)' }}>
            📦
          </div>
        )}
        {item.negotiable && <div className="nt-neg-badge">Negotiable</div>}
      </div>
      <div className="nt-card-body">
        <span className="nt-card-cat">{item.category}</span>
        <h4 className="nt-card-title">{item.title}</h4>
        <div className="nt-card-price">₹{item.price}</div>
        <p className="nt-card-desc">{item.description}</p>
        
        <div className="nt-card-footer">
          <div className="nt-seller-tag">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               {(item.sellerId || 'S').charAt(0).toUpperCase()}
            </div>
            Posted by {item.sellerId}
          </div>
          
          <button 
            className="nt-btn nt-btn-primary" 
            onClick={() => onOpenChat(item)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <MessageCircle size={14} /> Chat
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TradeItemCard;
