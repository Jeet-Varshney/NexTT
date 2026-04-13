import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Printer } from 'lucide-react';
import API_BASE from '../../config/api.js';

const API = `${API_BASE}/api/nexkit`;

const PrintService = ({ currentUser, onCheckout }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Settings
  const [colorType, setColorType] = useState('B/W');
  const [copies, setCopies] = useState(1);
  const [pageSelection, setPageSelection] = useState('All');
  const [customPages, setCustomPages] = useState('');
  
  // Delivery
  const [deliveryMethod, setDeliveryMethod] = useState('Pickup');
  const [address, setAddress] = useState('');

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setUploading(true);

    try {
      // Mock upload to our backend
      const formData = new FormData();
      formData.append('fileName', droppedFile.name);
      
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData // In real life, we would send the actual file blob here
      });
      const data = await res.json();
      setFileUrl(data.fileUrl || `mock_url_${Date.now()}`);
    } catch {
      // Offline fallback
      setTimeout(() => setFileUrl(`offline_url_${Date.now()}`), 1000);
    } finally {
      setUploading(false);
    }
  };

  // Cost logic mirroring backend
  const calculateCost = () => {
    if (!file) return 0;
    // Estimate page count: roughly 10 pages for demo purposes if 'All' is selected. 
    // In real life, frontend parses PDFs or backend tells us metadata.
    let pageCount = 10; 
    
    if (pageSelection === 'Custom' && customPages) {
       // Parse e.g. "1-5", "1,2,3"
       const parts = customPages.split(',').filter(Boolean);
       let count = 0;
       parts.forEach(p => {
         if (p.includes('-')) {
           const [start, end] = p.split('-').map(Number);
           if (!isNaN(start) && !isNaN(end) && end >= start) count += (end - start + 1);
         } else if (!isNaN(Number(p))) count += 1;
       });
       if (count > 0) pageCount = count;
    }
    
    const baseRate = colorType === 'Color' ? 6 : 3;
    return Math.max(20, pageCount * copies * baseRate);
  };

  const totalCost = calculateCost();
  const isValid = fileUrl && (deliveryMethod === 'Pickup' || address.trim() !== '') && (pageSelection !== 'Custom' || customPages.trim() !== '');

  const handlePlaceOrder = () => {
    if (!isValid) return;
    onCheckout({
      type: 'PrintJob',
      printDetails: {
        fileName: file.name,
        fileUrl,
        colorType,
        copies,
        pageSelection: pageSelection === 'Custom' ? customPages : 'All',
        pagesCount: totalCost / (colorType === 'Color' ? 6 : 3) / copies // Reverse calculate roughly
      },
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'Delivery' ? address : 'Campus Print Center',
      paymentMethod: 'Cash',
      totalAmount: totalCost
    });
  };

  return (
    <div className="nk-print-container">
      <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 20px', color: 'var(--text-main)' }}>
        🖨️ Document Printing
      </h2>

      {/* Upload Zone */}
      {!file ? (
        <div 
          className="nk-upload-zone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
          onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); }}
          onDrop={(e) => { e.currentTarget.classList.remove('drag-over'); handleFileDrop(e); }}
          onClick={() => document.getElementById('print-upload-input').click()}
        >
          <input 
            type="file" 
            id="print-upload-input" 
            style={{ display: 'none' }} 
            onChange={handleFileDrop} 
            accept=".pdf,.doc,.docx,.png,.jpg"
          />
          <UploadCloud size={48} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '16px' }} />
          <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: 'var(--text-main)' }}>Upload Document</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Drag & Drop or click to browse (PDF, Word, Images)</p>
        </div>
      ) : (
        <div className="nk-file-card">
          <FileText size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: 0, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</h4>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
              {uploading ? 'Uploading...' : 'Uploaded successfully (Estimated 10 pages)'}
            </span>
          </div>
          {!uploading && (
            <button onClick={() => { setFile(null); setFileUrl(''); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px', padding: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
              Change
            </button>
          )}
        </div>
      )}

      {/* Settings */}
      {file && !uploading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="nk-print-settings">
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Color type */}
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Color Mode</label>
              <div className="nk-radio-group">
                <button className={`nk-radio-btn ${colorType === 'B/W' ? 'active' : ''}`} onClick={() => setColorType('B/W')}>B/W (₹3/pg)</button>
                <button className={`nk-radio-btn ${colorType === 'Color' ? 'active' : ''}`} onClick={() => setColorType('Color')}>Color (₹6/pg)</button>
              </div>
            </div>
            {/* Copies */}
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Copies</label>
              <div className="nk-qty-controls" style={{ marginTop: '6px', justifyContent: 'space-between', padding: '6px' }}>
                <button className="nk-qty-btn" onClick={() => setCopies(Math.max(1, copies - 1))}>-</button>
                <span className="nk-qty-text">{copies}</span>
                <button className="nk-qty-btn" onClick={() => setCopies(copies + 1)}>+</button>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />

          {/* Page Selection */}
          <div>
             <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Pages to Print</label>
             <div className="nk-radio-group">
                <button className={`nk-radio-btn ${pageSelection === 'All' ? 'active' : ''}`} onClick={() => setPageSelection('All')}>All Pages</button>
                <button className={`nk-radio-btn ${pageSelection === 'Custom' ? 'active' : ''}`} onClick={() => setPageSelection('Custom')}>Custom</button>
             </div>
             {pageSelection === 'Custom' && (
                <input 
                  type="text" 
                  className="nk-input" 
                  placeholder="e.g. 1-5, 8, 11-13" 
                  value={customPages}
                  onChange={e => setCustomPages(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
             )}
          </div>

          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />

          {/* Delivery */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Delivery Method</label>
            <div className="nk-radio-group">
              <button 
                className={`nk-radio-btn ${deliveryMethod === 'Pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('Pickup')}
              >
                🏫 Pickup center
              </button>
              <button 
                className={`nk-radio-btn ${deliveryMethod === 'Delivery' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('Delivery')}
              >
                🛵 Delivery
              </button>
            </div>

            {deliveryMethod === 'Delivery' && (
              <input 
                type="text" 
                className="nk-input" 
                placeholder="e.g. Hostel A, Room 204"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ marginTop: '10px' }}
              />
            )}
          </div>

          {/* Total & Action */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginTop: '10px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Estimated Cost: (Min ₹20)</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>₹{totalCost}</span>
             </div>
             <button 
                className="nk-checkout-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled={!isValid}
                onClick={handlePlaceOrder}
             >
                <Printer size={18} /> Place Print Order
             </button>
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default PrintService;
