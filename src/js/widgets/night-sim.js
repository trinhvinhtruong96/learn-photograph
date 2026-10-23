import { LENSES, aperturesFor, handheldLimitSeconds, npfSeconds, rule500Seconds, slowestSafeShutter } from '../photo-math.js';
import { formatAperture, formatDecimal, formatSeconds, formatShutter } from '../format.js';
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

const stopsText = (v) => (v === 0 ? 'tắt' : `${v} stop`);
// The 500 rule only causes trails when it allows a clearly longer time than NPF (true at wide apertures).
const TRAIL_MARGIN = 1.05;

export function starReadout(focal, aperture) {
  const npf = npfSeconds(focal, aperture);
  const rule = rule500Seconds(focal);
  const npfLine = `Sao: quy tắc NPF cho ${formatSeconds(npf)} ở ${formatAperture(aperture)}.`;
  if (rule > npf * TRAIL_MARGIN) {
    return [npfLine, `Quy tắc 500 cho ${formatSeconds(rule)}, dài hơn ${formatDecimal(rule / npf)} lần, nên sao bị kéo thành vệt ngắn.`];
  }
  return [npfLine, `Quy tắc 500 cho ${formatSeconds(rule)}. Ở khẩu độ này, thời gian NPF bằng hoặc dài hơn, nên hãy dùng thời gian ngắn hơn: ${formatSeconds(Math.min(npf, rule))}.`];
}

export function mount(host) {
  const state = { focal: 35, aperture: 1.4, stops: 2 };
  const npfSky = createSky('Sao ở thời gian NPF: những chấm nhỏ');
  const ruleSky = createSky('Sao ở thời gian theo quy tắc 500');
  const view = el('div', { class: 'sim-panels' }, [
    el('figure', {}, [npfSky.svg, el('figcaption', { text: 'Thời gian NPF' })]),
    el('figure', {}, [ruleSky.svg, el('figcaption', { text: 'Thời gian quy tắc 500' })]),
  ]);
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Khẩu độ', values: aperturesFor(LENSES[35]), value: 1.4, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const stabilizer = rangeControl({ label: 'Số stop chống rung bạn tin cậy', values: [0, 1, 2, 3, 4], value: 2, format: stopsText, onInput: (v) => update({ stops: v }) });
  const lens = radioGroup({
    legend: 'Ống kính',
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
      `Cầm tay, cảnh đứng yên, chống rung ${stopsText(state.stops)}: ${formatShutter(handheld)} hoặc nhanh hơn.`,
      'Người vẫn cần 1/60 đến 1/250 giây, vì chống rung không giữ được người đang chuyển động.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, {
    view: [view],
    controls: [lens.el, aperture.el, stabilizer.el],
    readout,
    live: live.el,
    extra: [el('p', { class: 'sim__credit', text: 'Quy tắc NPF © Frédéric Michaud, Société Astronomique du Havre.' })],
  });
  update({});
}
