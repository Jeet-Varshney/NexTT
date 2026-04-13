import { X, ShoppingBag, Trash2, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AddressForm from './AddressForm';

const Cart = ({ cart, onRemove, onAdd, onClose, onCheckout }) => {
  const [orderType, setOrderType] = useState('Pickup');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [address, setAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'

  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalPrepTime = cart.length ? Math.max(...cart.map(i => i.prepTime)) : 0;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const handlePlaceOrder = () => {
    onCheckout({ items: cart, orderType, deliveryAddress: address, paymentMethod, totalAmount, totalPrepTime });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="cart-header">
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
          {step === 'cart' ? `Cart (${totalItems})` : 'Checkout'}
        </h3>
        <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
          <X size={22} />
        </button>
      </div>

      {/* ── STEP 1: Cart Items ── */}
      {step === 'cart' && (
        <>
          <div className="cart-items-list">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item._id}
                  className="cart-item-row"
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                >
                  <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>₹{item.price} × {item.quantity}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button className="qty-btn" style={{ width: '26px', height: '26px', fontSize: '14px' }} onClick={() => onRemove(item._id)}>−</button>
                    <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                    <button className="qty-btn" style={{ width: '26px', height: '26px', fontSize: '14px' }} onClick={() => onAdd(item)}>+</button>
                  </div>
                  <span style={{ fontWeight: 700, minWidth: '44px', textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>Your cart is empty</p>
            )}
          </div>

          <div className="cart-footer">
            <div className="cart-total-row" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 400 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> Max Prep Time</span>
              <span>~{totalPrepTime} min</span>
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{totalAmount}</span>
            </div>
            <button
              className="auth-button"
              disabled={cart.length === 0}
              onClick={() => setStep('checkout')}
              style={{ padding: '14px', fontSize: '15px' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2: Checkout ── */}
      {step === 'checkout' && (
        <>
          <div className="cart-items-list" style={{ gap: '20px' }}>

            {/* Delivery or Pickup */}
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Order Type</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Pickup', 'Delivery'].map(t => (
                  <button
                    key={t}
                    className={`payment-option ${orderType === t ? 'selected' : ''}`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => { setOrderType(t); if (t === 'Delivery') setShowAddressForm(true); }}
                  >
                    <MapPin size={14} /> {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            {orderType === 'Delivery' && (
              <AddressForm value={address} onChange={setAddress} />
            )}

            {/* Payment methods */}
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Payment Method</p>
              <div className="payment-method-grid">
                {['UPI', 'Card', 'Cash'].map(m => (
                  <button key={m} className={`payment-option ${paymentMethod === m ? 'selected' : ''}`} onClick={() => setPaymentMethod(m)}>
                    {m === 'UPI' ? '📲' : m === 'Card' ? '💳' : '💵'}<br />
                    <span style={{ fontSize: '12px' }}>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: '16px', background: 'var(--input-bg)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0, fontWeight: 600, marginBottom: '4px' }}>Order Summary</p>
              {cart.map(i => (
                <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>{i.name} × {i.quantity}</span>
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{totalAmount}</span>
            </div>
            <button className="auth-button" style={{ padding: '14px', fontSize: '15px' }} onClick={handlePlaceOrder}>
              Place Order 🎉
            </button>
            <button onClick={() => setStep('cart')} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '13px' }}>
              ← Back to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
