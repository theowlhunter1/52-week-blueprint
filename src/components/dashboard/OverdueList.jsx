import { usePlan } from '../../context/PlanContext';
import { getOverdueTasks } from '../../utils/weekCalculations';
import DomainBadge from '../task/DomainBadge';

export default function OverdueList({ currentWeek, onTaskClick }) {
  const { getAllTasks } = usePlan();
  const overdue = getOverdueTasks(getAllTasks(), currentWeek);

  if (overdue.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Overdue Tasks</h3>
        <p className="text-sm text-text-muted">No overdue tasks. You're on track!</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-red-900/30 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-red-400">Overdue Tasks</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
          {overdue.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {overdue.map(task => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-bg-hover transition-colors"
          >
            <DomainBadge domain={task.domain} />
            <span className="flex-1 text-sm text-text-primary truncate">{task.title}</span>
            <span className="text-[10px] text-red-400 whitespace-nowrap">
              Week {task.due_week} ({currentWeek - task.due_week}w late)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
