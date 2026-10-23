import { describe, expect, test } from 'vitest';
import {
  LENSES, aperturesFor, autoShutter, blurDiscMm, blurPercentOfFrame, depthOfField, exposureOffset,
  handheldLimitSeconds, horizontalFovDeg, hyperfocalMm, npfSeconds, rule500Seconds,
  sameFramingDistanceMm, settingsEv, slowestSafeShutter,
} from '../src/js/photo-math.js';

const near = (actual, expected, pct = 1) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.abs(expected) * (pct / 100));

describe('exposure value', () => {
  test('f/16, 1/125 s, ISO 100 is EV 15 (sunny 16)', () => {
    near(settingsEv({ aperture: 16, shutter: 1 / 125, iso: 100 }), 15);
  });
  test('equivalent exposures land within 0.1 EV of each other', () => {
    const evs = [[2.8, 1 / 500], [4, 1 / 250], [5.6, 1 / 125]].map(([aperture, shutter]) =>
      settingsEv({ aperture, shutter, iso: 100 }));
    expect(Math.max(...evs) - Math.min(...evs)).toBeLessThan(0.1);
  });
  test('doubling ISO needs one stop less light', () => {
    const base = settingsEv({ aperture: 4, shutter: 1 / 250, iso: 100 });
    near(settingsEv({ aperture: 4, shutter: 1 / 250, iso: 200 }), base - 1);
  });
  test('positive offset means too bright: f/2, 1/250 s, ISO 200 in open shade is 3 stops over', () => {
    near(exposureOffset(12, { aperture: 2, shutter: 1 / 250, iso: 200 }), 3, 2);
  });
  test('open shade example f/2, 1/1000 s, ISO 100 is correct', () => {
    expect(Math.abs(exposureOffset(12, { aperture: 2, shutter: 1 / 1000, iso: 100 }))).toBeLessThan(0.1);
  });
});

describe('aperture priority (A mode)', () => {
  test('picks the nearest full-stop shutter speed', () => {
    expect(autoShutter(12, 2, 100)).toEqual({ shutter: 1 / 1000, clamped: 'none' });
  });
  test('dim street at f/16, ISO 100 needs about 15 s', () => {
    expect(autoShutter(4, 16, 100)).toEqual({ shutter: 15, clamped: 'none' });
  });
  test('pins to 1/8000 s when even that lets in too much light', () => {
    expect(autoShutter(15, 1.4, 25600)).toEqual({ shutter: 1 / 8000, clamped: 'fast' });
  });
  test('pins to 30 s when even that is too short', () => {
    expect(autoShutter(-4, 16, 100)).toEqual({ shutter: 30, clamped: 'slow' });
  });
});

describe('depth of field', () => {
  test('hyperfocal distance for 35mm at f/8', () => near(hyperfocalMm(35, 8), 5139));
  test('35mm f/8 focused at 3 m', () => {
    const d = depthOfField(35, 8, 3000);
    near(d.near, 1898);
    near(d.far, 7158);
  });
  test('85mm f/1.8 focused at 2 m keeps about 5.7 cm sharp', () => {
    const d = depthOfField(85, 1.8, 2000);
    near(d.near, 1972);
    near(d.far, 2029);
    near(d.total, 57.2, 3);
  });
  test('35mm f/1.4 focused at 1 m', () => {
    const d = depthOfField(35, 1.4, 1000);
    near(d.near, 968);
    near(d.far, 1034);
  });
  test('focused at the hyperfocal distance, sharpness runs from half of it to infinity', () => {
    const h = hyperfocalMm(35, 8);
    const d = depthOfField(35, 8, h);
    near(d.near, h / 2);
    expect(d.far).toBe(Infinity);
  });
  test('focused beyond the hyperfocal distance, far limit and total are infinite', () => {
    const d = depthOfField(35, 8, 6000);
    expect(d.far).toBe(Infinity);
    expect(d.total).toBe(Infinity);
    expect(d.near).toBeLessThan(6000);
  });
});

describe('background blur', () => {
  test('85mm f/1.8, subject 2 m, background 6 m', () => {
    near(blurDiscMm(85, 1.8, 2000, 6000), 1.397);
    near(blurPercentOfFrame(blurDiscMm(85, 1.8, 2000, 6000)), 3.88);
  });
  test('35mm f/1.4 from the same spot', () => near(blurDiscMm(35, 1.4, 2000, 6000), 0.297));
  test('same framing with the 35mm means 0.82 m away and about 1.5 times less blur', () => {
    const s35 = sameFramingDistanceMm(85, 2000, 35);
    near(s35, 823.5);
    near(blurDiscMm(85, 1.8, 2000, 6000) / blurDiscMm(35, 1.4, s35, s35 + 4000), 1.52, 2);
  });
  test('an object at the focus distance has no blur', () => expect(blurDiscMm(85, 1.8, 2000, 2000)).toBe(0));
});

describe('star and handheld limits', () => {
  test('NPF for 35mm at f/1.4 and f/2', () => {
    near(npfSeconds(35, 1.4), 6.51);
    near(npfSeconds(35, 2), 7.11);
  });
  test('500 rule for 35mm', () => near(rule500Seconds(35), 14.29));
  test('handheld limit doubles per stabilizer stop', () => {
    near(handheldLimitSeconds(85), 1 / 85);
    near(handheldLimitSeconds(35, 2), 4 / 35);
  });
  test('slowest safe full-stop shutter speeds', () => {
    expect(slowestSafeShutter(handheldLimitSeconds(35, 2))).toBe(1 / 8);
    expect(slowestSafeShutter(handheldLimitSeconds(85, 2))).toBe(1 / 30);
    expect(slowestSafeShutter(handheldLimitSeconds(85, 0))).toBe(1 / 125);
  });
  test('horizontal field of view', () => {
    near(horizontalFovDeg(35), 54.43);
    near(horizontalFovDeg(85), 23.91);
  });
});

describe('lens apertures', () => {
  test('each lens starts at its widest aperture and ends at f/16', () => {
    expect(aperturesFor(LENSES[35])).toEqual([1.4, 2, 2.8, 4, 5.6, 8, 11, 16]);
    expect(aperturesFor(LENSES[85])).toEqual([1.8, 2, 2.8, 4, 5.6, 8, 11, 16]);
  });
});
