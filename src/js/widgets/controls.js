import { el, uid } from '../dom.js';

export function numberRange(from, to, step) {
  const count = Math.round((to - from) / step) + 1;
  return Array.from({ length: count }, (_, i) => Math.round((from + i * step) * 100) / 100);
}

function nearestIndex(list, target) {
  let best = 0;
  list.forEach((v, i) => {
    if (Math.abs(v - target) < Math.abs(list[best] - target)) best = i;
  });
  return best;
}

export function rangeControl({ label, values, value, format, spoken = format, onInput }) {
  const id = uid('range');
  let list = values;
  const output = el('span', { class: 'sim-control__value', 'aria-hidden': 'true' });
  const input = el('input', { type: 'range', id, min: 0, max: list.length - 1, step: 1, value: nearestIndex(list, value) });
  const sync = () => {
    const current = list[Number(input.value)];
    output.textContent = format(current);
    input.setAttribute('aria-valuetext', spoken(current));
  };
  input.addEventListener('input', () => {
    sync();
    onInput(list[Number(input.value)]);
  });
  sync();
  return {
    el: el('div', { class: 'sim-control' }, [
      el('div', { class: 'sim-control__top' }, [el('label', { for: id, text: label }), output]),
      input,
    ]),
    get value() {
      return list[Number(input.value)];
    },
    set(v) {
      input.value = String(nearestIndex(list, v));
      sync();
    },
    setValues(next) {
      const current = list[Number(input.value)];
      list = next;
      input.max = String(list.length - 1);
      input.value = String(nearestIndex(list, current));
      sync();
    },
    setDisabled(flag) {
      input.disabled = flag;
    },
  };
}

export function radioGroup({ legend, options, value, onChange }) {
  const name = uid('radio');
  const inputs = [];
  const fieldset = el('fieldset', { class: 'sim-radios' }, [el('legend', { text: legend })]);
  for (const option of options) {
    const id = uid('option');
    const input = el('input', { type: 'radio', id, name, checked: option.value === value });
    input.addEventListener('change', () => {
      if (input.checked) onChange(option.value);
    });
    inputs.push([input, option.value]);
    fieldset.append(el('div', { class: 'sim-radio' }, [input, el('label', { for: id, text: option.label })]));
  }
  return {
    el: fieldset,
    set(v) {
      for (const [input, optionValue] of inputs) input.checked = optionValue === v;
    },
  };
}

export function checkbox({ label, checked = false, onChange }) {
  const id = uid('check');
  const input = el('input', { type: 'checkbox', id, checked });
  input.addEventListener('change', () => onChange(input.checked));
  return { el: el('div', { class: 'sim-check' }, [input, el('label', { for: id, text: label })]), input };
}

// Skips the first call (the readout drawn while the page loads) and debounces the rest,
// so screen readers only hear results the user asked for, once dragging stops.
export function createAnnouncer(write, delayMs = 500) {
  let first = true;
  let timer;
  return (text) => {
    if (first) {
      first = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => write(text), delayMs);
  };
}

export function liveRegion(delayMs = 500) {
  const node = el('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  return {
    el: node,
    announce: createAnnouncer((text) => {
      node.textContent = text;
    }, delayMs),
  };
}

export function readoutBox() {
  return el('div', { class: 'sim__readout' });
}

export function setReadout(box, lines) {
  box.replaceChildren(...lines.map((text) => el('p', { text })));
}

export function simLayout(host, { view, controls, readout, live, extra = [] }) {
  host.classList.add('sim');
  host.replaceChildren(
    el('div', { class: 'sim__view' }, view),
    el('div', { class: 'sim__panel' }, [el('div', { class: 'sim__controls' }, controls), readout, live, ...extra]),
  );
}
