import { SVG_NS, uid } from '../dom.js';

export const SCENE_WIDTH = 640;
export const SCENE_HEIGHT = 400;

// Fixed "photo" colors: the scene is a picture, so it does not follow the theme.
function markup(id) {
  return `
  <defs>
    <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2c3e66"/><stop offset="0.7" stop-color="#c9826b"/><stop offset="1" stop-color="#f3c27c"/>
    </linearGradient>
    <radialGradient id="${id}-vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="1"/>
    </radialGradient>
    <filter id="${id}-bg" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur data-bg-blur stdDeviation="0"/></filter>
    <filter id="${id}-motion" x="-40%" y="-10%" width="180%" height="120%"><feGaussianBlur data-motion stdDeviation="0 0"/></filter>
    <filter id="${id}-soft"><feGaussianBlur data-soft stdDeviation="0"/></filter>
    <filter id="${id}-tone" color-interpolation-filters="sRGB">
      <feColorMatrix data-sat type="saturate" values="1"/>
      <feComponentTransfer data-gain>
        <feFuncR type="linear" slope="1"/><feFuncG type="linear" slope="1"/><feFuncB type="linear" slope="1"/>
      </feComponentTransfer>
      <feComponentTransfer data-curve>
        <feFuncR type="table" tableValues="0 1"/><feFuncG type="table" tableValues="0 1"/><feFuncB type="table" tableValues="0 1"/>
      </feComponentTransfer>
    </filter>
    <filter id="${id}-sky-tone" color-interpolation-filters="sRGB">
      <feComponentTransfer data-sky-gain>
        <feFuncR type="linear" slope="1"/><feFuncG type="linear" slope="1"/><feFuncB type="linear" slope="1"/>
      </feComponentTransfer>
    </filter>
    <filter id="${id}-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="${id}-feather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur data-feather stdDeviation="12"/></filter>
    <mask id="${id}-sky-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="400">
      <rect x="-40" y="-40" width="720" height="180" fill="#fff" filter="url(#${id}-feather)"/>
    </mask>
    <g id="${id}-content">
      <rect width="640" height="400" fill="url(#${id}-sky)"/>
      <g filter="url(#${id}-bg)">
        <rect x="0" y="120" width="90" height="150" fill="#3a3f55"/>
        <rect x="80" y="90" width="70" height="180" fill="#454b66"/>
        <rect x="150" y="135" width="110" height="135" fill="#3d4259"/>
        <rect x="255" y="70" width="80" height="200" fill="#4b5170"/>
        <rect x="330" y="115" width="120" height="155" fill="#3a3f55"/>
        <rect x="445" y="95" width="85" height="175" fill="#474d69"/>
        <rect x="525" y="130" width="115" height="140" fill="#3d4259"/>
        <g fill="#ffd58a">
          <rect x="20" y="150" width="10" height="14"/><rect x="95" y="110" width="10" height="14"/><rect x="120" y="140" width="10" height="14"/>
          <rect x="180" y="160" width="10" height="14"/><rect x="270" y="95" width="10" height="14"/><rect x="300" y="130" width="10" height="14"/>
          <rect x="285" y="170" width="10" height="14"/><rect x="370" y="140" width="10" height="14"/><rect x="460" y="120" width="10" height="14"/>
          <rect x="490" y="150" width="10" height="14"/><rect x="560" y="155" width="10" height="14"/><rect x="600" y="190" width="10" height="14"/>
        </g>
        <g fill="#2f5a45"><circle cx="40" cy="250" r="34"/><circle cx="350" cy="255" r="28"/><circle cx="610" cy="245" r="38"/></g>
        <g fill="#ffe2a6"><circle cx="160" cy="205" r="7"/><circle cx="420" cy="200" r="7"/><circle cx="540" cy="215" r="6"/></g>
        <rect x="0" y="268" width="640" height="8" fill="#2b2e3b"/>
      </g>
      <rect x="0" y="276" width="640" height="124" fill="#6d6661"/>
      <rect x="0" y="276" width="640" height="10" fill="#857d77"/>
      <g stroke="#5a544f" stroke-width="2"><line x1="0" y1="330" x2="640" y2="330"/><line x1="0" y1="372" x2="640" y2="372"/></g>
      <g filter="url(#${id}-motion)">
        <g fill="none" stroke="#1d1f27" stroke-width="5">
          <circle cx="430" cy="318" r="26"/><circle cx="500" cy="318" r="26"/>
          <path d="M430 318 L458 280 L500 318 M458 280 L486 280 L500 318 M452 274 L470 274"/>
        </g>
        <path d="M462 272 L478 232 L490 230 L486 280 Z" fill="#2f7fb8"/>
        <circle cx="484" cy="220" r="11" fill="#d7a77f"/>
        <path d="M478 236 L500 262" stroke="#2f7fb8" stroke-width="7" stroke-linecap="round"/>
        <path d="M470 270 L462 300 M482 276 L490 300" stroke="#262838" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g>
        <ellipse cx="210" cy="388" rx="44" ry="8" fill="#000" opacity="0.25"/>
        <path d="M178 386 L182 300 L238 300 L242 386 Z" fill="#2b2d3a"/>
        <path d="M168 300 Q172 228 210 222 Q248 228 252 300 Z" fill="#c2563d"/>
        <rect x="202" y="206" width="16" height="20" fill="#cf9b74"/>
        <circle cx="210" cy="188" r="26" fill="#e0b48f"/>
        <path d="M184 186 Q186 156 212 158 Q238 158 236 186 Q228 170 210 172 Q192 172 184 186 Z" fill="#2a1d18"/>
        <circle cx="201" cy="190" r="2.6" fill="#2a1d18"/><circle cx="219" cy="190" r="2.6" fill="#2a1d18"/>
        <path d="M203 201 Q210 206 217 201" stroke="#8a4b3c" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
    </g>
  </defs>
  <g data-frame>
    <g filter="url(#${id}-soft)">
      <g filter="url(#${id}-tone)">
        <use href="#${id}-content"/>
        <use href="#${id}-content" mask="url(#${id}-sky-mask)" filter="url(#${id}-sky-tone)"/>
        <rect data-vignette width="640" height="400" fill="url(#${id}-vignette)" opacity="0"/>
        <circle data-dust cx="520" cy="70" r="6" fill="#1a1a1a" opacity="0"/>
      </g>
      <rect data-grain width="640" height="400" fill="#000" filter="url(#${id}-grain)" opacity="0" style="mix-blend-mode: overlay"/>
    </g>
    <rect data-mask-overlay x="-40" y="-40" width="720" height="180" fill="#ff3b3b" opacity="0" filter="url(#${id}-feather)"/>
  </g>`;
}

