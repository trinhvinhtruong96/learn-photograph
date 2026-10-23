import { ISOS, LENSES, SHAKE_TOLERANCE, SHUTTERS, aperturesFor, autoShutter, blurDiscMm, blurPercentOfFrame, handheldLimitSeconds, settingsEv } from '../photo-math.js';
import { formatAperture, formatEv, formatIso, formatShutter } from '../format.js';
import { svgEl } from '../dom.js';
import { liveRegion, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { SCENE_WIDTH, createScene } from './scene.js';

export const SCENES = [
  { ev: 15, label: 'Nắng gắt (EV 15)' },
  { ev: 13, label: 'Trời mây sáng (EV 13)' },
  { ev: 12, label: 'Bóng râm mở (EV 12)' },
  { ev: 5, label: 'Trong nhà buổi tối (EV 5)' },
  { ev: 4, label: 'Phố tối ban đêm (EV 4)' },
];

const SUBJECT_MM = 3000;
const BACKGROUND_MM = 12000;
const CYCLIST_SPEED_MM_S = 5000;
const CYCLIST_DISTANCE_MM = 8000;
const PLANNED_IBIS_STOPS = 2;
const MAX_BACKGROUND_BLUR_PX = 24;
const MAX_MOTION_BLUR_PX = 60;
const BINS = 32;
const BASE_HISTOGRAM = Array.from({ length: BINS }, (_, i) => Math.exp(-((i - 12) ** 2) / 50) + 0.35 * Math.exp(-((i - 24) ** 2) / 18));

const VERDICT_TEXT = { correct: 'đúng sáng', 'a-bit-bright': 'hơi sáng', 'too-bright': 'quá sáng', 'a-bit-dark': 'hơi tối', 'too-dark': 'quá tối' };

export function verdictFor(offset) {
  const size = Math.abs(offset);
  if (size < 0.35) return 'correct';
  if (offset > 0) return size <= 1.5 ? 'a-bit-bright' : 'too-bright';
  return size <= 1.5 ? 'a-bit-dark' : 'too-dark';
}

// Illustrative histogram: 8 stops across 32 bins; tones pushed past an edge pile up there (clipping).
export function histogramFor(offset) {
  const bins = new Array(BINS).fill(0);
  const shift = offset * (BINS / 8);
  BASE_HISTOGRAM.forEach((value, i) => {
    const j = Math.min(BINS - 1, Math.max(0, Math.round(i + shift)));
    bins[j] += value;
  });
  return bins;
}

export function computeExposure({ sceneEv, focal, mode, aperture, shutter, iso }) {
  const auto = mode === 'A' ? autoShutter(sceneEv, aperture, iso) : { shutter, clamped: 'none' };
  const t = auto.shutter;
  const offset = sceneEv - settingsEv({ aperture, shutter: t, iso });
  const backgroundPct = blurPercentOfFrame(blurDiscMm(focal, aperture, SUBJECT_MM, BACKGROUND_MM));
  const motionMm = (CYCLIST_SPEED_MM_S * t * focal) / CYCLIST_DISTANCE_MM;
  return {
    shutter: t,
    clamped: auto.clamped,
    offset,
    verdict: verdictFor(offset),
    backgroundBlurPx: Math.min(MAX_BACKGROUND_BLUR_PX, ((backgroundPct / 100) * SCENE_WIDTH) / 2),
    motionBlurPx: Math.min(MAX_MOTION_BLUR_PX, (motionMm / 36) * SCENE_WIDTH),
    grain: Math.log2(iso / 100) / 8,
    shake: t > handheldLimitSeconds(focal, PLANNED_IBIS_STOPS) * SHAKE_TOLERANCE,
    histogram: histogramFor(offset),
  };
}

function drawHistogram(svg, bins) {
  const max = Math.max(...bins);
  const width = 320 / bins.length;
  svg.replaceChildren(...bins.map((v, i) => {
    const h = (v / max) * 76;
    const clipped = (i === 0 || i === bins.length - 1) && v / max > 0.2;
    return svgEl('rect', { x: i * width + 1, y: 80 - h, width: width - 2, height: h, class: clipped ? 'histogram__bar histogram__bar--clip' : 'histogram__bar' });
  }));
}

export function mount(host) {
  const state = { sceneEv: 12, focal: 35, mode: 'M', aperture: 2, shutter: 1 / 1000, iso: 100 };
  const scene = createScene();
  const histogram = svgEl('svg', { viewBox: '0 0 320 80', class: 'histogram', 'aria-hidden': 'true' });
  const readout = readoutBox();
  const live = liveRegion();

  const aperture = rangeControl({ label: 'Khẩu độ', values: aperturesFor(LENSES[35]), value: state.aperture, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const shutter = rangeControl({ label: 'Tốc độ màn trập', values: [...SHUTTERS].reverse(), value: state.shutter, format: formatShutter, onInput: (v) => update({ shutter: v }) });
  const iso = rangeControl({ label: 'ISO', values: ISOS, value: state.iso, format: formatIso, onInput: (v) => update({ iso: v }) });
  const sceneChoice = radioGroup({ legend: 'Ánh sáng của cảnh (EV100)', options: SCENES.map((s) => ({ value: s.ev, label: s.label })), value: state.sceneEv, onChange: (v) => update({ sceneEv: v }) });
  const lens = radioGroup({
    legend: 'Ống kính',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: state.focal,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });
  const mode = radioGroup({
    legend: 'Chế độ',
    options: [{ value: 'M', label: 'M: bạn tự chỉnh cả ba' }, { value: 'A', label: 'A: máy tự chọn tốc độ' }],
    value: state.mode,
    onChange: (v) => update({ mode: v, shutter: shutter.value }),
  });

  function update(patch) {
    Object.assign(state, patch);
    const r = computeExposure(state);
    shutter.setDisabled(state.mode === 'A');
    if (state.mode === 'A') shutter.set(r.shutter);
    scene.setExposure(Math.max(-5, Math.min(5, r.offset)));
    scene.setBackgroundBlur(r.backgroundBlurPx);
    scene.setMotionBlur(r.motionBlurPx);
    scene.setGrain(r.grain * 0.6);
    drawHistogram(histogram, r.histogram);
    const lines = [`Phơi sáng ${formatEv(r.offset)}: ${VERDICT_TEXT[r.verdict]}.`];
    if (state.mode === 'A') lines.push(`Máy đã chọn ${formatShutter(r.shutter)}.`);
    if (r.clamped === 'fast') lines.push('Ngay cả ở 1/8000 giây, ảnh vẫn nhận quá nhiều sáng. Hãy khép khẩu hoặc hạ ISO.');
    if (r.clamped === 'slow') lines.push('Ngay cả ở 30 giây, ảnh vẫn không nhận đủ sáng. Hãy mở khẩu hoặc tăng ISO.');
    if (r.shake) lines.push(`${formatShutter(r.shutter)} là quá chậm để cầm tay với ống ${state.focal}mm. Hãy dùng chân máy hoặc tốc độ nhanh hơn.`);
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, {
    view: [scene.svg, histogram],
    controls: [sceneChoice.el, lens.el, mode.el, aperture.el, shutter.el, iso.el],
    readout,
    live: live.el,
  });
  update({});
}
