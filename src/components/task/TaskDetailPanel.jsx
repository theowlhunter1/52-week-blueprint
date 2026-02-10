import { usePlan } from '../../context/PlanContext';
import DomainBadge from './DomainBadge';
import TaskStatusBadge from './TaskStatusBadge';
import TaskNotes from './TaskNotes';

const statuses = ['not_started', 'in_progress', 'completed', 'skipped', 'deferred'];

export default function TaskDetailPanel({ taskId, onClose }) {
  const { getTask, dispatch } = usePlan();
  const task = getTask(taskId);

  if (!task) return null;

  const handleStatusChange = (status) => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { taskId: task.id, status } });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg-secondary border-l border-border h-full overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-bg-secondary border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <DomainBadge domain={task.domain} size="md" />
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
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{task.title}</h2>
            <p className="text-xs text-text-muted mt-1">Due: Week {task.due_week}{task.deferred_to_week ? ` (deferred to Week ${task.deferred_to_week})` : ''}</p>
          </div>

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

          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-text-primary leading-relaxed">{task.description}</p>
          </div>

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
