import { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { getCurrentWeek, getCompletionStats } from '../../utils/weekCalculations';
import ProgressRing from './ProgressRing';
import CurrentWeek from './CurrentWeek';
import QuarterBars from './QuarterBars';
import ThisWeekTasks from './ThisWeekTasks';
import OverdueList from './OverdueList';
import TaskDetailPanel from '../task/TaskDetailPanel';

export default function Dashboard() {
  const { state, getAllTasks } = usePlan();
  const [selectedTask, setSelectedTask] = useState(null);
  const currentWeek = getCurrentWeek(state.settings?.startDate);
  const tasks = getAllTasks();
  const stats = getCompletionStats(tasks);

  const domainStats = ['technical', 'strategy', 'leadership', 'credentials', 'networking', 'portfolio'].map(domain => {
    const domainTasks = tasks.filter(t => t.domain === domain);
    const s = getCompletionStats(domainTasks);
    return { domain, ...s };
  });

  const domainColors = {
    technical: 'var(--color-domain-technical)',
    strategy: 'var(--color-domain-strategy)',
    leadership: 'var(--color-domain-leadership)',
    credentials: 'var(--color-domain-credentials)',
    networking: 'var(--color-domain-networking)',
    portfolio: 'var(--color-domain-portfolio)',
  };

  const domainLabels = {
    technical: 'Technical',
    strategy: 'Strategy',
    leadership: 'Leadership',
    credentials: 'Credentials',
    networking: 'Networking',
    portfolio: 'Portfolio',
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">From $95K Head of AI to $250K+ Executive</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="bg-bg-secondary border border-border rounded-xl p-5 flex items-center justify-center relative">
          <ProgressRing percentage={stats.percentage} />
        </div>
        <CurrentWeek week={currentWeek} />
        <QuarterBars />
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl p-5 mb-5">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Domain Balance</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {domainStats.map(d => (
            <div key={d.domain} className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: domainColors[d.domain] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-primary">{domainLabels[d.domain]}</span>
                  <span className="text-xs text-text-muted">{d.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${d.percentage}%`, backgroundColor: domainColors[d.domain] }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ThisWeekTasks currentWeek={currentWeek} onTaskClick={setSelectedTask} />
        <OverdueList currentWeek={currentWeek} onTaskClick={setSelectedTask} />
      </div>

      {selectedTask && (
        <TaskDetailPanel taskId={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
