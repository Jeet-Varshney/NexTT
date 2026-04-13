import { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TradeListingForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Books', negotiable: false
  });
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }
    
    // Simulate image upload to mock URL for demo
    const payload = {
      ...form,
      price: Number(form.price),
      imageUrl: `mock_upload_${Date.now()}` // Mocked!
    };
    
    onSubmit(payload);
  };

  return (
    <motion.div className="nt-form-container" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--text-main)' }}>
        Sell an Item
      </h2>

      <form onSubmit={handleSubmit}>
        
        <div className="nt-form-group">
          <label className="nt-form-label">Upload Image <span style={{color: 'var(--primary)'}}>*</span></label>
          {!image ? (
            <div className="nt-upload-area" onClick={() => document.getElementById('nl-img-input').click()}>
              <input 
                type="file" id="nl-img-input" style={{ display: 'none' }} 
                accept="image/*" onChange={(e) => setImage(e.target.files[0])}
              />
              <UploadCloud size={40} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '10px' }} />
              <div style={{ color: 'var(--text-main)', fontSize: '15px' }}>Click to upload</div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
              <CheckCircle size={24} color="#00d68f" />
              <span style={{flex: 1}}>{image.name}</span>
              <button type="button" onClick={() => setImage(null)} style={{ background: 'none', border: 'none', color: '#f5004f', cursor: 'pointer' }}>Remove</button>
            </div>
          )}
        </div>

        <div className="nt-form-group">
          <label className="nt-form-label">Item Title <span style={{color: 'var(--primary)'}}>*</span></label>
          <input className="nt-input" placeholder="e.g. Engineering Physics Book" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>

        <div className="nt-form-group" style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label className="nt-form-label">Category <span style={{color: 'var(--primary)'}}>*</span></label>
            <select className="nt-input" style={{ width: '100%' }} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="Books">Books</option>
              <option value="Notes/Modules">Notes/Modules</option>
              <option value="Instruments">Instruments</option>
              <option value="Stationary">Stationary</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="nt-form-label">Price (₹) <span style={{color: 'var(--primary)'}}>*</span></label>
            <input type="number" className="nt-input" placeholder="0" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
        </div>

        <div className="nt-form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
          <div>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Price is Negotiable</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Allow buyers to make offers in chat.</div>
          </div>
          <div className="nt-toggle" onClick={() => setForm({...form, negotiable: !form.negotiable})}>
            <div className={`nt-toggle-box ${form.negotiable ? 'on' : ''}`}>
               <div className="nt-toggle-circle"></div>
            </div>
          </div>
        </div>

        <div className="nt-form-group">
          <label className="nt-form-label">Description <span style={{color: 'var(--primary)'}}>*</span></label>
          <textarea className="nt-input" rows={4} placeholder="Condition, usage time, syllabus version..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        </div>

        <button type="submit" className="nt-btn nt-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }} disabled={loading}>
          {loading ? 'Posting...' : 'Post Listing'}
        </button>

      </form>
    </motion.div>
  );
};

export default TradeListingForm;
