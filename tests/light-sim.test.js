import { describe, expect, test } from 'vitest';
import { CAMERA_KELVIN, lightPattern, whiteBalanceCast } from '../src/js/widgets/light-sim.js';

describe('light direction', () => {
  test.each([
    [0, 'Front light'], [20, 'Front light'], [45, '45° light'], [60, '45° light'], [90, 'Side light'],
    [120, 'Side light'], [135, 'Rim light'], [160, 'Rim light'], [180, 'Backlight'], [315, '45° light'],
  ])('light at %s° is %s', (angle, name) => expect(lightPattern(angle).name).toBe(name));
  test('the lit side follows the angle', () => {
    expect(lightPattern(90).side).toBe('right');
    expect(lightPattern(270).side).toBe('left');
    expect(lightPattern(0).side).toBe('none');
  });
  test('front light lights the whole face; backlight none of it', () => {
    expect(lightPattern(0).lit).toBeCloseTo(1, 5);
    expect(lightPattern(180).lit).toBeCloseTo(0, 5);
  });
});

describe('white balance', () => {
  test('the camera range matches the α7 II: 2500 K to 9900 K', () => {
    expect(CAMERA_KELVIN[0]).toBe(2500);
    expect(CAMERA_KELVIN.at(-1)).toBe(9900);
  });
  test('matching kelvin is neutral', () => expect(whiteBalanceCast(5500, 5500).cast).toBe('neutral'));
  test('a Daylight setting in shade looks blue', () => expect(whiteBalanceCast(9000, 5500).cast).toBe('blue'));
  test('a Daylight setting under a home bulb looks orange', () => expect(whiteBalanceCast(2700, 5500).cast).toBe('orange'));
  test('a higher camera number makes the photo warmer', () => expect(whiteBalanceCast(5500, 9900).cast).toBe('orange'));
  test('candlelight stays warm even at the 2500 K minimum', () => expect(whiteBalanceCast(1850, 2500).cast).toBe('orange'));
  test('a blue cast lowers red and raises blue', () => {
    const { tint } = whiteBalanceCast(9000, 5500);
    expect(tint.r).toBeLessThan(1);
    expect(tint.b).toBeGreaterThan(1);
  });
});
