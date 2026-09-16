import { randomUUID } from 'node:crypto';

// Simple in-memory task store. Swap for a real database later.
export function createStore(seed = []) {
  const tasks = new Map();

  for (const task of seed) {
    const id = task.id ?? randomUUID();
    tasks.set(id, { id, title: task.title, done: Boolean(task.done), createdAt: task.createdAt ?? Date.now() });
  }

  return {
    list() {
      return [...tasks.values()].sort((a, b) => a.createdAt - b.createdAt);
    },
    add(title) {
      const trimmed = String(title ?? '').trim();
      if (!trimmed) {
        throw new Error('Task title is required');
      }
      const task = { id: randomUUID(), title: trimmed, done: false, createdAt: Date.now() };
      tasks.set(task.id, task);
      return task;
    },
    update(id, patch) {
      const task = tasks.get(id);
      if (!task) {
        return null;
      }
      if (typeof patch.title === 'string' && patch.title.trim()) {
        task.title = patch.title.trim();
      }
      if (typeof patch.done === 'boolean') {
        task.done = patch.done;
      }
      tasks.set(id, task);
      return task;
    },
    remove(id) {
      return tasks.delete(id);
    },
  };
}
