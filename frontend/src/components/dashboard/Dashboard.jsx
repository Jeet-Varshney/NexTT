import { motion } from 'framer-motion';
import SideNav from './SideNav';
import TopNav from './TopNav';
import NoticesWidget from './widgets/NoticesWidget';
import BookingsWidget from './widgets/BookingsWidget';
import LostFoundWidget from './widgets/LostFoundWidget';
import NexKitWidget from './widgets/NexKitWidget';
import NexKitStatusWidget from './widgets/NexKitStatusWidget';
import QuickAccessWidget from './widgets/QuickAccessWidget';
import ComplaintsWidget from './widgets/ComplaintsWidget';
import AttendanceWidget from '../nexplanner/AttendanceWidget';
import './Dashboard.css';

const Dashboard = ({ onLogout, onNavigate, user }) => {
  return (
    <motion.div 
      className="dashboard-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SideNav onLogout={onLogout} onNavigate={onNavigate} user={user} />
      
      <div className="main-content-wrapper">
        <TopNav user={user} onLogout={onLogout} onNavigate={onNavigate} />
        
        <div className="dashboard-scroll-area">
          <div className="welcome-header">
            <motion.h1 
              className="welcome-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome, Student
            </motion.h1>
            <motion.p 
              style={{ color: 'var(--text-muted)' }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your campus life efficiently
            </motion.p>
          </div>

          <div className="dashboard-grid">
            <div className="span-8">
              <NoticesWidget />
            </div>
            <div className="span-4 flex flex-col gap-6">
              <QuickAccessWidget onNavigate={onNavigate} />
            </div>
            <div className="span-12">
               <AttendanceWidget userEmail={user?.email} />
            </div>
            <div className="span-6">
              <BookingsWidget />
            </div>
            <div className="span-6">
              <LostFoundWidget onNavigate={onNavigate} />
            </div>
            <div className="span-4">
              <NexKitWidget onNavigate={onNavigate} />
            </div>
            <div className="span-4">
              <NexKitStatusWidget />
            </div>
            <div className="span-4">
              <ComplaintsWidget />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
