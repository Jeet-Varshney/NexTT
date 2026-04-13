import { Trophy, Code, Users, Award, Sparkles, Plus, X, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Extracurriculars({ data, onAddActivity, onDeleteActivity, onOpenGallery }) {
  const [showForm, setShowForm] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [type, setType] = useState('Event');
  const [badgeGiven, setBadgeGiven] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const typeOptions = ['Event', 'Club', 'Hackathon'];

  const getIcon = (t) => {
    switch(t) {
      case 'Hackathon': return <Code size={32} className="text-purple-400" />;
      case 'Club': return <Users size={32} className="text-blue-400" />;
      default: return <Award size={32} className="text-yellow-400" />;
    }
  };

  const getTypeColor = (t) => {
    switch(t) {
      case 'Hackathon': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Club': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const handleSubmit = async () => {
    if (!activityName.trim()) return;
    setSubmitting(true);
    await onAddActivity(activityName.trim(), type, badgeGiven, date);
    setActivityName('');
    setType('Event');
    setBadgeGiven(false);
    setDate(new Date().toISOString().split('T')[0]);
    setSubmitting(false);
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-12 flex flex-col gap-6 md:gap-10 max-w-[1600px] mx-auto min-h-screen pb-24 lg:pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 text-yellow-500 font-bold text-xs uppercase tracking-[0.4em] mb-3">
              <Trophy size={16} /> Honor Archive
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Achievement Portfolio</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <button
            onClick={onOpenGallery}
            className="w-full md:w-auto justify-center bg-white/5 border border-white/10 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl"
          >
            <ExternalLink size={14} /> Gallery View
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto justify-center bg-white text-black px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest md:hover:scale-105 transition-all flex items-center gap-3 shadow-xl"
          >
            <Plus size={16} /> Register New Event
          </button>
        </div>
      </section>

      {/* Hero Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <div className="glass-panel p-8 bg-gradient-to-br from-yellow-500/5 to-transparent flex flex-col gap-2">
            <div className="text-3xl font-black text-white tracking-tighter">{data?.length || 0}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">Events Logged</div>
         </div>
         <div className="glass-panel p-8 bg-gradient-to-br from-purple-500/5 to-transparent flex flex-col gap-2">
            <div className="text-3xl font-black text-white tracking-tighter">
              {data?.filter(i => i.badgeGiven).length || 0}
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">Badges Issued</div>
         </div>
         <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/5 to-transparent flex flex-col gap-2">
            <div className="text-3xl font-black text-white tracking-tighter">
              {data?.filter(i => i.type === 'Hackathon').length || 0}
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">Hackathons</div>
         </div>
         <div className="col-span-2 lg:col-span-1 glass-panel p-8 bg-cyan-500/5 border-cyan-500/20 flex items-center justify-between">
            <div>
               <div className="text-lg font-bold text-white tracking-tight">Active Honor Status</div>
               <div className="text-xs text-white/40 mt-1 uppercase tracking-widest font-mono">NexT Multiplier Active</div>
            </div>
            <Sparkles className="text-cyan-400" size={32} />
         </div>
      </section>

      {/* Achievement Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {data?.map((item, i) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-panel p-10 flex flex-col items-center text-center group border-white/5 bg-white/[0.01] hover:border-cyan-400/30 transition-all duration-500 relative"
            >
               {/* Delete Button */}
               <button
                 onClick={() => onDeleteActivity(item._id)}
                 className="absolute top-4 right-4 p-2 bg-rose-500/0 text-rose-500/0 group-hover:bg-rose-500/10 group-hover:text-rose-400 rounded-lg transition-all duration-300 hover:bg-rose-500 hover:text-white"
               >
                 <Trash2 size={14} />
               </button>

               <div className="w-24 h-24 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-cyan-500/10 transition-all duration-500">
                  {getIcon(item.type)}
               </div>
               <div className="font-bold text-2xl text-white mb-3 tracking-tight">{item.activityName}</div>
               <div className={`text-[9px] uppercase font-black tracking-[0.2em] px-4 py-1.5 rounded-xl border mb-4 ${getTypeColor(item.type)}`}>
                 {item.type}
               </div>
               <div className="text-[10px] uppercase font-mono text-white/20 tracking-[0.2em] mb-8">{item.date}</div>
               
               {item.badgeGiven ? (
                  <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-6 py-2.5 rounded-xl text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/5">
                     <Award size={14} /> Badge Authenticated
                  </div>
               ) : (
                  <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] py-2.5">Verification Pending</div>
               )}
            </motion.div>
          ))}
        </AnimatePresence>

        {(!data || data.length === 0) && (
          <div className="col-span-full h-96 flex flex-col items-center justify-center opacity-10">
             <Trophy size={80} className="mb-4" />
             <div className="text-xl font-black uppercase tracking-[0.5em]">Honor Vault Empty</div>
             <div className="text-xs mt-2 tracking-widest">Register your first event to get started</div>
          </div>
        )}
      </section>

      {/* Register New Event Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0b10] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl">
                    <Trophy className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Register Event</h2>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-mono">Add to Honor Archive</p>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="text-white/40" size={20} />
                </button>
              </div>

              <div className="p-8 flex flex-col gap-6">
                {/* Activity Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Activity Name</label>
                  <input
                    type="text"
                    value={activityName}
                    onChange={e => setActivityName(e.target.value)}
                    placeholder="e.g. Smart India Hackathon..."
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-cyan-500/50 transition-all placeholder-white/10"
                  />
                </div>

                {/* Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Event Type</label>
                  <div className="flex gap-3">
                    {typeOptions.map(t => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          type === t
                            ? t === 'Hackathon' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                            : t === 'Club' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                            : 'bg-white/5 text-white/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-cyan-500/50 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Badge Toggle */}
                <div
                  onClick={() => setBadgeGiven(!badgeGiven)}
                  className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all ${
                    badgeGiven ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Award size={20} className={badgeGiven ? 'text-yellow-400' : 'text-white/20'} />
                    <div>
                      <div className={`font-bold text-sm ${badgeGiven ? 'text-yellow-400' : 'text-white/40'}`}>Badge Awarded</div>
                      <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Official recognition received</div>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-all relative ${badgeGiven ? 'bg-yellow-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${badgeGiven ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!activityName.trim() || submitting}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                    activityName.trim() && !submitting
                      ? 'bg-white text-black hover:scale-105 shadow-xl'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'Registering...' : 'Register to Honor Archive'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
