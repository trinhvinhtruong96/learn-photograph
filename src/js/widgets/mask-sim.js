import { formatEv } from '../format.js';
import { checkbox, liveRegion, numberRange, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { createScene } from './scene.js';

export function mount(host) {
  const state = { show: false, ev: 0, feather: 12 };
  const scene = createScene({ label: 'Cảnh đường phố có mặt nạ gradient trên bầu trời' });
  const readout = readoutBox();
  const live = liveRegion();
  const show = checkbox({ label: 'Hiện mặt nạ (màu đỏ)', onChange: (v) => { state.show = v; update(); } });
  const ev = rangeControl({ label: 'Phơi sáng bầu trời', values: numberRange(-2, 2, 0.1), value: 0, format: formatEv, onInput: (v) => { state.ev = v; update(); } });
  const feather = rangeControl({ label: 'Làm mềm viền', values: numberRange(0, 40, 2), value: 12, format: (v) => `${v} px`, spoken: (v) => `${v} điểm ảnh`, onInput: (v) => { state.feather = v; update(); } });

  function update() {
    scene.showMask(state.show);
    scene.setSkyExposure(state.ev);
    scene.setMaskFeather(state.feather);
    const lines = [
      `Bầu trời ${formatEv(state.ev)}. Phần còn lại của ảnh giữ nguyên.`,
      state.feather < 4 ? 'Viền cứng: đường mép mặt nạ có thể lộ ra.' : `Làm mềm viền ${state.feather} px: viền mềm giấu đi chỗ thay đổi.`,
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [scene.svg], controls: [show.el, ev.el, feather.el], readout, live: live.el });
  update();
}
