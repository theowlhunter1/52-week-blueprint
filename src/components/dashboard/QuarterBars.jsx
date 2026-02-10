import { usePlan } from '../../context/PlanContext';
import { getQuarterStats } from '../../utils/weekCalculations';

const quarterMeta = [
  { id: 'q1', label: 'Q1', color: 'var(--color-q1)' },
  { id: 'q2', label: 'Q2', color: 'var(--color-q2)' },
  { id: 'q3', label: 'Q3', color: 'var(--color-q3)' },
  { id: 'q4', label: 'Q4', color: 'var(--color-q4)' },
];

export default function QuarterBars() {
  const { getAllTasks } = usePlan();
  const tasks = getAllTasks();

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
