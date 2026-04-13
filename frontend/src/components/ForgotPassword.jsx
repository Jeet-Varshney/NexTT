import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import logoUrl from '../assets/logo.png';

const ForgotPassword = ({ onNavigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier) {
      setIsSent(true);
      // Simulating API call
      setTimeout(() => {
        onNavigate('login');
      }, 3000);
    }
  };

  return (
    <motion.div
      className="glass-panel auth-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-header">
        <img
          src={logoUrl}
          alt="NexT"
          style={{ height: '52px', width: 'auto', objectFit: 'contain', marginBottom: '12px', filter: 'drop-shadow(0 0 14px rgba(245,0,79,0.45))' }}
        />
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">We'll send you a recovery link</p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="text"
              name="identifier"
              className="auth-input"
              placeholder="College Email or Roll No"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Send Reset Link / OTP <Send size={18} />
          </button>

          <p className="auth-link" onClick={() => onNavigate('login')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> <span>Back to Login</span>
          </p>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-header"
          style={{ padding: '24px 0' }}
        >
          <div style={{ color: 'var(--success)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <Mail size={48} />
          </div>
          <h2>Check your inbox</h2>
          <p className="auth-subtitle" style={{ marginTop: '8px' }}>
            We've sent a recovery link to your email.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ForgotPassword;
