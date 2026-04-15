import { useState, useEffect, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { getCurrentWeek } from '../../utils/weekCalculations';
import { MAX_WEEK } from '../../constants/domains';
import QuarterSection from './QuarterSection';
import TaskDetailPanel from '../task/TaskDetailPanel';
import TimelineProgressBar from './TimelineProgressBar';

export default function Timeline() {
  const { state } = usePlan();
  const [selectedTask, setSelectedTask] = useState(null);
  const currentWeek = getCurrentWeek(state.settings?.startDate);
  const allBlocks = useMemo(() => state.quarters.flatMap(q => q.blocks), [state.quarters]);

  useEffect(() => {
    const el = document.getElementById('current-week');
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Timeline</h1>
          <p className="text-sm text-text-secondary mt-1">Quarterly career development plan</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-accent">Week {currentWeek}</span>
          <span className="text-sm text-text-muted ml-1">of {MAX_WEEK}</span>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm border-b border-border pb-4 mb-6">
        <TimelineProgressBar quarters={state.quarters} allBlocks={allBlocks} startDate={state.settings?.startDate} />
      </div>

      <div className="space-y-8">
        {state.quarters.map(quarter => (
          <QuarterSection
            key={quarter.id}
            quarter={quarter}
            currentWeek={currentWeek}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetailPanel taskId={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
