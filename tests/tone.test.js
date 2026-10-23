import { expect, test } from 'vitest';
import { CURVE_PRESETS, curvePoints, curveTable, describeCurve } from '../src/js/tone.js';

test('straight line gives an identity table', () => {
  curveTable(curvePoints(CURVE_PRESETS.linear)).forEach((v, i) => expect(v).toBeCloseTo(i / 16, 5));
});
test('S-curve darkens shadows and brightens highlights', () => {
  const table = curveTable(curvePoints(CURVE_PRESETS.contrast));
  expect(table[4]).toBeCloseTo(0.18, 5);
  expect(table[12]).toBeCloseTo(0.82, 5);
});
test('values outside 0 to 1 are clamped', () => {
  const table = curveTable([[0, -0.2], [1, 1.3]]);
  expect(Math.min(...table)).toBe(0);
  expect(Math.max(...table)).toBe(1);
});
test('describes contrast and matte looks', () => {
  expect(describeCurve(CURVE_PRESETS.contrast)).toContain('tăng tương phản');
  expect(describeCurve(CURVE_PRESETS.matte)).toContain('matte');
  expect(describeCurve(CURVE_PRESETS.linear)).toContain('bình thường');
});
