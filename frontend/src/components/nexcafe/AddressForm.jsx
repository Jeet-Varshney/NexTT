import { MapPin } from 'lucide-react';

const PRESET_ADDRESSES = [
  'Hostel Block A, Room 204',
  'Hostel Block B, Room 112',
  'Class Room 3F, Tech Wing',
  'Library Reading Hall',
];

const AddressForm = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Deliver to</p>
      {PRESET_ADDRESSES.map(a => (
        <button
          key={a}
          onClick={() => onChange(a)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px',
            border: `1px solid ${value === a ? 'var(--primary)' : 'var(--glass-border)'}`,
            background: value === a ? 'rgba(255,0,51,0.08)' : 'var(--input-bg)',
            color: value === a ? 'var(--primary)' : 'var(--text-muted)',
            fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-family)', textAlign: 'left'
          }}
        >
          <MapPin size={14} /> {a}
        </button>
      ))}
      <input
        type="text"
        placeholder="Or type a custom address…"
        className="auth-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ padding: '10px 16px', fontSize: '14px' }}
      />
    </div>
  );
};

export default AddressForm;
