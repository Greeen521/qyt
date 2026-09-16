// Pure helper: build a human-readable summary of task progress.
export function summarize(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const remaining = total - done;
  return { total, done, remaining };
}

export function summaryLabel(tasks) {
  const { total, remaining } = summarize(tasks);
  if (total === 0) return 'No tasks yet — add one below.';
  if (remaining === 0) return `All ${total} tasks done. Nice work!`;
  return `${remaining} of ${total} tasks remaining`;
}
