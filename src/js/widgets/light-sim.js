import { formatKelvin } from '../format.js';
import { el, svgEl, uid } from '../dom.js';
import { liveRegion, numberRange, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

export const CAMERA_KELVIN = numberRange(2500, 9900, 100);
export const SCENE_LIGHTS = [
  { k: 1850, label: 'Candle (1850 K)' },
  { k: 2700, label: 'Home bulb (2700 K)' },
  { k: 3500, label: 'Golden hour (3500 K)' },
  { k: 5500, label: 'Daylight (5500 K)' },
  { k: 7000, label: 'Overcast (7000 K)' },
  { k: 9000, label: 'Shade (9000 K)' },
];

const DESCRIPTIONS = {
  'Front light': 'Few shadows. Flat but clean, and kind to skin.',
  '45° light': 'Shadows shape the face. A classic portrait light.',
  'Side light': 'Half the face is in shadow. Dramatic.',
  'Rim light': 'The face is mostly in shadow with a bright edge.',
  Backlight: 'The face is in shade. Use a reflector or expose for the face.',
};

// 0° = light from the camera, 90° = from the right, 180° = from behind.
export function lightPattern(angleDeg) {
  const a = ((angleDeg % 360) + 360) % 360;
  const folded = a > 180 ? 360 - a : a;
  let side = 'right';
  if (a === 0 || a === 180) side = 'none';
  else if (a > 180) side = 'left';
  let name = 'Backlight';
  if (folded <= 20) name = 'Front light';
  else if (folded <= 60) name = '45° light';
  else if (folded <= 120) name = 'Side light';
  else if (folded <= 160) name = 'Rim light';
  return { name, folded, side, lit: (1 + Math.cos((folded * Math.PI) / 180)) / 2 };
}

// Mired difference: positive when the camera assumes warmer light than the scene has (photo turns blue).
export function whiteBalanceCast(sceneK, cameraK) {
  const mired = 1e6 / cameraK - 1e6 / sceneK;
  const strength = Math.max(-1, Math.min(1, mired / 150));
  let cast = 'neutral';
  if (Math.abs(mired) >= 15) cast = mired > 0 ? 'blue' : 'orange';
  return { mired, cast, tint: { r: 1 - 0.35 * strength, g: 1 - 0.05 * Math.abs(strength), b: 1 + 0.35 * strength } };
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function createFace() {
  const id = uid('face');
  const svg = svgEl('svg', { viewBox: '0 0 400 340', role: 'img', 'aria-label': 'A face lit from the chosen direction' });
  svg.innerHTML = `
    <defs>
      <linearGradient id="${id}-shade" data-shade x1="1" y1="0" x2="0" y2="0">
        <stop data-s1 offset="0.5" stop-color="#000" stop-opacity="0"/>
        <stop data-s2 offset="0.5" stop-color="#000" stop-opacity="0.78"/>
      </linearGradient>
      <clipPath id="${id}-head"><ellipse cx="200" cy="170" rx="92" ry="112"/></clipPath>
      <clipPath id="${id}-rim"><rect data-rim-clip x="200" y="40" width="100" height="260"/></clipPath>
    </defs>
    <rect width="400" height="340" fill="#3b3f4a"/>
    <path d="M100 340 Q112 268 200 262 Q288 268 300 340 Z" fill="#5a6b8c"/>
    <ellipse cx="200" cy="170" rx="92" ry="112" fill="#e2b48e"/>
    <path d="M108 150 Q110 52 200 50 Q290 52 292 150 Q270 96 200 98 Q130 96 108 150 Z" fill="#2a1d18"/>
    <ellipse cx="165" cy="165" rx="11" ry="7" fill="#fff"/><circle cx="165" cy="165" r="5" fill="#3a2a22"/>
    <ellipse cx="235" cy="165" rx="11" ry="7" fill="#fff"/><circle cx="235" cy="165" r="5" fill="#3a2a22"/>
    <path d="M200 172 L190 214 L206 214" fill="none" stroke="#b07a5a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M178 240 Q200 252 222 240" fill="none" stroke="#9c5444" stroke-width="4" stroke-linecap="round"/>
    <g clip-path="url(#${id}-head)"><rect x="108" y="58" width="184" height="224" fill="url(#${id}-shade)"/></g>
    <g clip-path="url(#${id}-rim)"><ellipse data-rim cx="200" cy="170" rx="92" ry="112" fill="none" stroke="#fff6dd" stroke-width="6" opacity="0"/></g>`;
  const q = (s) => svg.querySelector(s);
  return { svg, grad: q('[data-shade]'), s1: q('[data-s1]'), s2: q('[data-s2]'), rim: q('[data-rim]'), rimClip: q('[data-rim-clip]') };
}

function shadeFace(face, pattern, soft) {
  const width = soft ? 0.4 : 0.06;
  face.s1.setAttribute('offset', String(clamp01(pattern.lit - width / 2)));
  face.s2.setAttribute('offset', String(clamp01(pattern.lit + width / 2)));
  face.s2.setAttribute('stop-opacity', String(0.78 * Math.sqrt(1 - pattern.lit)));
  const fromLeft = pattern.side === 'left';
  face.grad.setAttribute('x1', fromLeft ? '0' : '1');
  face.grad.setAttribute('x2', fromLeft ? '1' : '0');
  face.rim.setAttribute('opacity', String(pattern.folded > 120 ? (pattern.folded - 120) / 60 : 0));
  face.rimClip.setAttribute('x', pattern.side === 'right' ? '200' : '100');
  face.rimClip.setAttribute('width', pattern.side === 'none' ? '200' : '100');
}

function createTopView() {
  const svg = svgEl('svg', { viewBox: '0 0 200 200', class: 'sim-diagram', 'aria-hidden': 'true' });
  const lamp = svgEl('circle', { class: 'd-accent', r: 10 });
  svg.append(
    svgEl('circle', { class: 'd-line', cx: 100, cy: 100, r: 75 }),
    svgEl('circle', { class: 'd-muted', cx: 100, cy: 100, r: 22 }),
    svgEl('path', { class: 'd-muted', d: 'M94 120 L100 132 L106 120 Z' }),
    svgEl('rect', { class: 'd-muted', x: 88, y: 184, width: 24, height: 14, rx: 3 }),
    svgEl('text', { x: 118, y: 196, text: 'Camera' }),
    lamp,
  );
  return {
    svg,
    update(angleDeg) {
      const a = (angleDeg * Math.PI) / 180;
      lamp.setAttribute('cx', String(100 + 75 * Math.sin(a)));
      lamp.setAttribute('cy', String(100 + 75 * Math.cos(a)));
    },
  };
}

function createSwatch() {
  const id = uid('wb');
  const svg = svgEl('svg', { viewBox: '0 0 400 200', role: 'img', 'aria-label': 'A white card, a grey card, a blue mug and a plant, as the camera records them' });
  svg.innerHTML = `
    <defs><filter id="${id}-wb" color-interpolation-filters="sRGB"><feComponentTransfer data-wb><feFuncR type="linear" slope="1"/><feFuncG type="linear" slope="1"/><feFuncB type="linear" slope="1"/></feComponentTransfer></filter></defs>
    <g filter="url(#${id}-wb)">
      <rect width="400" height="200" fill="#d9d4cc"/>
      <rect x="0" y="150" width="400" height="50" fill="#a89f93"/>
      <rect x="40" y="40" width="110" height="130" fill="#f7f7f5"/>
      <rect x="165" y="60" width="80" height="110" fill="#8a8a8a"/>
      <path d="M270 110 h60 v60 a10 10 0 0 1 -10 10 h-40 a10 10 0 0 1 -10 -10 z" fill="#3a6ea5"/>
      <path d="M330 125 a16 16 0 0 1 0 32" fill="none" stroke="#3a6ea5" stroke-width="8"/>
      <path d="M355 150 q-10 -60 20 -90 q-2 50 -20 90 z" fill="#4c8a4c"/>
    </g>`;
  const funcs = [...svg.querySelector('[data-wb]').children];
  return {
    svg,
    setTint({ r, g, b }) {
      funcs[0].setAttribute('slope', String(r));
      funcs[1].setAttribute('slope', String(g));
      funcs[2].setAttribute('slope', String(b));
    },
  };
}

function castText(cast, sceneK, cameraK) {
  if (cast.cast === 'neutral') return `Camera at ${formatKelvin(cameraK)} matches the light: white looks white.`;
  if (cast.cast === 'blue') return `Camera at ${formatKelvin(cameraK)} in ${formatKelvin(sceneK)} light: the photo looks too blue. Set a higher number to warm it up.`;
  if (sceneK < CAMERA_KELVIN[0] && cameraK === CAMERA_KELVIN[0]) return 'Your camera stops at 2500 K, so candlelight stays warm. Fix the rest in darktable.';
  return `Camera at ${formatKelvin(cameraK)} in ${formatKelvin(sceneK)} light: the photo looks too orange. Set a lower number to cool it down.`;
}

export function mount(host) {
  const state = { angle: 45, soft: false, sceneK: 9000, cameraK: 5500 };
  const face = createFace();
  const top = createTopView();
  const swatch = createSwatch();
  const readout = readoutBox();
  const live = liveRegion();
  const angle = rangeControl({ label: 'Light direction', values: numberRange(0, 345, 15), value: 45, format: (v) => `${v}°`, spoken: (v) => `${v} degrees`, onInput: (v) => { state.angle = v; update(); } });
  const quality = radioGroup({ legend: 'Light quality', options: [{ value: 'hard', label: 'Hard (small source)' }, { value: 'soft', label: 'Soft (big source)' }], value: 'hard', onChange: (v) => { state.soft = v === 'soft'; update(); } });
  const sceneLight = radioGroup({ legend: 'Light in the scene', options: SCENE_LIGHTS.map((s) => ({ value: s.k, label: s.label })), value: 9000, onChange: (v) => { state.sceneK = v; update(); } });
  const camera = rangeControl({ label: 'Camera white balance', values: CAMERA_KELVIN, value: 5500, format: formatKelvin, spoken: (v) => `${v} kelvin`, onInput: (v) => { state.cameraK = v; update(); } });

  function update() {
    const pattern = lightPattern(state.angle);
    shadeFace(face, pattern, state.soft);
    top.update(state.angle);
    const cast = whiteBalanceCast(state.sceneK, state.cameraK);
    swatch.setTint(cast.tint);
    const lines = [
      `${pattern.name}: ${DESCRIPTIONS[pattern.name]}`,
      state.soft ? 'Soft light: gentle shadow edges.' : 'Hard light: crisp shadow edges.',
      castText(cast, state.sceneK, state.cameraK),
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, {
    view: [el('div', { class: 'sim-panels' }, [face.svg, top.svg]), swatch.svg],
    controls: [angle.el, quality.el, sceneLight.el, camera.el],
    readout,
    live: live.el,
  });
  update();
}
