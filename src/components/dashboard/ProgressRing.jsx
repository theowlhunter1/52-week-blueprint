export default function ProgressRing({ percentage }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="160" height="160" className="-rotate-90">
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth="10"
        />
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-accent">{percentage}%</span>
        <span className="text-xs text-text-muted">Complete</span>
      </div>
    </div>
  );
}
