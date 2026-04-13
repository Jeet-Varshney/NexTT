import { useState } from 'react';
import { Bell, Search, User as UserIcon, LogOut, Settings, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
import logoUrl from '../../assets/logo.png';

const TopNav = ({ user, onLogout, onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Simulated notifications
  const notifications = [
    { id: 1, title: 'Your NexT Bites order is ready!', time: '2m ago', active: true },
    { id: 3, title: 'System: Scheduled maintenance tonight.', time: '1d ago', active: false }
  ];
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid var(--glass-border)',
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(20px)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Logo image – visible on mobile where sidebar is hidden */}
        <img src={logoUrl} alt="NexT Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(245,0,79,0.4))' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="input-group" style={{ width: '250px', background: 'var(--input-bg)', borderRadius: '20px', display: 'none' /* hidden on extra small, shown via css below */ }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search campus..." 
            style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 12px 8px 36px', color: 'var(--text-main)', outline: 'none' }} 
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
             onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
             style={{ background: 'var(--input-bg)', padding: '8px', borderRadius: '50%', color: 'var(--text-main)', cursor: 'pointer', border: 'none', outline: 'none' }}
          >
            <Bell size={20} />
            <span style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, background: 'var(--primary)', borderRadius: '50%', border: '2px solid #050505' }}></span>
          </button>
          
          <AnimatePresence>
             {showNotifications && (
                <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   style={{ position: 'absolute', top: 48, right: 0, width: 320, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100 }}
                >
                   <h4 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Notifications</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {notifications.map(n => (
                         <div key={n.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.active ? 'var(--primary)' : 'transparent', marginTop: 6 }} />
                            <div>
                               <div style={{ fontSize: 14, color: 'white' }}>{n.title}</div>
                               <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.2)'
          }}>
            {user?.username ? <span style={{ color: 'white', fontWeight: 600 }}>{user.username[0].toUpperCase()}</span> : <UserIcon size={20} color="white" />}
          </div>

          <AnimatePresence>
             {showProfile && (
                <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   style={{ position: 'absolute', top: 48, right: 0, width: 200, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100 }}
                >
                   <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, color: 'white' }}>{user?.username || 'Student User'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email || 'user@next.edu'}</div>
                   </div>
                   
                   <button onClick={() => { if(onNavigate) onNavigate('profile'); }} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <UserIcon size={16} /> My Profiling
                   </button>
                   <button onClick={() => { if(onNavigate) onNavigate('profile'); }} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <CreditCard size={16} /> Virtual ID
                   </button>
                   <button onClick={() => { if(onNavigate) onNavigate('settings'); }} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 8 }}>
                      <Settings size={16} /> Settings
                   </button>
                   
                   <button 
                      onClick={() => {
                         if(onLogout) {
                            onLogout();
                         } else {
                            localStorage.removeItem('next_token');
                            localStorage.removeItem('next_user');
                            window.location.reload();
                         }
                      }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(245, 0, 79, 0.1)', borderRadius: 8, border: 'none', color: '#f5004f', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                   >
                      <LogOut size={16} /> Secure Logout
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
