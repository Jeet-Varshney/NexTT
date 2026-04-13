import { useEffect, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

const PrintUpload = ({ file, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedFile) return;
    const uploadFile = async () => {
      setError('');
      setProgress(0);
      try {
        await onUpload(selectedFile);
        const interval = setInterval(() => {
          setProgress(old => {
            if (old >= 100) {
              clearInterval(interval);
              return 100;
            }
            return old + 20;
          });
        }, 120);
        return () => clearInterval(interval);
      } catch (err) {
        setError('Upload failed.');
      }
    };
    uploadFile();
  }, [selectedFile]);

  const handleSelect = (event) => {
    const chosen = event.target.files?.[0];
    if (!chosen) return;
    const accepted = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!accepted.includes(chosen.type)) {
      setError('Invalid file type. Upload PDF, DOC, DOCX, or image.');
      return;
    }
    setSelectedFile(chosen);
  };

  return (
    <div className="print-upload-card">
      <h3>Document Upload</h3>
      <p>PDF, image, or document. We keep uploads secure and preview-ready.</p>
      <label className="file-dropzone">
        <div className="file-icon"><UploadCloud size={28} /></div>
        <div>
          <strong>{file?.fileName || 'Choose a document to upload'}</strong>
          <span>{file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supported formats: PDF, DOC, DOCX, JPG, PNG'}</span>
        </div>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={handleSelect} />
      </label>
      <div className="upload-progress">
        <div className="upload-bar" style={{ width: `${file ? 100 : progress}%` }} />
      </div>
      {error && <p className="helper-text error">{error}</p>}
      {file && (
        <div className="uploaded-file-card">
          <FileText size={18} />
          <div>
            <p>{file.fileName}</p>
            <span>{file.mimeType}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintUpload;
