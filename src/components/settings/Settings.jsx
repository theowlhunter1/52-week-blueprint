import { useRef } from 'react';
import { usePlan } from '../../context/PlanContext';
import { exportToJSON, importFromJSON } from '../../utils/exportData';

export default function Settings() {
  const { state, dispatch } = usePlan();
  const fileInputRef = useRef(null);

  const handleDateChange = (e) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { startDate: e.target.value } });
  };

  const handleExport = () => {
    exportToJSON(state);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm('This will overwrite all current data. Continue?')) {
      e.target.value = '';
      return;
    }
    try {
      const data = await importFromJSON(file);
      dispatch({ type: 'IMPORT_STATE', payload: data });
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
    e.target.value = '';
  };

  const handleReset = () => {
    if (!window.confirm('Reset all data to the original 52-week plan? This cannot be undone.')) return;
    if (!window.confirm('Are you sure? All progress, notes, and changes will be lost.')) return;
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Settings</h1>
      <p className="text-sm text-text-secondary mb-8">Configure your blueprint tracker.</p>

      <div className="space-y-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-text-primary mb-1">Start Date</h3>
          <p className="text-xs text-text-muted mb-3">Week 1 begins on this date. All "current week" calculations derive from this.</p>
          <input
            type="date"
            value={state.settings?.startDate || ''}
            onChange={handleDateChange}
            className="bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-text-primary mb-1">Data Management</h3>
          <p className="text-xs text-text-muted mb-4">Export, import, or reset your plan data.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-accent text-bg-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-bg-tertiary border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-bg-hover transition-colors"
            >
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Reset to Original Plan
            </button>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-text-primary mb-1">About</h3>
          <p className="text-xs text-text-muted">
            52-Week Career Blueprint Tracker v1.0
            <br />
            From $95K Head of AI to $250K+ Executive
            <br />
            All data stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
