import { formatEv } from '../format.js';
import { checkbox, liveRegion, numberRange, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { createScene } from './scene.js';

export function mount(host) {
  const state = { show: false, ev: 0, feather: 12 };
  const scene = createScene({ label: 'Street scene with a gradient mask on the sky' });
  const readout = readoutBox();
  const live = liveRegion();
  const show = checkbox({ label: 'Show the mask in red', onChange: (v) => { state.show = v; update(); } });
  const ev = rangeControl({ label: 'Sky exposure', values: numberRange(-2, 2, 0.1), value: 0, format: formatEv, onInput: (v) => { state.ev = v; update(); } });
  const feather = rangeControl({ label: 'Feather', values: numberRange(0, 40, 2), value: 12, format: (v) => `${v} px`, spoken: (v) => `${v} pixels`, onInput: (v) => { state.feather = v; update(); } });

  function update() {
    scene.showMask(state.show);
    scene.setSkyExposure(state.ev);
    scene.setMaskFeather(state.feather);
    const lines = [
      `Sky ${formatEv(state.ev)}. The rest of the photo stays the same.`,
      state.feather < 4 ? 'Hard edge: the line of the mask may show.' : `Feather ${state.feather} px: a soft edge hides the change.`,
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [scene.svg], controls: [show.el, ev.el, feather.el], readout, live: live.el });
  update();
}
