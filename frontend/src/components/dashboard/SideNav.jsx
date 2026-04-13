import { LayoutDashboard, CalendarCheck, UtensilsCrossed, MapPin, User, LogOut, PenTool, Handshake, ShieldCheck, Brain, Settings } from 'lucide-react';
import logoUrl from '../../assets/logo.png';

const SideNav = ({ onLogout, onNavigate, user }) => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'Study Planner', icon: <Brain size={20} />, route: 'nexplanner' },
    { name: 'Cafeteria', icon: <UtensilsCrossed size={20} />, route: 'nexcafe' },
    { name: 'Lost & Found', icon: <MapPin size={20} />,      route: 'nexlocate' },
    { name: 'Stationary & Print', icon: <PenTool size={20} />, route: 'nexkit' },
    { name: 'Marketplace', icon: <Handshake size={20} />, route: 'nextrade' },
    { name: 'Profile',   icon: <User size={20} />, route: 'profile' },
    { name: 'Settings',  icon: <Settings size={20} />, route: 'settings' }
  ];

  if (user && user.role !== 'Student') {
     navItems.push({ name: 'Admin Console', icon: <ShieldCheck size={20} />, route: 'admin' });
  }

  return (
    <>
      <style>{`
        /* Desktop Sidebar */
        .sidebar {
          width: 260px;
          border-right: 1px solid var(--glass-border);
          background: rgba(20, 20, 25, 0.4);
          backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          padding: 24px;
          z-index: 20;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-muted);
          text-decoration: none;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .nav-link.active {
          background: var(--primary-gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 0, 51, 0.2);
        }

        /* Mobile Bottom Nav */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 70px;
            border-right: none;
            border-top: 1px solid var(--glass-border);
            flex-direction: row;
            justify-content: space-around;
            padding: 8px;
            position: fixed;
            bottom: 0;
            background: rgba(10, 10, 15, 0.9);
          }
          
          .nav-link {
            flex-direction: column;
            gap: 4px;
            padding: 8px;
            margin: 0;
            font-size: 11px;
            border-radius: 8px;
            flex: 1;
            justify-content: center;
          }
          
          .sidebar-logo, .logout-btn, .nav-link-text {
            display: none;
          }
          @media (max-width: 768px) { .nav-link-text { display: block; } }
        }
      `}</style>
      
      <div className="sidebar">
        <div className="sidebar-logo" style={{ marginBottom: '36px', paddingLeft: '4px' }}>
          <img
            src={logoUrl}
            alt="NexT"
            style={{ height: '44px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(245,0,79,0.5))' }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className={`nav-link ${item.active ? 'active' : ''}`}
              onClick={() => {
                if(item.route && onNavigate) onNavigate(item.route);
              }}
            >
              {item.icon}
              <span className="nav-link-text">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="nav-link logout-btn" onClick={onLogout} style={{ marginTop: 'auto', color: 'var(--error)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
};

export default SideNav;
