import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, GraduationCap, Edit3, Check } from 'lucide-react';
import { useState } from 'react';

export default function CourseRegistryModal({ isOpen, onClose, subjects, onUpdate, onDelete }) {
  const [newSubject, setNewSubject] = useState('');
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(1);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editAttended, setEditAttended] = useState(0);
  const [editTotal, setEditTotal] = useState(1);

  if (!isOpen) return null;

  const handleStartEdit = (s, i) => {
    setEditingIdx(i);
    setEditAttended(s.attended);
    setEditTotal(s.total);
  };

  const handleSaveEdit = (subjectName) => {
    onUpdate(subjectName, editAttended, editTotal);
    setEditingIdx(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#0a0b10] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-cyan-500/10 rounded-2xl">
                 <GraduationCap className="text-cyan-400" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Course Registry</h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-mono">Academic Inventory Management</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="text-white/40" />
            </button>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="grid gap-4">
              {subjects?.map((s, i) => {
                const pct = Math.round((s.attended / s.total) * 100);
                return (
                  <div key={i} className={`bg-white/5 p-4 rounded-2xl border group transition-all ${
                    editingIdx === i ? 'border-cyan-500/40 bg-white/[0.08]' : 'border-white/10 hover:border-white/20'
                  }`}>
                    {editingIdx === i ? (
                      // Edit mode
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-black text-cyan-400">{s.subject}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Editing record</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-white/30 uppercase tracking-widest">Attended</label>
                            <input
                              type="number" min={0} max={editTotal}
                              value={editAttended}
                              onChange={e => setEditAttended(Number(e.target.value))}
                              className="w-20 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:border-cyan-500/50 outline-none"
                            />
                          </div>
                          <span className="text-white/20 font-black mt-4">/</span>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-white/30 uppercase tracking-widest">Total</label>
                            <input
                              type="number" min={1}
                              value={editTotal}
                              onChange={e => setEditTotal(Number(e.target.value))}
                              className="w-20 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:border-cyan-500/50 outline-none"
                            />
                          </div>
                          <button
                            onClick={() => handleSaveEdit(s.subject)}
                            className="mt-4 p-2.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-all"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingIdx(null)}
                            className="mt-4 p-2.5 bg-white/5 text-white/30 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">{s.subject}</div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-cyan-500' : 'bg-rose-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-black font-mono ${pct >= 75 ? 'text-cyan-400' : 'text-rose-400'}`}>{pct}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                              <div className="text-xs font-bold text-white whitespace-nowrap">{s.attended} / {s.total}</div>
                              <div className="text-[10px] text-white/20 uppercase font-mono">Classes</div>
                           </div>
                           <button 
                             onClick={() => handleStartEdit(s, i)}
                             className="p-2.5 bg-cyan-500/5 text-cyan-400/0 group-hover:text-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500/20"
                           >
                             <Edit3 size={15} />
                           </button>
                           <button 
                             onClick={() => onDelete(s.subject)}
                             className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                           >
                             <Trash2 size={15} />
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Subject */}
            <div className="mt-8 p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/10 border-dashed">
               <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Enroll New Subject</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Subject Name" 
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="md:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500/50 outline-none placeholder-white/20"
                  />
                  <input 
                    type="number" 
                    placeholder="Attended" 
                    value={attended}
                    onChange={e => setAttended(Number(e.target.value))}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500/50 outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Total" 
                    value={total}
                    onChange={e => setTotal(Number(e.target.value))}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500/50 outline-none"
                  />
               </div>
               <button 
                 onClick={() => {
                   if(newSubject.trim()) {
                     onUpdate(newSubject.trim(), attended, total);
                     setNewSubject('');
                     setAttended(0);
                     setTotal(1);
                   }
                 }}
                 disabled={!newSubject.trim()}
                 className={`w-full mt-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                   newSubject.trim()
                     ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black'
                     : 'bg-white/5 text-white/20 cursor-not-allowed'
                 }`}
               >
                 <Plus size={18} /> Add Subject to Registry
               </button>
            </div>
          </div>

          <div className="p-8 border-t border-white/5 bg-black/20 flex justify-end gap-4">
             <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all">Close Registry</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
