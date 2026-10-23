import { LENSES, blurDiscMm, blurPercentOfFrame, sameFramingDistanceMm } from '../photo-math.js';
import { formatAperture, formatDistance, formatPercent } from '../format.js';
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

const PANEL_WIDTH = 320;
const blurPx = (pct) => Math.min(20, ((pct / 100) * PANEL_WIDTH) / 2);
const BEHIND_MM = [0, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000];
const behindText = (mm) => (mm === 0 ? 'touching' : formatDistance(mm));

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
  const panel85 = createPanel('View through the 85mm');
  const panel35 = createPanel('View through the 35mm');
  const caption35 = el('figcaption');
  const view = el('div', { class: 'sim-panels' }, [
    el('figure', {}, [panel85.svg, el('figcaption', { text: '85mm' })]),
    el('figure', {}, [panel35.svg, caption35]),
  ]);
  const readout = readoutBox();
  const live = liveRegion();
  const subject = rangeControl({ label: 'Person distance (85mm)', values: numberRange(1000, 5000, 250), value: 2000, format: formatDistance, onInput: (v) => update({ subjectMm: v }) });
  const behind = rangeControl({ label: 'Background behind the person', values: BEHIND_MM, value: 4000, format: behindText, onInput: (v) => update({ behindMm: v }) });
  const mode = radioGroup({
    legend: 'Compare',
    options: [{ value: 'spot', label: 'Both from the same spot' }, { value: 'framing', label: 'Same framing (35mm steps closer)' }],
    value: 'spot',
    onChange: (v) => update({ mode: v }),
  });
  const aperture = radioGroup({
    legend: 'Aperture',
    options: [{ value: 'wide', label: 'Wide open (f/1.8 and f/1.4)' }, { value: 2.8, label: 'f/2.8' }, { value: 4, label: 'f/4' }, { value: 8, label: 'f/8' }],
    value: 'wide',
    onChange: (v) => update({ aperture: v }),
  });

  function update(patch) {
    Object.assign(state, patch);
    const r = compareBackgroundBlur(state);
    panel85.update({ pct: r.pct85, personScale: 1, backgroundScale: 1 });
    panel35.update({ pct: r.pct35, personScale: r.personScale35, backgroundScale: r.backgroundScale35 });
    caption35.textContent = `35mm at ${formatDistance(r.s35)}`;
    const lines = [
      `85mm at ${formatAperture(r.n85)}: background blur is ${formatPercent(r.pct85)} of the frame width.`,
      `35mm at ${formatAperture(r.n35)}, ${formatDistance(r.s35)} away: ${formatPercent(r.pct35)}.`,
      state.behindMm === 0
        ? 'The person stands against the background, so nothing is blurred.'
        : `The 85mm blurs the background ${r.ratio.toFixed(1)} times more.`,
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [view], controls: [mode.el, aperture.el, subject.el, behind.el], readout, live: live.el });
  update({});
}
