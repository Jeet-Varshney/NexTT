import { motion } from 'framer-motion';
import { Camera, User, Hash, Mail, BookOpen, Layers, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { useState, useRef } from 'react';
import './Signup.css'; // specific styles for signup
import logoUrl from '../assets/logo.png';
import API_BASE from '../config/api.js';

const Signup = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    rollNo: '',
    email: '',
    branch: '',
    section: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const branches = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil"];
  const sections = ["A", "B", "C", "D" , "E" , "F" , "G" , "H" , "I" , "J"];  

  const validateEmail = (email) => {
    return email.endsWith('.edu') || email.includes('college') || email.endsWith('@its.edu.in');
  };

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 7) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (name === 'email' && value) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) ? '' : 'Must look like an official college email (@its.edu.in, .edu, etc)' }));
    } else if (name === 'email') {
      setErrors(prev => ({ ...prev, email: '' }));
    }

    if (name === 'confirmPassword' || name === 'password') {
      const pass = name === 'password' ? value : formData.password;
      const confirm = name === 'confirmPassword' ? value : formData.confirmPassword;
      if (confirm && pass !== confirm) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.email || errors.confirmPassword || !formData.username) return;

    setLoading(true);
    setSysError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
         alert('Registration Successful! Please log in.');
         onNavigate('login');
      } else {
         setSysError(data.message || 'Registration failed.');
      }
    } catch (err) {
       setSysError('Cannot connect to server. Try again later.');
    } finally {
       setLoading(false);
    }
  };

  const pwdStrength = checkPasswordStrength(formData.password);

  return (
    <motion.div
      className="glass-panel auth-card signup-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-header">
        <img
          src={logoUrl}
          alt="NexT"
          style={{ height: '52px', width: 'auto', objectFit: 'contain', marginBottom: '12px', filter: 'drop-shadow(0 0 14px rgba(245,0,79,0.45))' }}
        />
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Your Smart Campus</p>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* Avatar Upload */}
        <div className="avatar-upload-container">
          <div className="avatar-preview" onClick={() => fileInputRef.current.click()}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="avatar-img" />
            ) : (
              <Camera size={32} className="avatar-placeholder-icon" />
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <div className="input-group">
          <User className="input-icon" size={20} />
          <input type="text" name="username" className="auth-input" placeholder="Unique Username" required onChange={handleChange} />
        </div>

        <div className="input-row">
          <div className="input-group half">
            <Hash className="input-icon" size={20} />
            <input type="text" name="rollNo" className="auth-input" placeholder="Roll No" required onChange={handleChange} />
          </div>
          <div className="input-group half">
            <Phone className="input-icon" size={20} />
            <input type="tel" name="phone" className="auth-input" placeholder="Phone" required onChange={handleChange} />
          </div>
        </div>

        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input type="email" name="email" className="auth-input" placeholder="College Email ID" required onChange={handleChange} />
        </div>
        {errors.email && <span className="error-text">{errors.email}</span>}

        <div className="input-row">
          <div className="input-group half">
            <BookOpen className="input-icon" size={20} />
            <select name="branch" className="auth-input select-input" required onChange={handleChange} defaultValue="">
              <option value="" disabled>Branch</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="input-group half">
            <Layers className="input-icon" size={20} />
            <select name="section" className="auth-input select-input" required onChange={handleChange} defaultValue="">
              <option value="" disabled>Section</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input type="password" name="password" className="auth-input" placeholder="Password" required onChange={handleChange} />
        </div>
        {formData.password && (
          <div className="pwd-strength">
            <div className={`strength-bar ${pwdStrength >= 1 ? 'active' : ''}`}></div>
            <div className={`strength-bar ${pwdStrength >= 2 ? 'active' : ''}`}></div>
            <div className={`strength-bar ${pwdStrength >= 3 ? 'active' : ''}`}></div>
            <div className={`strength-bar ${pwdStrength >= 4 ? 'active' : ''}`}></div>
            <span className="strength-text">
              {pwdStrength < 2 ? 'Weak' : pwdStrength < 4 ? 'Good' : 'Strong'}
            </span>
          </div>
        )}

        <div className="input-group">
          <CheckCircle2 className="input-icon" size={20} />
          <input type="password" name="confirmPassword" className="auth-input" placeholder="Confirm Password" required onChange={handleChange} />
        </div>
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

        {sysError && <div className="error-text" style={{ textAlign: 'center', display: 'block', margin: '4px 0' }}>{sysError}</div>}

        <button type="submit" className="auth-button" style={{ marginTop: '16px' }} disabled={loading}>
          {loading ? 'Registering...' : 'Create Account'}
        </button>

        <p className="auth-link" onClick={() => onNavigate('login')}>
          Already have an account? <span>Log In</span>
        </p>
      </form>
    </motion.div>
  );
};

export default Signup;
