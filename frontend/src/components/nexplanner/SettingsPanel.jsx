import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Target, 
  Shield, 
  Palette, 
  Bell, 
  Database,
  Lock,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Check,
  X,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPanel({ onBack, onSync, syncing, email }) {
  // Goal settings state
  const [attendanceGoal, setAttendanceGoal] = useState(75);
  const [studyGoal, setStudyGoal] = useState(2);
  const [saved, setSaved] = useState(false);

  // Privacy toggles
  const [showEmail, setShowEmail] = useState(false);
  const [shareData, setShareData] = useState(false);
  const [aiInsights, setAiInsights] = useState(true);

  // Notification toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [aiTips, setAiTips] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  // Active section
  const [openSection, setOpenSection] = useState(null);

  // Theme state
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('next-theme') || 'Obsidian Dark';
  });
  const themes = [
    { name: 'Obsidian Dark', color: 'bg-cyan-500' },
    { name: 'Neon Synthwave', color: 'bg-purple-500' },
    { name: 'Arctic Minimal', color: 'bg-white' },
  ];

  useEffect(() => {
    localStorage.setItem('next-theme', activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  const handleSaveGoals = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }) => (
    <div
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${value ? 'bg-cyan-500' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
    </div>
  );

  const sections = [
    { id: 'goals', title: 'Core Objectives', sub: 'Target Attendance, Study Goals', icon: <Target className="text-cyan-400" /> },
    { id: 'privacy', title: 'Privacy & Lockdown', sub: 'OSIS Link Privacy, Data Access', icon: <Shield className="text-emerald-400" /> },
    { id: 'notifications', title: 'Telemetry Alerts', sub: 'Push Notifications, AI Tips', icon: <Bell className="text-amber-400" /> },
    { id: 'visual', title: 'Visual Protocol', sub: 'Theme, Display Preferences', icon: <Palette className="text-purple-400" /> },
  ];

  return (
    <div className="p-6 lg:p-12 flex flex-col gap-12 max-w-[1200px] mx-auto min-h-screen">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
           <div className="flex items-center gap-3 text-white/30 font-bold text-xs uppercase tracking-[0.4em] mb-3">
              <Settings size={16} /> System Preferences
           </div>
           <h2 className="text-5xl font-black text-white tracking-tighter">Configuration</h2>
         </div>
         <button 
           onClick={onBack}
           className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all shadow-xl hover:scale-105 shrink-0"
         >
           <ChevronLeft size={18} /> Back to Dashboard
         </button>
      </section>

      {/* OSIS Connection Panel */}
      <section className="glass-panel p-10 bg-white/[0.01] border-white/5 flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400">
                 <Database size={32} />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white tracking-tight italic">OSIS Connection</h3>
                 <p className="text-xs text-white/20 uppercase tracking-[0.2em] mt-1">Status: Operational // Synchronized</p>
                 <p className="text-xs text-white/10 font-mono mt-1">{email}</p>
              </div>
           </div>
           <button
             onClick={onSync}
             disabled={syncing}
             className={`px-8 py-3 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 ${
               syncing
                 ? 'bg-white/10 text-white/30 cursor-not-allowed'
                 : 'bg-cyan-500 text-black hover:scale-105 shadow-lg shadow-cyan-500/20'
             }`}
           >
             <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
             {syncing ? 'Syncing...' : 'Re-Sync Protocol'}
           </button>
        </div>

        {/* Settings Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s) => (
            <div key={s.id} className="flex flex-col">
              <button
                onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
                className="flex items-center justify-between group text-left p-4 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                      {s.icon}
                   </div>
                   <div>
                      <div className="text-white font-bold tracking-tight">{s.title}</div>
                      <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{s.sub}</div>
                   </div>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-white/20 transition-all duration-300 ${openSection === s.id ? 'rotate-90 text-cyan-400' : 'group-hover:text-white group-hover:translate-x-1'}`}
                />
              </button>

              <AnimatePresence>
                {openSection === s.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mt-2 flex flex-col gap-5">
                      {s.id === 'goals' && (
                        <>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Minimum Attendance Target (%)</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range" min={60} max={100} step={1}
                                value={attendanceGoal}
                                onChange={e => setAttendanceGoal(Number(e.target.value))}
                                className="flex-1 accent-cyan-400"
                              />
                              <span className="w-12 text-center font-black text-cyan-400 text-lg">{attendanceGoal}%</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Daily Study Goal (Hours)</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range" min={0.5} max={12} step={0.5}
                                value={studyGoal}
                                onChange={e => setStudyGoal(Number(e.target.value))}
                                className="flex-1 accent-purple-400"
                              />
                              <span className="w-12 text-center font-black text-purple-400 text-lg">{studyGoal}h</span>
                            </div>
                          </div>
                          <button
                            onClick={handleSaveGoals}
                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                              saved ? 'bg-emerald-500 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black'
                            }`}
                          >
                            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Objectives</>}
                          </button>
                        </>
                      )}

                      {s.id === 'privacy' && (
                        <>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <div className="text-sm font-bold text-white">Show Email in Profile</div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Visible to other students</div>
                            </div>
                            <Toggle value={showEmail} onChange={setShowEmail} />
                          </div>
                          <div className="flex items-center justify-between py-2 border-t border-white/5">
                            <div>
                              <div className="text-sm font-bold text-white">Share Analytics Data</div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Aggregate telemetry sharing</div>
                            </div>
                            <Toggle value={shareData} onChange={setShareData} />
                          </div>
                          <div className="flex items-center justify-between py-2 border-t border-white/5">
                            <div>
                              <div className="text-sm font-bold text-white">AI Personalization</div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Use data for AI recommendations</div>
                            </div>
                            <Toggle value={aiInsights} onChange={setAiInsights} />
                          </div>
                        </>
                      )}

                      {s.id === 'notifications' && (
                        <>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <div className="text-sm font-bold text-white">Push Notifications</div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Browser notifications</div>
                            </div>
                            <Toggle value={pushNotifs} onChange={setPushNotifs} />
                          </div>
                          <div className="flex items-center justify-between py-2 border-t border-white/5">
                            <div>
                              <div className="text-sm font-bold text-white">AI Optimization Tips</div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Receive daily study tips</div>
                            </div>
                            <Toggle value={aiTips} onChange={setAiTips} />
                          </div>
                          <div className="flex items-center justify-between py-2 border-t border-white/5">
                            <div>
                              <div className="text-sm font-bold text-white">Critical Attendance Alerts</div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Alert when below threshold</div>
                            </div>
                            <Toggle value={criticalAlerts} onChange={setCriticalAlerts} />
                          </div>
                        </>
                      )}

                      {s.id === 'visual' && (
                        <div className="flex flex-col gap-4">
                          <div className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">Active Theme</div>
                          {themes.map(theme => (
                            <button 
                              key={theme.name} 
                              onClick={() => setActiveTheme(theme.name)}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left w-full ${activeTheme === theme.name ? 'bg-white/5 border-white/20' : 'border-white/5 hover:border-white/10'}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full ${theme.color} opacity-80`} />
                                <span className={`text-sm font-bold ${activeTheme === theme.name ? 'text-white' : 'text-white/40'}`}>{theme.name}</span>
                              </div>
                              {activeTheme === theme.name && <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest bg-cyan-500/10 px-3 py-1 rounded-lg">Active</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone + Version */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-10 bg-rose-500/[0.02] border-rose-500/10 flex flex-col gap-6">
           <div className="flex items-center gap-3 text-rose-500 font-black text-[10px] uppercase tracking-widest">
              <Lock size={16} /> Danger Zone
           </div>
           <p className="text-xs text-white/40 leading-relaxed italic">
             "Terminating this session will purge the local cache. Mongoose-buffered operations may be lost if not synchronized."
           </p>
           <button 
             onClick={onBack}
             className="w-full py-4 border border-rose-500/20 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
           >
             Terminate Protocol v6.0
           </button>
        </div>

        <div className="glass-panel p-10 bg-cyan-500/[0.02] border-cyan-500/10 flex flex-col justify-center gap-2">
           <div className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] mb-4">Firmware Update</div>
           <div className="flex items-center justify-between">
              <span className="text-white font-bold">NexPlanner v6.0-Alpha</span>
              <span className="text-cyan-400 text-[10px] font-black uppercase bg-cyan-500/10 px-3 py-1 rounded-lg">Latest</span>
           </div>
           <p className="text-[10px] text-white/10 mt-4 leading-relaxed font-mono">HASH: 4b29x8177-4bb3-4382-bc05</p>
        </div>
      </section>
    </div>
  );
}
