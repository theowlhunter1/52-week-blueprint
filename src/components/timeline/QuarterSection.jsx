import WeekBlock from './WeekBlock';

export default function QuarterSection({ quarter, currentWeek, onTaskClick }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 sticky top-0 bg-bg-primary py-3 z-10">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: quarter.color }} />
        <h2 className="text-lg font-bold text-text-primary">{quarter.name}</h2>
        <p className="text-xs text-text-secondary">Weeks {quarter.weeks}</p>
      </div>
      <p className="text-sm text-text-secondary -mt-1 mb-2 pl-6">{quarter.theme}</p>
      <div className="space-y-2 pl-2">
        {quarter.blocks.map(block => {
          const isCurrentWeek = currentWeek >= block.week_range[0] && currentWeek <= block.week_range[1];
          return (
            <WeekBlock
              key={block.id}
              block={block}
              isCurrentWeek={isCurrentWeek}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
}
