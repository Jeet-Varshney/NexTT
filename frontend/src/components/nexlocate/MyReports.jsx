import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nexlocate`;
const CURRENT_USER = 'demo'; // Replace with auth context

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const StatusBadge = ({ s }) => {
  const map = {
    pending:  { label: '⏳ Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
    approved: { label: '✅ Approved', color: '#00d68f', bg: 'rgba(0,214,143,0.1)',  border: 'rgba(0,214,143,0.3)' },
    rejected: { label: '❌ Rejected', color: '#f5004f', bg: 'rgba(245,0,79,0.1)',   border: 'rgba(245,0,79,0.3)' },
  };
  const { label, color, bg, border } = map[s] || map.pending;
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color, background: bg, border: `1px solid ${border}`, letterSpacing: '0.04em' }}>
      {label}
    </span>
  );
};

const MyReports = ({ notifications, onNotifRead }) => {
  const [myItems, setMyItems]     = useState([]);
  const [myClaims, setMyClaims]   = useState([]);
  const [expanded, setExpanded]   = useState({});    // itemId → bool (show claims)
  const [claimsData, setClaimsData] = useState({});  // itemId → claims[]
  const [loadingClaims, setLoadingClaims] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        fetch(`${API}/items/${CURRENT_USER}/mine`),
        fetch(`${API}/claims/user/${CURRENT_USER}`),
      ]);
      setMyItems(await itemsRes.json());
      setMyClaims(await claimsRes.json());
    } catch {
      setMyItems([]);
      setMyClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleClaims = async (itemId) => {
    const next = !expanded[itemId];
    setExpanded(prev => ({ ...prev, [itemId]: next }));
    if (next && !claimsData[itemId]) {
      setLoadingClaims(prev => ({ ...prev, [itemId]: true }));
      try {
        const res = await fetch(`${API}/claims/item/${itemId}`);
        const data = await res.json();
        setClaimsData(prev => ({ ...prev, [itemId]: data }));
      } catch {
        setClaimsData(prev => ({ ...prev, [itemId]: [] }));
      } finally {
        setLoadingClaims(prev => ({ ...prev, [itemId]: false }));
      }
    }
  };

  const handleClaimAction = async (claimId, itemId, status) => {
    setActionLoading(claimId);
    try {
      await fetch(`${API}/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      // Refresh claims for this item
      const res = await fetch(`${API}/claims/item/${itemId}`);
      const data = await res.json();
      setClaimsData(prev => ({ ...prev, [itemId]: data }));
      // Refresh my items (status may be updated)
      const itemsRes = await fetch(`${API}/items/${CURRENT_USER}/mine`);
      setMyItems(await itemsRes.json());
    } catch {
      // Optimistic update in mock mode
      setClaimsData(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || []).map(c => c._id === claimId ? { ...c, status } : c),
      }));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="nl-my-list">
        {[1,2,3].map(i => (
          <div key={i} className="nl-skeleton" style={{ height: '90px', borderRadius: '18px' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── My Reports ── */}
      <section>
        <h3 style={{ padding: '24px 28px 12px', fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
          📋 My Reported Items
        </h3>

        {myItems.length === 0 ? (
          <div className="nl-empty" style={{ padding: '30px 20px' }}>
            <div className="nl-empty-icon">📭</div>
            <h3>Nothing reported yet</h3>
            <p>Use the "Report Item" tab to report a lost or found item.</p>
          </div>
        ) : (
          <div className="nl-my-list">
            {myItems.map(item => {
              const pendingCount = (claimsData[item._id] || []).filter(c => c.status === 'pending').length;
              const isExp = expanded[item._id];

              return (
                <motion.div key={item._id} layout>
                  <div className="nl-my-item-row">
                    {/* Thumb */}
                    <div className="nl-my-thumb">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        : (item.type === 'lost' ? '🔍' : '📦')}
                    </div>

                    <div className="nl-my-info" style={{ flex: 1 }}>
                      <h4 className="nl-my-title">
                        {item.title}
                        {notifications.some(n => n.itemId === item._id && !n.read) && (
                          <span style={{ marginLeft: '8px', background: 'var(--primary)', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '10px', verticalAlign: 'middle' }}>
                            New
                          </span>
                        )}
                      </h4>
                      <p className="nl-my-loc"><MapPin size={11}/> {item.location}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className={`nl-item-type-badge nl-badge-${item.status === 'claimed' ? 'claimed' : item.type}`}>
                          {item.status === 'claimed' ? '✓ Claimed' : item.type === 'lost' ? '🔍 Lost' : '📦 Found'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>

                      <div className="nl-my-actions">
                        <button
                          className="nl-outline-btn"
                          onClick={() => { toggleClaims(item._id); onNotifRead(item._id); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          {isExp ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                          View Claims
                          {pendingCount > 0 && (
                            <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '700' }}>
                              {pendingCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded claims list */}
                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 0 12px 0', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                          {loadingClaims[item._id] && (
                            <div className="nl-skeleton" style={{ height: '60px', borderRadius: '14px' }} />
                          )}
                          {!loadingClaims[item._id] && (claimsData[item._id] || []).length === 0 && (
                            <p style={{ fontSize: '13px', color: 'var(--text-dim)', padding: '10px 4px' }}>No claims yet.</p>
                          )}
                          {(claimsData[item._id] || []).map(claim => (
                            <div key={claim._id} className="nl-claim-row">
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: '700', fontSize: '14px' }}>
                                    {claim.claimantName || claim.claimantId}
                                  </span>
                                  <StatusBadge s={claim.status} />
                                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{timeAgo(claim.createdAt)}</span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                                  {claim.proof}
                                </p>
                                {claim.proofImageUrl && (
                                  <img src={claim.proofImageUrl} alt="proof" style={{ marginTop: '8px', maxHeight: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                )}
                              </div>

                              {claim.status === 'pending' && item.status !== 'claimed' && (
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexDirection: 'column' }}>
                                  <button
                                    className="nl-claim-approve-btn"
                                    disabled={!!actionLoading}
                                    onClick={() => handleClaimAction(claim._id, item._id, 'approved')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <CheckCircle2 size={13}/> Accept
                                  </button>
                                  <button
                                    className="nl-claim-reject-btn"
                                    disabled={!!actionLoading}
                                    onClick={() => handleClaimAction(claim._id, item._id, 'rejected')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <XCircle size={13}/> Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── My Claims ── */}
      <section>
        <h3 style={{ padding: '0 28px 12px', fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
          📨 My Submitted Claims
        </h3>

        {myClaims.length === 0 ? (
          <div className="nl-empty" style={{ padding: '30px 20px' }}>
            <div className="nl-empty-icon">📋</div>
            <h3>No claims submitted</h3>
            <p>Browse the feed and claim items that belong to you.</p>
          </div>
        ) : (
          <div className="nl-my-list" style={{ paddingTop: 0 }}>
            {myClaims.map(claim => (
              <motion.div key={claim._id} className="nl-my-item-row" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>Claim #{(claim._id || '').slice(-6)}</span>
                    <StatusBadge s={claim.status} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {claim.proof.length > 100 ? claim.proof.slice(0, 100) + '…' : claim.proof}
                  </p>
                  {claim.message && (
                    <p style={{ fontSize: '12px', color: 'var(--info)', margin: 0, padding: '6px 10px', background: 'rgba(56,189,248,0.07)', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.15)' }}>
                      📩 Owner's note: {claim.message}
                    </p>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>{timeAgo(claim.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default MyReports;
