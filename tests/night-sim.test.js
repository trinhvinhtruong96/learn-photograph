import { expect, test } from 'vitest';
import { starReadout } from '../src/js/widgets/night-sim.js';

test('wide open, the 500 rule allows a longer time and leaves trails', () => {
  const [npfLine, ruleLine] = starReadout(35, 1.4);
  expect(npfLine).toBe('Stars: the NPF rule says 6.5 s at f/1.4.');
  expect(ruleLine).toBe('The 500 rule says 14.3 s, 2.2 times longer, so stars smear into short lines.');
});

test('stopped down to f/16 the NPF time is longer, so the readout never claims the 500 rule smears', () => {
  const lines = starReadout(35, 16);
  expect(lines.join(' ')).not.toContain('smear');
  expect(lines[1]).toBe('The 500 rule says 14.3 s. At this aperture the NPF time is about the same or longer, so use the shorter one: 14.3 s.');
});
