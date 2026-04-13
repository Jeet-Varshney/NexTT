import { useState } from 'react';
import { X, MapPin, ShoppingBag } from 'lucide-react';
import AddressForm from '../nexcafe/AddressForm';

const Cart = ({ cart, onRemove, onAdd, onClose, onCheckout, deliveryAddress, onAddressChange }) => {
  const [orderMode, setOrderMode] = useState('Delivery');

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    onCheckout({ orderType: orderMode, deliveryAddress: orderMode === 'Delivery' ? deliveryAddress : 'Pickup Center' });
  };

  return (
    <div className="nexkit-cart">
      <div className="cart-header">
        <div>
          <h3>Cart ({totalItems})</h3>
          <p>{cart.length} product{cart.length !== 1 ? 's' : ''} in bag</p>
        </div>
        <button onClick={onClose}><X size={18} /></button>
      </div>

      <div className="cart-items-list">
        {cart.map(item => (
          <div key={item._id} className="cart-item-row">
            <div>
              <p>{item.name}</p>
              <span>₹{item.price} × {item.quantity}</span>
            </div>
            <div className="qty-control">
              <button onClick={() => onRemove(item._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onAdd(item)}>+</button>
            </div>
          </div>
        ))}
        {cart.length === 0 && (
          <p className="empty-cart">Nothing in cart yet. Add stationery items to start.</p>
        )}
      </div>

      <div className="cart-checkout-panel">
        <div className="checkout-row">
          <span>Order Type</span>
          <div className="delivery-toggle">
            {['Delivery', 'Pickup'].map(mode => (
              <button
                key={mode}
                className={orderMode === mode ? 'selected' : ''}
                onClick={() => setOrderMode(mode)}
              >
                <MapPin size={14} /> {mode}
              </button>
            ))}
          </div>
        </div>

        {orderMode === 'Delivery' && (
          <AddressForm value={deliveryAddress} onChange={onAddressChange} />
        )}

        <div className="cart-summary-card">
          <div className="summary-row"><span>Subtotal</span><strong>₹{totalAmount}</strong></div>
          <div className="summary-row"><span>Estimated delivery</span><strong>{orderMode === 'Delivery' ? '30-45 min' : 'Ready in 10 min'}</strong></div>
        </div>

        <button className="auth-button" onClick={handlePlaceOrder} disabled={cart.length === 0}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
