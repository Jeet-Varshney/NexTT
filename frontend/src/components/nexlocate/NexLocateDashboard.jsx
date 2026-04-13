import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, PlusCircle, LayoutList, Bell, User } from 'lucide-react';
import ItemFeed    from './ItemFeed';
import ReportForm  from './ReportForm';
import ClaimForm   from './ClaimForm';
import MyReports   from './MyReports';
import './NexLocate.css';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nexlocate`;
const CURRENT_USER = 'demo'; // TODO: pull from auth context
const USER_DISPLAY = 'You';  // TODO: pull from auth context

// ── Mock seed (used when backend is unavailable) ──────────────────────────────
const MOCK_ITEMS = [
  {
    _id: 'li1', title: 'Lost Wallet', type: 'lost', status: 'active',
    description: 'Black leather wallet with student ID card, some cash, and a metro card inside.',
    imageUrl: '', location: 'Library – 2nd Floor', userId: 'other1', userDisplay: 'Rahul S.',
    date: '2026-04-10', createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'li2', title: 'Found Keys', type: 'found', status: 'active',
    description: 'A bunch of keys with a blue keychain found near the cafeteria entrance.',
    imageUrl: '', location: 'Cafeteria', userId: 'other2', userDisplay: 'Priya K.',
    date: '2026-04-10', createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    _id: 'li3', title: 'Lost Earphones', type: 'lost', status: 'active',
    description: 'White wired earphones with mic. Left in the computer lab near window seat.',
    imageUrl: '', location: 'Computer Lab', userId: 'other3', userDisplay: 'Amit R.',
    date: '2026-04-09', createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'li4', title: 'Found Notebook', type: 'found', status: 'active',
    description: 'A ruled notebook with "CS301" written on the cover found in the auditorium.',
    imageUrl: '', location: 'Auditorium', userId: 'other4', userDisplay: 'Sneha M.',
    date: '2026-04-10', createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'li5', title: 'Lost Water Bottle', type: 'lost', status: 'active',
    description: 'Blue 1-litre Decathlon bottle with a sticker of a mountain on it.',
    imageUrl: '', location: 'Sports Ground', userId: 'other5', userDisplay: 'Dev P.',
    date: '2026-04-08', createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const TABS = [
  { id: 'feed',    label: 'Browse Feed',    icon: <Search size={15}/>      },
  { id: 'report',  label: 'Report Item',    icon: <PlusCircle size={15}/>  },
  { id: 'mine',    label: 'My Reports',     icon: <LayoutList size={15}/>  },
  { id: 'notifs',  label: 'Notifications',  icon: <Bell size={15}/>        },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const NexLocateDashboard = ({ onBack }) => {
  const [tab, setTab]                     = useState('feed');
  const [items, setItems]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [claimTarget, setClaimTarget]     = useState(null);  // item being claimed
  const [claimLoading, setClaimLoading]   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast]                 = useState(null);

  // Filters (lifted here so ItemFeed is controlled)
  const [search, setSearch]               = useState('');
  const [typeFilter, setTypeFilter]       = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  // ── fetch feed ──
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);
      if (locationFilter) params.set('location', locationFilter);
      if (search)         params.set('search', search);
      const res  = await fetch(`${API}/items?${params}`);
      const data = await res.json();
      setItems(data.length ? data : MOCK_ITEMS);
    } catch {
      setItems(MOCK_ITEMS);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, locationFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchItems, 300); // debounce search
    return () => clearTimeout(t);
  }, [fetchItems]);

  // ── toast helper ──
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── report submit ──
  const handleReport = async (formData) => {
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: CURRENT_USER,
          userDisplay: USER_DISPLAY,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('✅ Item reported successfully!');
      setTab('feed');
      fetchItems();
    } catch (err) {
      // If backend down, add to mock and still feel responsive
      const mockItem = {
        _id: `m-${Date.now()}`, ...formData,
        userId: CURRENT_USER, userDisplay: USER_DISPLAY,
        status: 'active', createdAt: new Date().toISOString(),
      };
      setItems(prev => [mockItem, ...prev]);
      showToast('✅ Item reported!');
      setTab('feed');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── claim submit ──
  const handleClaimSubmit = async ({ proof, proofImageUrl }) => {
    if (!claimTarget) return;
    setClaimLoading(true);
    try {
      const res = await fetch(`${API}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: claimTarget._id,
          claimantId: CURRENT_USER,
          claimantName: USER_DISPLAY,
          proof,
          proofImageUrl,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        showToast('⚠️ You already have a pending claim on this item.', 'warning');
      } else if (!res.ok) {
        throw new Error(data.message);
      } else {
        // Add in-app notification for owner (simulated)
        setNotifications(prev => [
          {
            id: Date.now(),
            itemId: claimTarget._id,
            msg: `📨 Your claim on "${claimTarget.title}" was submitted.`,
            time: new Date().toISOString(),
            unread: true,
            type: 'sent',
          },
          ...prev,
        ]);
        showToast('📨 Claim submitted! The owner will review it.');
        setClaimTarget(null);
      }
    } catch {
      showToast('📨 Claim submitted (offline mode)!');
      setClaimTarget(null);
    } finally {
      setClaimLoading(false);
    }
  };

  const unreadNotifs = notifications.filter(n => n.unread).length;

  const markNotifsRead = (itemId) => {
    setNotifications(prev => prev.map(n => n.itemId === itemId ? { ...n, unread: false } : n));
  };

  return (
    <div className="nexlocate-container">

      {/* ── Header ── */}
      <div className="nl-topbar">
        <button onClick={onBack} className="nl-back-btn">
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: 0, fontSize: '26px', fontWeight: '800',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em',
          }}>
            🔍 NexLocate
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Campus Lost &amp; Found
          </p>
        </div>

        {/* Notification bell */}
        <button
          onClick={() => setTab('notifs')}
          style={{
            position: 'relative', background: 'var(--glass-bg-light)',
            border: '1px solid var(--glass-border)', borderRadius: '12px',
            padding: '9px 12px', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
          }}
        >
          <Bell size={18} />
          {unreadNotifs > 0 && (
            <span className="nl-notif-badge">{unreadNotifs}</span>
          )}
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div className="nl-tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nl-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
            {t.id === 'notifs' && unreadNotifs > 0 && (
              <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>
                {unreadNotifs}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">

        {tab === 'feed' && (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ItemFeed
              items={items}
              loading={loading}
              onClaim={setClaimTarget}
              currentUserId={CURRENT_USER}
              search={search}        setSearch={setSearch}
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              locationFilter={locationFilter} setLocationFilter={setLocationFilter}
            />
          </motion.div>
        )}

        {tab === 'report' && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ReportForm onSubmit={handleReport} loading={submitLoading} />
          </motion.div>
        )}

        {tab === 'mine' && (
          <motion.div key="mine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <MyReports notifications={notifications} onNotifRead={markNotifsRead} />
          </motion.div>
        )}

        {tab === 'notifs' && (
          <motion.div key="notifs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="nl-notif-list">
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main)' }}>
                🔔 Notifications
              </h3>
              {notifications.length === 0 ? (
                <div className="nl-empty" style={{ padding: '30px 0' }}>
                  <div className="nl-empty-icon">🔕</div>
                  <h3>All quiet</h3>
                  <p>You'll be notified when someone claims your item or your claim is reviewed.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <motion.div
                    key={n.id}
                    className={`nl-notif-item ${n.unread ? 'unread' : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="nl-notif-icon">{n.type === 'sent' ? '📨' : n.type === 'approved' ? '✅' : '❌'}</div>
                    <div>
                      <p className="nl-notif-text">{n.msg}</p>
                      <p className="nl-notif-time">{new Date(n.time).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Claim Modal ── */}
      <AnimatePresence>
        {claimTarget && (
          <ClaimForm
            item={claimTarget}
            onSubmit={handleClaimSubmit}
            onClose={() => setClaimTarget(null)}
            loading={claimLoading}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            style={{
              position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(10,10,22,0.97)', border: `1px solid ${toast.type === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(0,214,143,0.4)'}`,
              color: toast.type === 'warning' ? '#f59e0b' : 'var(--success)',
              padding: '13px 24px', borderRadius: '40px', fontWeight: '700', fontSize: '14px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)', zIndex: 9999,
              backdropFilter: 'blur(20px)', whiteSpace: 'nowrap',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NexLocateDashboard;
