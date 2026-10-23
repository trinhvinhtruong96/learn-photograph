import { expect, test } from 'vitest';
import { blurComparisonText, compareBackgroundBlur } from '../src/js/widgets/background-sim.js';

const base = { subjectMm: 2000, behindMm: 4000, aperture: 'wide' };

test('from the same spot, wide open, the 85mm blurs about 4.7 times more', () => {
  const r = compareBackgroundBlur({ ...base, mode: 'spot' });
  expect(r.ratio).toBeCloseTo(4.7, 1);
  expect(r.pct85).toBeCloseTo(3.88, 1);
  expect(r.personScale35).toBeCloseTo(0.4, 1);
});

test('with the same framing, the 35mm stands at 0.82 m, the person keeps its size and the 85mm blurs about 1.5 times more', () => {
  const r = compareBackgroundBlur({ ...base, mode: 'framing' });
  expect(r.s35).toBeCloseTo(823.5, 0);
  expect(r.personScale35).toBeCloseTo(1, 5);
  expect(r.ratio).toBeCloseTo(1.52, 1);
});

test('a background right behind the person gives no blur and a finite ratio', () => {
  const r = compareBackgroundBlur({ ...base, behindMm: 0, mode: 'spot' });
  expect(r.pct85).toBe(0);
  expect(r.pct35).toBe(0);
  expect(r.ratio).toBe(1);
});

test('the comparison sentence names the lens that really blurs more', () => {
  expect(blurComparisonText(4.7, 4000)).toBe('Ống 85mm làm mờ hậu cảnh gấp 4,7 lần.');
  expect(blurComparisonText(0.88, 500)).toBe('Ống 35mm làm mờ hậu cảnh gấp 1,1 lần.');
  expect(blurComparisonText(1.02, 500)).toBe('Hai ống kính làm mờ hậu cảnh gần như nhau.');
  expect(blurComparisonText(1, 0)).toBe('Người đứng sát hậu cảnh, nên không có gì bị mờ.');
});
