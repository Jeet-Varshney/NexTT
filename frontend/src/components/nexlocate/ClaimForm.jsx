import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Camera, Upload, ShieldCheck } from 'lucide-react';

const ClaimForm = ({ item, onSubmit, onClose, loading }) => {
  const [proof, setProof]             = useState('');
  const [proofImage, setProofImage]   = useState('');
  const [dragOver, setDragOver]       = useState(false);
  const [errors, setErrors]           = useState({});
  const fileRef = useRef(null);

  const processImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setProofImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!proof.trim() || proof.trim().length < 20) {
      errs.proof = 'Please provide at least 20 characters explaining why this is yours.';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ proof, proofImageUrl: proofImage });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="nl-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="nl-modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2 className="nl-modal-title">🙋 Claim Item</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '-12px' }}>
                {item.title} · <span style={{ color: 'var(--text-dim)' }}>{item.location}</span>
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '7px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          {/* Safety note */}
          <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <ShieldCheck size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '13px', color: '#38bdf8', margin: 0, lineHeight: 1.5 }}>
              Your contact info stays private. The item owner will review your claim and reach out through the app.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Proof description */}
            <div className="nl-form-group" style={{ marginBottom: '18px' }}>
              <label className="nl-form-label">
                Why is this yours? <span className="nl-required">*</span>
              </label>
              <textarea
                className={`nl-form-textarea ${errors.proof ? 'error' : ''}`}
                placeholder="Describe specific details that prove this belongs to you — contents, markings, receipts, etc."
                value={proof}
                onChange={(e) => { setProof(e.target.value); if (errors.proof) setErrors({}); }}
                rows={4}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {errors.proof
                  ? <p className="nl-error-text" style={{ margin: 0 }}><AlertCircle size={12}/> {errors.proof}</p>
                  : <span />
                }
                <span style={{ fontSize: '11px', color: proof.length >= 20 ? 'var(--success)' : 'var(--text-dim)' }}>
                  {proof.length}/20 min
                </span>
              </div>
            </div>

            {/* Optional proof image */}
            <div className="nl-form-group" style={{ marginBottom: '24px' }}>
              <label className="nl-form-label">
                <Camera size={13} /> Additional Proof Image (optional)
              </label>
              <div
                className={`nl-upload-zone ${dragOver ? 'drag-over' : ''} ${proofImage ? 'has-image' : ''}`}
                style={{ padding: proofImage ? '0' : '20px' }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); processImage(e.dataTransfer.files[0]); }}
              >
                {proofImage ? (
                  <>
                    <img src={proofImage} alt="Proof" className="nl-upload-preview" />
                    <div className="nl-upload-change-overlay">
                      <Camera size={16} /> Change
                    </div>
                  </>
                ) : (
                  <div className="nl-upload-hint" style={{ gap: '6px', fontSize: '13px' }}>
                    <Upload size={22} className="nl-upload-icon" />
                    Upload a receipt, photo, or other proof
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => processImage(e.target.files[0])} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} className="nl-outline-btn" style={{ flex: 1, padding: '13px' }}>
                Cancel
              </button>
              <button type="submit" className="nl-submit-btn" style={{ flex: 2, marginTop: 0 }} disabled={loading}>
                {loading ? '⏳ Submitting…' : '📨 Submit Claim'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClaimForm;
