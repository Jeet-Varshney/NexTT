import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Truck, Package, X } from 'lucide-react';

const STEPS = [
  { key: 'Pending',        label: 'Order Placed',       icon: <Package size={14} />,     hint: 'Your order has been received.' },
  { key: 'Preparing',     label: 'Preparing',           icon: <Clock size={14} />,        hint: 'The cafeteria is cooking your food.' },
  { key: 'Ready',         label: 'Ready',               icon: <CheckCircle size={14} />,  hint: 'Your order is ready!' },
  { key: 'OutForDelivery',label: 'Out for Delivery',    icon: <Truck size={14} />,        hint: 'On the way to you.' },
  { key: 'Completed',     label: 'Delivered',           icon: <CheckCircle size={14} />,  hint: 'Enjoy your meal! 🎉' },
];

// Simulate status progression for MVP demo
const DEMO_TIMELINE_MS = [0, 4000, 8000, 13000, 18000];

const OrderTracker = ({ order, onClose }) => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [secsLeft, setSecsLeft] = useState(120); // 2 min cancellation window
  const [cancelled, setCancelled] = useState(false);
  const isDelivery = order.orderType === 'Delivery';

  // Progress status automatically for demo
  useEffect(() => {
    const timers = DEMO_TIMELINE_MS.map((delay, i) =>
      setTimeout(() => setCurrentStatusIndex(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Cancellation countdown
  useEffect(() => {
    if (secsLeft <= 0) return;
    const t = setInterval(() => setSecsLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [secsLeft]);

  const handleCancel = () => {
    if (secsLeft > 0) setCancelled(true);
  };

  const visibleSteps = isDelivery ? STEPS : STEPS.filter(s => s.key !== 'OutForDelivery');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="widget-card"
      style={{ maxWidth: '480px', width: '100%', margin: '0 auto', padding: '28px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ margin: 0 }}>Order Tracking</h2>
        <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={22} /></button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
        #{order.orderId || 'ORD-DEMO'} · {order.orderType} · ₹{order.totalAmount}
      </p>

      {cancelled ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ color: 'var(--error)', fontSize: '20px', fontWeight: 600 }}>Order Cancelled</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Refund will be initiated shortly.</p>
        </div>
      ) : (
        <>
          <div className="tracker-steps">
            {visibleSteps.map((step, i) => {
              const done = i < currentStatusIndex;
              const active = i === currentStatusIndex;
              const isLast = i === visibleSteps.length - 1;
              return (
                <div key={step.key} className="tracker-step">
                  <div className="step-indicator">
                    <div className={`step-dot ${done ? 'done' : active ? 'active' : ''}`} />
                    {!isLast && <div className={`step-line ${done ? 'done' : ''}`} />}
                  </div>
                  <div style={{ paddingBottom: isLast ? 0 : '28px', paddingLeft: '4px' }}>
                    <p className="step-label" style={{ color: done || active ? 'var(--text-main)' : 'var(--text-muted)', margin: 0 }}>
                      {step.icon} {step.label}
                    </p>
                    {active && <p className="step-sublabel">{step.hint}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cancellation window */}
          {secsLeft > 0 && currentStatusIndex < 2 && (
            <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--warning)' }}>
                Cancel window closes in <strong>{secsLeft}s</strong>
              </p>
              <button onClick={handleCancel} style={{ marginTop: '8px', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>
                Cancel Order
              </button>
            </div>
          )}
          {secsLeft <= 0 && currentStatusIndex < 4 && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>Cancellation window expired.</p>
          )}
        </>
      )}
    </motion.div>
  );
};

export default OrderTracker;
