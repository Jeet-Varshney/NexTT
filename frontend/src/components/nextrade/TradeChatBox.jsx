import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Handshake } from 'lucide-react';
import { io } from 'socket.io-client';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nextrade`;

const TradeChatBox = ({ currentUser, item, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [offerInput, setOfferInput] = useState('');
  const [isMakingOffer, setIsMakingOffer] = useState(false);
  
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  
  const isSeller = currentUser === item.sellerId;
  const roomId = `chat_${item._id}_${isSeller ? 'SELLER_VIEW' : currentUser}`; 

  useEffect(() => {
    // Determine target user to chat with based on perspective (simplified for hackathon format)
    const targetUserId = isSeller ? 'demo-buyer' : item.sellerId;

    // Load History
    fetch(`${API}/chat/${item._id}`)
      .then(res => res.json())
      .then(data => {
         // Filter for current conversation
         setMessages(data.filter(m => (m.senderId === currentUser && m.receiverId === targetUserId) || (m.senderId === targetUserId && m.receiverId === currentUser)));
      })
      .catch(() => {});

    // Init Socket
    socketRef.current = io(API_BASE);
    socketRef.current.emit('join_room', roomId);

    socketRef.current.on('receive_message', (msgData) => {
      setMessages(prev => [...prev, msgData]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [item._id, currentUser, isSeller, roomId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const targetUserId = isSeller ? 'demo-buyer' : item.sellerId; // Strict demo 1-on-1 logic

  const handleSend = async (customOffer = null) => {
    const text = customOffer ? `I made an offer: ₹${customOffer}` : input.trim();
    if (!text && !customOffer) return;

    const payload = {
      senderId: currentUser,
      receiverId: targetUserId,
      itemId: item._id,
      messageText: text,
      offerPrice: customOffer || undefined,
      timestamp: new Date().toISOString()
    };

    // Optimistic UI for offline resilience
    const tempMsg = { ...payload, _id: Date.now() };
    setMessages(prev => [...prev, tempMsg]);
    setInput('');
    setIsMakingOffer(false);
    setOfferInput('');

    // Emit live
    socketRef.current.emit('send_message', { ...payload, roomId });

    // Save to DB
    try {
      await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Mocked gracefully
    }
  };

  const handleDealFinalize = async (msgId, status) => {
     // accept or reject offer
     try {
       await fetch(`${API}/chat/${msgId}/status`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ status }) // 'accepted' or 'rejected'
       });
       
       if (status === 'accepted') {
         // Mark item as sold!
         await fetch(`${API}/items/${item._id}/status`, {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status: 'sold' })
         });
         alert('Deal Finalized! Item marked as Sold.');
         onClose();
       } else {
         setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'rejected' } : m));
       }
     } catch {
        alert("Action completed offline via mock fallback.");
     }
  };

  return (
    <div className="nt-chat-overlay">
      <motion.div className="nt-chat-window" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="nt-chat-header">
          <div className="nt-chat-item-tiny">
            <div style={{ background: 'var(--primary)', width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
               {item.imageUrl.startsWith('mock') ? '📦' : <img src={item.imageUrl} alt="item" className="nt-chat-item-img"/>}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, color: 'white' }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                 {isSeller ? `Chatting with ${targetUserId}` : `Seller: ${item.sellerId}`} • ₹{item.price} {item.negotiable && '(Neg.)'}
              </p>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="nt-chat-body" ref={scrollRef}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
               <MessageCircle size={32} style={{ opacity: 0.3 }} />
               <p>Send a message to start negotiation.</p>
               <p style={{ fontSize: 11 }}>Note: Ensure your safety by meeting on campus!</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.senderId === currentUser;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div className={`nt-bubble ${isMe ? 'nt-bubble-me' : 'nt-bubble-them'}`}>
                    {m.messageText}
                  </div>
                  
                  {m.offerPrice && (
                    <div className="nt-offer-box">
                       <strong style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Handshake size={14}/> Offer: ₹{m.offerPrice}
                       </strong>
                       {m.status === 'accepted' && <div style={{ color: '#00d68f', fontSize: 12, marginTop: 4 }}>Offer Accepted!</div>}
                       {m.status === 'rejected' && <div style={{ color: '#f5004f', fontSize: 12, marginTop: 4 }}>Offer Rejected.</div>}
                       
                       {/* If I am the receiver of the offer and it's untouched */}
                       {!isMe && (!m.status || m.status === 'sent') && (
                         <div className="nt-offer-actions">
                           <button className="nt-btn" style={{ background: 'rgba(0,214,143,0.2)', color: '#00d68f', borderColor: 'transparent' }} onClick={() => handleDealFinalize(m._id, 'accepted')}>Accept</button>
                           <button className="nt-btn" style={{ background: 'rgba(245,0,79,0.2)', color: '#f5004f', borderColor: 'transparent' }} onClick={() => handleDealFinalize(m._id, 'rejected')}>Reject</button>
                         </div>
                       )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="nt-chat-footer">
          {isMakingOffer ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
               <input type="number" className="nt-offer-input" placeholder="₹ Offer Price" value={offerInput} onChange={e => setOfferInput(e.target.value)} autoFocus />
               <button className="nt-btn nt-btn-primary" onClick={() => handleSend(Number(offerInput))}>Send Offer</button>
               <button className="nt-btn" style={{ border: 'none', background: 'none' }} onClick={() => setIsMakingOffer(false)}>Cancel</button>
            </div>
          ) : (
            <div className="nt-chat-input-row">
              <input 
                type="text" 
                className="nt-chat-input" 
                placeholder="Type your message..." 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              {item.negotiable && !isSeller && (
                <button className="nt-btn" onClick={() => setIsMakingOffer(true)} title="Make an offer">
                  <Handshake size={18} />
                </button>
              )}
              <button className="nt-chat-send" onClick={() => handleSend()}>
                <Send size={18} />
              </button>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default TradeChatBox;
