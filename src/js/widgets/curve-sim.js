import { CURVE_PRESETS, curvePoints, curveTable, describeCurve } from '../tone.js';
import { el, svgEl } from '../dom.js';
import { liveRegion, numberRange, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { createScene } from './scene.js';

const LEVELS = [
  { key: 'blacks', label: 'Điểm đen (đầu ra ở 0%)', values: numberRange(0, 0.3, 0.01) },
  { key: 'shadows', label: 'Vùng tối (đầu ra ở 25%)', values: numberRange(0, 0.6, 0.01) },
  { key: 'mids', label: 'Tông trung bình (đầu ra ở 50%)', values: numberRange(0.2, 0.8, 0.01) },
  { key: 'highlights', label: 'Vùng sáng (đầu ra ở 75%)', values: numberRange(0.5, 1, 0.01) },
];
const percent = (v) => `${Math.round(v * 100)}%`;

function drawCurve(svg, table, points) {
  const toX = (x) => x * 200;
  const toY = (y) => 200 - y * 200;
  svg.replaceChildren(
    ...[50, 100, 150].flatMap((p) => [
      svgEl('line', { class: 'd-line', x1: p, y1: 0, x2: p, y2: 200, opacity: 0.4 }),
      svgEl('line', { class: 'd-line', x1: 0, y1: p, x2: 200, y2: p, opacity: 0.4 }),
    ]),
    svgEl('line', { class: 'd-line', x1: 0, y1: 200, x2: 200, y2: 0, 'stroke-dasharray': '4 4' }),
    svgEl('polyline', { class: 'd-accent-line', points: table.map((v, i) => `${toX(i / (table.length - 1))},${toY(v)}`).join(' ') }),
    ...points.map(([x, y]) => svgEl('circle', { class: 'd-accent', cx: toX(x), cy: toY(y), r: 5 })),
  );
}

export function mount(host) {
  const levels = { blacks: 0, shadows: 0.25, mids: 0.5, highlights: 0.75 };
  const scene = createScene({ label: 'Cảnh đường phố sau khi áp đường cong tông màu' });
  const graph = svgEl('svg', { viewBox: '-4 -4 208 208', class: 'sim-diagram', 'aria-hidden': 'true' });
  const readout = readoutBox();
  const live = liveRegion();
  const controls = LEVELS.map((level) => rangeControl({
    label: level.label,
    values: level.values,
    value: levels[level.key],
    format: percent,
    spoken: (v) => `đầu ra ${percent(v)}`,
    onInput: (v) => {
      levels[level.key] = v;
      update();
    },
  }));
  const presets = el('div', { class: 'sim__buttons' }, Object.values(CURVE_PRESETS).map((preset) => el('button', {
    type: 'button',
    class: 'button button--ghost',
    text: preset.label,
    onclick: () => {
      LEVELS.forEach((level, i) => {
        levels[level.key] = preset[level.key];
        controls[i].set(preset[level.key]);
      });
      update();
    },
  })));

  function update() {
    const points = curvePoints(levels);
    const table = curveTable(points);
    scene.setToneCurve(table);
    drawCurve(graph, table, points);
    const line = describeCurve(levels);
    setReadout(readout, [line]);
    live.announce(line);
  }

  simLayout(host, { view: [scene.svg, graph], controls: [presets, ...controls.map((c) => c.el)], readout, live: live.el });
  update();
}
