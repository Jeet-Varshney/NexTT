import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import { useEffect } from 'react';

const SuccessAnimation = ({ onComplete }) => {
  useEffect(() => {
    // 3 seconds of futuristic success animation before returning or redirecting
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="glass-panel"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        width: '300px',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
      }}
    >
      <motion.div
        initial={{ scale: 0.5, color: '#9ca3af' }}
        animate={{ 
          scale: [1, 1.2, 1],
          color: '#10b981',
          filter: ['drop-shadow(0 0 0px #10b981)', 'drop-shadow(0 0 30px #10b981)', 'drop-shadow(0 0 10px #10b981)']
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Fingerprint size={80} strokeWidth={1} />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-family)',
          margin: 0
        }}
      >
        Access Granted
      </motion.h2>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '150px' }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #10b981, transparent)'
        }}
      />
    </motion.div>
  );
};

export default SuccessAnimation;
