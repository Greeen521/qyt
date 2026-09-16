import { useEffect, useState } from 'react';
import { api } from './api.js';
import { summaryLabel } from './summary.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setTasks(await api.listTasks());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    try {
      await api.addTask(value);
      setTitle('');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onToggle(task) {
    try {
      await api.toggleTask(task.id, !task.done);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(task) {
    try {
      await api.deleteTask(task.id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>qyt</h1>
        <p className="app__subtitle">{summaryLabel(tasks)}</p>
      </header>

      <form className="task-form" onSubmit={onAdd}>
        <input
          className="task-form__input"
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="New task title"
        />
        <button className="task-form__button" type="submit">
          Add task
        </button>
      </form>

      {error && <p className="app__error" role="alert">{error}</p>}

      {loading ? (
        <p className="app__empty">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="app__empty">Nothing here yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${task.done ? 'task--done' : ''}`}>
              <label className="task__label">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => onToggle(task)}
                />
                <span className="task__title">{task.title}</span>
              </label>
              <button
                className="task__delete"
                type="button"
                onClick={() => onDelete(task)}
                aria-label={`Delete ${task.title}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
