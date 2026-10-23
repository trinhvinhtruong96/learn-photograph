import { expect, test } from 'vitest';
import { EDIT_STEPS, FINISHED, RAW_LOOK, editState } from '../src/js/widgets/edit-steps.js';

test('step 0 is the untouched RAW look', () => {
  expect(editState(0)).toEqual(RAW_LOOK);
});

test('the last step is fully finished', () => {
  expect(editState(EDIT_STEPS.length - 1)).toEqual(FINISHED);
});

test('steps fix things one at a time, in order', () => {
  const afterExposure = editState(2);
  expect(afterExposure.vignette).toBe(FINISHED.vignette);
  expect(afterExposure.exposure).toBe(FINISHED.exposure);
  expect(afterExposure.curve).toEqual(RAW_LOOK.curve);
  expect(afterExposure.dust).toBe(true);
});

test('every step after the first changes something different', () => {
  const fixes = EDIT_STEPS.slice(1).map((s) => s.fixes);
  expect(new Set(fixes).size).toBe(fixes.length);
});
