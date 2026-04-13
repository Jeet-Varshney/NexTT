import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const ItemCard = ({ item, onAdd, onRemove, quantity }) => {
  return (
    <motion.div
      className="nexkit-card"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="nexkit-image-wrap">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="nexkit-card-body">
        <div>
          <p className="nexkit-card-category">{item.category}</p>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <div className="nexkit-card-meta">
          <span>₹{item.price}</span>
          <AnimatePresence mode="wait">
            {quantity > 0 ? (
              <motion.div
                className="qty-control"
                key="qty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <button onClick={() => onRemove(item._id)}><Minus size={14} /></button>
                <span>{quantity}</span>
                <button onClick={() => onAdd(item)}><Plus size={14} /></button>
              </motion.div>
            ) : (
              <motion.button
                className="add-btn"
                key="add"
                onClick={() => onAdd(item)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                + Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
