import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import NexPlannerDashboard from './components/nexplanner/NexPlannerDashboard';
import NexCafeDashboard from './components/nexcafe/NexCafeDashboard';
import NexLocateDashboard from './components/nexlocate/NexLocateDashboard';
import NexKitDashboard from './components/nexkit/NexKitDashboard';
import NexTradeDashboard from './components/nextrade/NexTradeDashboard';
import AdminLayout from './components/admin/AdminLayout';
import ProfileDashboard from './components/profile/ProfileDashboard';
import SettingsPanel from './components/nexplanner/SettingsPanel';
import CursorAnimation from './components/CursorAnimation';
import './App.css';

function App() {
  // Views: 'login', 'signup', 'forgot', 'dashboard', 'nexcafe', 'nexlocate', 'nexkit', 'nextrade', 'nexplanner', 'admin', 'profile'
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Apply saved theme on first load
    const savedTheme = localStorage.getItem('next-theme') || 'Obsidian Dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Auto login check
    const stored = localStorage.getItem('next_user');
    if (stored) {
      setUser(JSON.parse(stored));
      setCurrentView('dashboard');
    }
  }, []);

  const navigateTo = (view) => setCurrentView(view);
  
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('next_user', JSON.stringify(userData));
    setUser(userData);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('next_user');
    setUser(null);
    navigateTo('login');
  };

  return (
    <div className="app-container" style={{ padding: ['dashboard','nexcafe','nexlocate','nexkit','nextrade','nexplanner','admin','profile', 'settings'].includes(currentView) ? '0' : '20px' }}>
      <CursorAnimation />
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
           <Login key="login" onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />
        )}
        {currentView === 'signup' && (
          <Signup key="signup" onNavigate={navigateTo} />
        )}
        {currentView === 'forgot' && (
          <ForgotPassword key="forgot" onNavigate={navigateTo} />
        )}
        {currentView === 'dashboard' && (
          <Dashboard key="dashboard" onLogout={handleLogout} onNavigate={navigateTo} user={user} />
        )}
        {currentView === 'nexplanner' && (
          <NexPlannerDashboard key="nexplanner" onBack={() => navigateTo('dashboard')} user={user} />
        )}

        {currentView === 'nexcafe' && (
          <NexCafeDashboard key="nexcafe" onBack={() => navigateTo('dashboard')} />
        )}
        {currentView === 'nexlocate' && (
          <NexLocateDashboard key="nexlocate" onBack={() => navigateTo('dashboard')} />
        )}
        {currentView === 'nexkit' && (
          <NexKitDashboard key="nexkit" onBack={() => navigateTo('dashboard')} />
        )}
        {currentView === 'nextrade' && (
          <NexTradeDashboard key="nextrade" onBack={() => navigateTo('dashboard')} />
        )}
        {currentView === 'admin' && (
          <AdminLayout key="admin" onExit={() => navigateTo('dashboard')} user={user} />
        )}
        {currentView === 'profile' && (
          <ProfileDashboard key="profile" user={user} onBack={() => navigateTo('dashboard')} onLogout={handleLogout} />
        )}
        {currentView === 'settings' && (
          <SettingsPanel key="settings" user={user} email={user?.email} onBack={() => navigateTo('dashboard')} onSync={() => {}} syncing={false} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
