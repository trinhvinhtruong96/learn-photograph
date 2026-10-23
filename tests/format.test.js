import { describe, expect, test } from 'vitest';
import {
  describeDepth, describeSharpZone, formatAperture, formatDistance, formatEv, formatPercent, formatSeconds,
  formatShutter,
} from '../src/js/format.js';

test.each([[1.4, 'f/1.4'], [2, 'f/2'], [16, 'f/16']])('aperture %s → %s', (n, text) => {
  expect(formatAperture(n)).toBe(text);
});
test.each([[1 / 8000, '1/8000 giây'], [1 / 250, '1/250 giây'], [1 / 2, '1/2 giây'], [1, '1 giây'], [15, '15 giây']])(
  'shutter %s → %s', (t, text) => expect(formatShutter(t)).toBe(text));
test.each([[57, '5,7 cm'], [968, '97 cm'], [1898, '1,9 m'], [7158, '7,2 m'], [12000, '12 m'], [Infinity, 'vô cực']])(
  'distance %s mm → %s', (mm, text) => expect(formatDistance(mm)).toBe(text));
test.each([[1, '+1,0 EV'], [-0.3, '\u22120,3 EV'], [0.02, '0,0 EV'], [-0.04, '0,0 EV']])(
  'EV %s → %s', (ev, text) => expect(formatEv(ev)).toBe(text));
test('seconds keep one decimal with a decimal comma', () => expect(formatSeconds(6.51)).toBe('6,5 giây'));
test('percent uses a decimal comma', () => expect(formatPercent(3.88)).toBe('3,9%'));

describe('sharp zone text', () => {
  test('finite zone', () => {
    expect(describeSharpZone({ near: 1898, far: 7158 })).toBe('Nét từ 1,9 m đến 7,2 m.');
  });
  test('zone that reaches infinity', () => {
    expect(describeSharpZone({ near: 2570, far: Infinity })).toBe('Nét từ 2,6 m đến vô cực.');
  });
  test('a very thin zone shows two decimals so the ends differ', () => {
    expect(describeSharpZone({ near: 1971.8, far: 2029.0 })).toBe('Nét từ 1,97 m đến 2,03 m.');
  });
  test('depth text never prints Infinity or NaN', () => {
    expect(describeDepth({ total: Infinity })).toBe('Độ sâu trường ảnh: mọi thứ từ giới hạn gần đến vô cực.');
    expect(describeDepth({ total: 57.2 })).toBe('Độ sâu trường ảnh: 5,7 cm.');
  });
});
