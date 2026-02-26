import { getCompletionStats, getScheduleStatus } from '../../utils/weekCalculations';

export default function TimelineProgressBar({ quarters, allBlocks, startDate }) {
  const quarterStats = quarters.map(q => {
    const tasks = q.blocks.flatMap(b => b.tasks);
    const stats = getCompletionStats(tasks);
    return { ...stats, color: q.color, name: q.id.toUpperCase() };
  });

  const totalTasks = quarterStats.reduce((sum, s) => sum + s.total, 0);
  const totalCompleted = quarterStats.reduce((sum, s) => sum + s.completed, 0);
  const totalPct = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const schedule = getScheduleStatus(allBlocks, startDate);

  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-bg-secondary">
        {quarterStats.map((qs, i) => {
          const segmentWidth = totalTasks > 0 ? (qs.total / totalTasks) * 100 : 25;
          const fillWidth = qs.total > 0 ? (qs.completed / qs.total) * 100 : 0;
          return (
            <div
              key={qs.name}
              className="relative h-full"
              style={{ width: `${segmentWidth}%` }}
            >
              <div
                className={`h-full ${i === 0 ? 'rounded-l-full' : ''} ${i === quarterStats.length - 1 ? 'rounded-r-full' : ''}`}
                style={{ width: `${fillWidth}%`, backgroundColor: qs.color }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-text-secondary">
          {totalCompleted}/{totalTasks} tasks ({totalPct}%)
        </span>
        <span className="text-sm text-text-muted">
          {schedule.label} &middot; {schedule.closedCount}/{schedule.totalBlocks} blocks closed
        </span>
      </div>
    </div>
  );
}
