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

/**
 * Compute adaptive start/end dates for each block, accounting for early closures.
 * Returns a Map of blockId -> { adaptiveStart, adaptiveEnd, originalStart, originalEnd }.
 */
export function getAdaptiveBlockDates(allBlocks, startDate) {
  const result = new Map();
  if (!startDate || !allBlocks || allBlocks.length === 0) return result;

  // Sort blocks by week_range start
  const sorted = [...allBlocks].sort((a, b) => a.week_range[0] - b.week_range[0]);

  let nextStart = null;

  for (const block of sorted) {
    const originalStart = getWeekDate(startDate, block.week_range[0]);
    const originalEndBase = getWeekDate(startDate, block.week_range[1]);
    const originalEnd = new Date(originalEndBase);
    originalEnd.setDate(originalEnd.getDate() + 6);

    const originalDuration = originalEnd.getTime() - originalStart.getTime();

    const adaptiveStart =
      nextStart && nextStart < originalStart ? new Date(nextStart) : new Date(originalStart);

    const adaptiveEnd = new Date(adaptiveStart.getTime() + originalDuration);

    result.set(block.id, {
      adaptiveStart,
      adaptiveEnd,
      originalStart: new Date(originalStart),
      originalEnd: new Date(originalEnd),
    });

    if (block.closed && block.closed_date) {
      const closedDate = new Date(block.closed_date);
      nextStart = new Date(closedDate);
      nextStart.setDate(nextStart.getDate() + 1);
    } else {
      nextStart = new Date(adaptiveEnd);
      nextStart.setDate(nextStart.getDate() + 1);
    }
  }

  return result;
}

/**
 * Compute schedule status based on closed blocks and time saved.
 * Returns { bufferDays, weeksAhead, closedCount, totalBlocks, label }.
 */
export function getScheduleStatus(allBlocks, startDate) {
  if (!startDate || !allBlocks || allBlocks.length === 0) {
    return { bufferDays: 0, weeksAhead: 0, closedCount: 0, totalBlocks: 0, label: 'On track' };
  }

  const totalBlocks = allBlocks.length;
  let closedCount = 0;
  let bufferDays = 0;

  for (const block of allBlocks) {
    if (block.closed && block.closed_date) {
      closedCount++;
      const originalEndBase = getWeekDate(startDate, block.week_range[1]);
      const originalEnd = new Date(originalEndBase);
      originalEnd.setDate(originalEnd.getDate() + 6);

      const closedDate = new Date(block.closed_date);
      const daysSaved = Math.floor((originalEnd - closedDate) / (24 * 60 * 60 * 1000));
      if (daysSaved > 0) {
        bufferDays += daysSaved;
      }
    }
  }

  const weeksAhead = Math.floor(bufferDays / 7);

  let label;
  if (weeksAhead >= 1) {
    label = `${weeksAhead} week${weeksAhead > 1 ? 's' : ''} ahead`;
  } else if (bufferDays > 0) {
    label = `${bufferDays} day${bufferDays > 1 ? 's' : ''} ahead`;
  } else {
    label = 'On track';
  }

  return { bufferDays, weeksAhead, closedCount, totalBlocks, label };
}
