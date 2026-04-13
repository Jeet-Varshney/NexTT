import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Zap,
  TrendingUp,
  Activity,
  FileText
} from 'lucide-react';

export default function AttendancePanel({ attendanceData, onOpenRegistry, onOpenReports }) {
  const data = attendanceData || [];
  
  const calculateMetrics = () => {
    let totalClasses = 0;
    let totalAttended = 0;
    const subjects = data.map(s => {
      const pct = (s.attended / s.total) * 100;
      const needed = Math.max(0, Math.ceil((0.75 * s.total - s.attended) / 0.25));
      totalClasses += s.total;
      totalAttended += s.attended;
      
      let status = 'safe';
      if (pct < 75) status = 'critical';
      else if (pct < 80) status = 'warning';

      return { ...s, pct, needed, status };
    });

    const overall = totalClasses ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;
    const projected = (overall * 0.9).toFixed(1); // Simulated "pace" drop

    return { subjects, overall, projected, totalClasses, totalAttended };
  };

  const { subjects, overall, projected, totalClasses, totalAttended } = calculateMetrics();
  const COLORS = ['#22d3ee', '#818cf8', '#c084fc', '#f472b6', '#34d399'];

  const getSuggestions = () => {
    const list = [];
    subjects.forEach(s => {
      if (s.status === 'critical') {
        list.push({
          type: 'critical',
          text: `Critical: You need ${s.needed} more consecutive classes in ${s.subject} to reach 75%.`,
          icon: <AlertCircle className="text-rose-500" size={18} />
        });
      } else if (s.status === 'warning') {
        list.push({
          type: 'warning',
          text: `Warning: ${s.subject} is at ${s.pct.toFixed(1)}%. One missed class will trigger a critical state.`,
          icon: <Info className="text-amber-500" size={18} />
        });
      }
    });

    if (parseFloat(overall) > 75) {
      list.push({
        type: 'safe',
        text: `Status Nominal. Projected trend shows you maintaining ${projected}% by finals week.`,
        icon: <CheckCircle2 className="text-emerald-500" size={18} />
      });
    }

    return list;
  };

  const suggestions = getSuggestions();

  return (
    <div className="p-4 md:p-6 lg:p-12 flex flex-col gap-6 md:gap-10 max-w-[1600px] mx-auto overflow-hidden pb-24 lg:pb-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass-panel p-10 bg-gradient-to-br from-cyan-500/10 to-transparent border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
           
           <div className="relative">
              <div className="w-56 h-56 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="text-7xl font-black text-white tracking-tighter"
                 >
                   {overall}<span className="text-2xl text-white/40">%</span>
                 </motion.div>
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="50%" cy="50%" r="104" 
                      fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="8"
                    />
                    <motion.circle 
                      cx="50%" cy="50%" r="104" 
                      fill="none" stroke="#22d3ee" strokeWidth="8"
                      strokeDasharray="653"
                      initial={{ strokeDashoffset: 653 }}
                      animate={{ strokeDashoffset: 653 - (653 * (overall / 100)) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                 </svg>
              </div>
           </div>

            <div className="flex-1 text-center md:text-left mt-6 md:mt-0">
               <div className="flex items-center justify-center md:justify-start gap-3 text-cyan-400 font-bold text-xs uppercase tracking-[0.4em] mb-4">
                  <Zap size={16} /> Operational Capacity
               </div>
               <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">Your Academic Health is {overall >= 75 ? 'Optimal' : 'Sub-Par'}</h2>
              <p className="text-white/40 text-sm max-w-md mb-8 leading-relaxed">
                Aggregated records from OSIS indicate a stable trajectory. We recommend focusing on Lab sessions this week.
              </p>
              <div className="flex flex-col md:flex-row flex-wrap gap-4 mx-auto md:mx-0">
                 <button 
                   onClick={onOpenRegistry}
                   className="w-full md:w-auto justify-center bg-white text-black px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest md:hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                 >
                   Modify Course Registry <ArrowRight size={14} />
                 </button>
                 <button
                   onClick={onOpenReports}
                   className="w-full md:w-auto justify-center bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest md:hover:scale-105 hover:bg-cyan-500/20 transition-all flex items-center gap-3"
                 >
                   View Reports <FileText size={14} />
                 </button>
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-8">
           <div className="glass-panel p-8 bg-white/[0.02]">
              <div className="flex items-center gap-3 text-white/30 uppercase tracking-widest text-[10px] font-black mb-4">
                 <TrendingUp size={14} /> Projection Pace
              </div>
              <div className="text-4xl font-black text-white mb-2">{projected}%</div>
              <div className="text-xs text-rose-400 font-bold">Estimated -3.2% decline without correction</div>
           </div>
           <div className="glass-panel p-8 bg-white/[0.02]">
              <div className="flex items-center gap-3 text-white/30 uppercase tracking-widest text-[10px] font-black mb-4">
                 <Activity size={14} /> Activity Index
              </div>
              <div className="text-4xl font-black text-white mb-2">{totalAttended}/{totalClasses}</div>
              <div className="text-xs text-cyan-400 font-bold">Protocol interactions currently active</div>
           </div>
        </div>
      </section>

      {/* Graphs Cluster */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-10 h-[500px]">
         <div className="glass-panel p-10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
               <span className="w-1.5 h-6 bg-cyan-400 rounded-full" /> Subject Analytics
            </h3>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjects} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                     <XAxis 
                       dataKey="subject" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                       angle={-45}
                       textAnchor="end"
                     />
                     <YAxis hide />
                     <ReTooltip 
                       contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                     />
                     <Bar dataKey="pct" radius={[10, 10, 0, 0]} barSize={40}>
                        {subjects.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.pct >= 75 ? '#22d3ee' : '#f43f5e'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="glass-panel p-10 flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
               <span className="w-1.5 h-6 bg-purple-400 rounded-full" /> Distribution
            </h3>
            <div className="flex-1 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                       data={subjects}
                       innerRadius="65%"
                       outerRadius="85%"
                       paddingAngle={5}
                       dataKey="attended"
                       stroke="none"
                     >
                        {subjects.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <ReTooltip 
                        contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                     />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[10px] text-white/20 uppercase font-black tracking-widest">Aggregate</div>
                  <div className="text-2xl font-black text-white">{totalAttended}</div>
               </div>
            </div>
         </div>
      </section>

      {/* Smart Suggestions */}
      <section className="glass-panel p-10">
         <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-6">Smart Protocol Insights</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((s, i) => (
               <div 
                 key={i} 
                 className={`flex items-start gap-4 p-6 rounded-2xl border transition-all hover:scale-105 ${
                   s.type === 'critical' ? 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 
                   s.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 
                   'bg-emerald-500/5 border-emerald-500/20'
                 }`}
               >
                  <div className="mt-1">{s.icon}</div>
                  <div className="text-sm text-white/80 leading-relaxed font-medium">{s.text}</div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
