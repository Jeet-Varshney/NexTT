import { useMemo } from 'react';

const PrintSettings = ({ settings, onChange }) => {
  const pageHint = useMemo(() => {
    if (settings.pageMode === 'All') return 'All pages will be printed.';
    return `Custom pages: ${settings.pages}`;
  }, [settings]);

  return (
    <div className="print-settings-card">
      <h3>Print Settings</h3>
      <div className="settings-row">
        <label>Color mode</label>
        <div className="toggle-group">
          {['Black & White', 'Color'].map(mode => (
            <button
              key={mode}
              className={settings.color === (mode === 'Color') ? 'selected' : ''}
              onClick={() => onChange({ ...settings, color: mode === 'Color' })}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row">
        <label>Copies</label>
        <div className="copy-input">
          <input
            type="number"
            min="1"
            value={settings.copies}
            onChange={(e) => onChange({ ...settings, copies: Math.max(1, Number(e.target.value) || 1) })}
          />
        </div>
      </div>

      <div className="settings-row">
        <label>Page selection</label>
        <div className="toggle-group">
          {['All', 'Custom'].map(mode => (
            <button
              key={mode}
              className={settings.pageMode === mode ? 'selected' : ''}
              onClick={() => onChange({ ...settings, pageMode: mode, pages: mode === 'All' ? 'All' : settings.pages || '1-5' })}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {settings.pageMode === 'Custom' && (
        <input
          className="page-input"
          type="text"
          value={settings.pages}
          onChange={(e) => onChange({ ...settings, pages: e.target.value })}
          placeholder="e.g. 1-5, 8, 10"
        />
      )}

      <p className="helper-text">{pageHint}</p>
    </div>
  );
};

export default PrintSettings;
