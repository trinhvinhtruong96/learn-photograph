import { expect, test } from 'vitest';
import { perspectiveCompare } from '../src/js/widgets/composition-sim.js';

test('same framing: the 85mm stands about 2.9 m away and the mountain looks about 2.35 times larger', () => {
  const r = perspectiveCompare();
  expect(r.s35).toBe(1200);
  expect(Math.abs(r.s85 - 2914)).toBeLessThan(5);
  expect(r.ratio).toBeGreaterThan(2.3);
  expect(r.ratio).toBeLessThan(2.4);
});

test('a far background grows more, relative to the person, than a near one', () => {
  expect(perspectiveCompare(50000).ratio).toBeGreaterThan(perspectiveCompare(2000).ratio);
});
