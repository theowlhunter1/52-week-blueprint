export function getCurrentWeek(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now - start;
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(52, diffWeeks));
}

export function getQuarterForWeek(week) {
  if (week <= 13) return 'q1';
  if (week <= 26) return 'q2';
  if (week <= 39) return 'q3';
  return 'q4';
}

export function getWeekDate(startDate, weekNumber) {
  if (!startDate) return null;
  const start = new Date(startDate);
  const date = new Date(start);
  date.setDate(date.getDate() + (weekNumber - 1) * 7);
  return date;
}

export function isOverdue(task, currentWeek) {
  return (
    task.due_week < currentWeek &&
    task.status !== 'completed' &&
    task.status !== 'skipped' &&
    task.status !== 'deferred'
  );
}

export function getCompletionStats(tasks) {
  const countable = tasks.filter(t => t.status !== 'skipped');
  const completed = countable.filter(t => t.status === 'completed');
  return {
    total: countable.length,
    completed: completed.length,
    percentage: countable.length > 0 ? Math.round((completed.length / countable.length) * 100) : 0,
  };
}

export function getQuarterStats(tasks, quarterId) {
  const quarterWeeks = {
    q1: [1, 13],
    q2: [14, 26],
    q3: [27, 39],
    q4: [40, 52],
  };
  const [start, end] = quarterWeeks[quarterId];
  const quarterTasks = tasks.filter(t => t.due_week >= start && t.due_week <= end);
  return getCompletionStats(quarterTasks);
}

export function getOverdueTasks(tasks, currentWeek) {
  return tasks
    .filter(t => isOverdue(t, currentWeek))
    .sort((a, b) => a.due_week - b.due_week);
}

export function getThisWeekTasks(tasks, currentWeek) {
  return tasks.filter(t => t.due_week === currentWeek);
}
