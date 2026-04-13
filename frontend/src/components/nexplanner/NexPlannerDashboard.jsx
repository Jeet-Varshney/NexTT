import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NexNavigation from './NexNavigation';
import AttendancePanel from './AttendancePanel';
import DailyPlanner from './DailyPlanner';
import SelfStudyTracker from './SelfStudyTracker';
import Extracurriculars from './Extracurriculars';
import InsightsPanel from './InsightsPanel';
import CourseRegistryModal from './CourseRegistryModal';
import ReportsModal from './ReportsModal';
import AchievementGallery from './AchievementGallery';
import API_BASE from '../../config/api.js';

export default function NexPlannerDashboard({ onBack, user }) {
  const [data, setData] = useState({ metrics: null, tasks: [], extracurriculars: [] });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const email = user?.email || 'student@next.edu';
  const BASE = `${API_BASE}/api/nexplanner`;

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE}/metrics/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch(err) {
      console.error('FetchDataError:', err.message);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    setTimeout(async () => {
      await fetchData();
      setSyncing(false);
    }, 1500);
  };

  const handleLogStudy = async (hours) => {
    try {
      await fetch(`${BASE}/study-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hours, date: new Date().toISOString().split('T')[0] })
      });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleAddTask = async (title, category) => {
    try {
      await fetch(`${BASE}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, title, category, date: new Date().toISOString().split('T')[0] })
      });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleUpdateSubject = async (subjectName, attended, total) => {
    try {
      await fetch(`${BASE}/subject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subjectName, attended, total })
      });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleDeleteSubject = async (subjectName) => {
    try {
      await fetch(`${BASE}/subject?email=${encodeURIComponent(email)}&subjectName=${encodeURIComponent(subjectName)}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleToggleTask = async (id) => {
    try {
      await fetch(`${BASE}/task/${id}`, { method: 'PATCH' });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${BASE}/task/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleAddExtracurricular = async (activityName, type, badgeGiven, date) => {
    try {
      await fetch(`${BASE}/extracurricular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, activityName, type, badgeGiven, date })
      });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleDeleteExtracurricular = async (id) => {
    try {
      await fetch(`${BASE}/extracurricular/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(err) { console.error(err); }
  };

  if(loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#05060a]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="font-black uppercase tracking-[0.5em] text-xs text-cyan-400"
        >
          Initializing NexPlanner Protocol...
        </motion.div>
      </div>
    );
  }

  const renderPanel = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <AttendancePanel
            attendanceData={data?.metrics?.attendance}
            onOpenRegistry={() => setIsRegistryOpen(true)}
            onOpenReports={() => setIsReportsOpen(true)}
          />
        );
      case 'learning':
        return (
          <SelfStudyTracker
            streaks={data?.metrics?.studyStreaks}
            onLogStudy={handleLogStudy}
          />
        );
      case 'planner':
        return (
          <DailyPlanner
            tasks={data?.tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'activities':
        return (
          <Extracurriculars
            data={data?.extracurriculars}
            onAddActivity={handleAddExtracurricular}
            onDeleteActivity={handleDeleteExtracurricular}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        );
      case 'insights':
        return (
          <InsightsPanel
            data={data}
            onOpenReports={() => setIsReportsOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white flex flex-col lg:flex-row shadow-2xl relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#05060a]" />
      <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-500/[0.03] blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-500/[0.03] blur-[150px] rounded-full pointer-events-none -z-10" />

      <NexNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onSync={handleSync}
        syncing={syncing}
        onBack={onBack}
      />

      <main className="flex-1 min-h-screen pb-24 lg:pb-0 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {renderPanel()}
          </motion.div>
        </AnimatePresence>
      </main>

      <CourseRegistryModal 
        isOpen={isRegistryOpen} 
        onClose={() => setIsRegistryOpen(false)} 
        subjects={data?.metrics?.attendance}
        onUpdate={handleUpdateSubject}
        onDelete={handleDeleteSubject}
      />

      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        data={data}
      />

      <AchievementGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        achievements={data?.extracurriculars}
      />
    </div>
  );
}
