import { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { getWeekDate } from '../../utils/weekCalculations';
import TaskRow from './TaskRow';

const domains = ['technical', 'strategy', 'leadership', 'credentials', 'networking', 'portfolio'];

function formatShortDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WeekBlock({ block, isCurrentWeek, onTaskClick }) {
  const { state, dispatch } = usePlan();
  const startDate = state.settings?.startDate;
  const [expanded, setExpanded] = useState(isCurrentWeek);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('technical');
  const completedCount = block.tasks.filter(t => t.status === 'completed').length;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    dispatch({
      type: 'ADD_TASK',
      payload: {
        blockId: block.id,
        task: {
          title: newTitle.trim(),
          domain: newDomain,
          description: '',
          priority: 'normal',
          due_week: block.week_range[1],
        },
      },
    });
    setNewTitle('');
    setNewDomain('technical');
    setShowAddForm(false);
  };

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

        <span className="font-medium text-sm text-text-primary flex-1">
          {block.title}
          {startDate && (() => {
            const rangeStart = getWeekDate(startDate, block.week_range[0]);
            const rangeEnd = getWeekDate(startDate, block.week_range[1]);
            if (rangeEnd) rangeEnd.setDate(rangeEnd.getDate() + 6);
            return rangeStart && rangeEnd ? (
              <span className="text-[11px] text-text-muted font-normal ml-2">
                {formatShortDate(rangeStart)} – {formatShortDate(rangeEnd)}
              </span>
            ) : null;
          })()}
        </span>

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

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-text-muted hover:text-accent hover:bg-bg-hover transition-colors text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="px-4 py-3 rounded-lg bg-bg-tertiary border border-border space-y-2">
              <input
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full text-sm bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newDomain}
                  onChange={e => setNewDomain(e.target.value)}
                  className="text-xs bg-bg-secondary border border-border rounded-lg px-2 py-1 text-text-primary focus:outline-none focus:border-accent"
                >
                  {domains.map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewTitle(''); }}
                  className="text-xs px-3 py-1 rounded-lg border border-border text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="text-xs px-3 py-1 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
