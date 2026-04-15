import { usePlan } from '../../context/PlanContext';
import { getQuarterStats } from '../../utils/weekCalculations';

export default function QuarterBars() {
  const { state, getAllTasks } = usePlan();
  const tasks = getAllTasks();

  const quarterMeta = state.quarters.map(q => ({
    id: q.id,
    label: q.id.toUpperCase(),
    color: q.color,
  }));

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-text-secondary mb-4">Quarter Progress</h3>
      <div className="space-y-3">
        {quarterMeta.map(q => {
          const stats = getQuarterStats(tasks, q.id);
          return (
            <div key={q.id} className="flex items-center gap-3">
              <span className="text-xs font-bold w-6" style={{ color: q.color }}>{q.label}</span>
              <div className="flex-1 h-3 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%`, backgroundColor: q.color }}
                />
              </div>
              <span className="text-xs text-text-muted w-14 text-right">
                {stats.completed}/{stats.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
