const MINUS = '\u2212';

export function formatAperture(n) {
  return `f/${n}`;
}

export function formatShutter(t) {
  return t >= 1 ? `${t} s` : `1/${Math.round(1 / t)} s`;
}

export function shutterSpoken(t) {
  if (t >= 1) return `${t} ${t === 1 ? 'second' : 'seconds'}`;
  return `1/${Math.round(1 / t)} of a second`;
}

export function formatIso(iso) {
  return `ISO ${iso}`;
}

export function formatEv(ev) {
  const rounded = Math.round(ev * 10) / 10;
  if (rounded === 0) return '0.0 EV';
  return `${rounded > 0 ? '+' : MINUS}${Math.abs(rounded).toFixed(1)} EV`;
}

export function formatDistance(mm, digits = 1) {
  if (!Number.isFinite(mm)) return 'infinity';
  if (mm < 100) return `${(mm / 10).toFixed(1)} cm`;
  if (mm < 1000) return digits > 1 ? `${(mm / 10).toFixed(1)} cm` : `${Math.round(mm / 10)} cm`;
  if (mm < 10000) return `${(mm / 1000).toFixed(digits)} m`;
  return `${Math.round(mm / 1000)} m`;
}

export function formatSeconds(t) {
  return `${t.toFixed(1)} s`;
}

export function formatPercent(p) {
  return `${p.toFixed(1)}%`;
}

export function formatKelvin(k) {
  return `${k} K`;
}

export function describeSharpZone({ near, far }) {
  let from = formatDistance(near);
  let to = formatDistance(far);
  if (from === to) {
    from = formatDistance(near, 2);
    to = formatDistance(far, 2);
  }
  return `Sharp from ${from} to ${to}.`;
}

export function describeDepth({ total }) {
  return Number.isFinite(total)
    ? `Depth of field: ${formatDistance(total)}.`
    : 'Depth of field: everything from the near limit to infinity.';
}
