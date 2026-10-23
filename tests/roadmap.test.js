import { expect, test } from 'vitest';
import { STAGES, getStage, stageNeighbors, weeksLabel } from '../src/data/roadmap.js';

test('stage ids are unique', () => {
  expect(new Set(STAGES.map((s) => s.id)).size).toBe(STAGES.length);
});

test('every stage has 3 to 5 complete practice tasks with unique ids', () => {
  for (const stage of STAGES) {
    expect(stage.assignments.length).toBeGreaterThanOrEqual(3);
    expect(stage.assignments.length).toBeLessThanOrEqual(5);
    expect(new Set(stage.assignments.map((a) => a.id)).size).toBe(stage.assignments.length);
    for (const a of stage.assignments) {
      expect(a.title && a.task && a.check).toBeTruthy();
    }
  }
});

test('neighbors follow roadmap order', () => {
  expect(stageNeighbors('exposure').prev).toBeNull();
  expect(stageNeighbors('exposure').next.id).toBe('focus');
  expect(stageNeighbors('advanced-editing').next.id).toBe('portrait');
  expect(stageNeighbors('your-eye').next).toBeNull();
  expect(stageNeighbors('nope')).toEqual({ prev: null, next: null });
});

test('week labels', () => {
  expect(weeksLabel('1–2')).toBe('Tuần 1–2');
  expect(weeksLabel('11')).toBe('Tuần 11');
});

test('unknown stage ids return undefined', () => {
  expect(getStage('nope')).toBeUndefined();
});
