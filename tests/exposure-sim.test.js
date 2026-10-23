import { expect, test } from 'vitest';
import { computeExposure, histogramFor } from '../src/js/widgets/exposure-sim.js';

const base = { sceneEv: 12, focal: 35, mode: 'M', aperture: 2, shutter: 1 / 1000, iso: 100 };

test('f/2, 1/1000 s, ISO 100 is correct in open shade', () => {
  expect(computeExposure(base).verdict).toBe('correct');
});

test('A mode in bright sun at f/1.4 and ISO 25600 pins 1/8000 s and stays too bright', () => {
  const r = computeExposure({ ...base, sceneEv: 15, mode: 'A', aperture: 1.4, iso: 25600 });
  expect(r.shutter).toBe(1 / 8000);
  expect(r.clamped).toBe('fast');
  expect(r.verdict).toBe('too-bright');
  expect(Number.isFinite(r.offset)).toBe(true);
});

test('A mode on a dim street at f/16 picks 15 s and warns about hand shake', () => {
  const r = computeExposure({ ...base, sceneEv: 4, mode: 'A', aperture: 16 });
  expect(r.shutter).toBe(15);
  expect(r.verdict).toBe('correct');
  expect(r.shake).toBe(true);
});

test('the shake warning depends on the lens', () => {
  expect(computeExposure({ ...base, shutter: 1 / 8 }).shake).toBe(false);
  expect(computeExposure({ ...base, shutter: 1 / 4 }).shake).toBe(true);
  expect(computeExposure({ ...base, focal: 85, aperture: 1.8, shutter: 1 / 30 }).shake).toBe(false);
  expect(computeExposure({ ...base, focal: 85, aperture: 1.8, shutter: 1 / 15 }).shake).toBe(true);
});

test('slower shutter adds motion blur; wider aperture and longer lens add background blur', () => {
  expect(computeExposure({ ...base, shutter: 1 / 30 }).motionBlurPx).toBeGreaterThan(computeExposure(base).motionBlurPx);
  expect(computeExposure({ ...base, aperture: 1.4 }).backgroundBlurPx).toBeGreaterThan(computeExposure({ ...base, aperture: 16 }).backgroundBlurPx);
  expect(computeExposure({ ...base, focal: 85 }).backgroundBlurPx).toBeGreaterThan(computeExposure(base).backgroundBlurPx);
});

test('the histogram piles up at the right edge when 3 stops too bright', () => {
  const over = histogramFor(3);
  expect(over.at(-1)).toBe(Math.max(...over));
  const correct = histogramFor(0);
  expect(correct.at(-1)).toBeLessThan(0.05 * Math.max(...correct));
});
