import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Zap, Clock, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ReportsModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const streaks = data?.metrics?.studyStreaks || [];
  const totalHours = streaks.reduce((sum, s) => sum + s.hours, 0) || 0;
  const avgHours = streaks.length > 0 ? totalHours / streaks.length : 0;
  
  const tasks = data?.tasks || [];
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Derive distribution from tasks if they have categories, otherwise fallback
  const categories = ['Core', 'Lab', 'Urgent', 'Personal'];
  const distribution = categories.map((cat, i) => {
    const count = tasks.filter(t => t.category === cat).length;
    return {
      name: cat,
      value: count || (i === 0 ? 1 : 0), // Ensure at least something shows if empty
      color: cat === 'Core' ? '#22d3ee' : cat === 'Lab' ? '#34d399' : cat === 'Urgent' ? '#f43f5e' : '#fbbf24'
    };
  }).filter(d => d.value > 0);

  const chartData = distribution.length > 0 ? distribution : [
    { name: 'Theory', value: 40, color: '#22d3ee' },
    { name: 'Labs', value: 30, color: '#818cf8' },
    { name: 'Projects', value: 20, color: '#c084fc' },
    { name: 'Review', value: 10, color: '#f472b6' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#0a0b10] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-10 border-b border-white/5 flex justify-between items-start">
            <div>
               <div className="flex items-center gap-3 text-cyan-400 font-black text-xs uppercase tracking-[0.3em] mb-3">
                 <Zap size={16} /> Weekly Performance Telemetry
               </div>
               <h2 className="text-4xl font-black text-white tracking-tighter">Academic Insight Report</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
              <X className="text-white" />
            </button>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 flex flex-col gap-2">
                <Clock className="text-cyan-400 mb-2" />
                <div className="text-3xl font-black text-white tracking-tighter">{totalHours.toFixed(1)}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Total Study Hours</div>
             </div>
             <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 flex flex-col gap-2">
                <TrendingUp className="text-emerald-400 mb-2" />
                <div className="text-3xl font-black text-white tracking-tighter">{completionRate}%</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Mission Completion Rate</div>
             </div>
             <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 flex flex-col gap-2">
                <Calendar className="text-purple-400 mb-2" />
                <div className="text-3xl font-black text-white tracking-tighter">Day {data?.metrics?.studyStreaks?.length || 0}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Current Logic Streak</div>
             </div>

             <div className="md:col-span-2 bg-white/[0.03] p-8 rounded-3xl border border-white/5 h-[300px] relative overflow-hidden">
                <div className="absolute top-8 left-8 z-10">
                   <h3 className="text-lg font-bold text-white tracking-tight">Time Distribution</h3>
                   <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Activity Segmentation</p>
                </div>
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={chartData}
                         innerRadius="60%"
                         outerRadius="80%"
                         paddingAngle={8}
                         dataKey="value"
                         stroke="none"
                       >
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                         itemStyle={{ color: '#fff', fontSize: '10px' }}
                       />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
                <div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Pro Insight</h3>
                   <p className="text-sm text-white/60 leading-relaxed italic">
                     "Based on your 72-hour trajectory, you are 12% more efficient than last week. Maintain this velocity to reach your goal."
                   </p>
                </div>
                <button className="mt-8 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-xl hover:scale-105 transition-all">
                   Share Protocol
                </button>
             </div>
          </div>

          <div className="p-10 border-t border-white/5 bg-black/20 flex justify-center">
             <p className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-mono">Next Intelligence Generated Report // ID: {Math.random().toString(36).substr(2, 9)}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
