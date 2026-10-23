import { CURVE_PRESETS, curvePoints, curveTable } from '../tone.js';
import { el } from '../dom.js';
import { liveRegion, numberRange, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { createScene } from './scene.js';

// Working order from docs/research/darktable-5.6.md, section A.
export const EDIT_STEPS = [
  { module: 'Start: the RAW file', note: 'A RAW file looks flat, a bit dark and tilted. That is normal.' },
  { module: 'lens correction', note: 'Fixes dark corners first, because that changes the brightness.', fixes: 'vignette' },
  { module: 'exposure', note: 'Sets the overall brightness.', fixes: 'exposure' },
  { module: 'sigmoid', note: 'Adds contrast and keeps the brightest and darkest parts under control.', fixes: 'curve' },
  { module: 'color calibration', note: 'Fixes white balance so white looks white.', fixes: 'tint' },
  { module: 'color balance rgb', note: 'Adds color with the basic colorfulness preset.', fixes: 'saturation' },
  { module: 'denoise (profiled)', note: 'Removes noise with a profile made for the α7 II.', fixes: 'grain' },
  { module: 'local contrast', note: 'Brings back crisp detail.', fixes: 'softness' },
  { module: 'rotate and perspective', note: 'Straightens the horizon. Then crop trims the edges.', fixes: 'rotation' },
  { module: 'retouch', note: 'Removes a dust spot from the sky.', fixes: 'dust' },
];

export const RAW_LOOK = {
  vignette: 0.55,
  exposure: -1,
  curve: curveTable([[0, 0.1], [1, 0.9]]),
  tint: { r: 0.9, g: 1, b: 1.12 },
  saturation: 0.7,
  grain: 0.35,
  softness: 0.8,
  rotation: 2.5,
  dust: true,
};

export const FINISHED = {
  vignette: 0,
  exposure: 0,
  curve: curveTable(curvePoints(CURVE_PRESETS.contrast)),
  tint: { r: 1, g: 1, b: 1 },
  saturation: 1.15,
  grain: 0.04,
  softness: 0,
  rotation: 0,
  dust: false,
};

export function editState(stepIndex) {
  const state = { ...RAW_LOOK };
  for (const step of EDIT_STEPS.slice(1, stepIndex + 1)) state[step.fixes] = FINISHED[step.fixes];
  return state;
}

function applyEdit(scene, s) {
  scene.setVignette(s.vignette);
  scene.setExposure(s.exposure);
  scene.setToneCurve(s.curve);
  scene.setTint(s.tint);
  scene.setSaturation(s.saturation);
  scene.setGrain(s.grain);
  scene.setSoftness(s.softness);
  scene.setRotation(s.rotation);
  scene.setDust(s.dust);
}

export function mount(host) {
  let step = 0;
  const before = createScene({ label: 'Before: the unedited RAW file' });
  const after = createScene({ label: 'After: the photo at the current editing step' });
  applyEdit(before, RAW_LOOK);
  const afterLayer = el('div', { class: 'compare__after' }, [after.svg]);
  const divider = el('div', { class: 'compare__divider', 'aria-hidden': 'true' });
  const compare = el('div', { class: 'compare' }, [before.svg, afterLayer, divider]);
  const list = el('ol', { class: 'edit-steps' }, EDIT_STEPS.map((s) => el('li', {}, [el('b', { class: 'ui', text: s.module })])));
  const prev = el('button', { type: 'button', class: 'button button--ghost', text: 'Previous step' });
  const next = el('button', { type: 'button', class: 'button', text: 'Next step' });
  const readout = readoutBox();
  const live = liveRegion(300);

  const setSplit = (percent) => {
    afterLayer.style.clipPath = `inset(0 0 0 ${percent}%)`;
    divider.style.left = `${percent}%`;
  };
  const split = rangeControl({
    label: 'Before and after divider',
    values: numberRange(0, 100, 5),
    value: 50,
    format: (v) => `${v}% before`,
    spoken: (v) => `${v} percent before`,
    onInput: setSplit,
  });

  function render() {
    applyEdit(after, editState(step));
    [...list.children].forEach((li, i) => {
      li.classList.toggle('is-done', i < step);
      if (i === step) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    const current = EDIT_STEPS[step];
    const lines = [`Step ${step + 1} of ${EDIT_STEPS.length}: ${current.module}.`, current.note];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  prev.addEventListener('click', () => {
    step = Math.max(0, step - 1);
    render();
  });
  next.addEventListener('click', () => {
    step = Math.min(EDIT_STEPS.length - 1, step + 1);
    render();
  });

  simLayout(host, {
    view: [compare],
    controls: [el('div', { class: 'sim__buttons' }, [prev, next]), split.el, list],
    readout,
    live: live.el,
  });
  setSplit(50);
  render();
}
