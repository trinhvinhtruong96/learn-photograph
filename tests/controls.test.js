import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createAnnouncer } from '../src/js/widgets/controls.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('the readout written while the page loads is not announced', () => {
  const spoken = [];
  const announce = createAnnouncer((text) => spoken.push(text), 500);
  announce('Exposure 0.0 EV: correct.');
  vi.advanceTimersByTime(1000);
  expect(spoken).toEqual([]);
});

test('later changes are announced once, after the user stops dragging', () => {
  const spoken = [];
  const announce = createAnnouncer((text) => spoken.push(text), 500);
  announce('initial');
  announce('f/2');
  vi.advanceTimersByTime(200);
  announce('f/2.8');
  vi.advanceTimersByTime(500);
  expect(spoken).toEqual(['f/2.8']);
});
