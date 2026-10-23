import { LENSES, blurDiscMm, blurPercentOfFrame, sameFramingDistanceMm } from '../photo-math.js';
import { formatAperture, formatDecimal, formatDistance, formatPercent } from '../format.js';
import { el, svgEl, uid } from '../dom.js';
import { liveRegion, numberRange, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

const magnification = (focal, distanceMm) => focal / (distanceMm - focal);

export function compareBackgroundBlur({ subjectMm, behindMm, mode, aperture }) {
  const n85 = aperture === 'wide' ? LENSES[85].maxAperture : aperture;
  const n35 = aperture === 'wide' ? LENSES[35].maxAperture : aperture;
  const s35 = mode === 'framing' ? sameFramingDistanceMm(85, subjectMm, 35) : subjectMm;
  const b85 = blurDiscMm(85, n85, subjectMm, subjectMm + behindMm);
  const b35 = blurDiscMm(35, n35, s35, s35 + behindMm);
  return {
    s35,
    n85,
    n35,
    pct85: blurPercentOfFrame(b85),
    pct35: blurPercentOfFrame(b35),
    ratio: b35 === 0 ? 1 : b85 / b35,
    personScale35: magnification(35, s35) / magnification(85, subjectMm),
    backgroundScale35: magnification(35, s35 + behindMm) / magnification(85, subjectMm + behindMm),
  };
}

// Ratios within 5% of 1 read as "about the same"; below that, the 35mm is the one that blurs more.
export function blurComparisonText(ratio, behindMm) {
  if (behindMm === 0) return 'Người đứng sát hậu cảnh, nên không có gì bị mờ.';
  if (ratio > 1.05) return `Ống 85mm làm mờ hậu cảnh gấp ${formatDecimal(ratio)} lần.`;
  if (ratio < 0.95) return `Ống 35mm làm mờ hậu cảnh gấp ${formatDecimal(1 / ratio)} lần.`;
  return 'Hai ống kính làm mờ hậu cảnh gần như nhau.';
}

const PANEL_WIDTH = 320;
const blurPx = (pct) => Math.min(20, ((pct / 100) * PANEL_WIDTH) / 2);
const BEHIND_MM = [0, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000];
const behindText = (mm) => (mm === 0 ? 'sát người' : formatDistance(mm));

function createPanel(label) {
  const id = uid('bg');
  const svg = svgEl('svg', { viewBox: '0 0 320 240', role: 'img', 'aria-label': label });
  const tile = (dx) => `
    <g transform="translate(${dx} 0)">
      <rect x="0" y="90" width="70" height="90" fill="#6f7a8f"/><rect x="80" y="70" width="60" height="110" fill="#7c879c"/>
      <rect x="150" y="100" width="80" height="80" fill="#6a7488"/><rect x="240" y="80" width="70" height="100" fill="#7c879c"/>
      <circle cx="40" cy="160" r="24" fill="#4f7a5a"/><circle cx="200" cy="165" r="20" fill="#4f7a5a"/>
      <circle cx="120" cy="130" r="6" fill="#ffe2a6"/><circle cx="280" cy="120" r="6" fill="#ffe2a6"/>
    </g>`;
  svg.innerHTML = `
    <defs><filter id="${id}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur data-blur stdDeviation="0"/></filter></defs>
    <rect width="320" height="240" fill="#cfd9e3"/>
    <rect y="180" width="320" height="60" fill="#8f9a7a"/>
    <g filter="url(#${id}-blur)">
      <g data-bg-scale>${tile(-320)}${tile(0)}${tile(320)}<rect x="-400" y="180" width="1120" height="60" fill="#8f9a7a"/></g>
    </g>
    <g data-person>
      <path d="M136 240 L140 175 L180 175 L184 240 Z" fill="#2b2d3a"/>
      <path d="M126 178 Q130 128 160 122 Q190 128 194 178 Z" fill="#c2563d"/>
      <circle cx="160" cy="100" r="22" fill="#e0b48f"/>
      <path d="M138 98 Q140 74 160 76 Q180 74 182 98 Q174 86 160 87 Q146 86 138 98 Z" fill="#2a1d18"/>
    </g>`;
  const blur = svg.querySelector('[data-blur]');
  const background = svg.querySelector('[data-bg-scale]');
  const person = svg.querySelector('[data-person]');
  return {
    svg,
    update({ pct, personScale, backgroundScale }) {
      blur.setAttribute('stdDeviation', String(blurPx(pct)));
      background.setAttribute('transform', `translate(160 180) scale(${backgroundScale}) translate(-160 -180)`);
      person.setAttribute('transform', `translate(160 240) scale(${personScale}) translate(-160 -240)`);
    },
  };
}

export function mount(host) {
  const state = { subjectMm: 2000, behindMm: 4000, mode: 'spot', aperture: 'wide' };
  const panel85 = createPanel('Khung hình qua ống 85mm');
  const panel35 = createPanel('Khung hình qua ống 35mm');
  const caption35 = el('figcaption');
  const view = el('div', { class: 'sim-panels' }, [
    el('figure', {}, [panel85.svg, el('figcaption', { text: 'Ống 85mm' })]),
    el('figure', {}, [panel35.svg, caption35]),
  ]);
  const readout = readoutBox();
  const live = liveRegion();
  const subject = rangeControl({ label: 'Khoảng cách tới người (85mm)', values: numberRange(1000, 5000, 250), value: 2000, format: formatDistance, onInput: (v) => update({ subjectMm: v }) });
  const behind = rangeControl({ label: 'Hậu cảnh phía sau người', values: BEHIND_MM, value: 4000, format: behindText, onInput: (v) => update({ behindMm: v }) });
  const mode = radioGroup({
    legend: 'So sánh',
    options: [{ value: 'spot', label: 'Cả hai đứng cùng một chỗ' }, { value: 'framing', label: 'Cùng khung hình (ống 35mm bước lại gần)' }],
    value: 'spot',
    onChange: (v) => update({ mode: v }),
  });
  const aperture = radioGroup({
    legend: 'Khẩu độ',
    options: [{ value: 'wide', label: 'Mở tối đa (f/1.8 và f/1.4)' }, { value: 2.8, label: 'f/2.8' }, { value: 4, label: 'f/4' }, { value: 8, label: 'f/8' }],
    value: 'wide',
    onChange: (v) => update({ aperture: v }),
  });

  function update(patch) {
    Object.assign(state, patch);
    const r = compareBackgroundBlur(state);
    panel85.update({ pct: r.pct85, personScale: 1, backgroundScale: 1 });
    panel35.update({ pct: r.pct35, personScale: r.personScale35, backgroundScale: r.backgroundScale35 });
    caption35.textContent = `Ống 35mm cách ${formatDistance(r.s35)}`;
    const lines = [
      `Ống 85mm ở ${formatAperture(r.n85)}: vệt mờ hậu cảnh rộng bằng ${formatPercent(r.pct85)} bề ngang khung hình.`,
      `Ống 35mm ở ${formatAperture(r.n35)}, cách ${formatDistance(r.s35)}: ${formatPercent(r.pct35)}.`,
      blurComparisonText(r.ratio, state.behindMm),
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [view], controls: [mode.el, aperture.el, subject.el, behind.el], readout, live: live.el });
  update({});
}
