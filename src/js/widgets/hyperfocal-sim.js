import { LENSES, aperturesFor, depthOfField, hyperfocalMm } from '../photo-math.js';
import { describeSharpZone, formatAperture, formatDistance } from '../format.js';
import { svgEl } from '../dom.js';
import { liveRegion, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

// Compressed distance scale: 0 → 40, infinity → 560.
const xFor = (mm) => (Number.isFinite(mm) ? 40 + 520 * (mm / (mm + 5000)) : 560);
const TICKS_MM = [1000, 2000, 5000, 10000, 20000];

function createScale() {
  const svg = svgEl('svg', { viewBox: '0 0 640 150', class: 'sim-diagram', 'aria-hidden': 'true' });
  const zone = svgEl('rect', { class: 'd-zone', y: 50, height: 40 });
  const focusMark = svgEl('line', { class: 'd-accent-line', y1: 40, y2: 100 });
  const focusLabel = svgEl('text', { y: 32, 'text-anchor': 'middle' });
  const nearLabel = svgEl('text', { y: 118, 'text-anchor': 'middle' });
  svg.append(
    svgEl('line', { class: 'd-line', x1: 40, y1: 90, x2: 600, y2: 90 }),
    ...TICKS_MM.map((mm) => svgEl('text', { x: xFor(mm), y: 140, 'text-anchor': 'middle', text: formatDistance(mm) })),
    svgEl('text', { x: 590, y: 140, 'text-anchor': 'middle', text: '∞' }),
    svgEl('rect', { class: 'd-muted', x: 6, y: 78, width: 26, height: 20, rx: 4 }),
    zone,
    focusMark,
    focusLabel,
    nearLabel,
  );
  return {
    svg,
    update(hyperfocal, near) {
      const left = xFor(near);
      zone.setAttribute('x', String(left));
      zone.setAttribute('width', String(600 - left));
      const fx = xFor(hyperfocal);
      focusMark.setAttribute('x1', String(fx));
      focusMark.setAttribute('x2', String(fx));
      focusLabel.setAttribute('x', String(fx));
      focusLabel.textContent = `focus ${formatDistance(hyperfocal)}`;
      nearLabel.setAttribute('x', String(left));
      nearLabel.textContent = `sharp from ${formatDistance(near)}`;
    },
  };
}

export function mount(host) {
  const state = { focal: 35, aperture: 8 };
  const scale = createScale();
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Aperture', values: aperturesFor(LENSES[35]), value: 8, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const lens = radioGroup({
    legend: 'Lens',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: 35,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });

  function update(patch) {
    Object.assign(state, patch);
    const hyperfocal = hyperfocalMm(state.focal, state.aperture);
    const dof = depthOfField(state.focal, state.aperture, hyperfocal);
    scale.update(hyperfocal, dof.near);
    const lines = [
      `Focus at ${formatDistance(hyperfocal)}. ${describeSharpZone(dof)}`,
      'That means acceptably sharp, not perfectly sharp. If far detail matters most, focus a little farther.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [scale.svg], controls: [lens.el, aperture.el], readout, live: live.el });
  update({});
}
