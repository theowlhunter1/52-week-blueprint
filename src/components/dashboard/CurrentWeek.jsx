export default function CurrentWeek({ week }) {
  const progress = Math.round((week / 52) * 100);
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-bold text-accent">{week}</span>
        <span className="text-sm text-text-muted">of 52 weeks</span>
      </div>
      <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-text-muted mt-2">{progress}% of the year elapsed</p>
    </div>
  );
}
