import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Target, 
  Brain, 
  BarChart3, 
  ZapOff,
  Flame,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export default function InsightsPanel({ data, onOpenReports }) {
  const totalHours = data?.metrics?.studyStreaks?.reduce((sum, s) => sum + s.hours, 0) || 0;
  const avgHours = (totalHours / (data?.metrics?.studyStreaks?.length || 1)).toFixed(1);
  const tasksDone = data?.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = data?.tasks?.length || 1;
  const taskRate = Math.round((tasksDone / totalTasks) * 100);

  // Attendance analysis
  const attendance = data?.metrics?.attendance || [];
  const criticalSubjects = attendance.filter(s => (s.attended / s.total) * 100 < 75);
  const overallAtt = attendance.length
    ? ((attendance.reduce((s, a) => s + a.attended, 0) / attendance.reduce((s, a) => s + a.total, 0)) * 100).toFixed(1)
    : 0;

  // Consecutive streak calc
  const streaks = data?.metrics?.studyStreaks || [];
  const sortedStreaks = [...streaks].sort((a, b) => new Date(b.date) - new Date(a.date));
  let consecutiveDays = 0;
  for (let i = 0; i < sortedStreaks.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (sortedStreaks[i]?.date === expectedStr) consecutiveDays++;
    else break;
  }

  const telemetry = [
    { label: 'Total Learning Depth', value: `${totalHours.toFixed(1)}h`, icon: <Clock className="text-cyan-400" />, sub: 'Accumulated time', trend: '+12%' },
    { label: 'Mission Velocity', value: `${taskRate}%`, icon: <Target className="text-emerald-400" />, sub: 'Task completion', trend: taskRate > 60 ? '+' + taskRate : taskRate + '%' },
    { label: 'Cognitive Streak', value: consecutiveDays, icon: <Flame className="text-orange-500" />, sub: 'Consecutive days', trend: consecutiveDays > 0 ? 'Active' : 'Inactive' },
    { label: 'Session Intensity', value: `${avgHours}h`, icon: <Brain className="text-purple-400" />, sub: 'Daily average', trend: avgHours > 2 ? 'High' : 'Low' }
  ];

  // AI-generated suggestions based on real data
  const aiTips = [];
  if (criticalSubjects.length > 0) {
    aiTips.push({
      type: 'critical',
      icon: <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />,
      text: `Critical Alert: ${criticalSubjects.map(s => s.subject).join(', ')} ${criticalSubjects.length > 1 ? 'are' : 'is'} below 75% attendance. Prioritise these classes immediately.`
    });
  }
  if (taskRate < 50) {
    aiTips.push({
      type: 'warning',
      icon: <ZapOff size={18} className="text-amber-500 shrink-0 mt-0.5" />,
      text: `Task velocity is low (${taskRate}%). Consider breaking larger objectives into smaller sub-tasks.`
    });
  }
  if (parseFloat(avgHours) > 0 && parseFloat(avgHours) < 2) {
    aiTips.push({
      type: 'warning',
      icon: <ZapOff size={18} className="text-amber-500 shrink-0 mt-0.5" />,
      text: `Average study sessions are short (${avgHours}h/day). Deep work blocks of 2+ hours improve retention by 40%.`
    });
  }
  if (criticalSubjects.length === 0 && taskRate >= 60) {
    aiTips.push({
      type: 'good',
      icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />,
      text: `Excellent trajectory. Attendance at ${overallAtt}% and task rate at ${taskRate}% — maintain this momentum through finals week.`
    });
  }
  if (consecutiveDays >= 3) {
    aiTips.push({
      type: 'good',
      icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />,
      text: `${consecutiveDays}-day study streak detected. Studies show consistent daily sessions produce 25% higher exam retention.`
    });
  }
  if (aiTips.length === 0) {
    aiTips.push({
      type: 'info',
      icon: <CheckCircle2 size={18} className="text-cyan-500 shrink-0 mt-0.5" />,
      text: 'Log your study sessions and complete tasks daily to unlock personalized AI insights.'
    });
  }

  return (
    <div className="p-4 md:p-6 lg:p-12 flex flex-col gap-6 md:gap-12 max-w-[1600px] mx-auto min-h-screen pb-24 lg:pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs uppercase tracking-[0.4em] mb-3">
              <BarChart3 size={16} /> Academic Telemetry
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Strategic Insights</h2>
        </div>
        <button
          onClick={onOpenReports}
          className="w-full md:w-auto justify-center bg-white text-black px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest md:hover:scale-105 transition-all shadow-xl flex items-center gap-3 shrink-0"
        >
          <FileText size={14} /> Generate Report
        </button>
      </section>

      {/* Telemetry Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {telemetry.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-10 bg-white/[0.02] border-white/5 flex flex-col items-center text-center group"
          >
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
             </div>
             <div className="text-5xl font-black text-white tracking-tighter mb-2">{item.value}</div>
             <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">{item.label}</div>
             <div className="mt-4 flex items-center gap-2">
               <ArrowUpRight size={12} className="text-cyan-400" />
               <span className="text-[9px] text-cyan-400/60 uppercase tracking-[0.2em] font-mono">{item.trend}</span>
             </div>
          </motion.div>
        ))}
      </section>

      {/* Advanced Analysis */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <div className="glass-panel p-10 bg-gradient-to-br from-cyan-500/5 to-transparent flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
               <TrendingUp size={20} className="text-cyan-400" /> Performance Trajectory
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Overall Attendance</span>
                <span className={`text-sm font-black ${parseFloat(overallAtt) >= 75 ? 'text-cyan-400' : 'text-rose-400'}`}>{overallAtt}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Subjects at Risk</span>
                <span className={`text-sm font-black ${criticalSubjects.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{criticalSubjects.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Tasks Completed Today</span>
                <span className="text-sm font-black text-white">{tasksDone} / {totalTasks - 1 || 0}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
               <div className="px-5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase text-cyan-400">
                 {parseFloat(overallAtt) >= 80 ? 'Stable Pace' : 'Needs Attention'}
               </div>
               <div className={`px-5 py-2 rounded-xl border text-[10px] font-black uppercase ${taskRate >= 60 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                 {taskRate >= 60 ? 'High Growth' : 'Moderate Pace'}
               </div>
            </div>
         </div>

         <div className="glass-panel p-10 bg-gradient-to-br from-purple-500/5 to-transparent flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
               <Zap size={20} className="text-purple-400" /> AI Optimization Engine
            </h3>
            <div className="space-y-4">
               {aiTips.map((tip, i) => (
                 <div
                   key={i}
                   className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                     tip.type === 'critical' ? 'bg-rose-500/5 border-rose-500/20' :
                     tip.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                     tip.type === 'good' ? 'bg-emerald-500/5 border-emerald-500/20' :
                     'bg-cyan-500/5 border-cyan-500/20'
                   }`}
                 >
                    {tip.icon}
                    <div className="text-xs text-white/80 leading-relaxed">{tip.text}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
