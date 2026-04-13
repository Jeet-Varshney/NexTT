import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import API_BASE from '../../config/api.js';

export default function AttendanceWidget({ userEmail = 'student@next.edu' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const MOCK_ATTENDANCE = [
    { subject: 'Data Structures', attended: 28, total: 35 },
    { subject: 'Operating Systems', attended: 15, total: 25 },
    { subject: 'Computer Networks', attended: 18, total: 20 },
    { subject: 'Machine Learning', attended: 22, total: 30 }
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/nexplanner/metrics/${userEmail}`);
        const result = await res.json();
        // The API returns { metrics: { attendance: [...] }, ... }
        if (result && result.metrics && result.metrics.attendance) {
          setData(result.metrics.attendance);
        } else {
          setData(MOCK_ATTENDANCE);
        }
      } catch (err) {
        console.error('Widget Fetch Error:', err);
        setData(MOCK_ATTENDANCE);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [userEmail]);

  const getInsights = () => {
     let warnings = [];
     let totalClasses = 0;
     let totalAttended = 0;
     data.forEach(d => {
       totalClasses += d.total;
       totalAttended += d.attended;
       const pct = (d.attended/d.total)*100;
       if(pct < 75) warnings.push(d.subject);
     });
     const overall = totalClasses ? ((totalAttended/totalClasses)*100).toFixed(1) : 0;
     return { overall, warnings };
  };

  const { overall, warnings } = getInsights();

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const COLORS = ['#22d3ee', '#818cf8', '#c084fc', '#f472b6'];
  const overallColor = parseFloat(overall) >= 75 ? '#22d3ee' : '#f43f5e';

  if (loading) {
    return (
      <div className="glass-panel p-8 flex items-center justify-center h-full border border-white/5 bg-white/[0.02]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <div className="text-[10px] text-white/20 uppercase tracking-widest font-black">Decrypting OSIS Protocol...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel p-8 flex flex-col lg:flex-row gap-10 h-full border border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-500"
    >
       <div className="flex flex-col gap-6 lg:w-1/2">
         <div>
            <div className="flex items-center gap-3 mb-1">
               <div className="w-2 h-8 bg-cyan-400 rounded-full" />
               <h3 className="font-bold text-3xl text-white tracking-tighter">Academic Health</h3>
            </div>
            <p className="text-xs text-white/30 uppercase tracking-[0.3em] font-mono ml-5">OSIS Synchronized</p>
         </div>

         <div className="flex-1 flex flex-col gap-4 mt-4">
            {data.slice(0, 3).map((s, i) => { // Only show top 3 in widget
              const pct = Math.round((s.attended/s.total)*100);
              return (
                <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group/item">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-white/40 group-hover/item:text-cyan-400 transition-colors">
                    {s.attended}/{s.total}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{s.subject}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${pct >= 75 ? 'bg-cyan-500' : 'bg-rose-500'}`}
                        />
                      </div>
                      <span className={`text-[10px] font-black font-mono ${pct >= 75 ? 'text-cyan-400' : 'text-rose-400'}`}>{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
         </div>

         {warnings.length > 0 && (
           <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg text-rose-300 text-[10px] uppercase font-bold tracking-widest z-10 flex items-center gap-3 animate-pulse">
             <span>! ATTENDANCE WARNING IN {warnings.length} SUBJECTS</span>
           </div>
         )}
       </div>

       <div className="lg:w-1/2 flex items-center justify-center relative min-h-[300px]">
          <div className="w-full h-full absolute inset-0">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   innerRadius="65%"
                   outerRadius="85%"
                   paddingAngle={5}
                   dataKey="attended"
                   stroke="none"
                   animationBegin={0}
                   animationDuration={1500}
                 >
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.6} className="hover:opacity-100 transition-opacity cursor-pointer" />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                   itemStyle={{ color: '#fff', fontSize: '12px' }}
                 />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-sm text-white/30 font-black uppercase tracking-[0.2em] mb-1">Overall</div>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-black text-white tracking-tighter"
                  style={{ textShadow: `0 0 30px ${overallColor}40` }}
                >
                  {overall}<span className="text-2xl text-white/40">%</span>
                </motion.div>
                <div className={`mt-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${parseFloat(overall) >= 75 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {parseFloat(overall) >= 75 ? 'Nominal' : 'Critical'}
                </div>
             </div>
          </div>
       </div>
    </motion.div>
  );
}
