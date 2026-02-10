import { useState } from 'react';
import TaskRow from './TaskRow';

export default function WeekBlock({ block, isCurrentWeek, onTaskClick }) {
  const [expanded, setExpanded] = useState(isCurrentWeek);
  const completedCount = block.tasks.filter(t => t.status === 'completed').length;

  return (
    <div
      id={isCurrentWeek ? 'current-week' : undefined}
      className={`rounded-xl border transition-colors ${
        isCurrentWeek ? 'border-accent/50 bg-accent/5' : 'border-border bg-bg-secondary'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
      >
        <svg
          className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        <span className="font-medium text-sm text-text-primary flex-1">{block.title}</span>

        {isCurrentWeek && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">Current</span>
        )}

        <span className="text-xs text-text-muted">
          {completedCount}/{block.tasks.length}
        </span>

        <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-status-completed rounded-full transition-all"
            style={{ width: `${block.tasks.length > 0 ? (completedCount / block.tasks.length) * 100 : 0}%` }}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-0.5">
          {block.tasks.map(task => (
            <TaskRow key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      )}
    </div>
  );
}
