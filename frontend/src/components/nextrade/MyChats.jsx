import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nextrade`;

const MyChats = ({ currentUser, onOpenChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/chats/user/${currentUser}`)
      .then(res => res.json())
      .then(data => {
         // Data is an array of trade messages. We want to group them by `itemId`.
         const grouped = {};
         data.forEach(msg => {
            const iId = typeof msg.itemId === 'object' ? msg.itemId._id : msg.itemId;
            if (!grouped[iId]) {
              grouped[iId] = {
                 itemObj: typeof msg.itemId === 'object' ? msg.itemId : { _id: iId, title: `Item ${iId}`, price: '??' },
                 lastMessage: msg,
                 partnerId: msg.senderId === currentUser ? msg.receiverId : msg.senderId
              };
            } else {
              // Update last message if this one is newer
              if (new Date(msg.createdAt) > new Date(grouped[iId].lastMessage.createdAt)) {
                grouped[iId].lastMessage = msg;
                grouped[iId].partnerId = msg.senderId === currentUser ? msg.receiverId : msg.senderId;
              }
            }
         });
         setChats(Object.values(grouped));
      })
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: 'var(--text-main)' }}>Active Conversations</h2>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="nl-empty">
          <MessageCircle size={48} style={{ opacity: 0.3 }} />
          <h3>No Active Chats</h3>
          <p>Any items you are negotiating or discussing will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chats.map((chat, idx) => (
            <motion.div 
               key={idx} 
               className="nt-btn" 
               style={{ background: 'var(--glass-bg)', padding: 16, borderRadius: 16, border: '1px solid var(--glass-border)', display: 'flex', gap: 16, alignItems: 'center', textAlign: 'left', height: 'auto', textTransform: 'none' }}
               onClick={() => onOpenChat(chat.itemObj)}
            >
               <div style={{ width: 48, height: 48, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>
                 💬
               </div>
               <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: 15, color: 'white' }}>{chat.itemObj.title}</h4>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                      {new Date(chat.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>Partner: {chat.partnerId}</div>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.lastMessage.senderId === currentUser ? 'You: ' : ''}
                    {chat.lastMessage.offerPrice ? `[Made an offer: ₹${chat.lastMessage.offerPrice}]` : chat.lastMessage.messageText}
                  </p>
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChats;
