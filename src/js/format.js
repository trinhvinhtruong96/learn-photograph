// Display strings in Vietnamese: decimal comma, "giây" for seconds. f-numbers keep the dot, as printed on the camera.
const MINUS = '\u2212';

const decimal = (value, digits) => value.toFixed(digits).replace('.', ',');

export function formatDecimal(value, digits = 1) {
  return decimal(value, digits);
}

export function formatAperture(n) {
  return `f/${n}`;
}

export function formatShutter(t) {
  return t >= 1 ? `${t} giây` : `1/${Math.round(1 / t)} giây`;
}

export function formatIso(iso) {
  return `ISO ${iso}`;
}

export function formatEv(ev) {
  const rounded = Math.round(ev * 10) / 10;
  if (rounded === 0) return '0,0 EV';
  return `${rounded > 0 ? '+' : MINUS}${decimal(Math.abs(rounded), 1)} EV`;
}

export function formatDistance(mm, digits = 1) {
  if (!Number.isFinite(mm)) return 'vô cực';
  if (mm < 100) return `${decimal(mm / 10, 1)} cm`;
  if (mm < 1000) return digits > 1 ? `${decimal(mm / 10, 1)} cm` : `${Math.round(mm / 10)} cm`;
  if (mm < 10000) return `${decimal(mm / 1000, digits)} m`;
  return `${Math.round(mm / 1000)} m`;
}

export function formatSeconds(t) {
  return `${decimal(t, 1)} giây`;
}

export function formatPercent(p) {
  return `${decimal(p, 1)}%`;
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
  return `Nét từ ${from} đến ${to}.`;
}

export function describeDepth({ total }) {
  return Number.isFinite(total)
    ? `Độ sâu trường ảnh: ${formatDistance(total)}.`
    : 'Độ sâu trường ảnh: mọi thứ từ giới hạn gần đến vô cực.';
}
