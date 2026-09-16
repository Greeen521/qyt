import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { createStore } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');

export function createApp({ seed } = {}) {
  const app = express();
  const store = createStore(
    seed ?? [
      { title: 'Welcome to qyt', done: true },
      { title: 'Add your first task', done: false },
    ],
  );

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/api/tasks', (_req, res) => {
    res.json(store.list());
  });

  app.post('/api/tasks', (req, res) => {
    try {
      const task = store.add(req.body?.title);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/tasks/:id', (req, res) => {
    const task = store.update(req.params.id, req.body ?? {});
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).end();
  });

  // Serve the built client in production, when available.
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  return app;
}
