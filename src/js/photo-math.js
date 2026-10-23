// Pure photography formulas. No DOM access. Distances in mm, times in seconds.

export const COC_MM = 0.03;
export const PIXEL_PITCH_UM = 5.97;
export const FRAME_WIDTH_MM = 36;
// A shutter speed up to 20% slower than the computed limit still counts as safe (nominal speeds are rounded).
export const SHAKE_TOLERANCE = 1.2;

export const LENSES = {
  35: { focal: 35, maxAperture: 1.4, label: '35mm f/1.4' },
  85: { focal: 85, maxAperture: 1.8, label: '85mm f/1.8' },
};

export const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
export const SHUTTERS = [
  1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15,
  1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30,
];
export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

const HALF_STOP = Math.SQRT2;

export function aperturesFor(lens) {
  return [lens.maxAperture, ...APERTURES.filter((n) => n > lens.maxAperture)];
}

export function settingsEv({ aperture, shutter, iso }) {
  return Math.log2((aperture * aperture) / shutter) - Math.log2(iso / 100);
}

// Positive = brighter than a correct exposure.
export function exposureOffset(sceneEv100, settings) {
  return sceneEv100 - settingsEv(settings);
}

export function autoShutter(sceneEv100, aperture, iso) {
  const ideal = (aperture * aperture) / 2 ** (sceneEv100 + Math.log2(iso / 100));
  const fastest = SHUTTERS[0];
  const slowest = SHUTTERS[SHUTTERS.length - 1];
  if (ideal < fastest / HALF_STOP) return { shutter: fastest, clamped: 'fast' };
  if (ideal > slowest * HALF_STOP) return { shutter: slowest, clamped: 'slow' };
  let best = fastest;
  for (const t of SHUTTERS) {
    if (Math.abs(Math.log2(t / ideal)) < Math.abs(Math.log2(best / ideal))) best = t;
  }
  return { shutter: best, clamped: 'none' };
}

export function hyperfocalMm(focalMm, aperture, coc = COC_MM) {
  return (focalMm * focalMm) / (aperture * coc) + focalMm;
}

export function depthOfField(focalMm, aperture, subjectMm, coc = COC_MM) {
  const hyperfocal = hyperfocalMm(focalMm, aperture, coc);
  const near = (subjectMm * (hyperfocal - focalMm)) / (hyperfocal + subjectMm - 2 * focalMm);
  const far = subjectMm < hyperfocal
    ? (subjectMm * (hyperfocal - focalMm)) / (hyperfocal - subjectMm)
    : Infinity;
  return { near, far, total: far - near, hyperfocal };
}

// Blur disc on the sensor for an object at objectMm when focused at subjectMm.
export function blurDiscMm(focalMm, aperture, subjectMm, objectMm) {
  return ((focalMm * focalMm) / (aperture * (subjectMm - focalMm))) * (Math.abs(objectMm - subjectMm) / objectMm);
}

export function blurPercentOfFrame(blurMm) {
  return (blurMm / FRAME_WIDTH_MM) * 100;
}

// Distance that keeps the subject the same size in the frame with another lens.
export function sameFramingDistanceMm(fromFocalMm, fromSubjectMm, toFocalMm) {
  return toFocalMm + ((fromSubjectMm - fromFocalMm) * toFocalMm) / fromFocalMm;
}

export function rule500Seconds(focalMm) {
  return 500 / focalMm;
}

// Simplified NPF rule by Frédéric Michaud (Société Astronomique du Havre).
export function npfSeconds(focalMm, aperture, pitchUm = PIXEL_PITCH_UM) {
  return (35 * aperture + 30 * pitchUm) / focalMm;
}

export function handheldLimitSeconds(focalMm, stabilizerStops = 0) {
  return (1 / focalMm) * 2 ** stabilizerStops;
}

export function slowestSafeShutter(limitSeconds) {
  const safe = SHUTTERS.filter((t) => t <= limitSeconds * SHAKE_TOLERANCE);
  return safe.length ? safe[safe.length - 1] : SHUTTERS[0];
}

export function horizontalFovDeg(focalMm) {
  return (2 * Math.atan(FRAME_WIDTH_MM / (2 * focalMm)) * 180) / Math.PI;
}
