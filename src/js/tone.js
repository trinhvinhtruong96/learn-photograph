export const CURVE_PRESETS = {
  linear: { label: 'Straight line', blacks: 0, shadows: 0.25, mids: 0.5, highlights: 0.75 },
  contrast: { label: 'S-curve', blacks: 0, shadows: 0.18, mids: 0.5, highlights: 0.82 },
  matte: { label: 'Matte', blacks: 0.12, shadows: 0.3, mids: 0.52, highlights: 0.78 },
  shadows: { label: 'Open shadows', blacks: 0, shadows: 0.35, mids: 0.56, highlights: 0.78 },
};

export function curvePoints({ blacks, shadows, mids, highlights }) {
  return [[0, blacks], [0.25, shadows], [0.5, mids], [0.75, highlights], [1, 1]];
}

// Piecewise-linear curve sampled into a feComponentTransfer table.
export function curveTable(points, samples = 17) {
  const pts = [...points].sort((a, b) => a[0] - b[0]);
  const table = [];
  for (let i = 0; i < samples; i += 1) {
    const x = i / (samples - 1);
    let j = 0;
    while (j < pts.length - 2 && x > pts[j + 1][0]) j += 1;
    const [x0, y0] = pts[j];
    const [x1, y1] = pts[j + 1];
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    table.push(Math.min(1, Math.max(0, y0 + t * (y1 - y0))));
  }
  return table;
}

export function describeCurve(levels) {
  const table = curveTable(curvePoints(levels), 17);
  const midSlope = (table[10] - table[6]) / 0.25;
  const parts = [];
  if (midSlope > 1.1) parts.push('more contrast in the midtones');
  else if (midSlope < 0.9) parts.push('less contrast in the midtones');
  else parts.push('normal midtone contrast');
  if (levels.blacks >= 0.05) parts.push('lifted blacks give a matte look');
  if (levels.mids > 0.53) parts.push('the photo is brighter overall');
  else if (levels.mids < 0.47) parts.push('the photo is darker overall');
  return `Result: ${parts.join(', ')}.`;
}
