import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';

const KitCart = ({ items, onClose, onUpdateQty, onCheckout, loading }) => {
  const [deliveryMethod, setDeliveryMethod] = useState('Pickup');
  const [address, setAddress] = useState('');

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isValid = items.length > 0 && (deliveryMethod === 'Pickup' || address.trim() !== '');

  const handlePlaceOrder = () => {
    if (!isValid) return;
    onCheckout({
      type: 'Stationary',
      items: items.map(i => ({
        itemId: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        emoji: i.emoji
      })),
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'Delivery' ? address : 'Campus Store Pickup',
      paymentMethod: 'Cash',
      totalAmount: total
    });
  };

  return (
    <div className="nk-cart-overlay">
      <motion.div
        className="nk-cart-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="nk-cart-header">
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>🛒 Your Cart</h3>
          <button
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="nk-cart-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
              <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="nk-cart-row">
                <div className="nk-cart-emoji">{item.emoji}</div>
                <div className="nk-cart-details">
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px' }}>{item.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>₹{item.price}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '8px' }}>
                      <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 4px' }} onClick={() => onUpdateQty(item._id, item.quantity - 1)}>
                        {item.quantity === 1 ? <Trash2 size={12} color="var(--error)" /> : '-'}
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: '700', width: '14px', textAlign: 'center' }}>{item.quantity}</span>
                      <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 4px' }} onClick={() => onUpdateQty(item._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Delivery Method</label>
              <div className="nk-radio-group">
                <button
                  className={`nk-radio-btn ${deliveryMethod === 'Pickup' ? 'active' : ''}`}
                  onClick={() => setDeliveryMethod('Pickup')}
                >
                  🏫 Pickup
                </button>
                <button
                  className={`nk-radio-btn ${deliveryMethod === 'Delivery' ? 'active' : ''}`}
                  onClick={() => setDeliveryMethod('Delivery')}
                >
                  🛵 Delivery
                </button>
              </div>

              {deliveryMethod === 'Delivery' && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Delivery Address</label>
                  <input
                    type="text"
                    className="nk-input"
                    placeholder="e.g. Hostel A, Room 204"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nk-cart-footer">
          <div className="nk-cart-total">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            className="nk-checkout-btn"
            onClick={handlePlaceOrder}
            disabled={!isValid || loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          {deliveryMethod === 'Pickup' && items.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-dim)' }}>
              Pickup from Campus Print Center within 2 hours
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default KitCart;
