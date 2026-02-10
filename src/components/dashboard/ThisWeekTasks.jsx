import { usePlan } from '../../context/PlanContext';
import { getThisWeekTasks } from '../../utils/weekCalculations';
import DomainBadge from '../task/DomainBadge';

export default function ThisWeekTasks({ currentWeek, onTaskClick }) {
  const { getAllTasks, dispatch } = usePlan();
  const tasks = getThisWeekTasks(getAllTasks(), currentWeek);

  const toggleComplete = (e, taskId, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    dispatch({ type: 'SET_TASK_STATUS', payload: { taskId, status: newStatus } });
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-text-secondary mb-3">This Week's Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-text-muted">No tasks scheduled for this week.</p>
      ) : (
        <div className="space-y-1.5">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-bg-hover transition-colors group"
            >
              <button
                onClick={(e) => toggleComplete(e, task.id, task.status)}
                className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  task.status === 'completed'
                    ? 'bg-status-completed border-status-completed'
                    : 'border-border group-hover:border-text-muted'
                }`}
              >
                {task.status === 'completed' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <DomainBadge domain={task.domain} />
              <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
