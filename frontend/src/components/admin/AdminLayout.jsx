import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Coffee, CalendarRange, PackageSearch, 
  MapPin, Handshake, Users, Bell, Settings, Menu, X, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import './Admin.css';

import AdminOverview from './views/AdminOverview';
import AdminCafe from './views/AdminCafe';
import AdminTrade from './views/AdminTrade';
import AdminUsers from './views/AdminUsers';
import AdminComplaints from './views/AdminComplaints';

// Mock views for others that share table layout
const AdminPlaceholder = ({ title }) => (
  <div>
    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>{title} Management</h2>
    <div className="admin-table-container">
       <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          <ShieldCheck size={48} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
          Data connection required for {title} sync.
       </div>
    </div>
  </div>
);

const AdminLayout = ({ onExit, user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Secure defaults if prop drops
  const role = user?.role || 'Student';
  const perms = user?.permissions || [];
  
  const allNavItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'cafe', label: 'NexT Bites', icon: <Coffee size={18} /> },
    { id: 'kit', label: 'NexT Essentials', icon: <PackageSearch size={18} /> },
    { id: 'locate', label: 'NexT Finder', icon: <MapPin size={18} /> },
    { id: 'trade', label: 'NexT Bazaar', icon: <Handshake size={18} /> },
    { id: 'complaints', label: 'Complaints', icon: <ShieldAlert size={18} /> },
    { id: 'users', label: 'User Directory', icon: <Users size={18} /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={18} /> },
    { id: 'settings', label: 'System Config', icon: <Settings size={18} /> },
  ];

  // Restrict navigation based on 'permissions' array logic
  const navItems = allNavItems.filter(item => {
    if (role === 'Super Admin' || perms.includes('all')) return true;
    if (item.id === 'overview' || item.id === 'notifications' || item.id === 'users') return true; // Baseline available
    return perms.includes(item.id);
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'cafe': return <AdminCafe />;
      // case 'kit': return <AdminPlaceholder title="Stationery" />;
      // case 'locate': return <AdminPlaceholder title="Lost & Found" />;
      case 'trade': return <AdminTrade />;
      case 'complaints': return <AdminComplaints />;
      case 'users': return <AdminUsers activeUser={user} />;
      default: return <AdminPlaceholder title={navItems.find(n => n.id === activeTab)?.label} />;
    }
  };

  return (
    <div className="admin-wrapper">
      
      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon"><ShieldCheck size={24} /></div>
          NexT Admin
        </div>
        
        <div className="admin-nav">
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>
        
        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="admin-nav-item" style={{ width: '100%', color: '#f5004f' }} onClick={onExit}>
             <X size={18} /> Exit Console
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <button className="btn-action" style={{ display: 'inline-block' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
               <Menu size={24} />
             </button>
             <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
               {navItems.find(n => n.id === activeTab)?.label}
             </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
             <div style={{ textAlign: 'right', display: 'none', '@media(min-width: 768px)': { display: 'block' } }}>
               <div style={{ fontSize: 13, fontWeight: 700, color: role === 'Super Admin' ? 'var(--info)' : 'white' }}>{role}</div>
               <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email || 'admin@next.edu'}</div>
             </div>
             <div 
               onClick={() => setShowProfile(!showProfile)}
               style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
             >
               {user?.username ? user.username[0].toUpperCase() : 'A'}
             </div>

             <AnimatePresence>
               {showProfile && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     style={{ position: 'absolute', top: 56, right: 0, width: 220, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100 }}
                  >
                     <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, color: 'white' }}>{user?.username || 'Admin User'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                     </div>
                     <button className="dropdown-item" onClick={onExit} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <LayoutDashboard size={16} /> Return to Campus
                     </button>
                     <button 
                        onClick={() => {
                           localStorage.removeItem('next_token');
                           localStorage.removeItem('next_user');
                           window.location.reload();
                        }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(245, 0, 79, 0.1)', borderRadius: 8, border: 'none', color: '#f5004f', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}
                     >
                        <X size={16} /> Secure Logout
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
        </header>

        <section className="admin-content">
           <AnimatePresence mode="wait">
             <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
             >
                {renderContent()}
             </motion.div>
           </AnimatePresence>
        </section>
      </main>

    </div>
  );
};

export default AdminLayout;
