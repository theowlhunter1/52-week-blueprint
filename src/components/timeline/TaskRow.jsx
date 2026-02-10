import { usePlan } from '../../context/PlanContext';
import DomainBadge from '../task/DomainBadge';
import TaskStatusBadge from '../task/TaskStatusBadge';

export default function TaskRow({ task, onClick }) {
  const { dispatch } = usePlan();

  const toggleComplete = (e) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'not_started' : 'completed';
    dispatch({ type: 'SET_TASK_STATUS', payload: { taskId: task.id, status: newStatus } });
  };

  return (
    <div
      onClick={() => onClick(task.id)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-bg-hover group ${
        task.status === 'skipped' ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={toggleComplete}
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

      {task.custom && (
        <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-medium leading-none">Custom</span>
      )}

      <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
        {task.title}
      </span>

      <TaskStatusBadge status={task.status} />

      {task.priority === 'critical' && (
        <span className="text-red-400 text-xs">!!!</span>
      )}
      {task.priority === 'high' && (
        <span className="text-orange-400 text-xs">!!</span>
      )}
    </div>
  );
}
