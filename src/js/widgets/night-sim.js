import { LENSES, aperturesFor, handheldLimitSeconds, npfSeconds, rule500Seconds, slowestSafeShutter } from '../photo-math.js';
import { formatAperture, formatSeconds, formatShutter } from '../format.js';
import { el, svgEl } from '../dom.js';
import { liveRegion, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

function starField(count, seed) {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({ x: 10 + next() * 280, y: 10 + next() * 160, r: 0.8 + next() * 1.6 }));
}
const STARS = starField(45, 42);

function createSky(label) {
  const svg = svgEl('svg', { viewBox: '0 0 300 180', role: 'img', 'aria-label': label });
  const stars = svgEl('g');
  svg.append(svgEl('rect', { width: 300, height: 180, fill: '#0b1020' }), stars);
  return {
    svg,
    draw(trailPx) {
      stars.replaceChildren(...STARS.map(({ x, y, r }) => svgEl('line', {
        x1: x, y1: y, x2: x + trailPx, y2: y - trailPx * 0.3, stroke: '#f4f1e8', 'stroke-width': r * 2, 'stroke-linecap': 'round',
      })));
    },
  };
}

const stopsText = (v) => (v === 0 ? 'Off' : `${v} ${v === 1 ? 'stop' : 'stops'}`);
// The 500 rule only causes trails when it allows a clearly longer time than NPF (true at wide apertures).
const TRAIL_MARGIN = 1.05;

export function starReadout(focal, aperture) {
  const npf = npfSeconds(focal, aperture);
  const rule = rule500Seconds(focal);
  const npfLine = `Stars: the NPF rule says ${formatSeconds(npf)} at ${formatAperture(aperture)}.`;
  if (rule > npf * TRAIL_MARGIN) {
    return [npfLine, `The 500 rule says ${formatSeconds(rule)}, ${(rule / npf).toFixed(1)} times longer, so stars smear into short lines.`];
  }
  return [npfLine, `The 500 rule says ${formatSeconds(rule)}. At this aperture the NPF time is about the same or longer, so use the shorter one: ${formatSeconds(Math.min(npf, rule))}.`];
}

export function mount(host) {
  const state = { focal: 35, aperture: 1.4, stops: 2 };
  const npfSky = createSky('Stars at the NPF time: small dots');
  const ruleSky = createSky('Stars at the 500 rule time');
  const view = el('div', { class: 'sim-panels' }, [
    el('figure', {}, [npfSky.svg, el('figcaption', { text: 'NPF time' })]),
    el('figure', {}, [ruleSky.svg, el('figcaption', { text: '500 rule time' })]),
  ]);
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Aperture', values: aperturesFor(LENSES[35]), value: 1.4, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const stabilizer = rangeControl({ label: 'Stabilizer stops you count on', values: [0, 1, 2, 3, 4], value: 2, format: stopsText, onInput: (v) => update({ stops: v }) });
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
    const npf = npfSeconds(state.focal, state.aperture);
    const rule = rule500Seconds(state.focal);
    npfSky.draw(0.01);
    ruleSky.draw(Math.max(0.01, 6 * (rule / npf - 1)));
    const handheld = slowestSafeShutter(handheldLimitSeconds(state.focal, state.stops));
    const lines = [
      ...starReadout(state.focal, state.aperture),
      `Handheld, still scene, stabilizer ${stopsText(state.stops)}: ${formatShutter(handheld)} or faster.`,
      'People still need 1/60 s to 1/250 s, because the stabilizer cannot stop them moving.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, {
    view: [view],
    controls: [lens.el, aperture.el, stabilizer.el],
    readout,
    live: live.el,
    extra: [el('p', { class: 'sim__credit', text: 'NPF rule © Frédéric Michaud, Société Astronomique du Havre.' })],
  });
  update({});
}
