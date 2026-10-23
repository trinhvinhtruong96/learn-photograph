import { expect, test } from 'vitest';
import { starReadout } from '../src/js/widgets/night-sim.js';

test('wide open, the 500 rule allows a longer time and leaves trails', () => {
  const [npfLine, ruleLine] = starReadout(35, 1.4);
  expect(npfLine).toBe('Sao: quy tắc NPF cho 6,5 giây ở f/1.4.');
  expect(ruleLine).toBe('Quy tắc 500 cho 14,3 giây, dài hơn 2,2 lần, nên sao bị kéo thành vệt ngắn.');
});

test('stopped down to f/16 the NPF time is longer, so the readout never claims the 500 rule smears', () => {
  const lines = starReadout(35, 16);
  expect(lines.join(' ')).not.toContain('vệt');
  expect(lines[1]).toBe('Quy tắc 500 cho 14,3 giây. Ở khẩu độ này, thời gian NPF bằng hoặc dài hơn, nên hãy dùng thời gian ngắn hơn: 14,3 giây.');
});
