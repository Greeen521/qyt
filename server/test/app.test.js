import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

function freshApp() {
  return createApp({ seed: [] });
}

test('GET /api/health returns ok', async () => {
  const res = await request(freshApp()).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('tasks start empty with an empty seed', async () => {
  const res = await request(freshApp()).get('/api/tasks');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
});

test('POST /api/tasks creates a task', async () => {
  const app = freshApp();
  const res = await request(app).post('/api/tasks').send({ title: 'Buy milk' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Buy milk');
  assert.equal(res.body.done, false);
  assert.ok(res.body.id);

  const list = await request(app).get('/api/tasks');
  assert.equal(list.body.length, 1);
});

test('POST /api/tasks rejects an empty title', async () => {
  const res = await request(freshApp()).post('/api/tasks').send({ title: '   ' });
  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});

test('PATCH /api/tasks/:id toggles done', async () => {
  const app = freshApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Walk dog' });
  const id = created.body.id;

  const patched = await request(app).patch(`/api/tasks/${id}`).send({ done: true });
  assert.equal(patched.status, 200);
  assert.equal(patched.body.done, true);
});

test('PATCH unknown id returns 404', async () => {
  const res = await request(freshApp()).patch('/api/tasks/does-not-exist').send({ done: true });
  assert.equal(res.status, 404);
});

test('DELETE /api/tasks/:id removes a task', async () => {
  const app = freshApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Temporary' });
  const id = created.body.id;

  const del = await request(app).delete(`/api/tasks/${id}`);
  assert.equal(del.status, 204);

  const list = await request(app).get('/api/tasks');
  assert.equal(list.body.length, 0);
});
