import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Brain, Zap, Clock, TrendingUp, Calendar, Plus, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SelfStudyTracker({ streaks, onLogStudy }) {
  const [hours, setHours] = useState('');
  const [logging, setLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  const allStreaks = streaks || [];
  const weekData = [...allStreaks].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);

  // Calculate consecutive streak from today backwards
  const sortedDesc = [...allStreaks].sort((a, b) => new Date(b.date) - new Date(a.date));
  let consecutiveDays = 0;
  for (let i = 0; i < sortedDesc.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (sortedDesc[i]?.date === expectedStr) consecutiveDays++;
    else break;
  }

  const totalHours = allStreaks.reduce((sum, s) => sum + (s.hours || 0), 0);
  const todayEntry = allStreaks.find(s => s.date === new Date().toISOString().split('T')[0]);
  const todayHours = todayEntry?.hours || 0;

  const handleLog = async () => {
    if (!hours || Number(hours) <= 0) return;
    setLogging(true);
    await onLogStudy(Number(hours));
    setLogSuccess(true);
    setHours('');
    setLogging(false);
    setTimeout(() => setLogSuccess(false), 2000);
  };

  const quickAdd = (h) => {
    setHours(prev => {
      const cur = parseFloat(prev) || 0;
      return Math.max(0, Math.round((cur + h) * 2) / 2).toString();
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-12 flex flex-col gap-6 md:gap-10 max-w-[1600px] mx-auto pb-24 lg:pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs uppercase tracking-[0.4em] mb-3">
              <Zap size={16} /> Cognitive Laboratory
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mt-1 md:mt-2">Self-Learning Session</h2>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
           <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${consecutiveDays > 0 ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-white/20'}`}>
              <Flame size={24} />
           </div>
           <div>
              <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Ongoing Streak</div>
              <div className="text-xl font-black text-white">
                {consecutiveDays} Consecutive {consecutiveDays === 1 ? 'Day' : 'Days'}
              </div>
           </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 bg-white/[0.02] text-center">
          <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3 flex items-center justify-center gap-2">
            <Clock size={12} /> Today's Session
          </div>
          <div className={`text-4xl font-black tracking-tighter ${todayHours > 0 ? 'text-cyan-400' : 'text-white/20'}`}>
            {todayHours}h
          </div>
          <div className="text-[10px] text-white/20 mt-2 font-mono uppercase">
            {todayHours >= 2 ? 'Deep Work ✓' : 'Not Started'}
          </div>
        </div>
        <div className="glass-panel p-8 bg-white/[0.02] text-center">
          <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3 flex items-center justify-center gap-2">
            <Brain size={12} /> Total Logged
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">{totalHours.toFixed(1)}h</div>
          <div className="text-[10px] text-white/20 mt-2 font-mono uppercase">All Time</div>
        </div>
        <div className="glass-panel p-8 bg-white/[0.02] text-center">
          <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3 flex items-center justify-center gap-2">
            <TrendingUp size={12} /> Daily Average
          </div>
          <div className="text-4xl font-black text-purple-400 tracking-tighter">
            {allStreaks.length > 0 ? (totalHours / allStreaks.length).toFixed(1) : '0'}h
          </div>
          <div className="text-[10px] text-white/20 mt-2 font-mono uppercase">Per Session</div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Controls */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-panel p-8 flex flex-col gap-6">
               <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                  <Clock size={18} className="text-cyan-400" /> Log Session
               </h3>
               <div className="space-y-4">
                  <div className="text-xs text-white/30 uppercase font-black tracking-widest">Duration (Hours)</div>
                  
                  {/* Quick Add Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[0.5, 1, 1.5, 2].map(h => (
                      <button
                        key={h}
                        onClick={() => quickAdd(h)}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-black text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      >
                        +{h}h
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 w-full">
                      <button
                        onClick={() => quickAdd(-0.5)}
                        className="w-12 md:w-14 h-14 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Minus size={18} />
                      </button>
                      <div className="flex-1 h-14 relative">
                        <input 
                          type="number" 
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          placeholder="2.5"
                          step="0.5"
                          min="0"
                          className="absolute inset-0 w-full h-full bg-white/5 border border-white/10 rounded-xl px-4 text-white font-bold text-center text-xl md:text-2xl focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all m-0"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        />
                      </div>
                      <button
                        onClick={() => quickAdd(0.5)}
                        className="w-12 md:w-14 h-14 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={handleLog}
                      disabled={!hours || Number(hours) <= 0 || logging}
                      className={`w-full h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                        logSuccess
                          ? 'bg-emerald-500 text-white'
                          : hours && Number(hours) > 0 && !logging
                          ? 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-xl'
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {logSuccess ? '✓ Session Logged!' : logging ? 'Committing...' : 'Commit to Ledger'}
                    </button>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-8 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                  <TrendingUp size={14} /> Efficiency Index
               </div>
               <p className={`text-sm leading-relaxed ${todayHours >= 2 ? 'text-white/60' : 'text-white/30 italic'}`}>
                 {todayHours >= 3
                   ? '"Exceptional session depth. Your deep-work blocks are 30% above baseline."'
                   : todayHours >= 2
                   ? '"Good session logged. Consistent 2h+ blocks maximize long-term retention."'
                   : todayHours > 0
                   ? '"Session started. Try to reach at least 2 hours for optimal cognitive load."'
                   : '"No session logged today. Even 30 minutes keeps your streak alive."'}
               </p>
            </div>
         </div>

         {/* Analytics */}
         <div className="lg:col-span-8 glass-panel p-10 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <Calendar size={20} className="text-purple-400" /> Activity Timeline
               </h3>
               <div className="text-[10px] text-white/20 uppercase font-black tracking-widest">Trailing 7 Cycles</div>
            </div>

            <div className="flex-1 w-full">
               {weekData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weekData}>
                       <defs>
                          <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                       <XAxis 
                         dataKey="date" 
                         axisLine={false}
                         tickLine={false}
                         tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700 }}
                         padding={{ left: 20, right: 20 }}
                         tickFormatter={v => v.slice(5)} // Show MM-DD
                       />
                       <YAxis hide />
                       <Tooltip 
                         content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                             return (
                               <div className="bg-[#0f111a] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                                 <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">{payload[0].payload.date}</div>
                                 <div className="text-white text-2xl font-black tracking-tighter">{payload[0].value} <span className="text-[10px] text-gray-500 uppercase">Hours</span></div>
                               </div>
                             );
                           }
                           return null;
                         }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="hours" 
                         stroke="#22d3ee" 
                         strokeWidth={3} 
                         fillOpacity={1} 
                         fill="url(#colorStudy)" 
                         animationDuration={2000}
                         dot={{ fill: '#22d3ee', r: 4, strokeWidth: 0 }}
                         activeDot={{ r: 6, fill: '#22d3ee', strokeWidth: 0 }}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10">
                   <Brain size={64} className="mb-4" />
                   <div className="text-sm font-black uppercase tracking-[0.4em]">No sessions yet</div>
                   <div className="text-xs mt-2">Log your first session to see the timeline</div>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}
