import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import logoUrl from '../assets/logo.png';
import API_BASE from '../config/api.js';

const Login = ({ onNavigate, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        onLoginSuccess(data);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
       // Mock fallback for hackathon if backend is down
       if (formData.identifier === 'demo') {
         onLoginSuccess({ username: 'demo', rollNo: 'DEMO01', email: 'demo@next.edu', branch: 'Computer Science' });
       } else {
         setError('Cannot connect to server.');
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-panel auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-header">
        <img
          src={logoUrl}
          alt="NexT"
          style={{ height: '60px', width: 'auto', objectFit: 'contain', marginBottom: '16px', filter: 'drop-shadow(0 0 16px rgba(245,0,79,0.5))' }}
        />
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Enter Campus</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="input-group">
          <User className="input-icon" size={20} />
          <input
            type="text"
            name="identifier"
            className="auth-input"
            placeholder="Username / Roll No / College ID"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <p className="forgot-pwd-link" onClick={() => onNavigate('forgot')}>
          Forgot Password?
        </p>

        {error && <span className="error-text" style={{margin: '-10px 0 0', display: 'block', textAlign: 'center'}}>{error}</span>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Authenticating...' : <><ArrowRight size={20} /> Enter Campus</>}
        </button>

        <p className="auth-link" onClick={() => onNavigate('signup')}>
          Don't have an account? <span>Sign Up</span>
        </p>
      </form>
    </motion.div>
  );
};

export default Login;
