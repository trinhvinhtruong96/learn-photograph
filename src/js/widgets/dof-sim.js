import { LENSES, aperturesFor, blurDiscMm, blurPercentOfFrame, depthOfField } from '../photo-math.js';
import { describeDepth, describeSharpZone, formatAperture, formatDistance } from '../format.js';
import { svgEl, uid } from '../dom.js';
import { liveRegion, numberRange, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

const DISTANCES_MM = [...numberRange(500, 2000, 100), ...numberRange(2500, 10000, 500)];
const AXIS_MAX_MM = 12000;
const X0 = 70;
const X1 = 610;
const xFor = (mm) => X0 + (Math.min(mm, AXIS_MAX_MM) / AXIS_MAX_MM) * (X1 - X0);
const blurPx = (focal, aperture, subjectMm, objectMm) =>
  Math.min(20, ((blurPercentOfFrame(blurDiscMm(focal, aperture, subjectMm, objectMm)) / 100) * 640) / 2);

function createSideView() {
  const svg = svgEl('svg', { viewBox: '0 0 640 150', class: 'sim-diagram', 'aria-hidden': 'true' });
  const zone = svgEl('rect', { class: 'd-zone', y: 40, height: 60 });
  const subject = svgEl('g');
  const nearLabel = svgEl('text', { y: 30, 'text-anchor': 'middle' });
  const farLabel = svgEl('text', { y: 30, 'text-anchor': 'middle' });
  const ticks = [0, 2, 4, 6, 8, 10, 12].map((m) => svgEl('g', {}, [
    svgEl('line', { class: 'd-line', x1: xFor(m * 1000), x2: xFor(m * 1000), y1: 100, y2: 108 }),
    svgEl('text', { x: xFor(m * 1000), y: 128, 'text-anchor': 'middle', text: `${m} m` }),
  ]));
  svg.append(
    svgEl('line', { class: 'd-line', x1: X0, x2: X1, y1: 100, y2: 100 }),
    ...ticks,
    svgEl('rect', { class: 'd-muted', x: 20, y: 82, width: 34, height: 22, rx: 4 }),
    svgEl('rect', { class: 'd-muted', x: 54, y: 87, width: 12, height: 12 }),
    zone,
    subject,
    nearLabel,
    farLabel,
  );
  return {
    svg,
    update(dof, subjectMm) {
      const left = xFor(dof.near);
      const right = xFor(dof.far);
      zone.setAttribute('x', String(left));
      zone.setAttribute('width', String(Math.max(2, right - left)));
      const sx = xFor(subjectMm);
      subject.replaceChildren(
        svgEl('circle', { class: 'd-accent', cx: sx, cy: 56, r: 8 }),
        svgEl('rect', { class: 'd-accent', x: sx - 5, y: 66, width: 10, height: 34, rx: 3 }),
      );
      const beyondAxis = dof.far > AXIS_MAX_MM;
      if (right - left < 70) {
        nearLabel.setAttribute('x', String(left));
        nearLabel.textContent = describeSharpZone(dof).replace('Sharp from ', '').replace(/\.$/, '');
        farLabel.textContent = '';
      } else {
        nearLabel.setAttribute('x', String(left));
        nearLabel.textContent = formatDistance(dof.near);
        farLabel.setAttribute('x', String(Math.min(right, X1 - 30)));
        farLabel.textContent = beyondAxis ? `${formatDistance(dof.far)} →` : formatDistance(dof.far);
      }
    },
  };
}

function createPreview() {
  const id = uid('dof');
  const svg = svgEl('svg', { viewBox: '0 0 640 300', role: 'img', 'aria-label': 'Xem trước: bông hoa ở gần, người ở vùng nét, hàng cây phía sau' });
  svg.innerHTML = `
    <defs>
      <filter id="${id}-fg" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur data-fg stdDeviation="0"/></filter>
      <filter id="${id}-bg" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur data-bg stdDeviation="0"/></filter>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc4e8"/><stop offset="1" stop-color="#e8eef2"/></linearGradient>
    </defs>
    <rect width="640" height="300" fill="url(#${id}-sky)"/>
    <g filter="url(#${id}-bg)">
      <rect x="-20" y="150" width="680" height="40" fill="#7fa36a"/>
      <g fill="#3f6b4f"><circle cx="40" cy="130" r="44"/><circle cx="130" cy="120" r="52"/><circle cx="250" cy="135" r="40"/><circle cx="390" cy="118" r="54"/><circle cx="500" cy="132" r="42"/><circle cx="600" cy="122" r="50"/></g>
      <g fill="#5b3a29"><rect x="34" y="160" width="10" height="30"/><rect x="124" y="160" width="12" height="30"/><rect x="384" y="160" width="12" height="30"/><rect x="594" y="160" width="12" height="30"/></g>
    </g>
    <rect x="0" y="190" width="640" height="110" fill="#a7b98f"/>
    <g>
      <path d="M296 300 L300 230 L340 230 L344 300 Z" fill="#2b2d3a"/>
      <path d="M286 232 Q290 175 320 170 Q350 175 354 232 Z" fill="#c2563d"/>
      <circle cx="320" cy="150" r="22" fill="#e0b48f"/>
      <path d="M298 148 Q300 124 320 126 Q340 124 342 148 Q334 136 320 137 Q306 136 298 148 Z" fill="#2a1d18"/>
    </g>
    <g filter="url(#${id}-fg)">
      <path d="M120 300 Q118 250 126 215" stroke="#3f7a3a" stroke-width="6" fill="none"/>
      <g fill="#e66b8a"><circle cx="126" cy="200" r="16"/><circle cx="108" cy="212" r="14"/><circle cx="144" cy="212" r="14"/><circle cx="116" cy="230" r="13"/><circle cx="138" cy="230" r="13"/></g>
      <circle cx="126" cy="216" r="9" fill="#f6d55c"/>
    </g>`;
  const fg = svg.querySelector('[data-fg]');
  const bg = svg.querySelector('[data-bg]');
  return {
    svg,
    set(foregroundPx, backgroundPx) {
      fg.setAttribute('stdDeviation', String(foregroundPx));
      bg.setAttribute('stdDeviation', String(backgroundPx));
    },
  };
}

export function mount(host) {
  const state = { focal: 85, aperture: 1.8, subjectMm: 2000 };
  const side = createSideView();
  const preview = createPreview();
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Khẩu độ', values: aperturesFor(LENSES[85]), value: 1.8, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const distance = rangeControl({ label: 'Khoảng cách lấy nét', values: DISTANCES_MM, value: 2000, format: formatDistance, onInput: (v) => update({ subjectMm: v }) });
  const lens = radioGroup({
    legend: 'Ống kính',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: 85,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });

  function update(patch) {
    Object.assign(state, patch);
    const dof = depthOfField(state.focal, state.aperture, state.subjectMm);
    side.update(dof, state.subjectMm);
    preview.set(
      blurPx(state.focal, state.aperture, state.subjectMm, state.subjectMm * 0.5),
      blurPx(state.focal, state.aperture, state.subjectMm, state.subjectMm * 4),
    );
    const lines = [describeSharpZone(dof), describeDepth(dof), `Khoảng cách siêu nét: ${formatDistance(dof.hyperfocal)}.`];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [side.svg, preview.svg], controls: [lens.el, aperture.el, distance.el], readout, live: live.el });
  update({});
}
