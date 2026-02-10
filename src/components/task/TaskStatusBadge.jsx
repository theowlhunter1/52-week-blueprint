const statusConfig = {
  not_started: { label: 'Not Started', class: 'bg-status-not-started/20 text-status-not-started' },
  in_progress: { label: 'In Progress', class: 'bg-status-in-progress/20 text-status-in-progress' },
  completed: { label: 'Completed', class: 'bg-status-completed/20 text-status-completed' },
  skipped: { label: 'Skipped', class: 'bg-status-skipped/20 text-status-skipped line-through' },
  deferred: { label: 'Deferred', class: 'bg-status-deferred/20 text-status-deferred' },
};

export default function TaskStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.not_started;
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}
