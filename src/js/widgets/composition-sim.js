import { horizontalFovDeg, sameFramingDistanceMm } from '../photo-math.js';
import { formatDistance } from '../format.js';
import { el, svgEl, uid } from '../dom.js';
import { checkbox, liveRegion, radioGroup, readoutBox, setReadout, simLayout } from './controls.js';

// Background size relative to the subject, (s - f) / (s + D - f), compared at the same framing.
export function perspectiveCompare(behindMm = 50000, subject35Mm = 1200) {
  const s85 = sameFramingDistanceMm(35, subject35Mm, 85);
  const relative = (s, f) => (s - f) / (s + behindMm - f);
  return { s35: subject35Mm, s85, ratio: relative(s85, 85) / relative(subject35Mm, 35) };
}

const OVERLAYS = [
  { id: 'thirds', label: 'Rule of thirds', checked: true, lines: [[213.3, 0, 213.3, 400], [426.7, 0, 426.7, 400], [0, 133.3, 640, 133.3], [0, 266.7, 640, 266.7]] },
  { id: 'phi', label: 'Golden ratio grid', checked: false, lines: [[244.5, 0, 244.5, 400], [395.5, 0, 395.5, 400], [0, 152.8, 640, 152.8], [0, 247.2, 640, 247.2]] },
  { id: 'diagonals', label: 'Diagonals', checked: false, lines: [[0, 0, 640, 400], [640, 0, 0, 400]] },
  { id: 'center', label: 'Center lines', checked: false, lines: [[320, 0, 320, 400], [0, 200, 640, 200]] },
];

function createFrame() {
  const id = uid('frame');
  const svg = svgEl('svg', { viewBox: '0 0 640 400', class: 'sim-diagram', role: 'img', 'aria-label': 'A person on the left third with a mountain behind' });
  svg.innerHTML = `
    <defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb0dc"/><stop offset="1" stop-color="#dfe9ef"/></linearGradient></defs>
    <rect width="640" height="400" fill="url(#${id}-sky)"/>
    <g data-mountain>
      <path d="M330 250 L400 170 L432 196 L470 150 L540 250 Z" fill="#6f7d99"/>
      <path d="M454 168 L470 150 L486 170 L476 166 L468 174 Z" fill="#f4f6f8"/>
    </g>
    <rect x="0" y="250" width="640" height="150" fill="#9bb07f"/>
    <g>
      <path d="M178 400 L186 300 L240 300 L248 400 Z" fill="#2b2d3a"/>
      <path d="M166 304 Q170 228 213 220 Q256 228 260 304 Z" fill="#c2563d"/>
      <circle cx="213" cy="188" r="30" fill="#e0b48f"/>
      <path d="M183 184 Q186 150 214 152 Q242 150 244 184 Q234 166 213 168 Q192 166 183 184 Z" fill="#2a1d18"/>
    </g>
    <g data-overlays></g>`;
  return { svg, mountain: svg.querySelector('[data-mountain]'), overlays: svg.querySelector('[data-overlays]') };
}

function createTopView() {
  const svg = svgEl('svg', { viewBox: '0 0 300 220', class: 'sim-diagram', 'aria-hidden': 'true' });
  const cone = svgEl('path', { class: 'd-zone' });
  const subject = svgEl('circle', { class: 'd-accent', cx: 150, r: 7 });
  const label = svgEl('text', { x: 165 });
  svg.append(
    svgEl('text', { x: 150, y: 16, 'text-anchor': 'middle', text: 'Mountain, 50 m behind' }),
    cone,
    subject,
    label,
    svgEl('rect', { class: 'd-muted', x: 138, y: 200, width: 24, height: 14, rx: 3 }),
    svgEl('text', { x: 172, y: 212, text: 'You' }),
  );
  return {
    svg,
    update(fovDeg, subjectMm) {
      const half = ((fovDeg / 2) * Math.PI) / 180;
      const reach = 180;
      const dx = reach * Math.sin(half);
      const top = 200 - reach * Math.cos(half);
      cone.setAttribute('d', `M150 200 L${150 - dx} ${top} L${150 + dx} ${top} Z`);
      const y = 200 - (subjectMm / 3000) * 150;
      subject.setAttribute('cy', String(y));
      label.setAttribute('y', String(y + 5));
      label.textContent = `Person, ${formatDistance(subjectMm)}`;
    },
  };
}

export function mount(host) {
  const state = { focal: 35, overlays: new Set(OVERLAYS.filter((o) => o.checked).map((o) => o.id)) };
  const frame = createFrame();
  const top = createTopView();
  const readout = readoutBox();
  const live = liveRegion();
  const compare = perspectiveCompare();

  const lens = radioGroup({
    legend: 'Lens (same framing of the person)',
    options: [{ value: 35, label: '35mm' }, { value: 85, label: '85mm' }],
    value: 35,
    onChange: (v) => {
      state.focal = v;
      update();
    },
  });
  const toggles = el('fieldset', { class: 'sim-radios' }, [
    el('legend', { text: 'Grid overlays' }),
    ...OVERLAYS.map((o) => checkbox({
      label: o.label,
      checked: o.checked,
      onChange: (on) => {
        if (on) state.overlays.add(o.id);
        else state.overlays.delete(o.id);
        update();
      },
    }).el),
  ]);

  function update() {
    const is85 = state.focal === 85;
    const scale = is85 ? compare.ratio : 1;
    frame.mountain.setAttribute('transform', `translate(435 250) scale(${scale}) translate(-435 -250)`);
    frame.overlays.replaceChildren(...OVERLAYS
      .filter((o) => state.overlays.has(o.id))
      .flatMap((o) => o.lines.map(([x1, y1, x2, y2]) => svgEl('line', { class: 'overlay-line', x1, y1, x2, y2 }))));
    const fov = horizontalFovDeg(state.focal);
    top.update(fov, is85 ? compare.s85 : compare.s35);
    const lines = is85
      ? [
        `85mm: you step back to ${formatDistance(compare.s85)} for the same framing.`,
        `You see ${fov.toFixed(1)}° across.`,
        `The mountain looks ${compare.ratio.toFixed(1)} times bigger next to the person. Your distance changed the perspective, not the lens.`,
      ]
      : [
        `35mm: you stand ${formatDistance(compare.s35)} from the person.`,
        `You see ${fov.toFixed(1)}° across.`,
        'The mountain looks small and far away.',
      ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [frame.svg, top.svg], controls: [lens.el, toggles], readout, live: live.el });
  update();
}
