import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Package, PlusCircle, Tag, MessageCircle } from 'lucide-react';
import TradeFeed from './TradeFeed';
import TradeListingForm from './TradeListingForm';
import MyListings from './MyListings';
import MyChats from './MyChats';
import TradeChatBox from './TradeChatBox';
import './NexTrade.css';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nextrade`;
const CURRENT_USER = 'demo-student'; // Mock auth context

const TABS = [
  { id: 'browse', label: 'Browse', icon: <Search size={15}/> },
  { id: 'sell', label: 'Sell Item', icon: <PlusCircle size={15}/> },
  { id: 'my-listings', label: 'My Listings', icon: <Tag size={15}/> },
  { id: 'chats', label: 'My Chats', icon: <MessageCircle size={15}/> },
];

const NexTradeDashboard = ({ onBack }) => {
  const [tab, setTab] = useState('browse');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Feed Controls
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Trade Context
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [tab]);

  const fetchItems = async () => {
    if (tab !== 'browse') return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/items`);
      setItems(await res.json());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostListing = async (payload) => {
    setLoading(true);
    const apiPayload = { ...payload, sellerId: CURRENT_USER };
    try {
      await fetch(`${API}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });
      alert('Listing Posted successfully!');
      setTab('my-listings');
    } catch {
      alert('Mock listing created (Offline Mode)');
      setTab('my-listings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nextrade-container">
      
      {/* ── Topbar ── */}
      <div className="nt-topbar">
        <button onClick={onBack} className="nt-back-btn">
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: 0, fontSize: '26px', fontWeight: '800',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em',
          }}>
            🤝 NexTrade
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Student Marketplace
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="nt-tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nt-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">
        
        {/* Browse Tab */}
        {tab === 'browse' && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TradeFeed 
              items={items} loading={loading}
              search={search} setSearch={setSearch} 
              filter={filter} setFilter={setFilter}
              onOpenChat={(item) => setActiveChat(item)}
            />
          </motion.div>
        )}

        {/* Sell Item Tab */}
        {tab === 'sell' && (
          <motion.div key="sell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TradeListingForm onSubmit={handlePostListing} loading={loading} />
          </motion.div>
        )}

        {/* My Listings Tab */}
        {tab === 'my-listings' && (
          <motion.div key="listings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MyListings currentUser={CURRENT_USER} />
          </motion.div>
        )}

        {/* My Chats Tab */}
        {tab === 'chats' && (
          <motion.div key="chats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MyChats currentUser={CURRENT_USER} onOpenChat={(item) => setActiveChat(item)} />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Chat Box Modal Overrider */}
      <AnimatePresence>
        {activeChat && (
          <TradeChatBox 
            currentUser={CURRENT_USER} 
            item={activeChat} 
            onClose={() => setActiveChat(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default NexTradeDashboard;