export function createScene({ label = 'Illustrated street at dusk with a person, a cyclist and city lights' } = {}) {
  const id = uid('scene');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`);
  svg.setAttribute('class', 'scene');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  svg.innerHTML = markup(id);

  const q = (selector) => svg.querySelector(selector);
  const gain = [...q('[data-gain]').children];
  const curve = [...q('[data-curve]').children];
  const skyGain = [...q('[data-sky-gain]').children];
  const state = { stops: 0, tint: { r: 1, g: 1, b: 1 } };

  const applyGain = () => {
    const k = 2 ** state.stops;
    gain[0].setAttribute('slope', String(k * state.tint.r));
    gain[1].setAttribute('slope', String(k * state.tint.g));
    gain[2].setAttribute('slope', String(k * state.tint.b));
  };

  return {
    svg,
    setExposure(stops) { state.stops = stops; applyGain(); },
    setTint({ r = 1, g = 1, b = 1 }) { state.tint = { r, g, b }; applyGain(); },
    setSaturation(s) { q('[data-sat]').setAttribute('values', String(s)); },
    setToneCurve(table) {
      const values = table.map((v) => v.toFixed(3)).join(' ');
      for (const fn of curve) fn.setAttribute('tableValues', values);
    },
    setBackgroundBlur(px) { q('[data-bg-blur]').setAttribute('stdDeviation', String(px)); },
    setMotionBlur(px) { q('[data-motion]').setAttribute('stdDeviation', `${px} 0`); },
    setGrain(amount) { q('[data-grain]').setAttribute('opacity', String(amount)); },
    setSoftness(px) { q('[data-soft]').setAttribute('stdDeviation', String(px)); },
    setVignette(amount) { q('[data-vignette]').setAttribute('opacity', String(amount)); },
    setRotation(deg) { q('[data-frame]').setAttribute('transform', `rotate(${deg} 320 200)`); },
    setDust(visible) { q('[data-dust]').setAttribute('opacity', visible ? '0.8' : '0'); },
    setSkyExposure(stops) {
      const k = String(2 ** stops);
      for (const fn of skyGain) fn.setAttribute('slope', k);
    },
    setMaskFeather(px) { q('[data-feather]').setAttribute('stdDeviation', String(px)); },
    showMask(visible) { q('[data-mask-overlay]').setAttribute('opacity', visible ? '0.45' : '0'); },
  };
}
