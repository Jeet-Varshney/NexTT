import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const KitItemCard = ({ item, onAdd, cartQty, onUpdateQty }) => {
  return (
    <motion.div className="nk-item-card" layout>
      <div className="nk-item-img-placeholder">
        {item.emoji}
      </div>
      <div className="nk-item-body">
        <span className="nk-item-category">{item.category}</span>
        <h4 className="nk-item-title">{item.name}</h4>
        <p className="nk-item-desc">{item.description}</p>
        
        <div className="nk-item-footer">
          <div className="nk-item-price">₹{item.price}</div>
          
          {cartQty > 0 ? (
            <div className="nk-qty-controls">
              <button 
                className="nk-qty-btn" 
                onClick={() => onUpdateQty(item._id, cartQty - 1)}
              >
                <Minus size={14} />
              </button>
              <span className="nk-qty-text">{cartQty}</span>
              <button 
                className="nk-qty-btn" 
                onClick={() => onUpdateQty(item._id, cartQty + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="nk-add-btn" 
              onClick={() => onAdd(item)}
              disabled={!item.isAvailable}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <ShoppingCart size={14} /> 
              {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default KitItemCard;
