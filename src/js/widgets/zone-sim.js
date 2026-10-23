import { LENSES, aperturesFor, depthOfField } from '../photo-math.js';
import { describeSharpZone, formatAperture, formatDistance } from '../format.js';
import { svgEl } from '../dom.js';
import { liveRegion, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

const FOCUS_MM = [1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000];
const PEOPLE_MM = [1000, 2000, 3000, 4500, 6000, 8000];
const AXIS_MAX_MM = 10000;
const X0 = 60;
const X1 = 600;
const xFor = (mm) => X0 + (Math.min(mm, AXIS_MAX_MM) / AXIS_MAX_MM) * (X1 - X0);

function createSidewalk() {
  const svg = svgEl('svg', { viewBox: '0 0 640 170', class: 'sim-diagram', 'aria-hidden': 'true' });
  const zone = svgEl('rect', { class: 'd-zone', y: 40, height: 70 });
  const people = PEOPLE_MM.map((mm) => {
    const dot = svgEl('circle', { cx: xFor(mm), cy: 75, r: 10 });
    return { mm, dot, group: svgEl('g', {}, [dot, svgEl('text', { x: xFor(mm), y: 135, 'text-anchor': 'middle', text: formatDistance(mm) })]) };
  });
  svg.append(
    svgEl('rect', { class: 'd-line', x: X0, y: 40, width: X1 - X0, height: 70, rx: 6 }),
    zone,
    ...people.map((p) => p.group),
    svgEl('rect', { class: 'd-muted', x: 14, y: 64, width: 30, height: 22, rx: 4 }),
    svgEl('text', { x: 14, y: 160, text: 'Bạn' }),
  );
  return {
    svg,
    update(dof) {
      const left = xFor(dof.near);
      zone.setAttribute('x', String(left));
      zone.setAttribute('width', String(Math.max(2, xFor(dof.far) - left)));
      for (const p of people) {
        const sharp = p.mm >= dof.near && p.mm <= dof.far;
        p.dot.setAttribute('class', sharp ? 'd-accent' : 'd-muted');
        p.dot.setAttribute('opacity', sharp ? '1' : '0.45');
      }
    },
  };
}

export function mount(host) {
  const state = { aperture: 8, focusMm: 3000 };
  const sidewalk = createSidewalk();
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Khẩu độ (35mm)', values: aperturesFor(LENSES[35]), value: 8, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const focus = rangeControl({ label: 'Khoảng cách lấy nét tay', values: FOCUS_MM, value: 3000, format: formatDistance, onInput: (v) => update({ focusMm: v }) });

  function update(patch) {
    Object.assign(state, patch);
    const dof = depthOfField(35, state.aperture, state.focusMm);
    sidewalk.update(dof);
    const inZone = PEOPLE_MM.filter((mm) => mm >= dof.near && mm <= dof.far).length;
    const lines = [
      `Lấy nét ở ${formatDistance(state.focusMm)} với ${formatAperture(state.aperture)}. ${describeSharpZone(dof)}`,
      `${inZone}/${PEOPLE_MM.length} người trên vỉa hè nằm trong vùng nét.`,
      'Dùng 1/500 giây để "đóng băng" người đi bộ.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [sidewalk.svg], controls: [aperture.el, focus.el], readout, live: live.el });
  update({});
}
