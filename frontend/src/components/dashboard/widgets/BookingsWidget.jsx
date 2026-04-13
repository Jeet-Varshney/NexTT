import { CalendarCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingsWidget = () => {
  const bookings = [
    { id: 1, facility: 'Main Gym', time: 'Today, 5:00 PM', status: 'Upcoming' },
    { id: 2, facility: 'Study Room 4B', time: 'Tomorrow, 10:00 AM', status: 'Confirmed' }
  ];

  return (
    <motion.div 
      className="widget-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="widget-header">
        <h3 className="widget-title"><CalendarCheck className="widget-icon" size={20} /> Active Bookings</h3>
        <button style={{ background: 'none', color: 'var(--primary)', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
        {bookings.map(booking => (
          <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--input-bg)', borderRadius: '12px' }}>
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{booking.facility}</h5>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{booking.time}</p>
            </div>
            <span style={{ 
              fontSize: '12px', padding: '4px 10px', borderRadius: '20px', 
              background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'
            }}>
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BookingsWidget;
