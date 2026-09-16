import { describe, it, expect } from 'vitest';
import { summarize, summaryLabel } from './summary.js';

describe('summarize', () => {
  it('counts totals, done, and remaining', () => {
    const tasks = [
      { id: '1', title: 'a', done: true },
      { id: '2', title: 'b', done: false },
      { id: '3', title: 'c', done: false },
    ];
    expect(summarize(tasks)).toEqual({ total: 3, done: 1, remaining: 2 });
  });

  it('handles an empty list', () => {
    expect(summarize([])).toEqual({ total: 0, done: 0, remaining: 0 });
  });
});

describe('summaryLabel', () => {
  it('prompts when empty', () => {
    expect(summaryLabel([])).toMatch(/No tasks yet/);
  });

  it('celebrates when all done', () => {
    expect(summaryLabel([{ id: '1', title: 'a', done: true }])).toMatch(/All 1 tasks done/);
  });

  it('shows remaining count', () => {
    const tasks = [
      { id: '1', title: 'a', done: true },
      { id: '2', title: 'b', done: false },
    ];
    expect(summaryLabel(tasks)).toBe('1 of 2 tasks remaining');
  });
});
