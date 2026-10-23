import { describe, expect, test } from 'vitest';
import { PROGRESS_KEY, createProgressStore } from '../src/js/progress.js';

const STAGES = [
  { id: 'a', assignments: [{ id: 'a1' }, { id: 'a2' }] },
  { id: 'b', assignments: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }, { id: 'b4' }] },
  { id: 'empty', assignments: [] },
];

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

function throwingStorage() {
  const fail = () => { throw new DOMException('blocked', 'SecurityError'); };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

describe('progress store', () => {
  test('starts empty', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    expect(store.stageStats('a')).toEqual({ done: 0, total: 2, percent: 0, status: 'not-started' });
  });

  test('saves ticks and a new store reads them back', () => {
    const storage = memoryStorage();
    createProgressStore(storage, STAGES).setDone('a', 'a1', true);
    const reloaded = createProgressStore(storage, STAGES);
    expect(reloaded.isDone('a', 'a1')).toBe(true);
    expect(JSON.parse(storage.data.get(PROGRESS_KEY))).toEqual({ a: ['a1'] });
  });

  test('status moves from not started to in progress to done, and back', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    store.setDone('a', 'a1', true);
    expect(store.stageStats('a').status).toBe('in-progress');
    store.setDone('a', 'a2', true);
    expect(store.stageStats('a')).toEqual({ done: 2, total: 2, percent: 100, status: 'done' });
    store.setDone('a', 'a2', false);
    store.setDone('a', 'a1', false);
    expect(store.stageStats('a').status).toBe('not-started');
  });

  test('overall counts every task across stages', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    store.setDone('a', 'a1', true);
    store.setDone('a', 'a2', true);
    store.setDone('b', 'b1', true);
    expect(store.overallStats()).toEqual({ done: 3, total: 6, percent: 50, status: 'in-progress' });
  });

  test('corrupt JSON is treated as empty and overwritten on the next save', () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: '{not json' });
    const store = createProgressStore(storage, STAGES);
    expect(store.overallStats().done).toBe(0);
    store.setDone('b', 'b2', true);
    expect(JSON.parse(storage.data.get(PROGRESS_KEY))).toEqual({ b: ['b2'] });
  });

  test('wrong shapes, unknown stages, stale and duplicate ids are ignored', () => {
    const saved = { a: ['a1', 'old-task', 'a1', 7], zzz: ['x'], b: 'nope' };
    const store = createProgressStore(memoryStorage({ [PROGRESS_KEY]: JSON.stringify(saved) }), STAGES);
    expect(store.stageStats('a')).toEqual({ done: 1, total: 2, percent: 50, status: 'in-progress' });
    expect(store.stageStats('b').done).toBe(0);
  });

  test('an array saved at the top level is treated as empty', () => {
    const store = createProgressStore(memoryStorage({ [PROGRESS_KEY]: '["a1"]' }), STAGES);
    expect(store.overallStats().done).toBe(0);
  });

  test('blocked storage never throws and keeps ticks for the session', () => {
    const store = createProgressStore(throwingStorage(), STAGES);
    store.setDone('a', 'a1', true);
    expect(store.isDone('a', 'a1')).toBe(true);
    expect(() => store.reset()).not.toThrow();
    expect(store.isDone('a', 'a1')).toBe(false);
  });

  test('missing storage works in memory', () => {
    const store = createProgressStore(null, STAGES);
    store.setDone('b', 'b4', true);
    expect(store.stageStats('b').done).toBe(1);
  });

  test('a stage with no tasks reports 0% and does not break the overall total', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    expect(store.stageStats('empty')).toEqual({ done: 0, total: 0, percent: 0, status: 'not-started' });
    expect(store.overallStats().total).toBe(6);
  });

  test('unknown ids are a programming error', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    expect(() => store.setDone('a', 'nope', true)).toThrow('Unknown assignment "a/nope"');
  });

  test('reset clears memory and storage', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage, STAGES);
    store.setDone('a', 'a1', true);
    store.reset();
    expect(store.overallStats().done).toBe(0);
    expect(storage.data.has(PROGRESS_KEY)).toBe(false);
  });
});
