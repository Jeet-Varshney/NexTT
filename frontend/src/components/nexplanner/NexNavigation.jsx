import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Brain, 
  CalendarCheck, 
  Trophy, 
  LineChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  RefreshCw
} from 'lucide-react';

export default function NexNavigation({ activeTab, onTabChange, isCollapsed, onToggleCollapse, onSync, syncing, onBack }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'learning',  label: 'Self Learning', icon: <Brain size={20} /> },
    { id: 'planner',   label: 'Planner', icon: <CalendarCheck size={20} /> },
    { id: 'activities', label: 'Activities', icon: <Trophy size={20} /> },
    { id: 'insights',  label: 'Insights', icon: <LineChart size={20} /> }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 100 : 280 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-[#05060a] border-r border-white/5 z-50 overflow-hidden transition-all duration-300 ease-in-out shrink-0"
      >
        <div className="p-8 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <button 
                  onClick={onBack}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all mr-2"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-black text-black">N</div>
                <span className="font-black text-white tracking-widest text-sm uppercase">NexPlanner</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={onToggleCollapse}
            className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative group ${
                activeTab === item.id 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className={activeTab === item.id ? 'cyber-glow-cyan' : ''}>
                {item.icon}
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-sm tracking-tight whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeSideNav"
                  className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
           <button 
             onClick={onSync}
             disabled={syncing}
             className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             <RefreshCw size={20} className={syncing ? 'animate-spin text-cyan-400' : ''} />
             {!isCollapsed && <span className="font-bold text-sm text-white/60">Sync OSIS</span>}
           </button>
           <button 
             onClick={onBack}
             className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-rose-500/60 hover:bg-rose-500/5 hover:text-rose-500 transition-all font-bold"
           >
             <LogOut size={20} />
             {!isCollapsed && <span className="font-bold text-sm">Exit System</span>}
           </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0b10]/90 backdrop-blur-xl border-t border-white/5 px-4 h-20 flex items-center justify-around z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all p-2 rounded-xl ${
              activeTab === item.id ? 'text-cyan-400' : 'text-white/30'
            }`}
          >
            <div className={activeTab === item.id ? 'cyber-glow-cyan' : ''}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            {activeTab === item.id && (
               <motion.div 
                 layoutId="activeBottomNav"
                 className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]"
               />
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
