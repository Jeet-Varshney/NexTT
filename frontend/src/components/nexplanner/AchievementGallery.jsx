import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Award, Sparkles, Code, Users } from 'lucide-react';

export default function AchievementGallery({ isOpen, onClose, achievements }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'Hackathon': return <Code size={32} className="text-purple-400" />;
      case 'Club': return <Users size={32} className="text-blue-400" />;
      default: return <Award size={32} className="text-yellow-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          className="w-full max-w-5xl bg-[#0a0b10] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="p-12 flex justify-between items-center relative z-10 border-b border-white/5">
            <div>
               <div className="flex items-center gap-3 text-yellow-500 font-black text-xs uppercase tracking-[0.4em] mb-4">
                 <Trophy size={16} /> Honor Archive
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter">Achievement Gallery</h2>
            </div>
            <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
              <X className="text-white/40 group-hover:text-white" />
            </button>
          </div>

          <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar relative z-10">
            {achievements?.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center group hover:border-cyan-500/30 transition-all duration-500 hover:bg-white/[0.08]"
              >
                 <div className="w-24 h-24 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
                    {getIcon(item.type)}
                 </div>
                 <div className="font-bold text-xl text-white mb-2">{item.activityName}</div>
                 <div className="text-[10px] uppercase font-mono text-white/20 tracking-widest mb-6">{item.type} // {item.date}</div>
                 
                 {item.badgeGiven ? (
                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-[9px] font-black text-yellow-400 uppercase tracking-widest shadow-lg shadow-yellow-500/5">
                       <Award size={12} /> Badge Earned
                    </div>
                 ) : (
                    <div className="text-[9px] font-black text-white/10 uppercase tracking-widest">In Progress</div>
                 )}
              </motion.div>
            ))}
          </div>

          <div className="p-12 border-t border-white/5 bg-black/20 flex justify-center relative z-10">
             <div className="text-[10px] font-medium text-white/20 uppercase tracking-[0.5em] flex items-center gap-4">
                <Sparkles size={14} className="text-cyan-500" /> Authorized NexT Credential Vault <Sparkles size={14} className="text-purple-500" />
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
