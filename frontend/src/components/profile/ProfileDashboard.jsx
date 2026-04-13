import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User as UserIcon, Mail, Phone, BookOpen, Layers, Hash, LogOut, Verified, Edit3, Save, X } from 'lucide-react';
import API_BASE from '../../config/api.js';

const ProfileDashboard = ({ user, onBack, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [isSaving, setIsSaving] = useState(false);

  // Graceful fallback if hit directly without login
  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'white' }}>
         <h2>Not Authenticated</h2>
         <button className="nt-btn nt-btn-primary" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Assuming a PUT endpoint exists or mocking it
      await fetch(`${API_BASE}/api/auth/profile`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(editData)
      });
      // Optimistic update mutating prop (since no update callback is provided)
      Object.assign(user, editData);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      
      {/* ── Topbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(20px)' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }} onClick={onBack}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
         
         {/* ── ID Card Wrapper ── */}
         <motion.div 
           initial={{ opacity: 0, y: 20, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           className="glass-panel"
           style={{ width: '100%', maxWidth: 460, borderRadius: 32, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
         >
            {/* Header Identity */}
            <div style={{ position: 'relative', height: 160, background: 'linear-gradient(135deg, #185a9d, #43cea2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Verified size={16} /> Verified Student
               </div>
               
               <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-card)', border: '4px solid white', marginTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: 'var(--primary)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', zIndex: 10 }}>
                 <UserIcon size={50} />
               </div>
            </div>

            {/* Profile Body */}
            <div style={{ paddingTop: 60, paddingBottom: 32, paddingLeft: 32, paddingRight: 32, textAlign: 'center' }}>
               {isEditing ? (
                 <input 
                   type="text" 
                   value={editData.username} 
                   onChange={e => setEditData({...editData, username: e.target.value})}
                   style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px', color: 'white', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--primary)', borderRadius: 8, padding: '4px 12px', textAlign: 'center', width: '100%' }}
                 />
               ) : (
                 <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px', color: 'white' }}>{user.username}</h1>
               )}

               {isEditing ? (
                 <input 
                   type="text" 
                   value={editData.branch || ''} 
                   onChange={e => setEditData({...editData, branch: e.target.value})}
                   placeholder="Branch"
                   style={{ fontSize: 14, marginTop: 8, color: 'white', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '4px 12px', textAlign: 'center', width: '100%', WebkitTextFillColor: 'white' }}
                 />
               ) : (
                 <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{user.branch || "Unassigned"}</p>
               )}

               <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                 {!isEditing ? (
                   <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--glass-bg-light)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                     <Edit3 size={14} /> Edit Profile
                   </button>
                 ) : (
                   <div style={{ display: 'flex', gap: 10 }}>
                     <button onClick={handleSave} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--success)', border: 'none', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                       <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
                     </button>
                     <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                       <X size={14} /> Cancel
                     </button>
                   </div>
                 )}
               </div>


               {/* Metric Grid */}
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, textAlign: 'left' }}>
                  
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Hash size={14}/> ROLL NO</div>
                     <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{user.rollNo}</div>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Layers size={14}/> SECTION</div>
                     {isEditing ? (
                        <input 
                          type="text" 
                          value={editData.section || ''} 
                          onChange={e => setEditData({...editData, section: e.target.value})}
                          style={{ color: 'white', fontSize: 16, fontWeight: 600, background: 'transparent', border: 'none', borderBottom: '1px solid var(--primary)', outline: 'none', width: '100%', WebkitTextFillColor: 'white' }}
                        />
                     ) : (
                        <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{user.section || "N/A"}</div>
                     )}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Mail size={14}/> COLLEGE EMAIL</div>
                     {isEditing ? (
                        <input 
                          type="email" 
                          value={editData.email || ''} 
                          onChange={e => setEditData({...editData, email: e.target.value})}
                          style={{ color: 'white', fontSize: 16, fontWeight: 600, background: 'transparent', border: 'none', borderBottom: '1px solid var(--primary)', outline: 'none', width: '100%', WebkitTextFillColor: 'white' }}
                        />
                     ) : (
                        <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{user.email}</div>
                     )}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Phone size={14}/> PHONE NUMBER</div>
                     {isEditing ? (
                        <input 
                          type="tel" 
                          value={editData.phone || ''} 
                          onChange={e => setEditData({...editData, phone: e.target.value})}
                          placeholder="e.g. 9876543210"
                          style={{ color: 'white', fontSize: 16, fontWeight: 600, background: 'transparent', border: 'none', borderBottom: '1px solid var(--primary)', outline: 'none', width: '100%', WebkitTextFillColor: 'white' }}
                        />
                     ) : (
                        <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>+91 {user.phone || "Not provided"}</div>
                     )}
                  </div>

               </div>

               {/* Logout Trigger */}
               {!isEditing && (
                 <button 
                    onClick={onLogout}
                    style={{ width: '100%', marginTop: 32, padding: 16, background: 'rgba(245,0,79,0.1)', color: '#f5004f', border: '1px solid rgba(245,0,79,0.3)', borderRadius: 16, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(245,0,79,0.2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(245,0,79,0.1)'}
                 >
                   <LogOut size={18} /> Secure Logout
                 </button>
               )}

            </div>
         </motion.div>
      </div>

    </div>
  );
};

export default ProfileDashboard;
