const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore non-JSON bodies
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listTasks: () => fetch(`${BASE}/tasks`).then(handle),
  addTask: (title) =>
    fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(handle),
  toggleTask: (id, done) =>
    fetch(`${BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    }).then(handle),
  deleteTask: (id) =>
    fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' }).then(handle),
};
