import { CheckCircle2, Circle, Plus, Sparkles, Check, ListChecks, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyPlanner({ tasks, onToggleTask, onAddTask, onDeleteTask }) {
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Core');

  const categories = [
    { name: 'Core', color: 'bg-cyan-500', icon: <Sparkles size={12} /> },
    { name: 'Lab', color: 'bg-emerald-500', icon: <Check size={12} /> },
    { name: 'Urgent', color: 'bg-rose-500', icon: <Sparkles size={12} /> },
    { name: 'Personal', color: 'bg-amber-500', icon: <Check size={12} /> }
  ];

  const handleCreateTask = () => {
    if(newTask && onAddTask) {
      onAddTask(newTask, selectedCategory);
      setNewTask('');
    }
  };

  const completedCount = tasks?.filter(t => t.completed).length || 0;
  const totalCount = tasks?.length || 0;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-4 md:p-6 lg:p-12 flex flex-col gap-6 md:gap-10 max-w-[1400px] mx-auto h-[calc(100vh-80px)] lg:h-screen">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs uppercase tracking-[0.4em] mb-3">
              <ListChecks size={16} /> Mission Control
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Strategic Deployment</h2>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
              <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Task Completion</div>
              <div className="text-2xl font-black text-white">{completedCount}/{totalCount}</div>
           </div>
           <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
              <span className="text-xs font-black text-cyan-400">{Math.round(progress)}%</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="50%" cy="50%" r="28" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="4" />
                 <motion.circle 
                    cx="50%" cy="50%" r="28" fill="none" stroke="#22d3ee" strokeWidth="4"
                    strokeDasharray="176"
                    initial={{ strokeDashoffset: 176 }}
                    animate={{ strokeDashoffset: 176 - (176 * (progress / 100)) }}
                    transition={{ duration: 1 }}
                 />
              </svg>
           </div>
        </div>
      </section>

      {/* Input Overlay */}
      <section className="glass-panel p-4 md:p-8 bg-white/[0.01]">
         <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
               {categories.map(cat => (
                 <button 
                   key={cat.name}
                   onClick={() => setSelectedCategory(cat.name)}
                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                     selectedCategory === cat.name 
                     ? `${cat.color} text-black border-transparent shadow-[0_0_15px_rgba(34,211,238,0.4)]` 
                     : 'bg-white/5 text-white/30 border-white/10 hover:border-white/20'
                   }`}
                 >
                   {cat.name}
                 </button>
               ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
               <input 
                 type="text"
                 value={newTask}
                 onChange={e => setNewTask(e.target.value)}
                 placeholder="Initialize new objective..."
                 className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-6 py-4 md:py-5 text-base md:text-lg text-white font-medium focus:outline-none focus:border-cyan-500/50 transition-all placeholder-white/10"
                 onKeyDown={e => { if(e.key === 'Enter') handleCreateTask(); }}
               />
               <button 
                 onClick={handleCreateTask}
                 className={`w-full md:w-auto px-10 py-4 md:py-0 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                   newTask ? 'bg-white text-black md:hover:scale-105 shadow-2xl' : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                 }`}
               >
                 Deploy
               </button>
            </div>
         </div>
      </section>

      {/* Task List */}
      <section className="flex-1 overflow-y-auto custom-scrollbar pr-4">
         <div className="flex flex-col gap-10">
            {categories.map(cat => {
              const catTasks = tasks?.filter(t => (t.category || 'Core') === cat.name);
              if (!catTasks || catTasks.length === 0) return null;

              return (
                <div key={cat.name} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-4 rounded-full ${cat.color}`} />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{cat.name} Priorities</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                       {catTasks.map(task => (
                          <motion.div 
                            layout
                            key={task._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                              task.completed 
                              ? 'bg-white/[0.02] border-white/5 opacity-40' 
                              : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08] shadow-xl'
                            }`}
                          >
                            <div
                              onClick={() => onToggleTask(task._id)}
                              className={`shrink-0 w-8 h-8 flex items-center justify-center border-2 rounded-xl transition-all cursor-pointer ${
                                task.completed ? cat.color.replace('bg-', 'bg-').replace('cyan', 'cyan').replace('emerald', 'emerald').replace('rose', 'rose').replace('amber', 'amber') + ' border-transparent' : 'border-white/10 group-hover:border-white/30'
                              }`}>
                              {task.completed && <Check size={18} className="text-black" />}
                            </div>

                            <div className="flex-1 min-w-0" onClick={() => onToggleTask(task._id)} style={{cursor:'pointer'}}>
                               <div className={`text-lg font-bold tracking-tight transition-all ${task.completed ? 'line-through text-white/20' : 'text-white'}`}>
                                 {task.title}
                               </div>
                            </div>

                            <button
                              onClick={() => onDeleteTask(task._id)}
                              className="shrink-0 p-2 rounded-lg text-white/0 group-hover:text-rose-400/60 hover:!text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                       ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
         </div>

         {tasks?.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 mt-20">
               <ListChecks size={80} className="mb-4" />
               <div className="text-xl font-black uppercase tracking-[0.4em]">Zero Active Threads</div>
            </div>
         )}
      </section>
    </div>
  );
}
