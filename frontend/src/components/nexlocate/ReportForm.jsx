import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, AlertCircle, MapPin, Calendar, FileText, Camera } from 'lucide-react';

const LOCATIONS = [
  'Library', 'Cafeteria', 'Computer Lab', 'Main Gate', 'Hostel Block A',
  'Hostel Block B', 'Sports Ground', 'Auditorium', 'Admin Block', 'Parking Lot', 'Other',
];

const ReportForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: '', description: '', location: '', type: 'lost', date: '',
  });
  const [imageFile, setImageFile] = useState(null);      // File object
  const [imagePreview, setImagePreview] = useState('');  // data URL for preview
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image file.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be under 5 MB.' }));
      return;
    }
    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFilePick = (e) => processImageFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processImageFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())        errs.title       = 'Item title is required.';
    if (!form.description.trim())  errs.description = 'Description is required.';
    if (!form.location)            errs.location    = 'Location is required.';
    if (!imagePreview)             errs.image       = 'Image is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // Pass form data + imagePreview (base64) to parent
    onSubmit({ ...form, imageUrl: imagePreview });
  };

  return (
    <div className="nl-form-panel">
      <motion.div
        className="nl-form-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="nl-form-title">📢 Report an Item</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Item Type */}
          <div className="nl-form-group">
            <label className="nl-form-label">Item Type <span className="nl-required">*</span></label>
            <div className="nl-type-toggle">
              {['lost', 'found'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`nl-type-option ${form.type === t ? `active ${t}` : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, type: t }))}
                >
                  {t === 'lost' ? '🔍 I Lost This' : '📦 I Found This'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="nl-form-group">
            <label className="nl-form-label">
              <FileText size={13} /> Item Title <span className="nl-required">*</span>
            </label>
            <input
              className={`nl-form-input ${errors.title ? 'error' : ''}`}
              name="title"
              placeholder="e.g. Black Wallet, Blue Water Bottle..."
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <p className="nl-error-text"><AlertCircle size={12}/> {errors.title}</p>}
          </div>

          {/* Description */}
          <div className="nl-form-group">
            <label className="nl-form-label">
              <FileText size={13} /> Description <span className="nl-required">*</span>
            </label>
            <textarea
              className={`nl-form-textarea ${errors.description ? 'error' : ''}`}
              name="description"
              placeholder="Describe the item clearly — brand, color, distinguishing marks..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <p className="nl-error-text"><AlertCircle size={12}/> {errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div className="nl-form-group">
            <label className="nl-form-label">
              <Camera size={13} /> Item Photo <span className="nl-required">*</span>
            </label>
            <div
              className={`nl-upload-zone ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="nl-upload-preview" />
                  <div className="nl-upload-change-overlay">
                    <Camera size={16} /> Change Photo
                  </div>
                </>
              ) : (
                <div className="nl-upload-hint">
                  <Upload size={28} className="nl-upload-icon" />
                  <strong>Click or drag & drop to upload</strong>
                  <span>PNG, JPG, WEBP — max 5 MB</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFilePick}
              />
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setImagePreview(''); setImageFile(null); }}
                style={{ alignSelf: 'flex-start', marginTop: '6px', background: 'none', color: 'var(--error)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <X size={12} /> Remove image
              </button>
            )}
            {errors.image && <p className="nl-error-text"><AlertCircle size={12}/> {errors.image}</p>}
          </div>

          {/* Location */}
          <div className="nl-form-group">
            <label className="nl-form-label">
              <MapPin size={13} /> Location <span className="nl-required">*</span>
            </label>
            <select
              className={`nl-form-select ${errors.location ? 'error' : ''}`}
              name="location"
              value={form.location}
              onChange={handleChange}
            >
              <option value="">Select where it was lost / found</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.location && <p className="nl-error-text"><AlertCircle size={12}/> {errors.location}</p>}
          </div>

          {/* Date (optional) */}
          <div className="nl-form-group">
            <label className="nl-form-label">
              <Calendar size={13} /> Date (optional)
            </label>
            <input
              type="date"
              className="nl-form-input"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <button type="submit" className="nl-submit-btn" disabled={loading}>
            {loading ? (
              <>⏳ Submitting…</>
            ) : (
              <>{form.type === 'lost' ? '🔍' : '📦'} Report Item</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportForm;
