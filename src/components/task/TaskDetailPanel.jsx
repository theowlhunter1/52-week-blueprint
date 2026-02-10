import { useState, useRef, useEffect } from 'react';
import { usePlan } from '../../context/PlanContext';
import DomainBadge from './DomainBadge';
import TaskStatusBadge from './TaskStatusBadge';
import TaskNotes from './TaskNotes';

const statuses = ['not_started', 'in_progress', 'completed', 'skipped', 'deferred'];
const domains = ['technical', 'strategy', 'leadership', 'credentials', 'networking', 'portfolio'];
const priorities = ['normal', 'high', 'critical'];

function EditableText({ value, onSave, multiline = false, className = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  const save = () => {
    setEditing(false);
    if (draft.trim() && draft !== value) onSave(draft.trim());
    else setDraft(value);
  };

  if (!editing) {
    return (
      <div onClick={() => setEditing(true)} className={`cursor-pointer hover:bg-bg-hover rounded px-1 -mx-1 transition-colors ${className}`}>
        {multiline ? (
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{value}</p>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  }

  if (multiline) {
    return (
      <textarea
        ref={ref}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        rows={4}
        className="w-full text-sm text-text-primary bg-bg-tertiary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-accent resize-y"
      />
    );
  }

  return (
    <input
      ref={ref}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
      className={`w-full bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent ${className}`}
    />
  );
}

export default function TaskDetailPanel({ taskId, onClose }) {
  const { getTask, dispatch } = usePlan();
  const task = getTask(taskId);
  const [moveWeek, setMoveWeek] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const handleStatusChange = (status) => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { taskId: task.id, status } });
  };

  const handleUpdate = (field, value) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId: task.id, updates: { [field]: value } } });
  };

  const handleMove = () => {
    const week = parseInt(moveWeek, 10);
    if (week >= 1 && week <= 52) {
      dispatch({ type: 'MOVE_TASK', payload: { taskId: task.id, toWeek: week } });
      setMoveWeek('');
    }
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId: task.id } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg-secondary border-l border-border h-full overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-bg-secondary border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <DomainBadge domain={task.domain} size="md" />
            {task.custom && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-medium">Custom</span>
            )}
            {task.priority === 'critical' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">Critical</span>
            )}
            {task.priority === 'high' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-medium">High</span>
            )}
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Title — click to edit */}
          <div>
            <EditableText
              value={task.title}
              onSave={v => handleUpdate('title', v)}
              className="text-lg font-semibold text-text-primary"
            />
            <p className="text-xs text-text-muted mt-1">Due: Week {task.due_week}{task.deferred_to_week ? ` (deferred to Week ${task.deferred_to_week})` : ''}</p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    task.status === s
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-text-muted hover:text-text-primary'
                  }`}
                >
                  {s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Domain</h3>
            <select
              value={task.domain}
              onChange={e => handleUpdate('domain', e.target.value)}
              className="text-sm bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent"
            >
              {domains.map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Priority</h3>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p}
                  onClick={() => handleUpdate('priority', p)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    task.priority === p
                      ? p === 'critical' ? 'border-red-500 bg-red-500/10 text-red-400'
                        : p === 'high' ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-text-muted hover:text-text-primary'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description — click to edit */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Description</h3>
            <EditableText
              value={task.description}
              onSave={v => handleUpdate('description', v)}
              multiline
            />
          </div>

          {/* Move to Week */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Move to Week</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={52}
                value={moveWeek}
                onChange={e => setMoveWeek(e.target.value)}
                placeholder={String(task.due_week)}
                className="w-20 text-sm bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleMove}
                disabled={!moveWeek || parseInt(moveWeek, 10) === task.due_week}
                className="text-xs px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Move
              </button>
            </div>
          </div>

          {/* Delete */}
          <div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete Task
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400">Delete this task?</span>
                  <button
                    onClick={handleDelete}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
          </div>

          {/* Notes & History */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">Notes & History</h3>
            <TaskNotes task={task} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
