import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ItemCard = ({ item, onAdd, onRemove, quantity }) => {
  return (
    <motion.div
      className="item-card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="item-emoji">{item.emoji}</div>
      <h3 className="item-name">{item.name}</h3>
      <p className="item-desc">{item.description}</p>
      <div className="item-meta">
        <span className="item-price">₹{item.price}</span>
        <span className="item-prep"><Clock size={12} /> {item.prepTime} min</span>
      </div>

      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          <motion.button
            key="add"
            className="add-btn"
            onClick={() => onAdd(item)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            + Add to Cart
          </motion.button>
        ) : (
          <motion.div
            key="qty"
            className="qty-control"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="qty-btn" onClick={() => onRemove(item._id)}>−</button>
            <span style={{ fontWeight: 700, fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
            <button className="qty-btn" onClick={() => onAdd(item)}>+</button>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>₹{item.price * quantity}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ItemCard;
