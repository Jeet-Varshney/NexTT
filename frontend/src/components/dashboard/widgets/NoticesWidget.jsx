import { BellRing, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const NoticesWidget = () => {
  const notices = [
    { id: 1, title: 'Exam Schedule Released', desc: 'Mid-term examinations for all branches will commence from the 15th.', time: '2 hours ago', type: 'important' },
    { id: 2, title: 'Tech Fest 2026 Registration', desc: 'Last day to register for the upcoming hackathon!', time: '5 hours ago', type: 'info' },
    { id: 3, title: 'Library Maintenance', desc: 'Main library will be closed this Friday for maintenance.', time: '1 day ago', type: 'warning' },
  ];

  return (
    <motion.div 
      className="widget-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{ height: '100%', maxHeight: '400px' }}
    >
      <div className="widget-header">
        <h3 className="widget-title"><BellRing className="widget-icon" size={20} /> Campus Notices</h3>
      </div>
      
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
        {notices.map((notice) => (
          <div key={notice.id} style={{ 
            padding: '16px', 
            background: 'var(--input-bg)', 
            borderRadius: '12px',
            borderLeft: `4px solid ${notice.type === 'important' ? 'var(--primary)' : notice.type === 'warning' ? 'var(--warning)' : 'var(--success)'}`
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text-main)' }}>{notice.title}</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>{notice.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Clock size={12} /> {notice.time}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NoticesWidget;
