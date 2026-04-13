import { AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ComplaintsWidget = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <motion.div 
      className="widget-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="widget-header">
        <h3 className="widget-title"><AlertCircle className="widget-icon" size={20} /> Quick Complaint</h3>
      </div>
      
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', gap: '8px', color: 'var(--success)' }}
        >
           <CheckCircle2 size={32} />
           <span style={{ fontWeight: 600 }}>Complaint Logged</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          <select required className="auth-input" defaultValue="" style={{ padding: '10px 16px', background: 'rgba(0, 0, 0, 0.3)', color: 'white', borderRadius: 12 }}>
            <option value="" disabled style={{ color: 'black' }}>Category</option>
            <option value="hostel" style={{ color: 'black' }}>Hostel Maintenance</option>
            <option value="mess" style={{ color: 'black' }}>Mess & Food</option>
            <option value="it" style={{ color: 'black' }}>IT & Wi-Fi</option>
          </select>
          
          <input 
            type="text" 
            required
            placeholder="Issue Title" 
            className="auth-input" 
            style={{ padding: '10px 16px', background: 'rgba(0, 0, 0, 0.3)', color: 'white', borderRadius: 12 }} 
          />

          <textarea 
            required
            placeholder="Description" 
            className="auth-input" 
            style={{ padding: '10px 16px', background: 'rgba(0, 0, 0, 0.3)', color: 'white', borderRadius: 12, minHeight: '80px', resize: 'vertical' }} 
          />
          
          <button type="submit" disabled={status === 'submitting'} className="auth-button" style={{ padding: '12px', fontSize: '14px', marginTop: '4px' }}>
            {status === 'submitting' ? 'Sending...' : <><Send size={16} style={{marginRight: 6}} /> Submit</>}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ComplaintsWidget;
