# Learn Photography App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-page web app that teaches one learner photography from zero to portfolio with their Sony α7 II, 35mm f/1.4, 85mm f/1.8, darktable 5.6 and GIMP 3.2. It has 11 stage pages, interactive simulators, SVG illustrations and saved practice progress.

**Architecture:** Plain HTML pages with ES modules and no framework. Vite serves and builds the 12 pages. `src/data/roadmap.js` is the single source for stage order and practice tasks. Shared JS renders the header, table of contents, checklist and pager around static lesson HTML. Simulators are small modules mounted into `[data-widget]` hosts. All photography math lives in pure, tested modules.

**Tech Stack:** Node 24, pnpm 10, Vite, Vitest, `@fontsource-variable/inter`, `@fontsource-variable/fraunces`. No other dependencies.

**Spec:** `docs/superpowers/specs/2026-10-22-photography-roadmap-design.md`. Research notes in `docs/research/` are the source of every camera/software label and number.

## Global Constraints

- Dependencies are exactly: dev `vite`, `vitest`; runtime `@fontsource-variable/inter`, `@fontsource-variable/fraunces`.
- Vanilla HTML/CSS/JS (ES modules). The app runs under `pnpm dev` / `pnpm preview`, not from `file://`.
- English only. Lesson text targets: Flesch Reading Ease ≥ 60 (`data-read="tech"` sections ≥ 50), Flesch-Kincaid grade ≤ 7 (tech ≤ 9), average sentence ≤ 15 words, no sentence over 25 words, paragraphs ≤ 3 sentences and ≤ 60 words. `pnpm check:readability` enforces these.
- Camera and software labels are copied verbatim from `docs/research/*.md`, wrapped in `<b class="ui">…</b>`, with menu paths joined by ` › `. Nothing else is bold. New terms are wrapped in `<dfn>` at first use.
- Notation: `f/2.8`, `1/250 s`, `ISO 400`, `85mm` (lens), `2 m`, `5500 K`, `+1 EV`. Use numerals for 2 and up.
- Facts come only from the spec or `docs/research/`. Anything else is checked against an official source first, or left out. Notes specific to Vietnam always come after the general rule.
- Inside `data-read` sections: no nested lists, no "e.g."/"i.e." (write "for example"), no "simply", "just" or "obviously", and no negative contractions.
- localStorage keys: `lp:progress:v1` (progress) and `lp:theme` (`"dark"`/`"light"`).
- Formula constants: circle of confusion 0.03 mm, pixel pitch 5.97 µm, frame width 36 mm.
- Stage ids, in order: `exposure`, `focus`, `composition`, `light`, `editing`, `advanced-editing`, `portrait`, `street`, `landscape`, `night`, `your-eye`.
- WCAG AA contrast in both themes. Native inputs with visible labels. Full keyboard operation. `prefers-reduced-motion` respected.
- Git prints CRLF warnings on Windows; ignore them.

## Review Focus

1. **localStorage blocked or throwing** (private mode, disabled storage): every page still renders, checkboxes work for the session, nothing throws. Test in Task 2.
2. **A-mode settings beyond the camera's range** (bright sun, f/1.4, ISO 25600): the simulator pins the shutter at 1/8000 s and says "too bright". It never shows NaN or a blank readout. Test in Task 6.
3. **Focus at or beyond the hyperfocal distance**: the far limit reads "infinity" and depth-of-field text never prints `Infinity` or `NaN`. Test in Task 1.
4. **Background right behind the subject (0 m)** in the background-blur simulator: blur 0%, ratio finite. Test in Task 13.
5. **Corrupt or stale saved progress** (old assignment ids, duplicates, wrong JSON shape, a stage with no tasks): ignored, done never exceeds total, no NaN%. Test in Task 2.

## File Map

| Path | Responsibility | Task |
|---|---|---|
| `package.json`, `vite.config.js`, `.gitignore` | Scripts, build inputs, test config | 1, 5 |
| `src/js/photo-math.js` | Exposure, DoF, blur, star and handheld formulas; stop ladders; lens data | 1 |
| `src/js/format.js` | Display strings for apertures, shutter speeds, distances, EV | 1 |
| `src/js/tone.js` | Tone-curve tables, presets, description | 1 |
| `src/js/progress.js` | Progress store over localStorage | 2 |
| `src/data/roadmap.js` | Stages, practice tasks, neighbors, week labels | 3 |
| `scripts/readability-lib.js`, `scripts/readability.js` | Readability metrics and CLI | 4 |
| `src/styles/*.css` | Tokens, base, components | 5 |
| `src/js/dom.js` | `el`, `svgEl`, `uid` helpers | 5 |
| `src/js/theme.js`, `src/js/layout.js` | Theme toggle, header, footer | 5 |
| `src/js/stage-page.js` | Stage header, TOC, drawer, checklist, pager | 5 |
| `src/js/home.js` | Home roadmap, plan, overall progress, reset | 5 |
| `src/js/illustrations.js`, `src/js/widgets/mount.js`, `src/js/main.js` | Mount illustrations/widgets; page bootstrap | 5 |
| `index.html`, `stages/*.html` | Home page; 11 stage pages | 5, 7–17 |
| `src/js/widgets/controls.js` | Labelled range/radio/checkbox controls, live region, layout | 6 |
| `src/js/widgets/scene.js` | Shared SVG street scene with filter hooks | 6 |
| `src/js/widgets/*-sim.js`, `src/js/widgets/edit-steps.js` | One simulator per file | 6, 8–16 |
| `src/illustrations/*.svg` | Lesson diagrams | 7–17 |
| `tests/*.test.js` | Unit tests | 1–4, 6, 9–13 |
| `README.md` | How to run and check | 18 |

## Content Conventions (used by Tasks 5–17)

### Stage page section order

`#stage-header` (rendered) → lesson sections → `#key-terms` → `#simulator` (one or two sections) → `#warm-up` (stages 2–11) → `#practice` (rendered checklist) → `#mistakes` → `#self-check` → `#learn-more` → `#stage-pager` (rendered).

### Lesson markup (every lesson follows this shape)

Do not put `<section>` elements inside each other. Each lesson's `id` is used for TOC anchors and readability reports. The `.callout-label` spans are ignored by the readability checker. Exemplar (Stage 1, lesson 3):

```html
<section class="lesson" id="aperture" data-read="lesson">
  <h2>Aperture controls light and blur</h2>
  <div class="callout callout--sentence">
    <span class="callout-label">In one sentence</span>
    <p>The aperture is a hole in your lens. Its size sets the light and the background blur.</p>
  </div>
  <p>The <dfn>aperture</dfn> is a hole inside your lens. You set its size with the <dfn>f-number</dfn>. A small number, like f/1.8, means a big hole.</p>
  <p>A big hole lets in more light and blurs the background. A big number, like f/8, means a small hole. You get less light, but more of the scene is sharp.</p>
  <div class="callout callout--picture">
    <span class="callout-label">Picture it</span>
    <p>Read the f-number as a fraction. f/2 is a half. f/8 is an eighth. A half is bigger than an eighth, so f/2 is the bigger hole.</p>
  </div>
  <figure class="illus">
    <div data-illus="f-number-fraction"></div>
    <figcaption>Smaller f-number, bigger hole. Each full stop to the right lets in half the light.</figcaption>
  </figure>
  <p>The full stops on your lenses are f/1.4, 2, 2.8, 4, 5.6, 8, 11 and 16. Each step to the right lets in half the light.</p>
  <div class="callout callout--example">
    <span class="callout-label">Example</span>
    <p>A portrait with the 85mm at f/1.8: the face is sharp and the background turns into soft shapes. A group photo with the 35mm at f/8: every face is sharp.</p>
  </div>
  <div class="callout callout--camera">
    <span class="callout-label">On your α7 II</span>
    <p>Turn the mode dial to <b class="ui">A</b> (Aperture Priority). Turn the front or rear dial to change the f-number. The camera picks the shutter speed for you.</p>
  </div>
  <div class="callout callout--try">
    <span class="callout-label">Try it now</span>
    <p>Put a cup on a table with a busy background. Shoot it at f/1.4, f/4 and f/16 with the 35mm. Compare the backgrounds.</p>
  </div>
</section>
```

Callout classes: `callout--sentence`, `callout--picture`, `callout--example`, `callout--camera` (label "On your α7 II", "In darktable" or "In GIMP"), `callout--try`, `callout--mistake`.

### Other stage sections

```html
<section class="key-terms" id="key-terms" data-read="tech">
  <h2>Key terms</h2>
  <dl class="terms">
    <dt><dfn>Stop</dfn></dt><dd>A step that doubles or halves the light.</dd>
  </dl>
</section>

<section class="simulator wide" id="simulator">
  <h2>Play with exposure</h2>
  <p>One or two sentences on what to try.</p>
  <div data-widget="exposure-sim"></div>
</section>

<section class="warmup" id="warm-up" data-read="lesson">
  <h2>Warm-up</h2>
  <p>One short exercise that repeats an earlier skill.</p>
</section>

<section class="mistakes" id="mistakes" data-read="lesson">
  <h2>Common mistakes</h2>
  <ul class="mistakes__list">
    <li><p class="mistake">Thinking f/8 is a bigger hole than f/2.</p><p class="fix">The f-number is a fraction. f/2 is a half and f/8 is an eighth.</p></li>
  </ul>
</section>

<section class="self-check" id="self-check" data-read="lesson">
  <h2>Self-check</h2>
  <details class="quiz">
    <summary>Which is the bigger hole: f/2 or f/8?</summary>
    <p>f/2. A smaller f-number means a bigger hole.</p>
  </details>
</section>

<section class="learn-more" id="learn-more">
  <h2>Learn more</h2>
  <ul>
    <li><a href="https://helpguide.sony.net/ilc/1450/v1/en/index.html">Sony α7 II Help Guide</a></li>
  </ul>
</section>
```

### Illustrations

- One file per diagram in `src/illustrations/<name>.svg`, placed with `<figure class="illus"><div data-illus="<name>"></div><figcaption>…</figcaption></figure>`.
- Root element: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 H" role="img" aria-label="…">` plus `<title>` with the same text. No fixed `width`/`height`. No IDs: the same SVG may appear twice on a page.
- Colors only through classes styled in `components.css`: `i-line` (stroke), `i-fill`, `i-accent`, `i-accent-line`, `i-muted`, `i-cool`, `i-cool-line`, `i-text` (16px), `i-text-muted` (14px). No hex colors, so both themes work.
- Text inside SVGs follows the same plain-language rules. Labels ≤ 4 words.
- Exemplar (`src/illustrations/f-number-fraction.svg`):

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" role="img" aria-label="Four lens openings shrink from f/1.4 to f/4. Each step lets in half the light of the one before.">
  <title>Four lens openings shrink from f/1.4 to f/4. Each step lets in half the light of the one before.</title>
  <g>
    <circle class="i-fill" cx="100" cy="110" r="60"/>
    <circle class="i-line" cx="100" cy="110" r="60"/>
    <circle class="i-accent" cx="100" cy="110" r="56"/>
    <text class="i-text" x="100" y="205" text-anchor="middle">f/1.4</text>
  </g>
  <g>
    <circle class="i-line" cx="250" cy="110" r="60"/>
    <circle class="i-accent" cx="250" cy="110" r="40"/>
    <text class="i-text" x="250" y="205" text-anchor="middle">f/2</text>
  </g>
  <g>
    <circle class="i-line" cx="400" cy="110" r="60"/>
    <circle class="i-accent" cx="400" cy="110" r="28"/>
    <text class="i-text" x="400" y="205" text-anchor="middle">f/2.8</text>
  </g>
  <g>
    <circle class="i-line" cx="550" cy="110" r="60"/>
    <circle class="i-accent" cx="550" cy="110" r="20"/>
    <text class="i-text" x="550" y="205" text-anchor="middle">f/4</text>
  </g>
  <path class="i-accent-line" d="M160 30 H500"/>
  <path class="i-accent-line" d="M490 22 L505 30 L490 38"/>
  <text class="i-text-muted" x="330" y="20" text-anchor="middle">half the light each step</text>
</svg>
```

(Radii follow 56 × 1.4/N, so the area halves each stop.)

### Content workflow for every stage task

1. Write the illustrations listed in the task.
2. Write the lessons in the stage page, in the task's lesson order, using the outline in the spec section named in the task. Every lesson has all six parts (§4.1 of the spec), and every number comes from the spec or `docs/research/`.
3. Add key terms, simulator section(s), warm-up, mistakes, self-check and learn-more exactly as listed in the task.
4. Run `pnpm check:readability stages/<id>.html`. Rewrite the sentences it reports until it exits 0. Never change a fact to pass a check.
5. Label check: list every `<b class="ui">` on the page and confirm each label (each part of a path) appears in `docs/research/*.md` or in the official manual page you opened. Fix or remove any that do not.
6. Analogy check: use only the analogies in spec §4.3 "Use". Never use any from the "Avoid" list: "ISO = sensor sensitivity", an equal-sided exposure triangle, "telephoto compresses", "golden hour" taken literally, "warm = high Kelvin", "bokeh = amount of blur", "hyperfocal = perfectly sharp".
7. Run `pnpm test` and `pnpm build`.
8. Smoke test: `pnpm dev`, open the page, check that all illustrations render in both themes, the simulator works by mouse and keyboard, the TOC lists every lesson, ticking a practice task updates the header progress, and the console shows no errors.
9. Commit.

---

### Task 1: Project scaffold and pure photography math

**Files:**
- Create: `package.json`, `.gitignore`, `vite.config.js`
- Create: `src/js/photo-math.js`, `src/js/format.js`, `src/js/tone.js`
- Test: `tests/photo-math.test.js`, `tests/format.test.js`, `tests/tone.test.js`

**Interfaces:**
- Produces (`src/js/photo-math.js`):
  - `COC_MM`, `PIXEL_PITCH_UM`, `FRAME_WIDTH_MM`, `SHAKE_TOLERANCE`
  - `LENSES` (`{35: {focal, maxAperture, label}, 85: {…}}`), `APERTURES`, `SHUTTERS` (seconds, fastest first), `ISOS`
  - `aperturesFor(lens) → number[]`, `settingsEv({aperture, shutter, iso}) → number`, `exposureOffset(sceneEv100, settings) → number`, `autoShutter(sceneEv100, aperture, iso) → {shutter, clamped: 'none'|'fast'|'slow'}`
  - `hyperfocalMm(f, N, c?)`, `depthOfField(f, N, sMm, c?) → {near, far, total, hyperfocal}`, `blurDiscMm(f, N, subjectMm, objectMm)`, `blurPercentOfFrame(mm)`, `sameFramingDistanceMm(fromF, fromSMm, toF)`
  - `rule500Seconds(f)`, `npfSeconds(f, N, pitch?)`, `handheldLimitSeconds(f, stops?)`, `slowestSafeShutter(limitSeconds)`, `horizontalFovDeg(f)`
- Produces (`src/js/format.js`): `formatAperture(n)`, `formatShutter(t)`, `shutterSpoken(t)`, `formatIso(iso)`, `formatEv(ev)`, `formatDistance(mm, digits = 1)`, `formatSeconds(t)`, `formatPercent(p)`, `formatKelvin(k)`, `describeSharpZone({near, far})` (switches to 2 digits when both ends would read the same), `describeDepth({total})`
- Produces (`src/js/tone.js`): `CURVE_PRESETS` (`linear`, `contrast`, `matte`, `shadows`; each `{label, blacks, shadows, mids, highlights}`), `curvePoints(levels) → [x, y][]`, `curveTable(points, samples = 17) → number[]`, `describeCurve(levels) → string`

- [ ] **Step 1: Create the project files**

`package.json`:

```json
{
  "name": "learn-photograph",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "check:readability": "node scripts/readability.js"
  }
}
```

`.gitignore`:

```
node_modules/
dist/
```

`vite.config.js` (Task 5 adds the build inputs):

```js
import { defineConfig } from 'vite';

export default defineConfig({
  test: { include: ['tests/**/*.test.js'] },
});
```

Run: `pnpm add -D vite vitest` then `pnpm add @fontsource-variable/inter @fontsource-variable/fraunces`
Expected: install succeeds. If pnpm prints "Ignored build scripts: esbuild", that is fine: Vite works without it.

- [ ] **Step 2: Write the failing tests**

`tests/photo-math.test.js`:

```js
import { describe, expect, test } from 'vitest';
import {
  LENSES, aperturesFor, autoShutter, blurDiscMm, blurPercentOfFrame, depthOfField, exposureOffset,
  handheldLimitSeconds, horizontalFovDeg, hyperfocalMm, npfSeconds, rule500Seconds,
  sameFramingDistanceMm, settingsEv, slowestSafeShutter,
} from '../src/js/photo-math.js';

const near = (actual, expected, pct = 1) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.abs(expected) * (pct / 100));

describe('exposure value', () => {
  test('f/16, 1/125 s, ISO 100 is EV 15 (sunny 16)', () => {
    near(settingsEv({ aperture: 16, shutter: 1 / 125, iso: 100 }), 15);
  });
  test('equivalent exposures land within 0.1 EV of each other', () => {
    const evs = [[2.8, 1 / 500], [4, 1 / 250], [5.6, 1 / 125]].map(([aperture, shutter]) =>
      settingsEv({ aperture, shutter, iso: 100 }));
    expect(Math.max(...evs) - Math.min(...evs)).toBeLessThan(0.1);
  });
  test('doubling ISO needs one stop less light', () => {
    const base = settingsEv({ aperture: 4, shutter: 1 / 250, iso: 100 });
    near(settingsEv({ aperture: 4, shutter: 1 / 250, iso: 200 }), base - 1);
  });
  test('positive offset means too bright: f/2, 1/250 s, ISO 200 in open shade is 3 stops over', () => {
    near(exposureOffset(12, { aperture: 2, shutter: 1 / 250, iso: 200 }), 3, 2);
  });
  test('open shade example f/2, 1/1000 s, ISO 100 is correct', () => {
    expect(Math.abs(exposureOffset(12, { aperture: 2, shutter: 1 / 1000, iso: 100 }))).toBeLessThan(0.1);
  });
});

describe('aperture priority (A mode)', () => {
  test('picks the nearest full-stop shutter speed', () => {
    expect(autoShutter(12, 2, 100)).toEqual({ shutter: 1 / 1000, clamped: 'none' });
  });
  test('dim street at f/16, ISO 100 needs about 15 s', () => {
    expect(autoShutter(4, 16, 100)).toEqual({ shutter: 15, clamped: 'none' });
  });
  test('pins to 1/8000 s when even that lets in too much light', () => {
    expect(autoShutter(15, 1.4, 25600)).toEqual({ shutter: 1 / 8000, clamped: 'fast' });
  });
  test('pins to 30 s when even that is too short', () => {
    expect(autoShutter(-4, 16, 100)).toEqual({ shutter: 30, clamped: 'slow' });
  });
});

describe('depth of field', () => {
  test('hyperfocal distance for 35mm at f/8', () => near(hyperfocalMm(35, 8), 5139));
  test('35mm f/8 focused at 3 m', () => {
    const d = depthOfField(35, 8, 3000);
    near(d.near, 1898);
    near(d.far, 7158);
  });
  test('85mm f/1.8 focused at 2 m keeps about 5.7 cm sharp', () => {
    const d = depthOfField(85, 1.8, 2000);
    near(d.near, 1972);
    near(d.far, 2029);
    near(d.total, 57.2, 3);
  });
  test('35mm f/1.4 focused at 1 m', () => {
    const d = depthOfField(35, 1.4, 1000);
    near(d.near, 968);
    near(d.far, 1034);
  });
  test('focused at the hyperfocal distance, sharpness runs from half of it to infinity', () => {
    const h = hyperfocalMm(35, 8);
    const d = depthOfField(35, 8, h);
    near(d.near, h / 2);
    expect(d.far).toBe(Infinity);
  });
  test('focused beyond the hyperfocal distance, far limit and total are infinite', () => {
    const d = depthOfField(35, 8, 6000);
    expect(d.far).toBe(Infinity);
    expect(d.total).toBe(Infinity);
    expect(d.near).toBeLessThan(6000);
  });
});

describe('background blur', () => {
  test('85mm f/1.8, subject 2 m, background 6 m', () => {
    near(blurDiscMm(85, 1.8, 2000, 6000), 1.397);
    near(blurPercentOfFrame(blurDiscMm(85, 1.8, 2000, 6000)), 3.88);
  });
  test('35mm f/1.4 from the same spot', () => near(blurDiscMm(35, 1.4, 2000, 6000), 0.297));
  test('same framing with the 35mm means 0.82 m away and about 1.5 times less blur', () => {
    const s35 = sameFramingDistanceMm(85, 2000, 35);
    near(s35, 823.5);
    near(blurDiscMm(85, 1.8, 2000, 6000) / blurDiscMm(35, 1.4, s35, s35 + 4000), 1.52, 2);
  });
  test('an object at the focus distance has no blur', () => expect(blurDiscMm(85, 1.8, 2000, 2000)).toBe(0));
});

describe('star and handheld limits', () => {
  test('NPF for 35mm at f/1.4 and f/2', () => {
    near(npfSeconds(35, 1.4), 6.51);
    near(npfSeconds(35, 2), 7.11);
  });
  test('500 rule for 35mm', () => near(rule500Seconds(35), 14.29));
  test('handheld limit doubles per stabilizer stop', () => {
    near(handheldLimitSeconds(85), 1 / 85);
    near(handheldLimitSeconds(35, 2), 4 / 35);
  });
  test('slowest safe full-stop shutter speeds', () => {
    expect(slowestSafeShutter(handheldLimitSeconds(35, 2))).toBe(1 / 8);
    expect(slowestSafeShutter(handheldLimitSeconds(85, 2))).toBe(1 / 30);
    expect(slowestSafeShutter(handheldLimitSeconds(85, 0))).toBe(1 / 125);
  });
  test('horizontal field of view', () => {
    near(horizontalFovDeg(35), 54.43);
    near(horizontalFovDeg(85), 23.91);
  });
});

describe('lens apertures', () => {
  test('each lens starts at its widest aperture and ends at f/16', () => {
    expect(aperturesFor(LENSES[35])).toEqual([1.4, 2, 2.8, 4, 5.6, 8, 11, 16]);
    expect(aperturesFor(LENSES[85])).toEqual([1.8, 2, 2.8, 4, 5.6, 8, 11, 16]);
  });
});
```

`tests/format.test.js`:

```js
import { describe, expect, test } from 'vitest';
import {
  describeDepth, describeSharpZone, formatAperture, formatDistance, formatEv, formatSeconds,
  formatShutter, shutterSpoken,
} from '../src/js/format.js';

test.each([[1.4, 'f/1.4'], [2, 'f/2'], [16, 'f/16']])('aperture %s → %s', (n, text) => {
  expect(formatAperture(n)).toBe(text);
});
test.each([[1 / 8000, '1/8000 s'], [1 / 250, '1/250 s'], [1 / 2, '1/2 s'], [1, '1 s'], [15, '15 s']])(
  'shutter %s → %s', (t, text) => expect(formatShutter(t)).toBe(text));
test.each([[1 / 250, '1/250 of a second'], [1, '1 second'], [2, '2 seconds']])(
  'spoken shutter %s → %s', (t, text) => expect(shutterSpoken(t)).toBe(text));
test.each([[57, '5.7 cm'], [968, '97 cm'], [1898, '1.9 m'], [7158, '7.2 m'], [12000, '12 m'], [Infinity, 'infinity']])(
  'distance %s mm → %s', (mm, text) => expect(formatDistance(mm)).toBe(text));
test.each([[1, '+1.0 EV'], [-0.3, '\u22120.3 EV'], [0.02, '0.0 EV'], [-0.04, '0.0 EV']])(
  'EV %s → %s', (ev, text) => expect(formatEv(ev)).toBe(text));
test('seconds keep one decimal', () => expect(formatSeconds(6.51)).toBe('6.5 s'));

describe('sharp zone text', () => {
  test('finite zone', () => {
    expect(describeSharpZone({ near: 1898, far: 7158 })).toBe('Sharp from 1.9 m to 7.2 m.');
  });
  test('zone that reaches infinity', () => {
    expect(describeSharpZone({ near: 2570, far: Infinity })).toBe('Sharp from 2.6 m to infinity.');
  });
  test('a very thin zone shows two decimals so the ends differ', () => {
    expect(describeSharpZone({ near: 1971.8, far: 2029.0 })).toBe('Sharp from 1.97 m to 2.03 m.');
  });
  test('depth text never prints Infinity or NaN', () => {
    expect(describeDepth({ total: Infinity })).toBe('Depth of field: everything from the near limit to infinity.');
    expect(describeDepth({ total: 57.2 })).toBe('Depth of field: 5.7 cm.');
  });
});
```

`tests/tone.test.js`:

```js
import { expect, test } from 'vitest';
import { CURVE_PRESETS, curvePoints, curveTable, describeCurve } from '../src/js/tone.js';

test('straight line gives an identity table', () => {
  curveTable(curvePoints(CURVE_PRESETS.linear)).forEach((v, i) => expect(v).toBeCloseTo(i / 16, 5));
});
test('S-curve darkens shadows and brightens highlights', () => {
  const table = curveTable(curvePoints(CURVE_PRESETS.contrast));
  expect(table[4]).toBeCloseTo(0.18, 5);
  expect(table[12]).toBeCloseTo(0.82, 5);
});
test('values outside 0 to 1 are clamped', () => {
  const table = curveTable([[0, -0.2], [1, 1.3]]);
  expect(Math.min(...table)).toBe(0);
  expect(Math.max(...table)).toBe(1);
});
test('describes contrast and matte looks', () => {
  expect(describeCurve(CURVE_PRESETS.contrast)).toContain('more contrast');
  expect(describeCurve(CURVE_PRESETS.matte)).toContain('matte');
  expect(describeCurve(CURVE_PRESETS.linear)).toContain('normal');
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL, the modules cannot be resolved (`Failed to load url ../src/js/photo-math.js`).

- [ ] **Step 4: Implement the modules**

`src/js/photo-math.js`:

```js
// Pure photography formulas. No DOM access. Distances in mm, times in seconds.

export const COC_MM = 0.03;
export const PIXEL_PITCH_UM = 5.97;
export const FRAME_WIDTH_MM = 36;
// A shutter speed up to 20% slower than the computed limit still counts as safe (nominal speeds are rounded).
export const SHAKE_TOLERANCE = 1.2;

export const LENSES = {
  35: { focal: 35, maxAperture: 1.4, label: '35mm f/1.4' },
  85: { focal: 85, maxAperture: 1.8, label: '85mm f/1.8' },
};

export const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
export const SHUTTERS = [
  1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15,
  1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30,
];
export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

const HALF_STOP = Math.SQRT2;

export function aperturesFor(lens) {
  return [lens.maxAperture, ...APERTURES.filter((n) => n > lens.maxAperture)];
}

export function settingsEv({ aperture, shutter, iso }) {
  return Math.log2((aperture * aperture) / shutter) - Math.log2(iso / 100);
}

// Positive = brighter than a correct exposure.
export function exposureOffset(sceneEv100, settings) {
  return sceneEv100 - settingsEv(settings);
}

export function autoShutter(sceneEv100, aperture, iso) {
  const ideal = (aperture * aperture) / 2 ** (sceneEv100 + Math.log2(iso / 100));
  const fastest = SHUTTERS[0];
  const slowest = SHUTTERS[SHUTTERS.length - 1];
  if (ideal < fastest / HALF_STOP) return { shutter: fastest, clamped: 'fast' };
  if (ideal > slowest * HALF_STOP) return { shutter: slowest, clamped: 'slow' };
  let best = fastest;
  for (const t of SHUTTERS) {
    if (Math.abs(Math.log2(t / ideal)) < Math.abs(Math.log2(best / ideal))) best = t;
  }
  return { shutter: best, clamped: 'none' };
}

export function hyperfocalMm(focalMm, aperture, coc = COC_MM) {
  return (focalMm * focalMm) / (aperture * coc) + focalMm;
}

export function depthOfField(focalMm, aperture, subjectMm, coc = COC_MM) {
  const hyperfocal = hyperfocalMm(focalMm, aperture, coc);
  const near = (subjectMm * (hyperfocal - focalMm)) / (hyperfocal + subjectMm - 2 * focalMm);
  const far = subjectMm < hyperfocal
    ? (subjectMm * (hyperfocal - focalMm)) / (hyperfocal - subjectMm)
    : Infinity;
  return { near, far, total: far - near, hyperfocal };
}

// Blur disc on the sensor for an object at objectMm when focused at subjectMm.
export function blurDiscMm(focalMm, aperture, subjectMm, objectMm) {
  return ((focalMm * focalMm) / (aperture * (subjectMm - focalMm))) * (Math.abs(objectMm - subjectMm) / objectMm);
}

export function blurPercentOfFrame(blurMm) {
  return (blurMm / FRAME_WIDTH_MM) * 100;
}

// Distance that keeps the subject the same size in the frame with another lens.
export function sameFramingDistanceMm(fromFocalMm, fromSubjectMm, toFocalMm) {
  return toFocalMm + ((fromSubjectMm - fromFocalMm) * toFocalMm) / fromFocalMm;
}

export function rule500Seconds(focalMm) {
  return 500 / focalMm;
}

// Simplified NPF rule by Frédéric Michaud (Société Astronomique du Havre).
export function npfSeconds(focalMm, aperture, pitchUm = PIXEL_PITCH_UM) {
  return (35 * aperture + 30 * pitchUm) / focalMm;
}

export function handheldLimitSeconds(focalMm, stabilizerStops = 0) {
  return (1 / focalMm) * 2 ** stabilizerStops;
}

export function slowestSafeShutter(limitSeconds) {
  const safe = SHUTTERS.filter((t) => t <= limitSeconds * SHAKE_TOLERANCE);
  return safe.length ? safe[safe.length - 1] : SHUTTERS[0];
}

export function horizontalFovDeg(focalMm) {
  return (2 * Math.atan(FRAME_WIDTH_MM / (2 * focalMm)) * 180) / Math.PI;
}
```

`src/js/format.js`:

```js
const MINUS = '\u2212';

export function formatAperture(n) {
  return `f/${n}`;
}

export function formatShutter(t) {
  return t >= 1 ? `${t} s` : `1/${Math.round(1 / t)} s`;
}

export function shutterSpoken(t) {
  if (t >= 1) return `${t} ${t === 1 ? 'second' : 'seconds'}`;
  return `1/${Math.round(1 / t)} of a second`;
}

export function formatIso(iso) {
  return `ISO ${iso}`;
}

export function formatEv(ev) {
  const rounded = Math.round(ev * 10) / 10;
  if (rounded === 0) return '0.0 EV';
  return `${rounded > 0 ? '+' : MINUS}${Math.abs(rounded).toFixed(1)} EV`;
}

export function formatDistance(mm, digits = 1) {
  if (!Number.isFinite(mm)) return 'infinity';
  if (mm < 100) return `${(mm / 10).toFixed(1)} cm`;
  if (mm < 1000) return digits > 1 ? `${(mm / 10).toFixed(1)} cm` : `${Math.round(mm / 10)} cm`;
  if (mm < 10000) return `${(mm / 1000).toFixed(digits)} m`;
  return `${Math.round(mm / 1000)} m`;
}

export function formatSeconds(t) {
  return `${t.toFixed(1)} s`;
}

export function formatPercent(p) {
  return `${p.toFixed(1)}%`;
}

export function formatKelvin(k) {
  return `${k} K`;
}

export function describeSharpZone({ near, far }) {
  let from = formatDistance(near);
  let to = formatDistance(far);
  if (from === to) {
    from = formatDistance(near, 2);
    to = formatDistance(far, 2);
  }
  return `Sharp from ${from} to ${to}.`;
}

export function describeDepth({ total }) {
  return Number.isFinite(total)
    ? `Depth of field: ${formatDistance(total)}.`
    : 'Depth of field: everything from the near limit to infinity.';
}
```

`src/js/tone.js`:

```js
export const CURVE_PRESETS = {
  linear: { label: 'Straight line', blacks: 0, shadows: 0.25, mids: 0.5, highlights: 0.75 },
  contrast: { label: 'S-curve', blacks: 0, shadows: 0.18, mids: 0.5, highlights: 0.82 },
  matte: { label: 'Matte', blacks: 0.12, shadows: 0.3, mids: 0.52, highlights: 0.78 },
  shadows: { label: 'Open shadows', blacks: 0, shadows: 0.35, mids: 0.56, highlights: 0.78 },
};

export function curvePoints({ blacks, shadows, mids, highlights }) {
  return [[0, blacks], [0.25, shadows], [0.5, mids], [0.75, highlights], [1, 1]];
}

// Piecewise-linear curve sampled into a feComponentTransfer table.
export function curveTable(points, samples = 17) {
  const pts = [...points].sort((a, b) => a[0] - b[0]);
  const table = [];
  for (let i = 0; i < samples; i += 1) {
    const x = i / (samples - 1);
    let j = 0;
    while (j < pts.length - 2 && x > pts[j + 1][0]) j += 1;
    const [x0, y0] = pts[j];
    const [x1, y1] = pts[j + 1];
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    table.push(Math.min(1, Math.max(0, y0 + t * (y1 - y0))));
  }
  return table;
}

export function describeCurve(levels) {
  const table = curveTable(curvePoints(levels), 17);
  const midSlope = (table[10] - table[6]) / 0.25;
  const parts = [];
  if (midSlope > 1.1) parts.push('more contrast in the midtones');
  else if (midSlope < 0.9) parts.push('less contrast in the midtones');
  else parts.push('normal midtone contrast');
  if (levels.blacks >= 0.05) parts.push('lifted blacks give a matte look');
  if (levels.mids > 0.53) parts.push('the photo is brighter overall');
  else if (levels.mids < 0.47) parts.push('the photo is darker overall');
  return `Result: ${parts.join(', ')}.`;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS (3 files).

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .gitignore vite.config.js src/js/photo-math.js src/js/format.js src/js/tone.js tests
git commit -m "feat: project scaffold and photography math"
```

---

### Task 2: Progress store

**Files:**
- Create: `src/js/progress.js`
- Test: `tests/progress.test.js`

**Interfaces:**
- Consumes: stage objects shaped `{ id, assignments: [{ id }] }` (Task 3 provides the real list).
- Produces: `PROGRESS_KEY = 'lp:progress:v1'`, `createProgressStore(storage, stages)` returning:
  - `isDone(stageId, assignmentId) → boolean`
  - `setDone(stageId, assignmentId, done)`, which throws on unknown ids
  - `stageStats(stageId) → {done, total, percent, status}` with `status` one of `'not-started' | 'in-progress' | 'done'`
  - `overallStats() → same shape`
  - `reset()`

- [ ] **Step 1: Write the failing test**

`tests/progress.test.js`:

```js
import { describe, expect, test } from 'vitest';
import { PROGRESS_KEY, createProgressStore } from '../src/js/progress.js';

const STAGES = [
  { id: 'a', assignments: [{ id: 'a1' }, { id: 'a2' }] },
  { id: 'b', assignments: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }, { id: 'b4' }] },
  { id: 'empty', assignments: [] },
];

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

function throwingStorage() {
  const fail = () => { throw new DOMException('blocked', 'SecurityError'); };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

describe('progress store', () => {
  test('starts empty', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    expect(store.stageStats('a')).toEqual({ done: 0, total: 2, percent: 0, status: 'not-started' });
  });

  test('saves ticks and a new store reads them back', () => {
    const storage = memoryStorage();
    createProgressStore(storage, STAGES).setDone('a', 'a1', true);
    const reloaded = createProgressStore(storage, STAGES);
    expect(reloaded.isDone('a', 'a1')).toBe(true);
    expect(JSON.parse(storage.data.get(PROGRESS_KEY))).toEqual({ a: ['a1'] });
  });

  test('status moves from not started to in progress to done, and back', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    store.setDone('a', 'a1', true);
    expect(store.stageStats('a').status).toBe('in-progress');
    store.setDone('a', 'a2', true);
    expect(store.stageStats('a')).toEqual({ done: 2, total: 2, percent: 100, status: 'done' });
    store.setDone('a', 'a2', false);
    store.setDone('a', 'a1', false);
    expect(store.stageStats('a').status).toBe('not-started');
  });

  test('overall counts every task across stages', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    store.setDone('a', 'a1', true);
    store.setDone('a', 'a2', true);
    store.setDone('b', 'b1', true);
    expect(store.overallStats()).toEqual({ done: 3, total: 6, percent: 50, status: 'in-progress' });
  });

  test('corrupt JSON is treated as empty and overwritten on the next save', () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: '{not json' });
    const store = createProgressStore(storage, STAGES);
    expect(store.overallStats().done).toBe(0);
    store.setDone('b', 'b2', true);
    expect(JSON.parse(storage.data.get(PROGRESS_KEY))).toEqual({ b: ['b2'] });
  });

  test('wrong shapes, unknown stages, stale and duplicate ids are ignored', () => {
    const saved = { a: ['a1', 'old-task', 'a1', 7], zzz: ['x'], b: 'nope' };
    const store = createProgressStore(memoryStorage({ [PROGRESS_KEY]: JSON.stringify(saved) }), STAGES);
    expect(store.stageStats('a')).toEqual({ done: 1, total: 2, percent: 50, status: 'in-progress' });
    expect(store.stageStats('b').done).toBe(0);
  });

  test('an array saved at the top level is treated as empty', () => {
    const store = createProgressStore(memoryStorage({ [PROGRESS_KEY]: '["a1"]' }), STAGES);
    expect(store.overallStats().done).toBe(0);
  });

  test('blocked storage never throws and keeps ticks for the session', () => {
    const store = createProgressStore(throwingStorage(), STAGES);
    store.setDone('a', 'a1', true);
    expect(store.isDone('a', 'a1')).toBe(true);
    expect(() => store.reset()).not.toThrow();
    expect(store.isDone('a', 'a1')).toBe(false);
  });

  test('missing storage works in memory', () => {
    const store = createProgressStore(null, STAGES);
    store.setDone('b', 'b4', true);
    expect(store.stageStats('b').done).toBe(1);
  });

  test('a stage with no tasks reports 0% and does not break the overall total', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    expect(store.stageStats('empty')).toEqual({ done: 0, total: 0, percent: 0, status: 'not-started' });
    expect(store.overallStats().total).toBe(6);
  });

  test('unknown ids are a programming error', () => {
    const store = createProgressStore(memoryStorage(), STAGES);
    expect(() => store.setDone('a', 'nope', true)).toThrow('Unknown assignment "a/nope"');
  });

  test('reset clears memory and storage', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage, STAGES);
    store.setDone('a', 'a1', true);
    store.reset();
    expect(store.overallStats().done).toBe(0);
    expect(storage.data.has(PROGRESS_KEY)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/progress.test.js`
Expected: FAIL, `Failed to load url ../src/js/progress.js`.

- [ ] **Step 3: Implement**

`src/js/progress.js`:

```js
export const PROGRESS_KEY = 'lp:progress:v1';

export function createProgressStore(storage, stages) {
  const known = new Map(stages.map((stage) => [stage.id, new Set(stage.assignments.map((a) => a.id))]));
  let state = load();

  function load() {
    let raw = null;
    try {
      raw = storage ? storage.getItem(PROGRESS_KEY) : null;
    } catch {
      return {};
    }
    if (!raw) return {};
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {};
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const clean = {};
    for (const [stageId, ids] of Object.entries(parsed)) {
      const valid = known.get(stageId);
      if (!valid || !Array.isArray(ids)) continue;
      const kept = [...new Set(ids.filter((id) => typeof id === 'string' && valid.has(id)))];
      if (kept.length) clean[stageId] = kept;
    }
    return clean;
  }

  function save() {
    try {
      storage?.setItem(PROGRESS_KEY, JSON.stringify(state));
    } catch {
      // Storage blocked or full: progress lasts for this page only.
    }
  }

  function stats(done, total) {
    const percent = total ? Math.round((done / total) * 100) : 0;
    let status = 'in-progress';
    if (done === 0) status = 'not-started';
    else if (done >= total) status = 'done';
    return { done, total, percent, status };
  }

  return {
    isDone(stageId, assignmentId) {
      return state[stageId]?.includes(assignmentId) ?? false;
    },
    setDone(stageId, assignmentId, done) {
      if (!known.get(stageId)?.has(assignmentId)) {
        throw new Error(`Unknown assignment "${stageId}/${assignmentId}"`);
      }
      const ids = new Set(state[stageId] ?? []);
      if (done) ids.add(assignmentId);
      else ids.delete(assignmentId);
      const next = { ...state };
      if (ids.size) next[stageId] = [...ids];
      else delete next[stageId];
      state = next;
      save();
    },
    stageStats(stageId) {
      return stats(state[stageId]?.length ?? 0, known.get(stageId)?.size ?? 0);
    },
    overallStats() {
      let done = 0;
      let total = 0;
      for (const [stageId, ids] of known) {
        total += ids.size;
        done += state[stageId]?.length ?? 0;
      }
      return stats(done, total);
    },
    reset() {
      state = {};
      try {
        storage?.removeItem(PROGRESS_KEY);
      } catch {
        // Storage blocked: nothing was saved, so nothing to clear.
      }
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/progress.test.js`
Expected: PASS (12 tests).

- [ ] **Step 5: Commit**

```bash
git add src/js/progress.js tests/progress.test.js
git commit -m "feat: progress store with safe storage handling"
```

---

### Task 3: Roadmap data

**Files:**
- Create: `src/data/roadmap.js`
- Test: `tests/roadmap.test.js`

**Interfaces:**
- Produces:
  - `STAGES`: array in roadmap order of `{ id, number, title, level: 'Beginner'|'Intermediate'|'Advanced', weeks, group: 'core'|'track'|'final', summary, learn: string[], path: '/stages/<id>.html', assignments: [{ id, title, task, check }] }`
  - `PRACTICE_METHOD: string`
  - `getStage(id) → stage | undefined`
  - `stageNeighbors(id) → { prev: stage|null, next: stage|null }`
  - `weeksLabel(weeks) → 'Week 11' | 'Weeks 1–2'`

- [ ] **Step 1: Write the failing test**

`tests/roadmap.test.js`:

```js
import { expect, test } from 'vitest';
import { STAGES, getStage, stageNeighbors, weeksLabel } from '../src/data/roadmap.js';

test('stage ids are unique', () => {
  expect(new Set(STAGES.map((s) => s.id)).size).toBe(STAGES.length);
});

test('every stage has 3 to 5 complete practice tasks with unique ids', () => {
  for (const stage of STAGES) {
    expect(stage.assignments.length).toBeGreaterThanOrEqual(3);
    expect(stage.assignments.length).toBeLessThanOrEqual(5);
    expect(new Set(stage.assignments.map((a) => a.id)).size).toBe(stage.assignments.length);
    for (const a of stage.assignments) {
      expect(a.title && a.task && a.check).toBeTruthy();
    }
  }
});

test('neighbors follow roadmap order', () => {
  expect(stageNeighbors('exposure').prev).toBeNull();
  expect(stageNeighbors('exposure').next.id).toBe('focus');
  expect(stageNeighbors('advanced-editing').next.id).toBe('portrait');
  expect(stageNeighbors('your-eye').next).toBeNull();
  expect(stageNeighbors('nope')).toEqual({ prev: null, next: null });
});

test('week labels use singular for one week', () => {
  expect(weeksLabel('1–2')).toBe('Weeks 1–2');
  expect(weeksLabel('11')).toBe('Week 11');
});

test('unknown stage ids return undefined', () => {
  expect(getStage('nope')).toBeUndefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/roadmap.test.js`
Expected: FAIL, `Failed to load url ../src/data/roadmap.js`.

- [ ] **Step 3: Implement**

`src/data/roadmap.js`:

```js
const stage = (data) => ({ ...data, path: `/stages/${data.id}.html` });

export const PRACTICE_METHOD =
  'For each task: change one thing at a time. Compare the frames side by side in darktable. Write one line per frame: setting, result, why. Redo your weakest frame the next day.';

export const STAGES = [
  stage({
    id: 'exposure', number: '1', title: 'Exposure: control light', level: 'Beginner', weeks: '1–2', group: 'core',
    summary: 'Learn how aperture, shutter speed and ISO make a photo bright or dark.',
    learn: ['Set up your camera from zero', 'Use stops to compare light', 'Balance aperture, shutter speed and ISO', 'Read the histogram and fix exposure'],
    assignments: [
      { id: 'aperture-ladder', title: 'Aperture ladder', task: 'In A mode, shoot one still subject with the 35mm at f/1.4, 2, 2.8, 4, 5.6, 8, 11 and 16.', check: 'You can point to the frame where the background starts to look sharp.' },
      { id: 'shutter-ladder', title: 'Shutter ladder', task: 'In S mode, shoot moving water or traffic from 1/1000 s down to 1/4 s, one stop at a time.', check: 'You can name the slowest speed that still freezes the motion.' },
      { id: 'iso-test', title: 'ISO test', task: 'In a dim room, shoot one scene at ISO 100, 400, 1600, 6400 and 25600. View each at 100% in darktable.', check: 'You have picked your highest ISO that still looks clean enough to you.' },
      { id: 'histogram-fix', title: 'Fix it with the histogram', task: 'Shoot 30 frames in A mode. After each one, read the histogram and fix the exposure with the exposure compensation dial.', check: 'No important highlights touch the right edge of the histogram.' },
      { id: 'sunny-16', title: 'Sunny 16', task: 'On a sunny day, set M mode, ISO 100, f/16 and 1/125 s without looking at the meter. Then try the cloud and shade steps.', check: 'Your frames are within one stop of a good exposure.' },
    ],
  }),
  stage({
    id: 'focus', number: '2', title: 'Focus and sharpness', level: 'Beginner', weeks: '3', group: 'core',
    summary: 'Get the right part of the photo sharp, every time.',
    learn: ['Pick the right focus mode and area', 'Use Eye AF and back-button focus', 'Control depth of field', 'Find your handheld limit'],
    assignments: [
      { id: 'nearest-eye', title: 'Nearest eye', task: 'With the 85mm at about 2 m, shoot a friend turned slightly to one side at f/1.8 and at f/4. Use Eye AF in AF-S.', check: 'At 100%, the eye closest to you is sharp in both frames.' },
      { id: 'track-walker', title: 'Track a walker', task: 'Set AF-C. Ask a friend to walk toward you and shoot a burst of 10 frames.', check: 'At least 7 of the 10 frames are sharp on the face.' },
      { id: 'handheld-limit', title: 'Your handheld limit', task: 'Shoot a still object with each lens from 1/60 s down to 1/4 s, three frames per speed.', check: 'You know your slowest sharp speed for the 35mm and for the 85mm.' },
      { id: 'manual-peaking', title: 'Manual focus with peaking', task: 'Set Peaking Level to Mid. Focus 10 still objects in Manual Focus.', check: '8 of the 10 frames are sharp where you wanted.' },
    ],
  }),
  stage({
    id: 'composition', number: '3', title: 'Composition', level: 'Intermediate', weeks: '4–5', group: 'core',
    summary: 'Arrange what is in the frame so the photo is clear and strong.',
    learn: ['Simplify the frame', 'Use thirds, lines, frames and layers', 'Control perspective with distance', 'Work a scene'],
    assignments: [
      { id: 'twenty-ways', title: '20 compositions', task: 'Pick one subject. Make 20 different photos of it in 20 minutes: move, crouch, climb, change the background.', check: 'You can pick 3 frames that each work for a different reason.' },
      { id: 'lens-swap', title: '35mm vs 85mm', task: 'Frame a person from head to waist with the 35mm. Then walk back and make the same framing with the 85mm.', check: 'You can describe how the background changed.' },
      { id: 'lines-walk', title: 'Leading lines walk', task: 'For one walk, only shoot photos where a line leads to the subject.', check: 'You have 5 frames where the line ends at the subject.' },
      { id: 'three-heights', title: 'Three heights', task: 'Shoot one scene from ground level, eye level and from above.', check: 'You can say which height tells the story best, and why.' },
    ],
  }),
  stage({
    id: 'light', number: '4', title: 'Light and color', level: 'Intermediate', weeks: '6–7', group: 'core',
    summary: 'See light like a photographer and get color right.',
    learn: ['See hard and soft light', 'Use light direction on faces', 'Plan for golden and blue hour', 'Set white balance'],
    assignments: [
      { id: 'four-times', title: 'Four times of day', task: 'Shoot the same place at sunrise, midday, golden hour and blue hour.', check: 'You can describe the shadows and the color in each frame.' },
      { id: 'window-turn', title: 'Turn by the window', task: 'Put a person next to a window. Shoot them facing it, then turned to 45°, 90°, 135° and 180°.', check: 'You can name the light direction you like best for faces.' },
      { id: 'wb-sunset', title: 'White balance at sunset', task: 'At sunset, shoot one scene with Auto, Daylight and Shade white balance.', check: 'You can explain why Shade looks the warmest.' },
      { id: 'complementary', title: 'Complementary colors', task: 'Find and shoot 5 scenes with orange against blue, or red against green.', check: 'In each frame the two colors are easy to spot.' },
    ],
  }),
  stage({
    id: 'editing', number: '5', title: 'Editing workflow (darktable)', level: 'Intermediate', weeks: '8', group: 'core',
    summary: 'Turn RAW files into finished photos in darktable.',
    learn: ['Organize and cull a shoot', 'Edit a RAW file in a set order', 'Edit a whole set at once', 'Export and back up'],
    assignments: [
      { id: 'cull-ten', title: 'Cull to 10', task: 'Import one shoot with add to library. Reject weak frames with R, then give stars until 10 frames have 3 stars or more.', check: 'You have exactly 10 picks.' },
      { id: 'edit-ten', title: 'Edit 10 in order', task: 'Edit your 10 picks in the working order from this stage. Take a snapshot before you start each one.', check: 'Every edit looks better than its snapshot to you.' },
      { id: 'export-web', title: 'Export a web set', task: 'Export the 10 as JPEG, sRGB, quality 90, max size 2048 × 2048.', check: 'All 10 files open on your phone and look like they do on the computer.' },
      { id: 'backup-321', title: 'Back up', task: 'Set up the 3-2-1 rule: your computer, an external drive and one copy off-site. Include the .xmp files.', check: 'You can find one photo on all 3 copies.' },
    ],
  }),
  stage({
    id: 'advanced-editing', number: '6', title: 'Advanced editing (darktable and GIMP)', level: 'Advanced', weeks: '9–10', group: 'core',
    summary: 'Edit parts of a photo, grade color and retouch in darktable and GIMP.',
    learn: ['Edit parts of a photo with masks', 'Dodge, burn and shape contrast', 'Grade color and build a style', 'Retouch skin and spots in GIMP'],
    assignments: [
      { id: 'graduated-sky', title: 'Graduated sky', task: 'Darken the sky in a landscape with a gradient mask in exposure.', check: 'You cannot see where the mask ends.' },
      { id: 'portrait-retouch', title: 'Portrait retouch', task: 'In GIMP, remove 5 blemishes with Heal and even out the skin with Wavelet decompose.', check: 'At 100%, pores and skin texture are still visible.' },
      { id: 'set-style', title: 'One style, six frames', task: 'Create a style from your best edit and apply it to a 6-frame set.', check: 'The 6 frames look like one series.' },
      { id: 'hdr-merge', title: 'HDR merge', task: 'Shoot a 3-frame bracket on a tripod and merge it with create HDR.', check: 'Both the bright sky and the dark shadows show detail.' },
    ],
  }),
  stage({
    id: 'portrait', number: '7a', title: 'Portrait (85mm)', level: 'Advanced', weeks: '11', group: 'track',
    summary: 'Make flattering portraits with the 85mm.',
    learn: ['Choose distance and settings for portraits', 'Separate the person from the background', 'Find flattering light', 'Direct people with actions'],
    assignments: [
      { id: 'five-frame-set', title: 'Five-frame portrait set', task: 'Photograph one person: tight, waist-up, full body, environmental with the 35mm, and one candid.', check: 'The 5 frames work together as one story about this person.' },
      { id: 'three-lights', title: 'Three light setups', task: 'Shoot the same person in open shade, by a window at 45°, and backlit with a reflector.', check: 'You can say which setup flatters this face most.' },
      { id: 'direct-actions', title: 'Direct with actions', task: 'Direct a friend through 5 actions: walk, turn, look away, laugh, sit. Do not give poses.', check: 'At least 3 frames look natural, not posed.' },
    ],
  }),
  stage({
    id: 'street', number: '7b', title: 'Street and documentary (35mm)', level: 'Advanced', weeks: '12', group: 'track',
    summary: 'Catch real moments and tell stories with the 35mm.',
    learn: ['Zone focus with the 35mm', 'See light, layers and gestures', 'Work ethically and legally', 'Tell a story in a photo essay'],
    assignments: [
      { id: 'one-hour-theme', title: 'One hour, one theme', task: 'Walk for one hour with only the 35mm. Pick one theme, such as hands or shadows.', check: 'You have 5 frames on the theme.' },
      { id: 'fishing', title: 'Fishing', task: 'Find good light and a clean background. Wait 20 minutes in that spot for the right person to walk in.', check: 'One frame has a person in the exact spot you chose.' },
      { id: 'photo-essay', title: 'Photo essay', task: 'Shoot an 8-photo story about one place or event: establishing, medium, detail, portrait, moment, closing.', check: 'Someone who was not there can tell you the story from the 8 photos.' },
    ],
  }),
  stage({
    id: 'landscape', number: '7c', title: 'Landscape and travel', level: 'Advanced', weeks: '13', group: 'track',
    summary: 'Plan, shoot and share places with depth and good light.',
    learn: ['Plan for light and weather', 'Get front-to-back sharpness', 'Shoot long exposures and brackets', 'Tell a travel story'],
    assignments: [
      { id: 'golden-plan', title: 'Plan a golden hour', task: 'Use SunCalc.org to plan one sunrise or sunset shoot. Arrive 30 minutes early.', check: 'You were set up before the best light started.' },
      { id: 'long-exposure', title: 'Long exposure', task: 'Use a tripod and an ND filter, or blue hour, to shoot moving water or clouds for 1 s or longer.', check: 'The moving parts look smooth and the still parts are sharp.' },
      { id: 'travel-story', title: 'Travel story', task: 'Make a 6-frame travel story: wide view, people, detail, food, transport, night.', check: 'The 6 frames show a place, not only its sights.' },
    ],
  }),
  stage({
    id: 'night', number: '7d', title: 'Night and low light', level: 'Advanced', weeks: '14', group: 'track',
    summary: 'Shoot sharp, clean photos when light is low.',
    learn: ['Shoot sharp photos handheld at night', 'Choose noise over blur', 'Shoot light trails and city lights', 'Try your first star photo'],
    assignments: [
      { id: 'night-street', title: 'Handheld night street', task: 'Shoot 20 frames on a lit street, handheld, with the 35mm at f/1.4.', check: 'At least 10 frames are sharp at 100%.' },
      { id: 'light-trails', title: 'Light trails', task: 'At blue hour, put the camera on a tripod. Shoot traffic at ISO 100, f/8 to f/11, for 5 to 30 s.', check: 'The trails are long and no light turns into a big white blob.' },
      { id: 'first-stars', title: 'First star photo', task: 'On a moonless night away from city light, shoot the stars with the 35mm at the NPF time.', check: 'Stars look like dots, not lines, at 100%.' },
    ],
  }),
  stage({
    id: 'your-eye', number: '8', title: 'Your own eye and portfolio', level: 'Advanced', weeks: '15–16', group: 'final',
    summary: 'Develop your own style and build a portfolio.',
    learn: ['Learn from the masters', 'Read and critique photos', 'Build a 12-photo portfolio', 'Print and share your work'],
    assignments: [
      { id: 'study-three', title: 'Study three masters', task: 'Pick 3 photos by the masters on this page. For each, write what you see, how it was made and what it means.', check: 'You wrote at least 3 sentences per photo.' },
      { id: 'portfolio-12', title: 'Build a 12-photo portfolio', task: 'Choose your best 12 photos. Give them one consistent edit and put them in a sequence.', check: 'Every photo earns its place; you would remove none.' },
      { id: 'feedback-three', title: 'Get feedback', task: 'Show your portfolio to 3 people. Ask which photo stays with them and which one they would remove.', check: 'You changed at least one thing because of the feedback.' },
      { id: 'print-five', title: 'Print five', task: 'Print 5 photos at least 13 × 18 cm.', check: 'The prints look as good as the screen version.' },
    ],
  }),
];

export function getStage(id) {
  return STAGES.find((s) => s.id === id);
}

export function stageNeighbors(id) {
  const index = STAGES.findIndex((s) => s.id === id);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? STAGES[index - 1] : null,
    next: index < STAGES.length - 1 ? STAGES[index + 1] : null,
  };
}

export function weeksLabel(weeks) {
  return weeks.includes('–') ? `Weeks ${weeks}` : `Week ${weeks}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/roadmap.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/roadmap.js tests/roadmap.test.js
git commit -m "feat: roadmap data with practice tasks"
```

---

### Task 4: Readability checker

**Files:**
- Create: `scripts/readability-lib.js`, `scripts/readability.js`
- Test: `tests/readability.test.js`

**Interfaces:**
- Produces:
  - `TARGETS`
  - `countSyllables(word)`, `splitSentences(text)`, `wordsOf(sentence)`
  - `extractSections(html) → [{ id, kind: 'lesson'|'tech', units: [{type, text}] }]`
  - `extractUnits(html)`
  - `analyze(units) → { sentences, words, fre, grade, avgSentence, maxSentence, longest, paragraphs }`
  - `checkSection(kind, metrics) → string[]`
- CLI: `pnpm check:readability [files…]`. With no files it checks `index.html` and every `stages/*.html`. It exits 1 on any problem, including a page with no `data-read` sections.

- [ ] **Step 1: Write the failing test**

`tests/readability.test.js`:

```js
import { describe, expect, test } from 'vitest';
import { analyze, checkSection, countSyllables, extractSections, extractUnits, splitSentences } from '../scripts/readability-lib.js';

describe('syllables', () => {
  test.each([['cat', 1], ['camera', 3], ['aperture', 3], ['photography', 4], ['shutter', 2], ['exposure', 3], ['simple', 2], ['focused', 2], ['f/2.8', 1], ['1/250', 1]])(
    '%s has %i', (word, n) => expect(countSyllables(word)).toBe(n));
});

describe('sentences', () => {
  test('splits on end punctuation but not inside numbers', () => {
    expect(splitSentences('Set f/2.8 now. Then shoot at 1/250 s. Done!')).toEqual(['Set f/2.8 now.', 'Then shoot at 1/250 s.', 'Done!']);
    expect(splitSentences('Use f/1.4 and 1.5 m.')).toEqual(['Use f/1.4 and 1.5 m.']);
  });
});

describe('extraction', () => {
  test('skips headings, SVG, tables and callout labels', () => {
    const units = extractUnits('<h2>Title here</h2><div class="callout"><span class="callout-label">In one sentence</span><p>Light makes the photo.</p></div><svg><text>Label</text></svg><table><tr><td>f/2</td></tr></table>');
    expect(units).toEqual([{ type: 'p', text: 'Light makes the photo.' }]);
  });
  test('a list item with paragraphs is counted once, through its paragraphs', () => {
    const units = extractUnits('<ul><li><p class="mistake">Wrong idea.</p><p class="fix">Right idea.</p></li><li>Plain item</li></ul>');
    expect(units.map((u) => u.text).sort()).toEqual(['Plain item', 'Right idea.', 'Wrong idea.']);
  });
  test('nested lists are rejected', () => {
    expect(() => extractUnits('<ul><li>One <ul><li>Two</li></ul></li></ul>')).toThrow('Nested lists');
  });
  test('only sections with data-read are checked', () => {
    const sections = extractSections('<section id="a" data-read="lesson"><p>Hi there.</p></section><section id="b"><p>Skip.</p></section><section id="c" data-read="tech"><dl><dt>Stop</dt><dd>A step of light.</dd></dl></section>');
    expect(sections.map((s) => [s.id, s.kind])).toEqual([['a', 'lesson'], ['c', 'tech']]);
    expect(sections[1].units).toEqual([{ type: 'dd', text: 'A step of light.' }]);
  });
  test('entities are decoded', () => {
    expect(extractUnits('<p>Shade &amp; sun &#8594; done.</p>')[0].text).toBe('Shade & sun → done.');
  });
});

describe('metrics and targets', () => {
  test('short plain sentences score as easy', () => {
    const m = analyze([{ type: 'p', text: 'The cat sat. The dog ran.' }]);
    expect(m.sentences).toBe(2);
    expect(m.words).toBe(6);
    expect(m.avgSentence).toBe(3);
    expect(m.fre).toBeGreaterThan(90);
  });
  test('reports a sentence over 25 words', () => {
    const long = `${Array.from({ length: 30 }, () => 'word').join(' ')}.`;
    const problems = checkSection('lesson', analyze([{ type: 'li', text: long }]));
    expect(problems.some((p) => p.startsWith('Longest sentence has 30 words'))).toBe(true);
  });
  test('reports a paragraph with more than 3 sentences', () => {
    const problems = checkSection('lesson', analyze([{ type: 'p', text: 'One. Two. Three. Four.' }]));
    expect(problems.some((p) => p.startsWith('Paragraph too long'))).toBe(true);
  });
  test('tech sections have a lower Reading Ease bar', () => {
    const metrics = { sentences: 5, fre: 55, grade: 6, avgSentence: 10, maxSentence: 12, longest: '', paragraphs: [] };
    expect(checkSection('lesson', metrics)).toHaveLength(1);
    expect(checkSection('tech', metrics)).toHaveLength(0);
  });
  test('an empty section is a problem', () => {
    expect(checkSection('lesson', analyze([]))).toEqual(['no text found']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/readability.test.js`
Expected: FAIL, `Failed to load url ../scripts/readability-lib.js`.

- [ ] **Step 3: Implement the library**

`scripts/readability-lib.js`:

```js
export const TARGETS = {
  lesson: { fre: 60, grade: 7 },
  tech: { fre: 50, grade: 9 },
  avgSentence: 15,
  maxSentence: 25,
  paragraphSentences: 3,
  paragraphWords: 60,
};

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…', times: '×', rarr: '→', asymp: '≈', deg: '°', minus: '−', middot: '·',
};

const REMOVE = [
  /<svg\b[\s\S]*?<\/svg>/gi,
  /<table\b[\s\S]*?<\/table>/gi,
  /<script\b[\s\S]*?<\/script>/gi,
  /<h[1-6]\b[\s\S]*?<\/h[1-6]>/gi,
  /<span class="callout-label">[\s\S]*?<\/span>/gi,
];

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return String.fromCodePoint(value);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}

export function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 1; // numbers and notation such as f/2.8 or 1/250
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 0);
}

export function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[^a-z])/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z0-9]/.test(s));
}

export function wordsOf(sentence) {
  return sentence.split(/\s+/).filter((t) => /[A-Za-z0-9]/.test(t));
}

export function extractUnits(html) {
  let body = html;
  for (const re of REMOVE) body = body.replace(re, ' ');
  const units = [];
  for (const match of body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
    if (/<(ul|ol)\b/i.test(match[1])) throw new Error('Nested lists are not allowed in checked sections');
    if (/<p\b/i.test(match[1])) continue;
    units.push({ type: 'li', text: stripTags(match[1]) });
  }
  for (const match of body.matchAll(/<(p|dd|summary|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    units.push({ type: match[1].toLowerCase(), text: stripTags(match[2]) });
  }
  return units.filter((u) => u.text);
}

export function extractSections(html) {
  const sections = [];
  for (const match of html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)) {
    const kind = /data-read="(lesson|tech)"/.exec(match[1])?.[1];
    if (!kind) continue;
    const id = /\bid="([^"]+)"/.exec(match[1])?.[1] ?? '(no id)';
    try {
      sections.push({ id, kind, units: extractUnits(match[2]) });
    } catch (error) {
      throw new Error(`Section ${id}: ${error.message}`);
    }
  }
  return sections;
}

export function analyze(units) {
  let sentences = 0;
  let words = 0;
  let syllables = 0;
  let maxSentence = 0;
  let longest = '';
  const paragraphs = [];
  for (const unit of units) {
    const parts = splitSentences(unit.text);
    let unitWords = 0;
    for (const sentence of parts) {
      const w = wordsOf(sentence);
      sentences += 1;
      words += w.length;
      unitWords += w.length;
      syllables += w.reduce((n, word) => n + countSyllables(word), 0);
      if (w.length > maxSentence) {
        maxSentence = w.length;
        longest = sentence;
      }
    }
    if (unit.type === 'p') paragraphs.push({ text: unit.text, sentences: parts.length, words: unitWords });
  }
  const wps = sentences ? words / sentences : 0;
  const spw = words ? syllables / words : 0;
  return {
    sentences,
    words,
    fre: sentences ? 206.835 - 1.015 * wps - 84.6 * spw : 0,
    grade: sentences ? 0.39 * wps + 11.8 * spw - 15.59 : 0,
    avgSentence: wps,
    maxSentence,
    longest,
    paragraphs,
  };
}

export function checkSection(kind, m) {
  if (m.sentences === 0) return ['no text found'];
  const target = TARGETS[kind];
  const problems = [];
  if (m.fre < target.fre) problems.push(`Reading Ease ${m.fre.toFixed(0)} is below ${target.fre}`);
  if (m.grade > target.grade) problems.push(`Grade ${m.grade.toFixed(1)} is above ${target.grade}`);
  if (m.avgSentence > TARGETS.avgSentence) {
    problems.push(`Average sentence ${m.avgSentence.toFixed(1)} words is above ${TARGETS.avgSentence}`);
  }
  if (m.maxSentence > TARGETS.maxSentence) problems.push(`Longest sentence has ${m.maxSentence} words: "${m.longest}"`);
  for (const p of m.paragraphs) {
    if (p.sentences > TARGETS.paragraphSentences || p.words > TARGETS.paragraphWords) {
      problems.push(`Paragraph too long (${p.sentences} sentences, ${p.words} words): "${p.text.slice(0, 80)}…"`);
    }
  }
  return problems;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/readability.test.js`
Expected: PASS. If a syllable case fails, fix `countSyllables`, not the expected value. The expected values are the real syllable counts.

- [ ] **Step 5: Write the CLI**

`scripts/readability.js`:

```js
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze, checkSection, extractSections } from './readability-lib.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const files = args.length
  ? args
  : ['index.html', ...readdirSync(join(root, 'stages')).filter((f) => f.endsWith('.html')).map((f) => `stages/${f}`)];

let failed = false;
for (const file of files) {
  const html = readFileSync(join(root, file), 'utf8');
  let sections;
  try {
    sections = extractSections(html);
  } catch (error) {
    console.log(`✗ ${file}: ${error.message}`);
    failed = true;
    continue;
  }
  if (sections.length === 0) {
    console.log(`✗ ${file}: no sections marked with data-read`);
    failed = true;
    continue;
  }
  console.log(`\n${file}`);
  for (const section of sections) {
    const m = analyze(section.units);
    const problems = checkSection(section.kind, m);
    const mark = problems.length ? '✗' : '✓';
    console.log(
      `  ${mark} ${section.id.padEnd(24)} ${section.kind.padEnd(6)} FRE ${m.fre.toFixed(0).padStart(3)}  grade ${m.grade.toFixed(1).padStart(4)}  avg ${m.avgSentence.toFixed(1).padStart(4)}  max ${String(m.maxSentence).padStart(2)}`,
    );
    for (const problem of problems) console.log(`      - ${problem}`);
    if (problems.length) failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
```

Run: `node scripts/readability.js docs/superpowers/specs/2026-10-22-photography-roadmap-design.md`
Expected: `✗ … no sections marked with data-read` and exit code 1. This confirms the empty-page path works.

- [ ] **Step 6: Commit**

```bash
git add scripts tests/readability.test.js
git commit -m "feat: readability checker for lesson text"
```

---

### Task 5: Site shell: styles, layout, home page and stage skeletons

**Files:**
- Modify: `vite.config.js`
- Create: `src/styles/main.css`, `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`
- Create: `src/js/dom.js`, `src/js/theme.js`, `src/js/layout.js`, `src/js/stage-page.js`, `src/js/home.js`, `src/js/illustrations.js`, `src/js/widgets/mount.js`, `src/js/main.js`
- Create: `index.html`, and `stages/<id>.html` for all 11 stage ids

**Interfaces:**
- Consumes: `STAGES`, `getStage`, `stageNeighbors`, `weeksLabel`, `PRACTICE_METHOD` (Task 3); `createProgressStore` (Task 2).
- Produces:
  - `src/js/dom.js`: `SVG_NS`, `uid(prefix) → string`, `el(tag, attrs, children)`, `svgEl(tag, attrs, children)`. In `attrs`, the key `text` sets `textContent`, a function value under an `on…` key adds a listener, and `true` sets an empty attribute.
  - `src/js/stage-page.js`: `progressBlock(stats, label) → HTMLElement`
  - Page contract:
    - `main#main[data-stage="<id>"]` (stage) or `main#main[data-page="home"]` (home)
    - `#stage-header`, `[data-checklist]`, `#toc`, `#stage-pager`
    - `[data-illus="<name>"]` loads `src/illustrations/<name>.svg`
    - `[data-widget="<name>"]` loads `src/js/widgets/<name>.js` and calls its exported `mount(host)`

- [ ] **Step 1: Build inputs for all pages**

`vite.config.js`:

```js
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { STAGES } from './src/data/roadmap.js';

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page('./index.html'),
        ...Object.fromEntries(STAGES.map((s) => [s.id, page(`./stages/${s.id}.html`)])),
      },
    },
  },
  test: { include: ['tests/**/*.test.js'] },
});
```

If the installed Vite warns that `rollupOptions` is deprecated, rename the key to `rolldownOptions` and keep the same value.

- [ ] **Step 2: Styles**

`src/styles/main.css`:

```css
@import '@fontsource-variable/inter';
@import '@fontsource-variable/fraunces';
@import './tokens.css';
@import './base.css';
@import './components.css';
```

`src/styles/tokens.css`:

```css
:root {
  --font-body: 'Inter Variable', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-display: 'Fraunces Variable', Georgia, serif;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --radius: 12px;
  --radius-sm: 8px;
  --measure: 70ch;
  --step--1: 0.875rem;
  --step-0: 1.0625rem;
  --step-1: 1.25rem;
  --step-2: 1.6rem;
  --step-3: 2.1rem;
  --step-4: 2.8rem;
}

:root,
[data-theme='dark'] {
  color-scheme: dark;
  --bg: #111214;
  --surface: #1a1c20;
  --surface-2: #23262b;
  --border: #33373e;
  --text: #ece7df;
  --muted: #a8a196;
  --accent: #f2a93b;
  --accent-strong: #ffc266;
  --accent-ink: #1a1206;
  --success: #6fcf8e;
  --warning: #f2c94c;
  --error: #ff7a6b;
  --focus: #ffd27a;
  --callout-sentence: #2a2417;
  --callout-picture: #26201a;
  --callout-example: #17242a;
  --callout-camera: #1f1d2b;
  --callout-try: #182619;
  --callout-mistake: #2b1a1a;
  --illus-line: #ece7df;
  --illus-fill: #2b2f36;
  --illus-accent: #f2a93b;
  --illus-muted: #8c8579;
  --illus-cool: #6fb3d9;
}

[data-theme='light'] {
  color-scheme: light;
  --bg: #faf7f2;
  --surface: #ffffff;
  --surface-2: #f1ece4;
  --border: #ddd5c9;
  --text: #1d1b18;
  --muted: #5f584e;
  --accent: #a65f00;
  --accent-strong: #8a4f00;
  --accent-ink: #ffffff;
  --success: #1f7a3f;
  --warning: #8a6100;
  --error: #b3261e;
  --focus: #a65f00;
  --callout-sentence: #fbf1df;
  --callout-picture: #f9efe4;
  --callout-example: #e9f3f9;
  --callout-camera: #f0edfa;
  --callout-try: #e8f5ec;
  --callout-mistake: #fbeaea;
  --illus-line: #1d1b18;
  --illus-fill: #efe9df;
  --illus-accent: #b86a00;
  --illus-muted: #8a8276;
  --illus-cool: #2f7fb8;
}
```

`src/styles/base.css`:

```css
*,
*::before,
*::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-padding-top: 5rem; scroll-behavior: smooth; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: var(--step-0); line-height: 1.65; }
img, svg { max-width: 100%; }
h1, h2, h3 { font-family: var(--font-display); font-weight: 650; line-height: 1.2; letter-spacing: -0.01em; }
h1 { font-size: var(--step-4); margin: 0 0 var(--space-3); }
h2 { font-size: var(--step-3); margin: var(--space-7) 0 var(--space-3); }
h3 { font-size: var(--step-2); margin: var(--space-5) 0 var(--space-2); }
p, ul, ol, dl { margin: 0 0 var(--space-3); }
a { color: var(--accent); text-underline-offset: 0.2em; }
a:hover { color: var(--accent-strong); }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; border-radius: 4px; }
b.ui { font-weight: 650; color: var(--text); }
dfn { font-style: italic; }
kbd { font-family: ui-monospace, monospace; font-size: 0.9em; padding: 0.1em 0.4em; border: 1px solid var(--border); border-bottom-width: 2px; border-radius: 4px; background: var(--surface-2); }
.visually-hidden { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.skip-link { position: absolute; left: var(--space-3); top: -4rem; z-index: 100; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); background: var(--accent); color: var(--accent-ink); }
.skip-link:focus { top: var(--space-3); }
.layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-6); max-width: 1240px; margin: 0 auto; padding: var(--space-5) var(--space-4) var(--space-8); }
@media (min-width: 1080px) { .layout--stage { grid-template-columns: 240px minmax(0, 1fr); } }
main { min-width: 0; }
main:focus { outline: none; }
main > * { max-width: var(--measure); }
main > .wide { max-width: none; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

`src/styles/components.css`:

```css
/* Header and footer */
.site-header { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--bg) 90%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
.site-header__inner { max-width: 1240px; margin: 0 auto; padding: var(--space-3) var(--space-4); display: flex; align-items: center; gap: var(--space-4); }
.brand { display: flex; align-items: baseline; gap: var(--space-2); color: var(--text); text-decoration: none; font-family: var(--font-display); font-size: var(--step-1); font-weight: 650; }
.brand:hover { color: var(--text); }
.brand__tag { font-family: var(--font-body); font-size: var(--step--1); color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; }
.site-nav { margin-inline-start: auto; }
.site-nav a { color: var(--text); text-decoration: none; font-weight: 550; }
.site-nav a:hover { color: var(--accent); }
.site-header__actions { display: flex; gap: var(--space-2); }
@media (max-width: 719px) { .brand__tag { display: none; } .site-header__inner { gap: var(--space-2); } }
.site-footer { border-top: 1px solid var(--border); color: var(--muted); font-size: var(--step--1); }
.site-footer__inner { max-width: 1240px; margin: 0 auto; padding: var(--space-5) var(--space-4); }

/* Buttons */
.button { display: inline-flex; align-items: center; gap: var(--space-2); padding: 0.55em 1.1em; border-radius: 999px; border: 1px solid transparent; background: var(--accent); color: var(--accent-ink); font: inherit; font-weight: 600; text-decoration: none; cursor: pointer; }
.button:hover { background: var(--accent-strong); color: var(--accent-ink); }
.button--ghost { background: transparent; color: var(--text); border-color: var(--border); }
.button--ghost:hover { background: var(--surface-2); color: var(--text); }
@media (min-width: 1080px) { .toc-toggle, .toc__close { display: none; } }

/* Table of contents and mobile drawer */
.toc__title { font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: var(--space-2); }
.toc ol { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-1); }
.toc a { display: block; padding: var(--space-1) var(--space-2); border-left: 2px solid var(--border); color: var(--muted); text-decoration: none; font-size: var(--step--1); line-height: 1.4; }
.toc a:hover { color: var(--text); }
.toc a[aria-current] { color: var(--accent); border-left-color: var(--accent); }
.toc__close { margin-bottom: var(--space-3); }
@media (min-width: 1080px) { .toc { position: sticky; top: 5rem; align-self: start; max-height: calc(100vh - 6rem); overflow: auto; } }
@media (max-width: 1079px) {
  .toc:not([data-open]) { display: none; }
  .toc[data-open] { position: fixed; inset: 0 auto 0 0; z-index: 60; width: min(320px, 85vw); padding: var(--space-5) var(--space-4); overflow: auto; background: var(--surface); border-right: 1px solid var(--border); box-shadow: 0 0 0 100vmax rgb(0 0 0 / 0.55); }
}
body.drawer-open { overflow: hidden; }

/* Stage header and progress */
.stage-header { margin-bottom: var(--space-6); }
.stage-kicker { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2) var(--space-3); color: var(--muted); font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.06em; }
.stage-summary { font-size: var(--step-1); color: var(--muted); }
.stage-learn { padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.stage-learn__label { font-weight: 650; margin-bottom: var(--space-2); }
.stage-learn ul { margin: 0; padding-left: 1.2em; }
.badge { display: inline-block; padding: 0.1em 0.6em; border: 1px solid currentColor; border-radius: 999px; font-size: var(--step--1); font-weight: 600; letter-spacing: 0; text-transform: none; }
.badge--beginner { color: var(--success); }
.badge--intermediate { color: var(--warning); }
.badge--advanced { color: var(--accent); }
.progress-block { display: grid; gap: var(--space-1); margin-top: var(--space-4); }
.progress-block__label { font-size: var(--step--1); color: var(--muted); }
progress { width: 100%; height: 0.6rem; appearance: none; border: none; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
progress::-webkit-progress-bar { background: var(--surface-2); border-radius: 999px; }
progress::-webkit-progress-value { background: var(--accent); border-radius: 999px; }
progress::-moz-progress-bar { background: var(--accent); border-radius: 999px; }

/* Lessons and callouts */
.lesson + .lesson { margin-top: var(--space-6); border-top: 1px solid var(--border); }
.callout { position: relative; margin: var(--space-5) 0; padding: calc(var(--space-4) + 0.4rem) var(--space-4) var(--space-4); border: 1px solid var(--border); border-left: 4px solid var(--callout-color); border-radius: var(--radius); background: var(--surface); }
.callout > :last-child { margin-bottom: 0; }
.callout-label { position: absolute; top: -0.8em; left: var(--space-3); padding: 0.05em 0.7em; border: 1px solid var(--callout-color); border-radius: 999px; background: var(--bg); color: var(--text); font-size: var(--step--1); font-weight: 650; }
.callout--sentence { --callout-color: var(--accent); background: var(--callout-sentence); font-size: var(--step-1); }
.callout--picture { --callout-color: var(--warning); background: var(--callout-picture); }
.callout--example { --callout-color: var(--illus-cool); background: var(--callout-example); }
.callout--camera { --callout-color: var(--accent); background: var(--callout-camera); }
.callout--try { --callout-color: var(--success); background: var(--callout-try); }
.callout--mistake { --callout-color: var(--error); background: var(--callout-mistake); }

/* Illustrations */
.illus { margin: var(--space-5) 0; }
.illus svg { display: block; width: 100%; height: auto; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.illus figcaption { margin-top: var(--space-2); color: var(--muted); font-size: var(--step--1); }
.i-line { fill: none; stroke: var(--illus-line); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.i-fill { fill: var(--illus-fill); }
.i-accent { fill: var(--illus-accent); }
.i-accent-line { fill: none; stroke: var(--illus-accent); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.i-muted { fill: var(--illus-muted); }
.i-cool { fill: var(--illus-cool); }
.i-cool-line { fill: none; stroke: var(--illus-cool); stroke-width: 2; stroke-linecap: round; }
.i-text { fill: var(--illus-line); font-family: var(--font-body); font-size: 16px; }
.i-text-muted { fill: var(--muted); font-family: var(--font-body); font-size: 14px; }

/* Key terms, mistakes, self-check, practice, learn more, pager */
.terms { display: grid; grid-template-columns: max-content 1fr; gap: var(--space-2) var(--space-4); }
.terms dt { font-weight: 650; }
.terms dd { margin: 0; color: var(--muted); }
@media (max-width: 719px) { .terms { grid-template-columns: 1fr; gap: 0; } .terms dd { margin-bottom: var(--space-3); } }
.mistakes__list { list-style: none; padding: 0; display: grid; gap: var(--space-3); }
.mistakes__list li { padding: var(--space-3) var(--space-4); border-left: 4px solid var(--error); border-radius: var(--radius-sm); background: var(--surface); }
.mistake { font-weight: 600; margin-bottom: var(--space-1); }
.fix { margin: 0; color: var(--muted); }
.quiz { margin-bottom: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); }
.quiz summary { cursor: pointer; padding: var(--space-3) var(--space-4); font-weight: 600; }
.quiz p { margin: 0; padding: 0 var(--space-4) var(--space-3); color: var(--muted); }
.practice-method { color: var(--muted); }
.checklist { list-style: none; padding: 0; display: grid; gap: var(--space-3); }
.checklist__item { padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.checklist__head { display: flex; align-items: center; gap: var(--space-3); }
.checklist__head input { flex: none; width: 1.4rem; height: 1.4rem; accent-color: var(--accent); }
.checklist__title { font-size: var(--step-1); font-weight: 650; }
.checklist__task { margin: var(--space-2) 0 var(--space-1) calc(1.4rem + var(--space-3)); }
.checklist__check { margin: 0 0 0 calc(1.4rem + var(--space-3)); color: var(--muted); }
.checklist__check-label { color: var(--text); font-weight: 600; }
.learn-more ul { padding-left: 1.2em; }
.pager { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-top: var(--space-8); }
.pager__link { display: grid; padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); text-decoration: none; }
.pager__link:hover { border-color: var(--accent); color: var(--text); }
.pager__link--next { grid-column: 2; text-align: right; }
.pager__dir { color: var(--muted); font-size: var(--step--1); }
.pager__title { font-weight: 650; }
@media (max-width: 719px) { .pager { grid-template-columns: 1fr; } .pager__link--next { grid-column: 1; } }

/* Home */
.hero { padding: var(--space-6) 0 var(--space-5); }
.hero__kicker { color: var(--accent); font-size: var(--step--1); font-weight: 650; letter-spacing: 0.1em; text-transform: uppercase; }
.hero h1 { font-size: clamp(2.4rem, 6vw, 4rem); }
.hero__lead { font-size: var(--step-1); color: var(--muted); }
.kit__list { list-style: none; padding: 0; display: grid; gap: var(--space-3); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.kit__list li { display: grid; gap: var(--space-1); padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.kit__name { font-weight: 650; }
.kit__note { color: var(--muted); font-size: var(--step--1); }
.steps { display: grid; gap: var(--space-2); padding-left: 1.4em; }
.step-name { color: var(--accent); }
.plan { list-style: none; padding: 0; display: grid; }
.plan li { display: grid; grid-template-columns: 7.5rem 1fr; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--border); }
.plan__weeks { color: var(--muted); }
.roadmap__label { margin-top: var(--space-6); color: var(--muted); font-family: var(--font-body); font-size: var(--step-1); font-weight: 600; }
.roadmap__path { position: relative; list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-3); }
.roadmap__path::before { content: ''; position: absolute; left: calc(var(--space-4) + 1.5rem); top: 1rem; bottom: 1rem; width: 2px; background: var(--border); }
.roadmap__tracks { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-3); grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.stage-card { position: relative; display: grid; grid-template-columns: 3.2rem 1fr; gap: var(--space-3); height: 100%; padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); text-decoration: none; }
.stage-card:hover { border-color: var(--accent); color: var(--text); }
.stage-card__number { display: grid; place-items: center; width: 3.2rem; height: 3.2rem; border: 2px solid var(--border); border-radius: 50%; background: var(--surface-2); font-family: var(--font-display); font-size: var(--step-1); font-weight: 700; }
.stage-card--in-progress .stage-card__number { border-color: var(--accent); }
.stage-card--done .stage-card__number { border-color: var(--accent); background: var(--accent); color: var(--accent-ink); }
.stage-card__body { display: grid; gap: var(--space-1); }
.stage-card__title { font-family: var(--font-display); font-size: var(--step-1); font-weight: 650; }
.stage-card__meta { display: flex; align-items: center; gap: var(--space-2); color: var(--muted); font-size: var(--step--1); }
.stage-card__summary { color: var(--muted); }
.stage-card__status { color: var(--muted); font-size: var(--step--1); }
.meter { display: block; height: 0.4rem; overflow: hidden; border-radius: 999px; background: var(--surface-2); }
.meter__fill { display: block; height: 100%; background: var(--accent); }
.roadmap__reset { margin-top: var(--space-5); }

/* Simulators */
.simulator { margin-top: var(--space-7); }
.sim { display: grid; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
@media (min-width: 720px) { .sim { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); align-items: start; } }
.sim__view { display: grid; gap: var(--space-3); }
.sim__view svg { display: block; width: 100%; height: auto; border-radius: var(--radius-sm); background: var(--surface-2); }
.sim__panel, .sim__controls { display: grid; gap: var(--space-3); }
.sim-control__top { display: flex; justify-content: space-between; gap: var(--space-2); font-size: var(--step--1); }
.sim-control__top label { font-weight: 600; }
.sim-control__value { color: var(--accent); font-weight: 650; font-variant-numeric: tabular-nums; }
.sim-control input[type='range'] { width: 100%; accent-color: var(--accent); }
.sim-radios { display: flex; flex-wrap: wrap; gap: var(--space-1) var(--space-3); margin: 0; padding: 0; border: 0; }
.sim-radios legend { width: 100%; margin-bottom: var(--space-1); padding: 0; font-size: var(--step--1); font-weight: 600; }
.sim-radio, .sim-check { display: flex; align-items: center; gap: var(--space-1); font-size: var(--step--1); }
.sim-radio input, .sim-check input { width: 1.1rem; height: 1.1rem; accent-color: var(--accent); }
.sim__readout { padding: var(--space-3); border-radius: var(--radius-sm); background: var(--surface-2); font-size: var(--step--1); }
.sim__readout p { margin: 0 0 var(--space-1); }
.sim__readout p:last-child { margin: 0; }
.sim__buttons { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.sim__credit { margin: 0; color: var(--muted); font-size: var(--step--1); }
.histogram__bar { fill: var(--muted); }
.histogram__bar--clip { fill: var(--error); }
.sim-diagram text { fill: var(--text); font-family: var(--font-body); font-size: 14px; }
.sim-diagram .d-line { fill: none; stroke: var(--muted); stroke-width: 2; }
.sim-diagram .d-zone { fill: var(--success); opacity: 0.35; }
.sim-diagram .d-accent { fill: var(--accent); }
.sim-diagram .d-accent-line { fill: none; stroke: var(--accent); stroke-width: 3; }
.sim-diagram .d-muted { fill: var(--muted); }
.sim-diagram .overlay-line { stroke: #ffffff; stroke-width: 2; opacity: 0.85; }
.compare { position: relative; }
.compare__after { position: absolute; inset: 0; }
.compare__divider { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--accent); pointer-events: none; }
.edit-steps { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-1); font-size: var(--step--1); }
.edit-steps li { padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); color: var(--muted); }
.edit-steps li.is-done { color: var(--text); }
.edit-steps li[aria-current] { background: var(--surface-2); color: var(--text); outline: 1px solid var(--accent); }
.sim-panels { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.sim-panels figure { margin: 0; }
.sim-panels figcaption { margin-top: var(--space-1); color: var(--muted); font-size: var(--step--1); text-align: center; }
```

- [ ] **Step 3: DOM helpers, theme and layout**

`src/js/dom.js`:

```js
export const SVG_NS = 'http://www.w3.org/2000/svg';

let counter = 0;
export function uid(prefix) {
  counter += 1;
  return `${prefix}-${counter}`;
}

function build(node, attrs, children) {
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  node.append(...[children].flat(Infinity).filter((c) => c !== undefined && c !== null && c !== false));
  return node;
}

export function el(tag, attrs = {}, children = []) {
  return build(document.createElement(tag), attrs, children);
}

export function svgEl(tag, attrs = {}, children = []) {
  return build(document.createElementNS(SVG_NS, tag), attrs, children);
}
```

`src/js/theme.js`:

```js
export const THEME_KEY = 'lp:theme';

function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function createThemeToggle(storage) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button--ghost theme-toggle';
  const sync = () => {
    button.textContent = currentTheme() === 'light' ? 'Dark theme' : 'Light theme';
    button.setAttribute('aria-label', currentTheme() === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  };
  button.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      storage?.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the theme lasts for this page only.
    }
    sync();
  });
  sync();
  return button;
}
```

`src/js/layout.js`:

```js
import { el } from './dom.js';
import { createThemeToggle } from './theme.js';

export function renderHeader(header, { storage, withToc }) {
  const tocButton = withToc
    ? el('button', { type: 'button', class: 'button button--ghost toc-toggle', 'aria-expanded': 'false', 'aria-controls': 'toc', text: 'Contents' })
    : null;
  header.replaceChildren(
    el('div', { class: 'site-header__inner' }, [
      el('a', { class: 'brand', href: '/' }, [
        el('span', { text: 'Learn Photography' }),
        el('span', { class: 'brand__tag', text: 'from zero' }),
      ]),
      el('nav', { class: 'site-nav', 'aria-label': 'Main' }, [el('a', { href: '/#roadmap', text: 'Roadmap' })]),
      el('div', { class: 'site-header__actions' }, [tocButton, createThemeToggle(storage)]),
    ]),
  );
  return { tocButton };
}

export function renderFooter(footer) {
  footer.replaceChildren(
    el('div', { class: 'site-footer__inner' }, [
      el('p', { text: 'Made for one learner: Sony α7 II, 35mm f/1.4 and 85mm f/1.8, edited in darktable and GIMP.' }),
      el('p', { text: 'Camera and software steps follow the Sony Help Guide and the darktable 5.6 and GIMP 3.2 manuals.' }),
    ]),
  );
}
```

- [ ] **Step 4: Stage page rendering**

`src/js/stage-page.js`:

```js
import { PRACTICE_METHOD, stageNeighbors, weeksLabel } from '../data/roadmap.js';
import { el, uid } from './dom.js';

const DESKTOP = window.matchMedia('(min-width: 1080px)');

export function progressBlock(stats, label) {
  const id = uid('progress');
  return el('div', { class: 'progress-block' }, [
    el('label', { for: id, class: 'progress-block__label', text: `${label}: ${stats.done} of ${stats.total}` }),
    el('progress', { id, max: stats.total || 1, value: stats.done }),
  ]);
}

export function renderStageHeader(container, stage, stats) {
  container.replaceChildren(
    el('p', { class: 'stage-kicker' }, [
      el('span', { text: `Stage ${stage.number}` }),
      el('span', { class: `badge badge--${stage.level.toLowerCase()}`, text: stage.level }),
      el('span', { text: weeksLabel(stage.weeks) }),
    ]),
    el('h1', { text: stage.title }),
    el('p', { class: 'stage-summary', text: stage.summary }),
    el('div', { class: 'stage-learn' }, [
      el('p', { class: 'stage-learn__label', text: 'What you will learn' }),
      el('ul', {}, stage.learn.map((item) => el('li', { text: item }))),
    ]),
    progressBlock(stats, 'Practice tasks done'),
  );
}

export function renderChecklist(container, stage, progress, onChange) {
  const items = stage.assignments.map((a) => {
    const id = `task-${stage.id}-${a.id}`;
    const input = el('input', { type: 'checkbox', id, 'aria-describedby': `${id}-task ${id}-check` });
    input.checked = progress.isDone(stage.id, a.id);
    input.addEventListener('change', () => {
      progress.setDone(stage.id, a.id, input.checked);
      onChange();
    });
    return el('li', { class: 'checklist__item' }, [
      el('div', { class: 'checklist__head' }, [input, el('label', { for: id, class: 'checklist__title', text: a.title })]),
      el('p', { id: `${id}-task`, class: 'checklist__task', text: a.task }),
      el('p', { id: `${id}-check`, class: 'checklist__check' }, [el('span', { class: 'checklist__check-label', text: 'Done when: ' }), a.check]),
    ]);
  });
  container.replaceChildren(el('p', { class: 'practice-method', text: PRACTICE_METHOD }), el('ul', { class: 'checklist' }, items));
}

function slugify(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

export function buildToc(toc, main) {
  const headings = [...main.querySelectorAll('h2')];
  const links = headings.map((heading) => {
    const section = heading.closest('section[id]');
    if (!heading.id && !section) heading.id = slugify(heading.textContent);
    const target = heading.id ? heading : section;
    return { link: el('a', { href: `#${target.id}`, text: heading.textContent }), heading };
  });
  toc.replaceChildren(
    el('p', { class: 'toc__title', text: 'On this page' }),
    el('ol', {}, links.map(({ link }) => el('li', {}, [link]))),
  );
  const byHeading = new Map(links.map(({ link, heading }) => [heading, link]));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const { link } of links) link.removeAttribute('aria-current');
      byHeading.get(entry.target)?.setAttribute('aria-current', 'location');
    }
  }, { rootMargin: '0px 0px -70% 0px' });
  for (const heading of headings) observer.observe(heading);
}

export function initDrawer(button, toc) {
  const close = el('button', { type: 'button', class: 'button button--ghost toc__close', text: 'Close' });
  toc.prepend(close);
  const focusables = () => [...toc.querySelectorAll('a, button')].filter((node) => node.offsetParent !== null);
  const open = () => {
    toc.dataset.open = 'true';
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    focusables()[0]?.focus();
  };
  const shut = (returnFocus) => {
    delete toc.dataset.open;
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    if (returnFocus) button.focus();
  };
  button.addEventListener('click', () => (toc.dataset.open ? shut(true) : open()));
  close.addEventListener('click', () => shut(true));
  toc.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || DESKTOP.matches || !toc.dataset.open) return;
    shut(false);
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  toc.addEventListener('keydown', (event) => {
    if (!toc.dataset.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      shut(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  DESKTOP.addEventListener('change', () => {
    if (DESKTOP.matches && toc.dataset.open) shut(false);
  });
}

export function renderPager(nav, stage) {
  const { prev, next } = stageNeighbors(stage.id);
  const link = (target, dir) => el('a', { class: `pager__link pager__link--${dir}`, href: target.path }, [
    el('span', { class: 'pager__dir', text: dir === 'prev' ? 'Previous stage' : 'Next stage' }),
    el('span', { class: 'pager__title', text: `${target.number}. ${target.title}` }),
  ]);
  const finish = el('a', { class: 'pager__link pager__link--next', href: '/#roadmap' }, [
    el('span', { class: 'pager__dir', text: 'You finished the roadmap' }),
    el('span', { class: 'pager__title', text: 'Back to the roadmap' }),
  ]);
  nav.replaceChildren(...[prev && link(prev, 'prev'), next ? link(next, 'next') : finish].filter(Boolean));
}
```

- [ ] **Step 5: Home rendering, loaders and bootstrap**

`src/js/home.js`:

```js
import { STAGES, weeksLabel } from '../data/roadmap.js';
import { el } from './dom.js';
import { progressBlock } from './stage-page.js';

const STATUS_TEXT = { 'not-started': 'Not started', 'in-progress': 'In progress', done: 'Done' };

function stageCard(stage, stats) {
  return el('a', { class: `stage-card stage-card--${stats.status}`, href: stage.path }, [
    el('span', { class: 'stage-card__number', text: stage.number }),
    el('span', { class: 'stage-card__body' }, [
      el('span', { class: 'stage-card__title', text: stage.title }),
      el('span', { class: 'stage-card__meta' }, [
        el('span', { class: `badge badge--${stage.level.toLowerCase()}`, text: stage.level }),
        el('span', { text: weeksLabel(stage.weeks) }),
      ]),
      el('span', { class: 'stage-card__summary', text: stage.summary }),
      el('span', { class: 'stage-card__status', text: `${STATUS_TEXT[stats.status]}: ${stats.done} of ${stats.total} practice tasks` }),
      el('span', { class: 'meter', 'aria-hidden': 'true' }, [el('span', { class: 'meter__fill', style: `width: ${stats.percent}%` })]),
    ]),
  ]);
}

export function renderHome(main, progress) {
  const roadmap = main.querySelector('[data-roadmap]');
  const overall = main.querySelector('[data-overall]');
  const plan = main.querySelector('[data-plan]');
  const reset = main.querySelector('[data-reset]');

  plan.replaceChildren(el('ol', { class: 'plan' }, STAGES.map((s) => el('li', {}, [
    el('span', { class: 'plan__weeks', text: weeksLabel(s.weeks) }),
    el('a', { href: s.path, text: `${s.number}. ${s.title}` }),
  ]))));

  const draw = () => {
    const card = (s) => el('li', {}, [stageCard(s, progress.stageStats(s.id))]);
    roadmap.replaceChildren(
      el('h3', { class: 'roadmap__label', text: 'Core: stages 1 to 6, in order' }),
      el('ol', { class: 'roadmap__path' }, STAGES.filter((s) => s.group === 'core').map(card)),
      el('h3', { class: 'roadmap__label', text: 'Tracks: any order after stage 6' }),
      el('ul', { class: 'roadmap__tracks' }, STAGES.filter((s) => s.group === 'track').map(card)),
      el('h3', { class: 'roadmap__label', text: 'Finish' }),
      el('ol', { class: 'roadmap__path' }, STAGES.filter((s) => s.group === 'final').map(card)),
    );
    overall.replaceChildren(progressBlock(progress.overallStats(), 'All practice tasks done'));
  };

  reset.addEventListener('click', () => {
    if (window.confirm('Reset all practice progress? This cannot be undone.')) {
      progress.reset();
      draw();
    }
  });
  draw();
}
```

`src/js/illustrations.js`:

```js
const files = import.meta.glob('../illustrations/*.svg', { query: '?raw', import: 'default' });

export async function mountIllustrations(root) {
  await Promise.all([...root.querySelectorAll('[data-illus]')].map(async (slot) => {
    const load = files[`../illustrations/${slot.dataset.illus}.svg`];
    if (!load) {
      console.error(`Missing illustration: ${slot.dataset.illus}`);
      return;
    }
    slot.innerHTML = await load();
  }));
}
```

`src/js/widgets/mount.js`:

```js
const loaders = import.meta.glob(['./*-sim.js', './edit-steps.js']);

export async function mountWidgets(root) {
  await Promise.all([...root.querySelectorAll('[data-widget]')].map(async (host) => {
    const load = loaders[`./${host.dataset.widget}.js`];
    if (!load) {
      console.error(`Unknown widget: ${host.dataset.widget}`);
      return;
    }
    const widget = await load();
    widget.mount(host);
  }));
}
```

`src/js/main.js`:

```js
import { STAGES, getStage } from '../data/roadmap.js';
import { renderHome } from './home.js';
import { mountIllustrations } from './illustrations.js';
import { renderFooter, renderHeader } from './layout.js';
import { createProgressStore } from './progress.js';
import { buildToc, initDrawer, renderChecklist, renderPager, renderStageHeader } from './stage-page.js';
import { mountWidgets } from './widgets/mount.js';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const storage = getStorage();
const progress = createProgressStore(storage, STAGES);
const main = document.getElementById('main');
const stageId = main.dataset.stage;
const stage = stageId ? getStage(stageId) : undefined;
if (stageId && !stage) throw new Error(`Unknown stage "${stageId}" in data-stage`);

const { tocButton } = renderHeader(document.getElementById('site-header'), { storage, withToc: Boolean(stage) });
renderFooter(document.getElementById('site-footer'));

if (stage) {
  const header = document.getElementById('stage-header');
  const refresh = () => renderStageHeader(header, stage, progress.stageStats(stage.id));
  refresh();
  renderChecklist(main.querySelector('[data-checklist]'), stage, progress, refresh);
  const toc = document.getElementById('toc');
  buildToc(toc, main);
  initDrawer(tocButton, toc);
  renderPager(document.getElementById('stage-pager'), stage);
} else if (main.dataset.page === 'home') {
  renderHome(main, progress);
}

mountIllustrations(main);
mountWidgets(main);
```

- [ ] **Step 6: Home page**

`index.html`:

```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Learn Photography from Zero</title>
    <meta name="description" content="A 16-week roadmap to learn photography with a Sony α7 II, a 35mm and an 85mm lens, darktable and GIMP." />
    <script>
      try {
        const saved = localStorage.getItem('lp:theme');
        document.documentElement.dataset.theme = saved === 'light' || saved === 'dark'
          ? saved
          : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      } catch {}
    </script>
    <link rel="stylesheet" href="/src/styles/main.css" />
    <script type="module" src="/src/js/main.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header id="site-header" class="site-header"></header>
    <div class="layout">
      <main id="main" class="home" data-page="home" tabindex="-1">
        <section class="hero" id="intro" data-read="lesson">
          <p class="hero__kicker">A 16-week roadmap</p>
          <h1>From zero to photographer</h1>
          <p class="hero__lead">Learn photography step by step with your own camera. Each stage explains one idea in plain words. Then you play with it and practice it outside.</p>
          <p><a class="button" href="/stages/exposure.html">Start with stage 1: Exposure</a></p>
        </section>

        <section class="kit wide" id="kit">
          <h2>Your kit</h2>
          <ul class="kit__list">
            <li><span class="kit__name">Sony α7 II</span><span class="kit__note">Full-frame camera with in-body stabilization</span></li>
            <li><span class="kit__name">35mm f/1.4</span><span class="kit__note">Street, travel, night and environmental portraits</span></li>
            <li><span class="kit__name">85mm f/1.8</span><span class="kit__note">Portraits with soft backgrounds</span></li>
            <li><span class="kit__name">darktable 5.6 and GIMP 3.2</span><span class="kit__note">Free editing: RAW files in darktable, retouching in GIMP</span></li>
          </ul>
        </section>

        <section class="how" id="how" data-read="lesson">
          <h2>How to use this roadmap</h2>
          <ol class="steps">
            <li><span class="step-name">Read.</span> Each lesson starts with the idea in one sentence.</li>
            <li><span class="step-name">Play.</span> Change one setting in the simulator and watch what happens.</li>
            <li><span class="step-name">Practice.</span> Go out and do the tasks with your camera.</li>
            <li><span class="step-name">Review.</span> Compare your photos side by side in darktable.</li>
            <li><span class="step-name">Tick.</span> Mark a task done when you meet its check.</li>
          </ol>
          <p>Plan on 3 to 5 hours a week. Stages 1 to 6 build on each other, so take them in order. After that, pick the tracks in any order.</p>
        </section>

        <section class="plan-section" id="plan">
          <h2>16-week plan</h2>
          <div data-plan></div>
        </section>

        <section class="roadmap wide" id="roadmap">
          <h2>Your roadmap</h2>
          <div data-overall aria-live="polite"></div>
          <div data-roadmap></div>
          <p class="roadmap__reset"><button type="button" class="button button--ghost" data-reset>Reset progress</button></p>
        </section>
      </main>
    </div>
    <footer id="site-footer" class="site-footer"></footer>
  </body>
</html>
```

- [ ] **Step 7: Stage page skeletons**

Create one file per row as `stages/<id>.html` from this template. Replace `{ID}`, `{TITLE}` and `{SUMMARY}` with the row's values. The title and summary must match `roadmap.js`.

| `{ID}` | `{TITLE}` | `{SUMMARY}` |
|---|---|---|
| exposure | Exposure: control light | Learn how aperture, shutter speed and ISO make a photo bright or dark. |
| focus | Focus and sharpness | Get the right part of the photo sharp, every time. |
| composition | Composition | Arrange what is in the frame so the photo is clear and strong. |
| light | Light and color | See light like a photographer and get color right. |
| editing | Editing workflow (darktable) | Turn RAW files into finished photos in darktable. |
| advanced-editing | Advanced editing (darktable and GIMP) | Edit parts of a photo, grade color and retouch in darktable and GIMP. |
| portrait | Portrait (85mm) | Make flattering portraits with the 85mm. |
| street | Street and documentary (35mm) | Catch real moments and tell stories with the 35mm. |
| landscape | Landscape and travel | Plan, shoot and share places with depth and good light. |
| night | Night and low light | Shoot sharp, clean photos when light is low. |
| your-eye | Your own eye and portfolio | Develop your own style and build a portfolio. |

```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{TITLE} · Learn Photography</title>
    <meta name="description" content="{SUMMARY}" />
    <script>
      try {
        const saved = localStorage.getItem('lp:theme');
        document.documentElement.dataset.theme = saved === 'light' || saved === 'dark'
          ? saved
          : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      } catch {}
    </script>
    <link rel="stylesheet" href="/src/styles/main.css" />
    <script type="module" src="/src/js/main.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header id="site-header" class="site-header"></header>
    <div class="layout layout--stage">
      <nav id="toc" class="toc" aria-label="On this page"></nav>
      <main id="main" class="stage" data-stage="{ID}" tabindex="-1">
        <div id="stage-header" class="stage-header"></div>

        <section class="practice" id="practice">
          <h2>Practice</h2>
          <div data-checklist></div>
        </section>

        <nav id="stage-pager" class="pager wide" aria-label="Stages"></nav>
      </main>
    </div>
    <footer id="site-footer" class="site-footer"></footer>
  </body>
</html>
```

- [ ] **Step 8: Verify**

Run: `pnpm test` (expected: PASS, all earlier suites)
Run: `pnpm build` (expected: 12 HTML files in `dist/`, no errors)
Run: `pnpm check:readability index.html` (expected: ✓ for `intro` and `how`, exit 0)

Smoke test with `pnpm dev`:
1. Open the home page. Plan, roadmap cards (6 core, 4 tracks, 1 finish) and overall progress all render.
2. Click **Light theme**. The page switches. Reload, and the theme stays.
3. Open a stage card. The stage header shows number, level, weeks and "What you will learn". The checklist shows the tasks.
4. Tick a task. The header progress updates. Go back home: the card shows "In progress".
5. At 360 px width, **Contents** opens the drawer. Tab cycles inside it, Escape closes it and focus returns to the button.
6. Click **Reset progress** and confirm. Cards return to "Not started".
7. The console shows no errors.

- [ ] **Step 9: Commit**

```bash
git add vite.config.js index.html stages src/styles src/js
git commit -m "feat: site shell, home page and stage skeletons"
```

---

### Task 6: Widget toolkit, shared scene and exposure simulator

**Files:**
- Create: `src/js/widgets/controls.js`, `src/js/widgets/scene.js`, `src/js/widgets/exposure-sim.js`
- Modify: `stages/exposure.html` (add the simulator section before `#practice`)
- Test: `tests/exposure-sim.test.js`

**Interfaces:**
- Consumes: `el`, `svgEl`, `uid`, `SVG_NS` (Task 5); photo-math and format (Task 1).
- Produces (`controls.js`):
  - `numberRange(from, to, step) → number[]`, with values rounded to 0.01
  - `rangeControl({label, values, value, format, spoken?, onInput}) → {el, value, set(v), setValues(list), setDisabled(flag)}`
  - `radioGroup({legend, options: [{value, label}], value, onChange}) → {el, set(v)}`
  - `checkbox({label, checked?, onChange}) → {el, input}`
  - `liveRegion(delayMs = 500) → {el, announce(text)}`
  - `readoutBox() → HTMLElement`, `setReadout(box, lines: string[])`
  - `simLayout(host, {view: Node[], controls: Node[], readout, live, extra?: Node[]})`
- Produces (`scene.js`): `SCENE_WIDTH = 640`, `SCENE_HEIGHT = 400`, `createScene({label?}) → { svg, setExposure(stops), setTint({r,g,b}), setSaturation(s), setToneCurve(table), setBackgroundBlur(px), setMotionBlur(px), setGrain(0..1), setSoftness(px), setVignette(0..1), setRotation(deg), setDust(bool), setSkyExposure(stops), setMaskFeather(px), showMask(bool) }`
- Produces (`exposure-sim.js`): `SCENES`, `verdictFor(offset)`, `histogramFor(offset) → number[32]`, `computeExposure({sceneEv, focal, mode: 'M'|'A', aperture, shutter, iso}) → {shutter, clamped, offset, verdict, backgroundBlurPx, motionBlurPx, grain, shake, histogram}`, `mount(host)`

- [ ] **Step 1: Write the failing test**

`tests/exposure-sim.test.js`:

```js
import { expect, test } from 'vitest';
import { computeExposure, histogramFor } from '../src/js/widgets/exposure-sim.js';

const base = { sceneEv: 12, focal: 35, mode: 'M', aperture: 2, shutter: 1 / 1000, iso: 100 };

test('f/2, 1/1000 s, ISO 100 is correct in open shade', () => {
  expect(computeExposure(base).verdict).toBe('correct');
});

test('A mode in bright sun at f/1.4 and ISO 25600 pins 1/8000 s and stays too bright', () => {
  const r = computeExposure({ ...base, sceneEv: 15, mode: 'A', aperture: 1.4, iso: 25600 });
  expect(r.shutter).toBe(1 / 8000);
  expect(r.clamped).toBe('fast');
  expect(r.verdict).toBe('too bright');
  expect(Number.isFinite(r.offset)).toBe(true);
});

test('A mode on a dim street at f/16 picks 15 s and warns about hand shake', () => {
  const r = computeExposure({ ...base, sceneEv: 4, mode: 'A', aperture: 16 });
  expect(r.shutter).toBe(15);
  expect(r.verdict).toBe('correct');
  expect(r.shake).toBe(true);
});

test('the shake warning depends on the lens', () => {
  expect(computeExposure({ ...base, shutter: 1 / 8 }).shake).toBe(false);
  expect(computeExposure({ ...base, shutter: 1 / 4 }).shake).toBe(true);
  expect(computeExposure({ ...base, focal: 85, aperture: 1.8, shutter: 1 / 30 }).shake).toBe(false);
  expect(computeExposure({ ...base, focal: 85, aperture: 1.8, shutter: 1 / 15 }).shake).toBe(true);
});

test('slower shutter adds motion blur; wider aperture and longer lens add background blur', () => {
  expect(computeExposure({ ...base, shutter: 1 / 30 }).motionBlurPx).toBeGreaterThan(computeExposure(base).motionBlurPx);
  expect(computeExposure({ ...base, aperture: 1.4 }).backgroundBlurPx).toBeGreaterThan(computeExposure({ ...base, aperture: 16 }).backgroundBlurPx);
  expect(computeExposure({ ...base, focal: 85 }).backgroundBlurPx).toBeGreaterThan(computeExposure(base).backgroundBlurPx);
});

test('the histogram piles up at the right edge when 3 stops too bright', () => {
  const over = histogramFor(3);
  expect(over.at(-1)).toBe(Math.max(...over));
  const correct = histogramFor(0);
  expect(correct.at(-1)).toBeLessThan(0.05 * Math.max(...correct));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/exposure-sim.test.js`
Expected: FAIL, `Failed to load url ../src/js/widgets/exposure-sim.js`.

- [ ] **Step 3: Controls**

`src/js/widgets/controls.js`:

```js
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

export function liveRegion(delayMs = 500) {
  const node = el('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  let timer;
  return {
    el: node,
    announce(text) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        node.textContent = text;
      }, delayMs);
    },
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
```

- [ ] **Step 4: Shared scene**

`src/js/widgets/scene.js`:

```js
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
      <rect x="-40" y="-40" width="720" height="262" fill="#fff" filter="url(#${id}-feather)"/>
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
    <rect data-mask-overlay x="-40" y="-40" width="720" height="262" fill="#ff3b3b" opacity="0" filter="url(#${id}-feather)"/>
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
```

- [ ] **Step 5: Exposure simulator**

`src/js/widgets/exposure-sim.js`:

```js
import { ISOS, LENSES, SHAKE_TOLERANCE, SHUTTERS, aperturesFor, autoShutter, blurDiscMm, blurPercentOfFrame, handheldLimitSeconds, settingsEv } from '../photo-math.js';
import { formatAperture, formatEv, formatIso, formatShutter, shutterSpoken } from '../format.js';
import { svgEl } from '../dom.js';
import { liveRegion, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { SCENE_WIDTH, createScene } from './scene.js';

export const SCENES = [
  { ev: 15, label: 'Bright sun (EV 15)' },
  { ev: 13, label: 'Cloudy bright (EV 13)' },
  { ev: 12, label: 'Open shade (EV 12)' },
  { ev: 5, label: 'Home at night (EV 5)' },
  { ev: 4, label: 'Dim street at night (EV 4)' },
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

export function verdictFor(offset) {
  const size = Math.abs(offset);
  if (size < 0.35) return 'correct';
  if (offset > 0) return size <= 1.5 ? 'a bit bright' : 'too bright';
  return size <= 1.5 ? 'a bit dark' : 'too dark';
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

  const aperture = rangeControl({ label: 'Aperture', values: aperturesFor(LENSES[35]), value: state.aperture, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const shutter = rangeControl({ label: 'Shutter speed', values: [...SHUTTERS].reverse(), value: state.shutter, format: formatShutter, spoken: shutterSpoken, onInput: (v) => update({ shutter: v }) });
  const iso = rangeControl({ label: 'ISO', values: ISOS, value: state.iso, format: formatIso, onInput: (v) => update({ iso: v }) });
  const sceneChoice = radioGroup({ legend: 'Light in scene (EV100)', options: SCENES.map((s) => ({ value: s.ev, label: s.label })), value: state.sceneEv, onChange: (v) => update({ sceneEv: v }) });
  const lens = radioGroup({
    legend: 'Lens',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: state.focal,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });
  const mode = radioGroup({
    legend: 'Mode',
    options: [{ value: 'M', label: 'M: you set all three' }, { value: 'A', label: 'A: the camera sets the shutter' }],
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
    const lines = [`Exposure ${formatEv(r.offset)}: ${r.verdict}.`];
    if (state.mode === 'A') lines.push(`The camera picked ${formatShutter(r.shutter)}.`);
    if (r.clamped === 'fast') lines.push('Even 1/8000 s lets in too much light. Close the aperture or lower the ISO.');
    if (r.clamped === 'slow') lines.push('Even 30 s is not enough light. Open the aperture or raise the ISO.');
    if (r.shake) lines.push(`${formatShutter(r.shutter)} is slow for the ${state.focal}mm by hand. Use a tripod or a faster shutter speed.`);
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
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test tests/exposure-sim.test.js`
Expected: PASS (6 tests).

- [ ] **Step 7: Place the simulator on the exposure page**

In `stages/exposure.html`, insert before `<section class="practice" id="practice">`:

```html
        <section class="simulator wide" id="simulator">
          <h2>Play with exposure</h2>
          <p>Pick a scene and a lens. Change one setting at a time and watch the photo, the histogram and the warnings. Switch to A mode to see which shutter speed the camera picks.</p>
          <div data-widget="exposure-sim"></div>
        </section>
```

- [ ] **Step 8: Smoke test**

With `pnpm dev`, open `/stages/exposure.html`:
1. Drag each slider. The scene brightens or darkens, the background blurs at f/1.4, the cyclist smears at slow shutter speeds, and grain grows with ISO.
2. Pick **Bright sun**, **A**, f/1.4 and ISO 25600. The readout says "too bright" and "Even 1/8000 s…", and the right histogram bar turns red. The shutter slider is disabled and shows 1/8000 s.
3. Pick **Dim street**, **A**, f/16, ISO 100. The readout shows 15 s and a hand-shake warning.
4. Switch the lens to 85mm. The aperture slider now starts at f/1.8.
5. Keyboard only: Tab reaches every control, and arrow keys move the sliders. A screen reader hears "f/2.8" and "1/250 of a second" as slider values (`aria-valuetext`).
6. The console shows no errors.

- [ ] **Step 9: Commit**

```bash
git add src/js/widgets tests/exposure-sim.test.js stages/exposure.html
git commit -m "feat: widget toolkit, shared scene and exposure simulator"
```

---

### Task 7: Stage 1 content: Exposure

**Files:**
- Modify: `stages/exposure.html`
- Create: `src/illustrations/camera-light-path.svg`, `bucket.svg`, `stops-staircase.svg`, `fraction-pie.svg`, `f-number-fraction.svg`, `shutter-motion.svg`, `iso-volume.svg`, `histogram-shapes.svg`

**Interfaces:**
- Consumes: page skeleton and the `#simulator` section (Tasks 5–6); Content Conventions (top of this plan).
- Source of facts: spec §5 "Stage 1 — Exposure"; `docs/research/sony-a7ii.md`; `docs/research/pedagogy-numbers-writing.md` (§A2, §A3, §B2, §B3).

- [ ] **Step 1: Illustrations**

`f-number-fraction.svg` is given in full in Content Conventions. Draw the others with the same style rules:

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `camera-light-path.svg` | 0 0 640 220 | Sun on the left. Arrows (`i-accent-line`) pass through a lens (two arcs), an aperture ring, an open shutter (two curtains) and a sensor rectangle. Labels under each: "light", "lens", "aperture", "shutter", "sensor". | Light travels through the lens, the aperture and the open shutter to the sensor. |
| `bucket.svg` | 0 0 640 260 | Rain lines (`i-cool-line`) over two buckets. Left: a wide bucket labelled "big opening, short time". Right: a narrow bucket labelled "small opening, long time". Both show the same water level (`i-cool`). | A wide bucket fills fast in the rain. A narrow bucket needs more time to collect the same water. |
| `stops-staircase.svg` | 0 0 640 240 | Five steps rising left to right, "×2" on each riser, "less light" at the bottom left and "more light" at the top right. | A staircase: each step up doubles the light, and each step down halves it. |
| `fraction-pie.svg` | 0 0 640 220 | Left pie cut in half with one half filled (`i-accent`), labelled "f/2 = 1/2". Right pie cut in eighths with one slice filled, labelled "f/8 = 1/8". | A pie cut in half next to a pie cut in eighths. f/2 is a half and f/8 is an eighth. |
| `shutter-motion.svg` | 0 0 640 220 | Three frames of one runner silhouette. 1/1000 s: sharp. 1/60 s: 3 offset copies at falling opacity. 1/8 s: 8 offset copies, long smear. Labels under each. | A runner shot at 1/1000 s is sharp, at 1/60 s is a little blurred and at 1/8 s is a smear. |
| `iso-volume.svg` | 0 0 640 220 | A volume knob marked ISO 100, 800, 6400 and 25600. To the right, three squares of the same grey with more dots (`i-muted`) in each, labelled "ISO 100", "ISO 6400", "ISO 25600". | A volume knob marked ISO 100 to 25600. Turning it up brightens the photo and makes grain more visible. |
| `histogram-shapes.svg` | 0 0 640 240 | Three small histograms (bars). "Too dark": a pile against the left edge. "Good": spread out with room at the right. "Clipped": a tall spike at the right edge in `i-accent`. | Three histograms: a pile at the left edge is too dark, a spread with room on the right is good, and a spike at the right edge means clipped highlights. |

- [ ] **Step 2: Lessons**

Insert the lessons after `#stage-header`, in this order. Lesson `aperture` is the exemplar in Content Conventions; copy it as written.

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `start-here` | A camera collects light | `camera-light-path`, `bucket` (Picture it) | Light → lens → aperture → shutter → sensor. *Exposure* = how much light you collect. The bucket analogy. **On your α7 II** as a numbered list: hold the camera with the left hand under the lens and elbows in; mode dial to <b class="ui">A</b> (Aperture Priority); half-press to focus, full press to shoot; <b class="ui">MENU › Camera Settings › Quality › RAW</b> (darktable needs RAW); show the histogram with <b class="ui">MENU › Custom Settings › DISP Button › Monitor</b>, tick <b class="ui">Histogram</b>, then repeat for <b class="ui">Finder</b>; battery NP-FW50 lasts about 270 shots with the viewfinder, so carry 2 spares. |
| 2 | `stops` | Stops double or halve the light | `stops-staircase` | One *stop* = double or half the light. Examples: f/4 → f/5.6 halves the light; 1/250 s → 1/125 s doubles it; ISO 400 → ISO 800 doubles the brightness. The exposure compensation dial moves in 1/3 stops, so 3 clicks = 1 stop. |
| 3 | `aperture` | Aperture controls light and blur | `fraction-pie` (Picture it), `f-number-fraction` | Exemplar (Content Conventions). Add `fraction-pie` inside the Picture it callout. |
| 4 | `shutter-speed` | Shutter speed freezes or blurs motion | `shutter-motion` | List: still person 1/125 s, walking 1/250 s, kids playing 1/500 s, running or sports 1/1000 s or faster, splashes 1/1000 s or faster, silky water from 1/2 s (smoother at 1–2 s, very smooth at 5–10 s, on a tripod). Handheld: start at 1 ÷ focal length (35mm → 1/40 s, 85mm → 1/100 s). Sony rates IBIS at 4.5 stops; plan on 2–3 for still subjects (35mm ≈ 1/8 s, 85mm ≈ 1/20 s). IBIS cancels your shake, not a moving subject. Picture it: a laser pointer shakes more on a far wall, the way a longer lens shows more shake. **On your α7 II**: <b class="ui">S</b> (Shutter Priority), turn the front or rear dial; <b class="ui">SteadyShot</b> is On by default. |
| 5 | `iso` | ISO brightens what you captured | `iso-volume` | The sensor has one sensitivity, and ISO brightens what it captured (volume knob). Noise mostly comes from too little light. Raising ISO in the camera still beats brightening later. Example: dim party (about EV 4), 35mm, f/1.4, 1/125 s, ISO 1600. ISO 50 lowers dynamic range, so start at ISO 100. **On your α7 II**: <b class="ui">MENU › Camera Settings › ISO</b>; <b class="ui">ISO AUTO</b> works from ISO 100 to 6400 by default; raise <b class="ui">ISO AUTO Maximum</b> for night work. |
| 6 | `together` | Three settings work together | none | Aperture and shutter let light in; ISO brightens it. Equivalent exposures in open shade at ISO 100: f/2.8 1/500 s = f/4 1/250 s = f/5.6 1/125 s. Sunny 16 list at shutter 1/ISO: snow or sand f/22, sunny f/16, slight overcast f/11, overcast f/8, heavy overcast f/5.6, open shade or sunset f/4. **On your α7 II**: in <b class="ui">M</b> (Manual Exposure), the front dial sets the aperture and the rear dial sets the shutter speed. |
| 7 | `modes-metering` | Modes, metering and the histogram | `histogram-shapes` | A mode is a pro workflow: you pick the aperture, the camera picks the shutter. Use M with <b class="ui">ISO AUTO</b> when you need a fixed shutter speed; in M, exposure compensation works only with ISO AUTO. Dial ±3 EV; the menu allows ±5 EV only when the dial is at 0. <b class="ui">Metering Mode</b>: <b class="ui">Multi</b>, <b class="ui">Center</b>, <b class="ui">Spot</b>. The meter aims for mid-grey, so snow needs about +1 EV and a black cat about −1 EV. There is no ideal histogram shape. Avoid a spike at the right edge: white areas hold no detail. <b class="ui">Zebra</b> levels 70 to 100 and 100+. |
| 8 | `review-loop` | Review every shoot in darktable | none | 15 minutes after every practice shoot: copy photos to `YYYY/YYYY-MM-DD_event`, open darktable, <b class="ui">import › add to library</b>, hover a photo and hold <b class="ui">W</b> to see it full size, read the settings in the <b class="ui">image information</b> module. Before writing, confirm the module name "image information" in the darktable 5.6 manual (utility modules). If it differs, use the manual's name. |

- [ ] **Step 3: Key terms, mistakes, self-check and learn more**

Key terms (`#key-terms`, tech), placed after the last lesson:

| Term | Definition |
|---|---|
| Exposure | How much light the photo collects. |
| Stop | A step that doubles or halves the light. |
| Aperture | The adjustable hole in the lens. |
| F-number | The aperture size as a fraction. Small number, big hole. |
| Shutter speed | How long the sensor collects light. |
| ISO | How much the camera brightens the light it captured. |
| Noise | Grainy specks, mostly from too little light. |
| EV (exposure value) | A number for how much light a scene has. |
| Histogram | A graph of the dark to bright tones in your photo. |
| Clipping | Pure white or black areas with no detail left. |
| Metering | How the camera measures light to pick settings. |

The `#simulator` section from Task 6 stays after `#key-terms`. Stage 1 has no warm-up.

Common mistakes (after `#practice`):

| Mistake | Fix |
|---|---|
| Thinking f/8 is a bigger hole than f/2. | The f-number is a fraction. f/2 is a half and f/8 is an eighth. |
| Judging brightness on the camera screen. | Screens look different in sun and in the dark. Check the histogram. |
| Using a slow shutter for people who move. | Use 1/250 s or faster for people who walk. |
| Thinking real photographers only use M. | A mode with the exposure dial is a fast, pro way to work. |
| Fearing high ISO. | Too little light makes noise. A blurry photo is worse than a grainy one. |
| Shooting JPEG only. | Shoot RAW so you can fix white balance and exposure later. |

Self-check:

| Question | Answer |
|---|---|
| Your photo is too dark. Which two settings let in more light? | A smaller f-number or a slower shutter speed. Raising ISO brightens too, but it adds no light. |
| You go from f/4 to f/5.6. How much light do you lose? | One stop: half the light. |
| Which is the bigger hole: f/2 or f/8? | f/2. A smaller f-number means a bigger hole. |
| Snow looks grey in your photo. What do you do? | Turn the exposure compensation dial to about +1. |
| Your histogram has a tall spike at the right edge. What does it mean? | Highlights are clipped. Those white areas have no detail, so lower the exposure. |

Learn more:
- Sony α7 II Help Guide: https://helpguide.sony.net/ilc/1450/v1/en/index.html
- Cambridge in Colour, Camera exposure: https://www.cambridgeincolour.com/tutorials/camera-exposure.htm
- Photography Life, What is ISO: https://photographylife.com/what-is-iso-in-photography
- Cambridge in Colour, Histograms: https://www.cambridgeincolour.com/tutorials/histograms1.htm

- [ ] **Step 4: Verify and commit**

Follow "Content workflow for every stage task" steps 4–8 for `stages/exposure.html`. Then:

```bash
git add stages/exposure.html src/illustrations
git commit -m "content: stage 1 exposure lessons and illustrations"
```

---

### Task 8: Stage 2: Focus and sharpness, with depth-of-field simulator

**Files:**
- Create: `src/js/widgets/dof-sim.js`
- Modify: `stages/focus.html`
- Create: `src/illustrations/dof-slab.svg`, `focus-areas.svg`, `nearest-eye.svg`, `recompose-error.svg`

**Interfaces:**
- Consumes: `depthOfField`, `blurDiscMm`, `blurPercentOfFrame`, `aperturesFor`, `LENSES` (Task 1); `describeSharpZone`, `describeDepth`, `formatDistance`, `formatAperture` (Task 1); controls (Task 6); `svgEl`, `uid` (Task 5).
- Produces: `mount(host)` for `data-widget="dof-sim"`.
- Source of facts: spec §5 "Stage 2 — Focus & sharpness"; `docs/research/sony-a7ii.md` rows 4a–4c, 5, 6, 8c, 8d, 10b, 11b.

The model is fully covered by Task 1 tests, including the infinity case and thin zones. This task adds rendering only, so it is verified by the smoke test.

- [ ] **Step 1: Simulator**

`src/js/widgets/dof-sim.js`:

```js
import { LENSES, aperturesFor, blurDiscMm, blurPercentOfFrame, depthOfField } from '../photo-math.js';
import { describeDepth, describeSharpZone, formatAperture, formatDistance } from '../format.js';
import { svgEl, uid } from '../dom.js';
import { liveRegion, numberRange, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

const DISTANCES_MM = [...numberRange(500, 2000, 100), ...numberRange(2500, 10000, 500)];
const AXIS_MAX_MM = 12000;
const X0 = 70;
const X1 = 610;
const xFor = (mm) => X0 + (Math.min(mm, AXIS_MAX_MM) / AXIS_MAX_MM) * (X1 - X0);
const blurPx = (focal, aperture, subjectMm, objectMm) =>
  Math.min(20, ((blurPercentOfFrame(blurDiscMm(focal, aperture, subjectMm, objectMm)) / 100) * 640) / 2);

function createSideView() {
  const svg = svgEl('svg', { viewBox: '0 0 640 150', class: 'sim-diagram', 'aria-hidden': 'true' });
  const zone = svgEl('rect', { class: 'd-zone', y: 40, height: 60 });
  const subject = svgEl('g');
  const nearLabel = svgEl('text', { y: 30, 'text-anchor': 'middle' });
  const farLabel = svgEl('text', { y: 30, 'text-anchor': 'middle' });
  const ticks = [0, 2, 4, 6, 8, 10, 12].map((m) => svgEl('g', {}, [
    svgEl('line', { class: 'd-line', x1: xFor(m * 1000), x2: xFor(m * 1000), y1: 100, y2: 108 }),
    svgEl('text', { x: xFor(m * 1000), y: 128, 'text-anchor': 'middle', text: `${m} m` }),
  ]));
  svg.append(
    svgEl('line', { class: 'd-line', x1: X0, x2: X1, y1: 100, y2: 100 }),
    ...ticks,
    svgEl('rect', { class: 'd-muted', x: 20, y: 82, width: 34, height: 22, rx: 4 }),
    svgEl('rect', { class: 'd-muted', x: 54, y: 87, width: 12, height: 12 }),
    zone,
    subject,
    nearLabel,
    farLabel,
  );
  return {
    svg,
    update(dof, subjectMm) {
      const left = xFor(dof.near);
      const right = xFor(dof.far);
      zone.setAttribute('x', String(left));
      zone.setAttribute('width', String(Math.max(2, right - left)));
      const sx = xFor(subjectMm);
      subject.replaceChildren(
        svgEl('circle', { class: 'd-accent', cx: sx, cy: 56, r: 8 }),
        svgEl('rect', { class: 'd-accent', x: sx - 5, y: 66, width: 10, height: 34, rx: 3 }),
      );
      const beyondAxis = dof.far > AXIS_MAX_MM;
      if (right - left < 70) {
        nearLabel.setAttribute('x', String(left));
        nearLabel.textContent = describeSharpZone(dof).replace('Sharp from ', '').replace(/\.$/, '');
        farLabel.textContent = '';
      } else {
        nearLabel.setAttribute('x', String(left));
        nearLabel.textContent = formatDistance(dof.near);
        farLabel.setAttribute('x', String(Math.min(right, X1 - 30)));
        farLabel.textContent = beyondAxis ? `${formatDistance(dof.far)} →` : formatDistance(dof.far);
      }
    },
  };
}

function createPreview() {
  const id = uid('dof');
  const svg = svgEl('svg', { viewBox: '0 0 640 300', role: 'img', 'aria-label': 'Preview: a flower in front, a person in focus, trees behind' });
  svg.innerHTML = `
    <defs>
      <filter id="${id}-fg" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur data-fg stdDeviation="0"/></filter>
      <filter id="${id}-bg" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur data-bg stdDeviation="0"/></filter>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc4e8"/><stop offset="1" stop-color="#e8eef2"/></linearGradient>
    </defs>
    <rect width="640" height="300" fill="url(#${id}-sky)"/>
    <g filter="url(#${id}-bg)">
      <rect x="-20" y="150" width="680" height="40" fill="#7fa36a"/>
      <g fill="#3f6b4f"><circle cx="40" cy="130" r="44"/><circle cx="130" cy="120" r="52"/><circle cx="250" cy="135" r="40"/><circle cx="390" cy="118" r="54"/><circle cx="500" cy="132" r="42"/><circle cx="600" cy="122" r="50"/></g>
      <g fill="#5b3a29"><rect x="34" y="160" width="10" height="30"/><rect x="124" y="160" width="12" height="30"/><rect x="384" y="160" width="12" height="30"/><rect x="594" y="160" width="12" height="30"/></g>
    </g>
    <rect x="0" y="190" width="640" height="110" fill="#a7b98f"/>
    <g>
      <path d="M296 300 L300 230 L340 230 L344 300 Z" fill="#2b2d3a"/>
      <path d="M286 232 Q290 175 320 170 Q350 175 354 232 Z" fill="#c2563d"/>
      <circle cx="320" cy="150" r="22" fill="#e0b48f"/>
      <path d="M298 148 Q300 124 320 126 Q340 124 342 148 Q334 136 320 137 Q306 136 298 148 Z" fill="#2a1d18"/>
    </g>
    <g filter="url(#${id}-fg)">
      <path d="M120 300 Q118 250 126 215" stroke="#3f7a3a" stroke-width="6" fill="none"/>
      <g fill="#e66b8a"><circle cx="126" cy="200" r="16"/><circle cx="108" cy="212" r="14"/><circle cx="144" cy="212" r="14"/><circle cx="116" cy="230" r="13"/><circle cx="138" cy="230" r="13"/></g>
      <circle cx="126" cy="216" r="9" fill="#f6d55c"/>
    </g>`;
  const fg = svg.querySelector('[data-fg]');
  const bg = svg.querySelector('[data-bg]');
  return {
    svg,
    set(foregroundPx, backgroundPx) {
      fg.setAttribute('stdDeviation', String(foregroundPx));
      bg.setAttribute('stdDeviation', String(backgroundPx));
    },
  };
}

export function mount(host) {
  const state = { focal: 85, aperture: 1.8, subjectMm: 2000 };
  const side = createSideView();
  const preview = createPreview();
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Aperture', values: aperturesFor(LENSES[85]), value: 1.8, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const distance = rangeControl({ label: 'Focus distance', values: DISTANCES_MM, value: 2000, format: formatDistance, onInput: (v) => update({ subjectMm: v }) });
  const lens = radioGroup({
    legend: 'Lens',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: 85,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });

  function update(patch) {
    Object.assign(state, patch);
    const dof = depthOfField(state.focal, state.aperture, state.subjectMm);
    side.update(dof, state.subjectMm);
    preview.set(
      blurPx(state.focal, state.aperture, state.subjectMm, state.subjectMm * 0.5),
      blurPx(state.focal, state.aperture, state.subjectMm, state.subjectMm * 4),
    );
    const lines = [describeSharpZone(dof), describeDepth(dof), `Hyperfocal distance: ${formatDistance(dof.hyperfocal)}.`];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [side.svg, preview.svg], controls: [lens.el, aperture.el, distance.el], readout, live: live.el });
  update({});
}
```

- [ ] **Step 2: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `dof-slab.svg` | 0 0 640 220 | Side view: camera on the left, a person in the middle. A band (`i-accent`, 35% opacity) around the person fades at both edges. Labels "sharp" over the band and "softer" on each side. | Only one distance is truly sharp. Sharpness fades gradually in front of and behind it. |
| `focus-areas.svg` | 0 0 640 220 | Four small frames labelled Wide, Zone, Center and Flexible Spot. Each shows the area the camera uses (`i-accent-line` boxes): the whole frame, a 3×3 block, a centre box, one small movable box. | Four focus areas: Wide uses the whole frame, Zone a block, Center the middle and Flexible Spot one small point you move. |
| `nearest-eye.svg` | 0 0 640 220 | A face turned slightly to one side. A focus box on the nearer eye (`i-accent-line`). A side-view inset shows a thin sharp slab through that eye only. | Focus on the eye closest to the camera. At f/1.8 the sharp slab is only a few centimeters deep. |
| `recompose-error.svg` | 0 0 640 220 | Top view: camera pointing at an eye, with an arc showing that sharp distance. A second, turned camera shows the same arc now passing behind the eye. Labels "focus here" and "after turning". | Focusing and then turning the camera swings the sharp plane, so it can miss the eye. |

- [ ] **Step 3: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `in-focus` | Only one distance is truly sharp | `dof-slab` | The slab-of-glass-with-soft-edges analogy. *Depth of field* depends on aperture and on how big the subject is in the frame (closer or longer lens = bigger = shallower). Near portrait distances, the sharp zone splits about evenly in front of and behind the subject. |
| 2 | `focus-mode` | Focus Mode: still or moving | none | <b class="ui">MENU › Camera Settings › Focus Mode</b>: <b class="ui">Single-shot AF</b> (AF-S, still subjects), <b class="ui">Continuous AF</b> (AF-C, moving), <b class="ui">DMF</b>, <b class="ui">Manual Focus</b>. Examples: café portrait in AF-S; a running child in AF-C. |
| 3 | `focus-area` | Focus Area: where the camera looks | `focus-areas` | <b class="ui">Focus Area</b>: <b class="ui">Wide</b>, <b class="ui">Zone</b>, <b class="ui">Center</b>, <b class="ui">Flexible Spot</b> (S/M/L), <b class="ui">Lock-on AF</b>. Beginner default: Flexible Spot M. To move the spot, assign <b class="ui">Focus Standard</b> to a key (firmware 4.00 or later). Do not mention "Expand Flexible Spot": the α7 II does not have it. |
| 4 | `eye-af` | Eye AF puts focus on the eye | `nearest-eye` | Assign it with <b class="ui">MENU › Custom Settings › Custom Key Settings</b>, pick a key, choose <b class="ui">Eye AF</b>. Hold that key while you press the shutter. Use it in AF-S; Sony warns it may not work in AF-C. The camera picks the eye. Example: 85mm, f/1.8, 2 m → only 5.7 cm is sharp. |
| 5 | `back-button` | Back-button focus separates focus from the shutter | none | <b class="ui">MENU › Custom Settings › AF w/ shutter › Off</b>, then <b class="ui">Custom Key Settings › AEL Button › AF On</b>, with the switch lever on AEL. Why: focus once, then shoot many frames without refocusing. |
| 6 | `manual-focus` | Manual focus with peaking | none | <b class="ui">Peaking Level</b> is Off by default, so set <b class="ui">Mid</b>. <b class="ui">Peaking Color</b>: Red, Yellow or White. <b class="ui">MF Assist › On</b> enlarges the view when you turn the focus ring. Peaking works in MF and DMF only. |
| 7 | `sharpness-killers` | What makes photos blurry | `recompose-error` | Most "bad lens" blur is a slow shutter or missed focus. Also: subject motion; focus-and-recompose at f/1.4; very small apertures (diffraction, around f/16); a dirty lens. <b class="ui">SteadyShot Adjust. › Manual</b> plus <b class="ui">SteadyS. Focal Len.</b> only for lenses without electronic contacts. At about 1/2000 s or faster wide open, if bokeh edges look cut off, try <b class="ui">e-Front Curtain Shut. › Off</b>. |

- [ ] **Step 4: Other sections**

Key terms: Focal plane (The one distance that is truly sharp.) · Depth of field (The zone in front and behind that looks sharp.) · Bokeh (The look of the blurred parts.) · AF-S (Focuses once and locks, for still subjects.) · AF-C (Keeps focusing while you half-press, for moving subjects.) · Focus area (The part of the frame the camera uses to focus.) · Peaking (Colored outlines that show sharp edges in manual focus.) · Diffraction (Softness from very small apertures, around f/16.) · Hyperfocal distance (The focus distance that keeps infinity acceptably sharp.)

Simulator section: heading "See the sharp zone". Intro: "Pick a lens, an aperture and a distance. The green band shows what looks sharp. Watch it shrink when you open the aperture or step closer." Widget `dof-sim`.

Warm-up: "Shoot one scene in A mode at f/2 and at f/8. Check the histogram on both and fix the exposure with the dial."

Mistakes:

| Mistake | Fix |
|---|---|
| Focusing on the nose or the ears. | Put the focus point on the nearest eye. |
| Leaving Focus Area on Wide. | Wide may pick the background. Use Flexible Spot M. |
| Believing the sharp zone is one third in front and two thirds behind. | That is only true far away. At portrait distance it is about half and half. |
| Thinking the smallest aperture is the sharpest. | Very small apertures, around f/16, soften detail. |
| Blaming the lens for blur. | Blur is usually a slow shutter or missed focus. |

Self-check:

| Question | Answer |
|---|---|
| A friend walks toward you. Which focus mode do you use? | Continuous AF (AF-C). |
| At 85mm, f/1.8 and 2 m, how deep is the sharp zone? | About 6 cm. Focus on the nearest eye. |
| You focus on an eye at f/1.4 and turn the camera to recompose. What can go wrong? | The sharp plane swings away, so the eye can go soft. Move the focus spot instead. |
| What does IBIS not fix? | A subject that moves. It only cancels your hand shake. |
| Your photo is a bit dark in A mode. What is the fastest fix? | Turn the exposure compensation dial up. |

Learn more:
- Cambridge in Colour, Depth of field: https://www.cambridgeincolour.com/tutorials/depth-of-field.htm
- Photography Life, The reciprocal rule: https://photographylife.com/what-is-reciprocal-rule-in-photography
- Sony α7 II Help Guide: https://helpguide.sony.net/ilc/1450/v1/en/index.html

- [ ] **Step 5: Verify and commit**

Follow the content workflow steps 4–8 for `stages/focus.html`. Smoke-test the simulator:
- 85mm, f/1.8, 2 m reads "Sharp from 1.97 m to 2.03 m." and "Depth of field: 5.7 cm."
- 35mm, f/8, 10 m reads "… to infinity." and the band reaches the right edge with an arrow.
- The foreground flower and the trees blur more at f/1.8 than at f/8.

```bash
git add src/js/widgets/dof-sim.js stages/focus.html src/illustrations
git commit -m "content: stage 2 focus lessons and depth-of-field simulator"
```

---

### Task 9: Stage 3: Composition, with grid and perspective simulator

**Files:**
- Create: `src/js/widgets/composition-sim.js`
- Modify: `stages/composition.html`
- Create: `src/illustrations/thirds-grid.svg`, `leading-lines.svg`, `framing-layers.svg`, `perspective-distance.svg`, `look-room.svg`
- Test: `tests/composition-sim.test.js`

**Interfaces:**
- Consumes: `sameFramingDistanceMm`, `horizontalFovDeg` (Task 1); `formatDistance` (Task 1); controls (Task 6); `el`, `svgEl`, `uid` (Task 5).
- Produces: `perspectiveCompare(behindMm = 50000, subject35Mm = 1200) → { s35, s85, ratio }`, `mount(host)`.
- Source of facts: spec §5 "Stage 3 — Composition"; `docs/research/pedagogy-numbers-writing.md` §A3 row 11 and §B2 "Composition".

- [ ] **Step 1: Write the failing test**

`tests/composition-sim.test.js`:

```js
import { expect, test } from 'vitest';
import { perspectiveCompare } from '../src/js/widgets/composition-sim.js';

test('same framing: the 85mm stands about 2.9 m away and the mountain looks about 2.35 times larger', () => {
  const r = perspectiveCompare();
  expect(r.s35).toBe(1200);
  expect(Math.abs(r.s85 - 2914)).toBeLessThan(5);
  expect(r.ratio).toBeGreaterThan(2.3);
  expect(r.ratio).toBeLessThan(2.4);
});

test('a far background grows more, relative to the person, than a near one', () => {
  expect(perspectiveCompare(50000).ratio).toBeGreaterThan(perspectiveCompare(2000).ratio);
});
```

Run: `pnpm test tests/composition-sim.test.js`
Expected: FAIL, the module is missing.

- [ ] **Step 2: Simulator**

`src/js/widgets/composition-sim.js`:

```js
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
```

Run: `pnpm test tests/composition-sim.test.js`
Expected: PASS.

- [ ] **Step 3: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `thirds-grid.svg` | 0 0 640 400 | A simple landscape with the horizon on the lower third line and a tree on the right third line. Grid lines in `i-accent-line`. | A landscape with the horizon on the lower third line and a tree on the right third line. |
| `leading-lines.svg` | 0 0 640 400 | A road narrowing from the bottom corners to a small figure (`i-accent`) near the upper third. | Two road edges lead the eye to a small figure in the distance. |
| `framing-layers.svg` | 0 0 640 400 | A doorway frame in the foreground (`i-fill`), a person in the middle ground, hills in the background (`i-muted`). Labels "foreground", "middle", "background". | A doorway frames a person, with hills behind: three layers of depth. |
| `perspective-distance.svg` | 0 0 640 260 | Top view: a person and a mountain far away. Camera A close with a wide cone, labelled "35mm, 1.2 m". Camera B farther back with a narrow cone, labelled "85mm, 2.9 m". | Same framing of the person: with the 85mm you stand farther back, so the far mountain looks larger. |
| `look-room.svg` | 0 0 640 220 | Two frames of a person looking left. In the first, the person sits on the left edge, facing out (label "cramped"). In the second, the person is on the right third with space in front (label "look room"). | Leave space in the direction a person looks. |

- [ ] **Step 4: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `simplify` | Simplify: one subject, clean edges | none | Name the subject in one word before you shoot. Remove what does not help. Check the edges and the background. |
| 2 | `thirds` | The rule of thirds is a guide | `thirds-grid` | It is a guideline, not a rule. Symmetry and centred subjects also work. **On your α7 II**: a grid can be shown in the viewfinder. Check the exact menu label in the Sony Help Guide before writing it; if you cannot confirm it, leave the camera step out. |
| 3 | `lines-frames-layers` | Lines, frames and layers lead the eye | `leading-lines`, `framing-layers` | Leading lines; natural frames (doorways, windows, branches); foreground, middle ground and background. |
| 4 | `negative-space` | Space and contrast make the subject stand out | none | Negative space; figure-ground, meaning the subject must contrast with the background in tone, color or sharpness. |
| 5 | `perspective` | Distance changes perspective | `perspective-distance` | Perspective comes from distance. With the 85mm you stand farther back, so the background looks larger and closer. Zooming or cropping changes only the framing. The 35mm shows context. Use the simulator numbers: 1.2 m vs 2.9 m, mountain about 2.4 times larger. Never say "the lens compresses". |
| 6 | `balance` | Balance, patterns and look room | `look-room` | Repetition and breaking the pattern; odd numbers; space where a subject looks or moves. |
| 7 | `work-the-scene` | Work the scene | none | Make 10 or more variations of one subject. Example (spec): "Street vendor: 35mm, step closer, frame through the stall, vendor on the right third, look room on the left." |

- [ ] **Step 5: Other sections**

Key terms: Rule of thirds (Placing key parts on lines that split the frame in three.) · Leading line (A line that guides the eye to the subject.) · Negative space (Empty area around the subject.) · Figure-ground (How well the subject stands out from the background.) · Perspective (How big near and far things look next to each other.) · Look room (Space in front of where a subject looks or moves.)

Simulator section: heading "Try grids and lenses". Intro: "Turn grid overlays on and off. Then switch between the 35mm and the 85mm. The person stays the same size, so watch what happens to the mountain." Widget `composition-sim`.

Warm-up: "Find your handheld limit again with the 85mm. Has it changed since stage 2?"

Mistakes:

| Mistake | Fix |
|---|---|
| Saying the 85mm "compresses" the scene. | Your distance changes perspective. The lens only changes how much you see. |
| Zooming or cropping instead of walking. | Walk closer or farther to change perspective. |
| Putting everything in the frame. | Pick one subject and keep the edges clean. |
| Taking one frame and leaving. | Work the scene: try 10 angles and distances. |
| Treating the rule of thirds as a law. | It is a guide. Centred and symmetric photos can be strong. |

Self-check:

| Question | Answer |
|---|---|
| Why does the mountain look bigger with the 85mm at the same framing? | You stand farther back. Distance changes perspective. |
| Your subject blends into a busy background. Name two fixes. | Move to find a plain or contrasting background, or use a smaller f-number to blur it. |
| A person looks to the left. Where do you leave space? | On the left, in front of their face. |
| Which f-number gives more depth of field: f/2 or f/11? | f/11. |

Learn more:
- Cambridge in Colour, Camera lenses (perspective): https://www.cambridgeincolour.com/tutorials/camera-lenses.htm
- Cambridge in Colour, Rule of thirds: https://www.cambridgeincolour.com/tutorials/rule-of-thirds.htm. Open this link first and drop it if it does not load.

- [ ] **Step 6: Verify and commit**

Follow the content workflow steps 4–8 for `stages/composition.html`. Smoke-test the simulator: switching to 85mm makes the mountain about 2.4 times larger and moves the person dot farther from "You". Each overlay toggles independently.

```bash
git add src/js/widgets/composition-sim.js tests/composition-sim.test.js stages/composition.html src/illustrations
git commit -m "content: stage 3 composition lessons and perspective simulator"
```

---

### Task 10: Stage 4: Light and color, with light and white-balance simulator

**Files:**
- Create: `src/js/widgets/light-sim.js`
- Modify: `stages/light.html`
- Create: `src/illustrations/hard-soft-shadow.svg`, `light-directions.svg`, `sun-angles.svg`, `kelvin-scale.svg`, `color-wheel.svg`
- Test: `tests/light-sim.test.js`

**Interfaces:**
- Consumes: `formatKelvin` (Task 1); controls (Task 6); `svgEl`, `uid`, `el` (Task 5).
- Produces:
  - `CAMERA_KELVIN` (2500–9900 in 100 K steps), `SCENE_LIGHTS`
  - `lightPattern(angleDeg) → { name, folded, side: 'left'|'right'|'none', lit }`
  - `whiteBalanceCast(sceneK, cameraK) → { mired, cast: 'neutral'|'blue'|'orange', tint: {r,g,b} }`
  - `mount(host)`
- Source of facts: spec §5 "Stage 4 — Light & color"; `docs/research/sony-a7ii.md` row 13; `docs/research/pedagogy-numbers-writing.md` §A4.

- [ ] **Step 1: Write the failing test**

`tests/light-sim.test.js`:

```js
import { describe, expect, test } from 'vitest';
import { CAMERA_KELVIN, lightPattern, whiteBalanceCast } from '../src/js/widgets/light-sim.js';

describe('light direction', () => {
  test.each([
    [0, 'Front light'], [20, 'Front light'], [45, '45° light'], [60, '45° light'], [90, 'Side light'],
    [120, 'Side light'], [135, 'Rim light'], [160, 'Rim light'], [180, 'Backlight'], [315, '45° light'],
  ])('light at %s° is %s', (angle, name) => expect(lightPattern(angle).name).toBe(name));
  test('the lit side follows the angle', () => {
    expect(lightPattern(90).side).toBe('right');
    expect(lightPattern(270).side).toBe('left');
    expect(lightPattern(0).side).toBe('none');
  });
  test('front light lights the whole face; backlight none of it', () => {
    expect(lightPattern(0).lit).toBeCloseTo(1, 5);
    expect(lightPattern(180).lit).toBeCloseTo(0, 5);
  });
});

describe('white balance', () => {
  test('the camera range matches the α7 II: 2500 K to 9900 K', () => {
    expect(CAMERA_KELVIN[0]).toBe(2500);
    expect(CAMERA_KELVIN.at(-1)).toBe(9900);
  });
  test('matching kelvin is neutral', () => expect(whiteBalanceCast(5500, 5500).cast).toBe('neutral'));
  test('a Daylight setting in shade looks blue', () => expect(whiteBalanceCast(9000, 5500).cast).toBe('blue'));
  test('a Daylight setting under a home bulb looks orange', () => expect(whiteBalanceCast(2700, 5500).cast).toBe('orange'));
  test('a higher camera number makes the photo warmer', () => expect(whiteBalanceCast(5500, 9900).cast).toBe('orange'));
  test('candlelight stays warm even at the 2500 K minimum', () => expect(whiteBalanceCast(1850, 2500).cast).toBe('orange'));
  test('a blue cast lowers red and raises blue', () => {
    const { tint } = whiteBalanceCast(9000, 5500);
    expect(tint.r).toBeLessThan(1);
    expect(tint.b).toBeGreaterThan(1);
  });
});
```

Run: `pnpm test tests/light-sim.test.js`
Expected: FAIL, the module is missing.

- [ ] **Step 2: Simulator**

`src/js/widgets/light-sim.js`:

```js
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
```

Run: `pnpm test tests/light-sim.test.js`
Expected: PASS.

- [ ] **Step 3: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `hard-soft-shadow.svg` | 0 0 640 240 | Left: a small sun, a ball and a crisp shadow. Right: a big window shape, the same ball and a soft, fading shadow. Labels "small source: hard" and "big source: soft". | A small light makes a crisp shadow. A big light makes a soft, gradual shadow. |
| `light-directions.svg` | 0 0 640 260 | Top view of a head with five lamp positions: front, 45°, side, rim and back, each labelled. Camera at the bottom. | Five light positions around a head, seen from above: front, 45°, side, rim and back. |
| `sun-angles.svg` | 0 0 640 240 | A horizon line. Sun positions at 6° above ("golden hour starts"), 0°, 4° below ("golden hour ends, blue hour starts") and 6° below ("blue hour ends"). | Golden hour runs from the sun 6° above the horizon to 4° below. Blue hour follows, to about 6° below. |
| `kelvin-scale.svg` | 0 0 640 200 | A bar from orange to blue with marks: candle 1850 K, home bulb 2700 K, golden hour 3500 K, daylight 5500 K, overcast 6500–7500 K, shade 7500–10 000 K. Under the bar an arrow "camera WB: higher number = warmer photo". | Light color from orange candlelight at about 1850 K to blue shade at up to 10 000 K. On the camera, a higher number makes the photo warmer. |
| `color-wheel.svg` | 0 0 640 260 | A 12-segment color wheel with a line joining orange and blue ("complementary") and an arc over three neighbors ("analogous"). The segments may use fixed colors; the labels use `i-text`. | A color wheel: opposite colors such as orange and blue are complementary, and neighbors are analogous. |

- [ ] **Step 4: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `hard-soft` | Big light is soft light | `hard-soft-shadow` | Softness = source size compared with the subject; closer = softer. Noon sun vs a cloudy day vs a window. |
| 2 | `direction` | Light direction shapes a face | `light-directions` | Front, 45°, side, back, rim, top ("raccoon eyes" at noon). |
| 3 | `time-of-day` | Golden hour and blue hour | `sun-angles` | Length depends on latitude and season; golden ≈ sun from 6° above to 4° below the horizon. Vietnam: golden light ≈ 40–50 minutes, blue hour ≈ 10–20 minutes, always written with "about". Use SunCalc.org for real times. Midday tactics: open shade, backlight. |
| 4 | `reading-light` | Read the light before you shoot | none | Look at the shadows on your own hand; look for catchlights in the eyes. Example (spec): "Portrait at noon: move the subject to the edge of open shade, facing the bright area → soft light + catchlights." |
| 5 | `white-balance` | Light has a color | `kelvin-scale` | Kelvin list from the spec (candle ≈ 1850 K … shade ≈ 7500–10 000 K). Lower K = more orange. On the camera, a higher WB number makes the photo warmer. <b class="ui">MENU › Camera Settings › White Balance</b>: presets or <b class="ui">C.Temp./Filter</b> from 2500 to 9900 K. AWB is fooled by dominant colors and mixed light; RAW lets you fix it later. |
| 6 | `color-harmony` | Colors that work together | `color-wheel` | Complementary (orange and teal), analogous, limited palettes. |
| 7 | `free-modifiers` | Shape light for free | none | A white wall as a reflector, a cheap 5-in-1 reflector, a thin curtain to soften a window. |

- [ ] **Step 5: Other sections**

Key terms: Hard light (Light from a small source, with crisp shadow edges.) · Soft light (Light from a large source, with gentle shadow edges.) · Catchlight (The light source reflected in the eyes.) · Golden hour (Time when the sun is low and the light is warm.) · Blue hour (Time just after sunset or before sunrise, with a deep blue sky.) · Color temperature (The color of light, measured in kelvin.) · White balance (The camera setting that makes white look white.)

Simulator section: heading "Move the light, change the color". Intro: "Turn the light around the face and switch between hard and soft light. Then pick a scene light and set the camera's white balance until the white card looks white." Widget `light-sim`.

Warm-up: "Make 10 compositions of one subject in 10 minutes. Use thirds, a leading line and a frame."

Mistakes:

| Mistake | Fix |
|---|---|
| Thinking noon sun is the best light. | Low sun is softer and warmer. Noon makes hard shadows. |
| Thinking soft light means dim light. | Soft light comes from a big source. It can be bright. |
| Thinking a higher WB number makes a cooler photo. | A higher number makes the photo warmer. |
| Trusting AWB everywhere. | Strong colors and mixed light fool it. Shoot RAW. |
| Planning on golden hour lasting 60 minutes. | It depends on where you are. Check SunCalc.org. |

Self-check:

| Question | Answer |
|---|---|
| How do you make window light softer? | Move the person closer to the window, or hang a thin white curtain. |
| Your camera is on Daylight in deep shade. What color cast do you get? | Blue. Choose Shade or a higher kelvin number. |
| Half the face is in shadow. Where is the light? | At the side, about 90°. |
| Why shoot RAW in tricky light? | You can set white balance later in darktable. |
| Why does the background look bigger with the 85mm at the same framing? | You stand farther back. |

Learn more:
- Cambridge in Colour, White balance: https://www.cambridgeincolour.com/tutorials/white-balance.htm
- Wikipedia, Golden hour: https://en.wikipedia.org/wiki/Golden_hour_(photography)
- Wikipedia, Blue hour: https://en.wikipedia.org/wiki/Blue_hour
- SunCalc: https://www.suncalc.org

- [ ] **Step 6: Verify and commit**

Follow the content workflow steps 4–8 for `stages/light.html`. Smoke-test the simulator:
- At 90°, the left half of the face is in shadow; at 270°, the right half.
- Soft light widens the shadow edge.
- At 180°, a rim appears on both sides.
- Shade light with the camera at 5500 K tints the card blue. Moving the camera toward 9000 K neutralizes it.
- Candle light at 2500 K shows the "camera stops at 2500 K" line.

```bash
git add src/js/widgets/light-sim.js tests/light-sim.test.js stages/light.html src/illustrations
git commit -m "content: stage 4 light lessons and light simulator"
```

---

### Task 11: Stage 5: Editing workflow, with edit-steps simulator

**Files:**
- Create: `src/js/widgets/edit-steps.js`
- Modify: `stages/editing.html`
- Create: `src/illustrations/edit-pipeline.svg`, `culling-funnel.svg`, `backup-321.svg`
- Test: `tests/edit-steps.test.js`

**Interfaces:**
- Consumes: `createScene` (Task 6); `CURVE_PRESETS`, `curvePoints`, `curveTable` (Task 1); controls (Task 6); `el` (Task 5).
- Produces:
  - `EDIT_STEPS`: `[{ module, note, fixes? }]`. Index 0 is the untouched RAW file; every later step names the scene property it fixes.
  - `RAW_LOOK`, `FINISHED`
  - `editState(stepIndex) → scene state`
  - `mount(host)`
- Source of facts: spec §5 "Stage 5 — Editing workflow"; `docs/research/darktable-5.6.md` (section A order, fact rows 1–7, 13–15).

- [ ] **Step 1: Write the failing test**

`tests/edit-steps.test.js`:

```js
import { expect, test } from 'vitest';
import { EDIT_STEPS, FINISHED, RAW_LOOK, editState } from '../src/js/widgets/edit-steps.js';

test('step 0 is the untouched RAW look', () => {
  expect(editState(0)).toEqual(RAW_LOOK);
});

test('the last step is fully finished', () => {
  expect(editState(EDIT_STEPS.length - 1)).toEqual(FINISHED);
});

test('steps fix things one at a time, in order', () => {
  const afterExposure = editState(2);
  expect(afterExposure.vignette).toBe(FINISHED.vignette);
  expect(afterExposure.exposure).toBe(FINISHED.exposure);
  expect(afterExposure.curve).toEqual(RAW_LOOK.curve);
  expect(afterExposure.dust).toBe(true);
});

test('every step after the first changes something different', () => {
  const fixes = EDIT_STEPS.slice(1).map((s) => s.fixes);
  expect(new Set(fixes).size).toBe(fixes.length);
});
```

Run: `pnpm test tests/edit-steps.test.js`
Expected: FAIL, the module is missing.

- [ ] **Step 2: Simulator**

`src/js/widgets/edit-steps.js`:

```js
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
```

Run: `pnpm test tests/edit-steps.test.js`
Expected: PASS.

- [ ] **Step 3: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `edit-pipeline.svg` | 0 0 640 300 | Nine rounded boxes in two rows with arrows, labelled in working order: lens correction, exposure, sigmoid, color calibration, color balance rgb, denoise (profiled), local contrast, rotate and perspective plus crop, retouch. | The basic darktable edit in nine steps, from lens correction to retouch. |
| `culling-funnel.svg` | 0 0 640 240 | A funnel: "200 photos" at the top, "reject with R" in the middle, "3 stars or more" lower, "10 picks" at the bottom. | Culling narrows 200 photos to 10 picks: reject the weak ones, then star the best. |
| `backup-321.svg` | 0 0 640 220 | Three boxes: "computer", "external drive", "off-site copy". Two media icons (disk, cloud). Labels "3 copies · 2 kinds of storage · 1 off-site". | The 3-2-1 backup rule: three copies, on two kinds of storage, with one copy kept off-site. |

- [ ] **Step 4: Lessons**

Callouts in this stage use the label "In darktable" instead of "On your α7 II". Exact module names come from `docs/research/darktable-5.6.md`.

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `raw` | RAW files keep everything | none | darktable never changes the original. Edits live in a sidecar file such as `DSC01234.ARW.xmp`. Back up the sidecars with the RAWs. |
| 2 | `organize` | Organize and cull | `culling-funnel` | Copy to `YYYY/YYYY-MM-DD_event`, then lighttable <b class="ui">import › add to library</b>. Hover a thumbnail and press <b class="ui">0</b>–<b class="ui">5</b> for stars, <b class="ui">R</b> to reject, <b class="ui">F1</b>–<b class="ui">F5</b> for color labels. Culling mode <b class="ui">X</b> (fixed) or <b class="ui">Ctrl+X</b> (dynamic); hold <b class="ui">W</b> for a full preview. |
| 3 | `setup` | Set up darktable once | none | preferences › processing › <b class="ui">auto-apply pixel workflow defaults</b> = "scene-referred (sigmoid)", the 5.6 default. Note that the manual's getting-started page still shows filmic rgb; this course uses sigmoid. |
| 4 | `basic-edit` | The basic edit, in order | `edit-pipeline` | Working order: <b class="ui">lens correction</b> (first, because the vignetting fix changes brightness) → <b class="ui">exposure</b> (auto +0.7 EV, like a camera JPEG; <b class="ui">Ctrl+B</b> color assessment mode) → <b class="ui">sigmoid</b> → <b class="ui">color calibration</b> (white balance, if needed) → <b class="ui">color balance rgb</b> (preset "basic colorfulness", then global vibrance) → <b class="ui">denoise (profiled)</b> (has an α7 II profile) → <b class="ui">local contrast</b> or <b class="ui">diffuse or sharpen</b> → <b class="ui">rotate and perspective</b> and <b class="ui">crop</b> → <b class="ui">retouch</b>. Say that darktable's internal order is fixed; this is the order you *work* in. Worked example (spec): an underexposed sunset street RAW from import to export, one module at a time. Do not invent slider names inside sigmoid; the research did not verify them. |
| 5 | `compare` | Compare before and after | none | <b class="ui">snapshots</b> module: <b class="ui">take snapshot</b>, then click the snapshot for a split view. Click older <b class="ui">history stack</b> items to step back. |
| 6 | `edit-a-set` | Edit a whole set | none | <b class="ui">Ctrl+C</b> / <b class="ui">Ctrl+V</b> to copy and paste; <b class="ui">Ctrl+Shift+C</b> / <b class="ui">Ctrl+Shift+V</b> to choose modules. Plain copy skips white balance and lens correction. |
| 7 | `export` | Export for web and print | none | <b class="ui">export</b> module: file format JPEG, quality 90, <b class="ui">set size</b> in pixels with max size 2048 × 2048 for the web (0 × 0 = full size for print), profile sRGB. |
| 8 | `backup` | Back up with the 3-2-1 rule | `backup-321` | 3 copies, 2 kinds of storage, 1 off-site; include the .xmp sidecars. |

- [ ] **Step 5: Other sections**

Key terms: RAW (The full data from the sensor, before processing.) · Sidecar (XMP) (A small file next to the photo that stores your edits.) · Module (One editing tool in darktable.) · History stack (The list of edits you made, in order.) · Snapshot (A saved state you can compare against.) · Culling (Picking the best photos and rejecting the rest.) · sRGB (The standard color space for screens and the web.)

Simulator section: heading "Step through a basic edit". Intro: "Press Next step to apply one darktable module at a time. Drag the divider to compare the RAW file with the edit." Widget `edit-steps`.

Warm-up: "Shoot one portrait by a window at 45°. Check that the nearest eye is sharp at 100%."

Mistakes:

| Mistake | Fix |
|---|---|
| Thinking JPEG is better because RAW looks flat. | RAW is unprocessed. Editing gives it life and keeps all the data. |
| Worrying that editing changes the original. | darktable keeps edits in the .xmp sidecar. |
| Expecting RAW to rescue a pure white sky. | Fully white areas hold no detail. Protect highlights when you shoot. |
| Sharpening to fix missed focus. | Sharpening cannot create detail that was never captured. |
| Exporting Adobe RGB for the web. | Use sRGB for screens and the web. |

Self-check:

| Question | Answer |
|---|---|
| Which module do you turn on first, and why? | lens correction, because fixing dark corners changes the brightness. |
| What does Ctrl+Shift+V do? | It pastes only the modules you choose. |
| Where are your edits stored? | In the .xmp sidecar next to the RAW file. |
| Which export settings suit the web? | JPEG, sRGB, quality 90, max size 2048 × 2048. |
| Your camera was on Daylight under orange lamps. Can you still fix it? | Yes. Set white balance in color calibration, because the RAW file keeps the data. |

Learn more:
- darktable 5.6 manual, Process: https://docs.darktable.org/usermanual/5.6/en/overview/workflow/process/
- darktable 5.6 manual, Sidecar files: https://docs.darktable.org/usermanual/5.6/en/overview/sidecar-files/sidecar/
- darktable 5.6 manual, Import: https://docs.darktable.org/usermanual/5.6/en/module-reference/utility-modules/lighttable/import/

- [ ] **Step 6: Verify and commit**

Follow the content workflow steps 4–8 for `stages/editing.html`. Smoke-test the simulator:
- Next step walks 1 to 10 and the current step is highlighted.
- At step 10 the right side is straight, bright, colorful and has no dust spot.
- The divider at 0% shows the full edit, and at 100% the full RAW.
- Keyboard: Tab reaches both buttons and the divider.

```bash
git add src/js/widgets/edit-steps.js tests/edit-steps.test.js stages/editing.html src/illustrations
git commit -m "content: stage 5 editing workflow and edit-steps simulator"
```

---

### Task 12: Stage 6: Advanced editing, with curve and mask simulators

**Files:**
- Create: `src/js/widgets/curve-sim.js`, `src/js/widgets/mask-sim.js`
- Modify: `stages/advanced-editing.html`
- Create: `src/illustrations/mask-types.svg`, `tone-zones.svg`, `s-curve.svg`, `frequency-separation.svg`, `round-trip.svg`

**Interfaces:**
- Consumes: `CURVE_PRESETS`, `curvePoints`, `curveTable`, `describeCurve` (Task 1, tested there); `formatEv` (Task 1); `createScene` (Task 6); controls (Task 6); `el`, `svgEl` (Task 5).
- Produces: `mount(host)` in both files.
- Source of facts: spec §5 "Stage 6 — Advanced editing"; `docs/research/darktable-5.6.md` rows 8a–12c and section C; `docs/research/gimp-3.2.md` (all step lists).

Both simulators only render logic that Task 1 already tests, so they are verified by the smoke test.

- [ ] **Step 1: Curve simulator**

`src/js/widgets/curve-sim.js`:

```js
import { CURVE_PRESETS, curvePoints, curveTable, describeCurve } from '../tone.js';
import { el, svgEl } from '../dom.js';
import { liveRegion, numberRange, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';
import { createScene } from './scene.js';

const LEVELS = [
  { key: 'blacks', label: 'Blacks (output at 0%)', values: numberRange(0, 0.3, 0.01) },
  { key: 'shadows', label: 'Shadows (output at 25%)', values: numberRange(0, 0.6, 0.01) },
  { key: 'mids', label: 'Midtones (output at 50%)', values: numberRange(0.2, 0.8, 0.01) },
  { key: 'highlights', label: 'Highlights (output at 75%)', values: numberRange(0.5, 1, 0.01) },
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
  const scene = createScene({ label: 'Street scene with the tone curve applied' });
  const graph = svgEl('svg', { viewBox: '-4 -4 208 208', class: 'sim-diagram', 'aria-hidden': 'true' });
  const readout = readoutBox();
  const live = liveRegion();
  const controls = LEVELS.map((level) => rangeControl({
    label: level.label,
    values: level.values,
    value: levels[level.key],
    format: percent,
    spoken: (v) => `output ${percent(v)}`,
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
```

- [ ] **Step 2: Mask simulator**

`src/js/widgets/mask-sim.js`:

```js
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
```

- [ ] **Step 3: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `mask-types.svg` | 0 0 640 240 | Four small frames: brush stroke, circle, gradient (fade from top) and parametric (only the bright sky selected). Labels under each. | Four kinds of masks: a brush, a shape, a gradient and a mask chosen by brightness. |
| `tone-zones.svg` | 0 0 640 200 | A bar from black to white split into 9 zones, each with a small up or down arrow, labelled "shadows" and "highlights" at the ends. | The tone equalizer splits a photo into brightness zones you can lift or lower one at a time. |
| `s-curve.svg` | 0 0 640 260 | Three small curve graphs: a straight line ("no change"), an S-curve ("more contrast"), and a curve with a lifted black end ("matte"). | Three tone curves: a straight line, an S-curve for more contrast and a lifted black end for a matte look. |
| `frequency-separation.svg` | 0 0 640 260 | A face square split into a stack: "fine detail (pores)" on top, "larger blotches" in the middle, "color and tone (residual)" at the bottom, with arrows "keep" on the top layer and "smooth" on the middle. | Wavelet decompose splits skin into layers: keep the fine pores and smooth only the larger blotches. |
| `round-trip.svg` | 0 0 640 200 | darktable box → arrow "16-bit TIFF" → GIMP box → arrow "Export As" → finished photo. | From darktable, export a 16-bit TIFF, retouch it in GIMP, then export the finished photo. |

- [ ] **Step 4: Lessons**

Callout labels: "In darktable" for lessons 1–8 and "In GIMP" for lessons 9–13.

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `masks` | Masks edit part of a photo | `mask-types` | Drawn shapes: brush, circle, ellipse, path, gradient. Parametric masks by brightness or color. <b class="ui">combine masks</b>. <b class="ui">feathering radius</b> and <b class="ui">blurring radius</b> for soft edges. Example: gradient mask on the sky in <b class="ui">exposure</b>, −0.7 EV. |
| 2 | `ai-mask` | AI object mask (optional) | none | New in 5.6 and off by default: enable AI in preferences and download a model. Click to add, <b class="ui">Shift+click</b> to exclude, right-click to apply. Example: select a person and lift them +0.3 EV. |
| 3 | `tone-equalizer` | Tone equalizer: dodge and burn by brightness | `tone-zones` | Tabs <b class="ui">simple</b>, <b class="ui">advanced</b>, <b class="ui">masking</b>. Hover over the image and scroll to lift or lower that zone. Example: lift a backlit face +1 EV. |
| 4 | `curves` | Curves shape contrast | `s-curve` | S-curve for contrast; lifted blacks for a matte look. Use the module name only after you confirm it in the darktable 5.6 manual ("rgb curve" is unverified in the research notes). |
| 5 | `color-grading` | Grade color with color balance rgb | none | Start with global vibrance and chroma (the manual's beginner advice). Then the <b class="ui">4 ways</b> tab: <b class="ui">shadows lift</b>, <b class="ui">highlights gain</b>, <b class="ui">power</b>, <b class="ui">global offset</b>. Example: warm highlights and teal shadows while skin stays natural. Never call these "wheels". |
| 6 | `styles` | Styles give a set one look | none | A style saves several modules; a preset saves one module. Create one in the lighttable <b class="ui">styles</b> module or from the <b class="ui">history stack</b>, and apply it by double-clicking. |
| 7 | `noise-lens` | Clean noise and fix lines | none | <b class="ui">denoise (profiled)</b>; optional <b class="ui">neural restore</b> (AI raw denoise that writes a new DNG and needs AI enabled); <b class="ui">rotate and perspective</b>. |
| 8 | `hdr-panorama` | HDR and panoramas | none | A RAW bracket shot on a tripod → lighttable <b class="ui">selected image[s] › create HDR</b> → a new DNG. Panoramas: neither darktable nor GIMP can stitch; use the free tool Hugin (optional). |
| 9 | `round-trip` | From darktable to GIMP and back | `round-trip` | Export a 16-bit TIFF from darktable. Open it in GIMP; <b class="ui">Image › Encoding</b> shows the bit depth. Retouch, then <b class="ui">File › Export As</b> (<b class="ui">Shift+Ctrl+E</b>) JPEG at quality 90 (GIMP's default is 85). <b class="ui">Save</b> writes `.xcf` only. |
| 10 | `heal-clone` | Heal and clone spots away | none | <b class="ui">Heal</b> (<b class="ui">H</b>) and <b class="ui">Clone</b> (<b class="ui">C</b>); <b class="ui">Ctrl+click</b> sets the source. For blemishes, sensor dust and small distractions. GIMP has no built-in content-aware remove. Use the blemish and dust step lists from `docs/research/gimp-3.2.md`. |
| 11 | `skin` | Retouch skin and keep the texture | `frequency-separation` | <b class="ui">Filters › Enhance › Wavelet decompose</b>: scale layers plus a residual. Smooth only the coarser scales and leave the finest scale (pores) alone. Follow the frequency-separation step list in `docs/research/gimp-3.2.md`. |
| 12 | `dodge-burn` | Dodge and burn in GIMP | none | <b class="ui">Dodge / Burn</b> tool (<b class="ui">Shift+D</b>, hold <b class="ui">Ctrl</b> to switch), or a new 50% grey layer in <b class="ui">Overlay</b> or <b class="ui">Soft light</b> mode, painted with low-opacity white or black. |
| 13 | `layers` | Layers, masks and effects | none | <b class="ui">Layer › Mask › Add Layer Masks…</b>; non-destructive filters appear as <b class="ui">Layer Effects</b> (the <b class="ui">fx</b> icon) and can be edited or merged later. |

- [ ] **Step 5: Other sections**

Key terms: Mask (A selection that limits an edit to part of the photo.) · Feather (A soft edge on a mask.) · Dodge and burn (Brightening and darkening small areas by hand.) · Curve (A graph that maps input tones to output tones.) · Color grading (Giving shadows and highlights their own color.) · Style (A saved set of darktable modules.) · Preset (Saved settings for one module.) · HDR (One photo merged from several exposures.) · Frequency separation (Splitting detail from color and tone to retouch skin.)

Two simulator sections, both `class="simulator wide"`:
- `id="simulator-curve"`, heading "Shape a tone curve". Intro: "Try the presets, then drag one level at a time. Watch the curve and the photo change together." Widget `curve-sim`.
- `id="simulator-mask"`, heading "Mask the sky". Intro: "Show the mask, then darken the sky. Lower the feather to see why soft edges matter." Widget `mask-sim`.

Warm-up: "Cull your last shoot to 5 photos and edit them in the working order from stage 5."

Mistakes:

| Mistake | Fix |
|---|---|
| Pushing saturation as far as it goes. | Compare with a snapshot. Edit for the story, not for color alone. |
| Smoothing skin until it looks like plastic. | Leave the finest detail scale alone so pores stay. |
| Using masks with hard edges. | Feather the mask so the change blends in. |
| Editing each photo of a set in a different way. | Build a style and apply it to the whole set. |

Self-check:

| Question | Answer |
|---|---|
| Which mask shape darkens a sky with a soft edge? | The gradient. |
| What is the difference between a preset and a style? | A preset saves one module. A style saves several. |
| Why export a 16-bit TIFF for GIMP? | It keeps the most tonal detail for retouching. |
| How do you keep skin texture when you smooth skin? | Smooth only the coarser Wavelet decompose scales and leave the finest scale alone. |
| Which darktable module adds contrast in the basic edit? | sigmoid. |

Learn more:
- darktable 5.6 manual, Drawn masks: https://docs.darktable.org/usermanual/5.6/en/darkroom/masking-and-blending/masks/drawn/
- darktable 5.6 manual, color balance rgb: https://docs.darktable.org/usermanual/5.6/en/module-reference/processing-modules/color-balance-rgb/
- GIMP 3.2 manual: https://docs.gimp.org/3.2/en/
- Hugin: https://hugin.sourceforge.io. Open this link first and drop it if it does not load.

- [ ] **Step 6: Verify and commit**

Follow the content workflow steps 4–8 for `stages/advanced-editing.html`. Smoke-test both simulators:
- **S-curve** shows "more contrast" and the photo gains punch. **Matte** lifts the blacks.
- Mask: "Show the mask" paints the sky red. Sky −2 EV darkens only the top. Feather 0 shows a hard line.
- Both simulators can share a page without breaking each other (scene filter ids are unique).

```bash
git add src/js/widgets/curve-sim.js src/js/widgets/mask-sim.js stages/advanced-editing.html src/illustrations
git commit -m "content: stage 6 advanced editing with curve and mask simulators"
```

---

### Task 13: Track 7a: Portrait, with background-blur simulator

**Files:**
- Create: `src/js/widgets/background-sim.js`
- Modify: `stages/portrait.html`
- Create: `src/illustrations/portrait-distances.svg`, `portrait-light-setups.svg`, `crop-lines.svg`
- Test: `tests/background-sim.test.js`

**Interfaces:**
- Consumes: `LENSES`, `blurDiscMm`, `blurPercentOfFrame`, `sameFramingDistanceMm` (Task 1); `formatAperture`, `formatDistance`, `formatPercent` (Task 1); controls (Task 6); `el`, `svgEl`, `uid` (Task 5).
- Produces:
  - `compareBackgroundBlur({ subjectMm, behindMm, mode: 'spot'|'framing', aperture: 'wide'|number })`, returning `{ s35, n85, n35, pct85, pct35, ratio, personScale35, backgroundScale35 }`
  - `mount(host)`
- Source of facts: spec §5 "Stage 7a"; `docs/research/sony-a7ii.md` rows 5, 7; `docs/research/pedagogy-numbers-writing.md` §A3 rows 12–13.

- [ ] **Step 1: Write the failing test**

`tests/background-sim.test.js`:

```js
import { expect, test } from 'vitest';
import { compareBackgroundBlur } from '../src/js/widgets/background-sim.js';

const base = { subjectMm: 2000, behindMm: 4000, aperture: 'wide' };

test('from the same spot, wide open, the 85mm blurs about 4.7 times more', () => {
  const r = compareBackgroundBlur({ ...base, mode: 'spot' });
  expect(r.ratio).toBeCloseTo(4.7, 1);
  expect(r.pct85).toBeCloseTo(3.88, 1);
  expect(r.personScale35).toBeCloseTo(0.4, 1);
});

test('with the same framing, the 35mm stands at 0.82 m, the person keeps its size and the 85mm blurs about 1.5 times more', () => {
  const r = compareBackgroundBlur({ ...base, mode: 'framing' });
  expect(r.s35).toBeCloseTo(823.5, 0);
  expect(r.personScale35).toBeCloseTo(1, 5);
  expect(r.ratio).toBeCloseTo(1.52, 1);
});

test('a background right behind the person gives no blur and a finite ratio', () => {
  const r = compareBackgroundBlur({ ...base, behindMm: 0, mode: 'spot' });
  expect(r.pct85).toBe(0);
  expect(r.pct35).toBe(0);
  expect(r.ratio).toBe(1);
});
```

Run: `pnpm test tests/background-sim.test.js`
Expected: FAIL, the module is missing.

- [ ] **Step 2: Simulator**

`src/js/widgets/background-sim.js`:

```js
import { LENSES, blurDiscMm, blurPercentOfFrame, sameFramingDistanceMm } from '../photo-math.js';
import { formatAperture, formatDistance, formatPercent } from '../format.js';
import { el, svgEl, uid } from '../dom.js';
import { liveRegion, numberRange, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

const magnification = (focal, distanceMm) => focal / (distanceMm - focal);

export function compareBackgroundBlur({ subjectMm, behindMm, mode, aperture }) {
  const n85 = aperture === 'wide' ? LENSES[85].maxAperture : aperture;
  const n35 = aperture === 'wide' ? LENSES[35].maxAperture : aperture;
  const s35 = mode === 'framing' ? sameFramingDistanceMm(85, subjectMm, 35) : subjectMm;
  const b85 = blurDiscMm(85, n85, subjectMm, subjectMm + behindMm);
  const b35 = blurDiscMm(35, n35, s35, s35 + behindMm);
  return {
    s35,
    n85,
    n35,
    pct85: blurPercentOfFrame(b85),
    pct35: blurPercentOfFrame(b35),
    ratio: b35 === 0 ? 1 : b85 / b35,
    personScale35: magnification(35, s35) / magnification(85, subjectMm),
    backgroundScale35: magnification(35, s35 + behindMm) / magnification(85, subjectMm + behindMm),
  };
}

const PANEL_WIDTH = 320;
const blurPx = (pct) => Math.min(20, ((pct / 100) * PANEL_WIDTH) / 2);
const BEHIND_MM = [0, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000];
const behindText = (mm) => (mm === 0 ? 'touching' : formatDistance(mm));

function createPanel(label) {
  const id = uid('bg');
  const svg = svgEl('svg', { viewBox: '0 0 320 240', role: 'img', 'aria-label': label });
  const tile = (dx) => `
    <g transform="translate(${dx} 0)">
      <rect x="0" y="90" width="70" height="90" fill="#6f7a8f"/><rect x="80" y="70" width="60" height="110" fill="#7c879c"/>
      <rect x="150" y="100" width="80" height="80" fill="#6a7488"/><rect x="240" y="80" width="70" height="100" fill="#7c879c"/>
      <circle cx="40" cy="160" r="24" fill="#4f7a5a"/><circle cx="200" cy="165" r="20" fill="#4f7a5a"/>
      <circle cx="120" cy="130" r="6" fill="#ffe2a6"/><circle cx="280" cy="120" r="6" fill="#ffe2a6"/>
    </g>`;
  svg.innerHTML = `
    <defs><filter id="${id}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur data-blur stdDeviation="0"/></filter></defs>
    <rect width="320" height="240" fill="#cfd9e3"/>
    <g filter="url(#${id}-blur)">
      <g data-bg-scale>${tile(-320)}${tile(0)}${tile(320)}<rect x="-400" y="180" width="1120" height="60" fill="#8f9a7a"/></g>
    </g>
    <g data-person>
      <path d="M136 240 L140 175 L180 175 L184 240 Z" fill="#2b2d3a"/>
      <path d="M126 178 Q130 128 160 122 Q190 128 194 178 Z" fill="#c2563d"/>
      <circle cx="160" cy="100" r="22" fill="#e0b48f"/>
      <path d="M138 98 Q140 74 160 76 Q180 74 182 98 Q174 86 160 87 Q146 86 138 98 Z" fill="#2a1d18"/>
    </g>`;
  const blur = svg.querySelector('[data-blur]');
  const background = svg.querySelector('[data-bg-scale]');
  const person = svg.querySelector('[data-person]');
  return {
    svg,
    update({ pct, personScale, backgroundScale }) {
      blur.setAttribute('stdDeviation', String(blurPx(pct)));
      background.setAttribute('transform', `translate(160 180) scale(${backgroundScale}) translate(-160 -180)`);
      person.setAttribute('transform', `translate(160 240) scale(${personScale}) translate(-160 -240)`);
    },
  };
}

export function mount(host) {
  const state = { subjectMm: 2000, behindMm: 4000, mode: 'spot', aperture: 'wide' };
  const panel85 = createPanel('View through the 85mm');
  const panel35 = createPanel('View through the 35mm');
  const caption35 = el('figcaption');
  const view = el('div', { class: 'sim-panels' }, [
    el('figure', {}, [panel85.svg, el('figcaption', { text: '85mm' })]),
    el('figure', {}, [panel35.svg, caption35]),
  ]);
  const readout = readoutBox();
  const live = liveRegion();
  const subject = rangeControl({ label: 'Person distance (85mm)', values: numberRange(1000, 5000, 250), value: 2000, format: formatDistance, onInput: (v) => update({ subjectMm: v }) });
  const behind = rangeControl({ label: 'Background behind the person', values: BEHIND_MM, value: 4000, format: behindText, onInput: (v) => update({ behindMm: v }) });
  const mode = radioGroup({
    legend: 'Compare',
    options: [{ value: 'spot', label: 'Both from the same spot' }, { value: 'framing', label: 'Same framing (35mm steps closer)' }],
    value: 'spot',
    onChange: (v) => update({ mode: v }),
  });
  const aperture = radioGroup({
    legend: 'Aperture',
    options: [{ value: 'wide', label: 'Wide open (f/1.8 and f/1.4)' }, { value: 2.8, label: 'f/2.8' }, { value: 4, label: 'f/4' }, { value: 8, label: 'f/8' }],
    value: 'wide',
    onChange: (v) => update({ aperture: v }),
  });

  function update(patch) {
    Object.assign(state, patch);
    const r = compareBackgroundBlur(state);
    panel85.update({ pct: r.pct85, personScale: 1, backgroundScale: 1 });
    panel35.update({ pct: r.pct35, personScale: r.personScale35, backgroundScale: r.backgroundScale35 });
    caption35.textContent = `35mm at ${formatDistance(r.s35)}`;
    const lines = [
      `85mm at ${formatAperture(r.n85)}: background blur is ${formatPercent(r.pct85)} of the frame width.`,
      `35mm at ${formatAperture(r.n35)}, ${formatDistance(r.s35)} away: ${formatPercent(r.pct35)}.`,
      state.behindMm === 0
        ? 'The person stands against the background, so nothing is blurred.'
        : `The 85mm blurs the background ${r.ratio.toFixed(1)} times more.`,
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [view], controls: [mode.el, aperture.el, subject.el, behind.el], readout, live: live.el });
  update({});
}
```

Run: `pnpm test tests/background-sim.test.js`
Expected: PASS.

- [ ] **Step 3: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `portrait-distances.svg` | 0 0 640 240 | Side view: a vertical camera at three distances from a person, labelled "1.5 m head and shoulders", "2.5 m waist-up" and "5 m full body". A note: "camera held horizontally: step back about 1.5×". | With the 85mm held vertically: about 1.5 m for head and shoulders, 2.5 m for waist-up and 5 m for full body. |
| `portrait-light-setups.svg` | 0 0 640 260 | Three top views: open shade (person at the edge of a shadow area, facing open sky), window at 45° (window, person, camera), backlight with reflector (sun behind, reflector in front at one side). | Three portrait light setups from above: open shade, a window at 45° and backlight with a reflector. |
| `crop-lines.svg` | 0 0 640 260 | A standing figure with red dashed lines at the knees, elbows and wrists ("avoid") and green lines mid-thigh and mid-upper-arm ("safer"). | Crop between joints, not at the knees, elbows or wrists. |

- [ ] **Step 4: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `distance` | Distance sets the framing | `portrait-distances` | Camera vertical: about 1.5 m, 2.5 m and 5 m; horizontal: step back about 1.5×. No nose distortion at these distances. |
| 2 | `settings` | Settings for sharp, soft-background portraits | none | f/1.8 for one person; f/2.8–4 for two people at different distances. Shutter 1/200 s or faster: use <b class="ui">M</b> with <b class="ui">ISO AUTO</b>, because A mode on the α7 II cannot set a minimum shutter speed. Still subject: AF-S plus Eye AF (hold the key). Moving subject: AF-C with <b class="ui">Flexible Spot</b> or <b class="ui">Lock-on AF</b>. Example: "Window portrait: 85mm, f/2, 1/200 s, ISO 800, subject 1 m from the window at 45°." |
| 3 | `background` | Background distance makes the blur | none | More distance from person to background = more blur. From the same spot the 85mm blurs about 4.7× more than the 35mm; framed the same, about 1.5× more. Point to the simulator. |
| 4 | `light` | Find flattering light | `portrait-light-setups` | Open shade, window at 45°, backlight with a reflector, golden-hour rim light; avoid noon top light. |
| 5 | `directing` | Direct with actions, not poses | none | Body at 45°, weight on the back foot, chin forward and slightly down, give the hands a job. Ask for actions ("walk toward me"), talk, and show the results on the screen. |
| 6 | `framing` | Frame without awkward crops | `crop-lines` | Avoid cropping at joints; eyes near the upper third. |
| 7 | `environmental` | Environmental portraits with the 35mm | none | Show the person in their place; step closer with the 35mm; the background tells part of the story. |

- [ ] **Step 5: Other sections**

Key terms: Working distance (How far you stand from the person.) · Environmental portrait (A portrait that shows the person's place.) · Reflector (A light surface that bounces light into shadows.) · Rim light (Light from behind that outlines the person.) · Headroom (Space above the head in the frame.)

Simulator section: heading "Compare background blur". Intro: "Compare the two lenses side by side. Switch between 'same spot' and 'same framing', then move the background farther away." Widget `background-sim`.

Warm-up: "Edit one portrait in the working order from stage 5. Take a snapshot first and compare."

Mistakes:

| Mistake | Fix |
|---|---|
| Using f/1.8 for two people at different distances. | Use f/2.8 to f/4 so both faces are sharp. |
| Standing very close with the 35mm for a headshot. | The nose looks bigger up close. Step back and use the 85mm. |
| Cropping at the knees or wrists. | Crop between joints. |
| Giving stiff poses. | Give actions: walk, turn, laugh. |
| Shooting faces in noon sun. | Move into open shade. |

Self-check:

| Question | Answer |
|---|---|
| How far do you stand for a waist-up portrait with the 85mm held vertically? | About 2.5 m. |
| Two people stand at different distances. Which aperture do you pick? | f/2.8 to f/4. |
| How do you get more background blur without changing lenses? | Move the person farther from the background, step closer, or use a smaller f-number. |
| Why use M with ISO AUTO for portraits on the α7 II? | A mode cannot set a minimum shutter speed. M with ISO AUTO keeps 1/200 s. |
| Where should a sky mask's edge go? | Along the horizon, with a soft feather. |

Learn more:
- Cambridge in Colour, Depth of field: https://www.cambridgeincolour.com/tutorials/depth-of-field.htm
- Sony α7 II Help Guide (Eye AF): https://helpguide.sony.net/ilc/1450/v1/en/index.html
- Photography Life, Shutter speed: https://photographylife.com/what-is-shutter-speed-in-photography

- [ ] **Step 6: Verify and commit**

Follow the content workflow steps 4–8 for `stages/portrait.html`. Smoke-test the simulator:
- "Same spot" shows the 35mm person smaller with a sharper background and "4.7 times".
- "Same framing" shows equal person sizes and "1.5 times".
- Background "touching" shows no blur and the "stands against the background" line.

```bash
git add src/js/widgets/background-sim.js tests/background-sim.test.js stages/portrait.html src/illustrations
git commit -m "content: portrait track with background-blur simulator"
```

---

### Task 14: Track 7b: Street and documentary, with zone-focus simulator

**Files:**
- Create: `src/js/widgets/zone-sim.js`
- Modify: `stages/street.html`
- Create: `src/illustrations/zone-focus.svg`, `photo-essay.svg`

**Interfaces:**
- Consumes: `LENSES`, `aperturesFor`, `depthOfField` (Task 1); `describeSharpZone`, `formatAperture`, `formatDistance` (Task 1); controls (Task 6); `svgEl` (Task 5).
- Produces: `mount(host)`. `photo-essay.svg` is reused by Task 17.
- Source of facts: spec §5 "Stage 7b"; `docs/research/sony-a7ii.md` rows 1c, 7, 11a; `docs/research/pedagogy-numbers-writing.md` §A2 (market example) and §A5 (law).

The zone math is covered by Task 1 tests (35mm, f/8, 3 m → 1.9–7.2 m), so this task adds rendering only.

- [ ] **Step 1: Simulator**

`src/js/widgets/zone-sim.js`:

```js
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
    svgEl('text', { x: 14, y: 160, text: 'You' }),
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
  const aperture = rangeControl({ label: 'Aperture (35mm)', values: aperturesFor(LENSES[35]), value: 8, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const focus = rangeControl({ label: 'Manual focus distance', values: FOCUS_MM, value: 3000, format: formatDistance, onInput: (v) => update({ focusMm: v }) });

  function update(patch) {
    Object.assign(state, patch);
    const dof = depthOfField(35, state.aperture, state.focusMm);
    sidewalk.update(dof);
    const inZone = PEOPLE_MM.filter((mm) => mm >= dof.near && mm <= dof.far).length;
    const lines = [
      `Focus at ${formatDistance(state.focusMm)} with ${formatAperture(state.aperture)}. ${describeSharpZone(dof)}`,
      `${inZone} of ${PEOPLE_MM.length} people on the sidewalk are sharp.`,
      'Use 1/500 s to freeze people who walk.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [sidewalk.svg], controls: [aperture.el, focus.el], readout, live: live.el });
  update({});
}
```

- [ ] **Step 2: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `zone-focus.svg` | 0 0 640 220 | Top view of a sidewalk with a camera on the left and a green band from 1.9 m to 7.2 m, labelled "focus 3 m, f/8". Walking figures inside the band are solid; one outside is faded. | Zone focusing: with the 35mm at f/8 focused at 3 m, everyone from about 1.9 m to 7.2 m is sharp. |
| `photo-essay.svg` | 0 0 640 240 | Six storyboard frames in a row with simple icons and labels: establishing (wide street), medium (stall), detail (hands), portrait (face), moment (gesture), closing (empty street at dusk). | A photo essay in six frames: establishing, medium, detail, portrait, moment and closing. |

- [ ] **Step 3: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `why-35` | Why the 35mm works on the street | none | Context plus closeness: you are part of the scene. |
| 2 | `settings` | Set up for zone focus | `zone-focus` | M with <b class="ui">ISO AUTO</b>: f/8, 1/500 s, <b class="ui">ISO AUTO Maximum</b> 6400; the exposure dial still adjusts brightness. <b class="ui">Manual Focus</b> at 3 m → sharp from about 1.9 m to 7.2 m. Alternative: A mode, AF-C, Wide. The α7 II has no silent shutter, so be open, not sneaky. Example (spec): "Market at golden hour: 35mm, M mode, f/8, 1/500 s, ISO AUTO (the camera picks about ISO 800–1600), zone focus 3 m. Find a shaft of light and wait for someone to walk into it." |
| 3 | `seeing` | See light, layers and gestures | none | Light and shadow, layers, gestures, juxtaposition, color, repetition. "Fishing" (wait in one spot) vs "hunting" (walk and react). |
| 4 | `ethics` | Get close with respect | none | Confidence, body language, a smile. Respect children and vulnerable people; delete a photo if asked. Laws differ by country. Then the Vietnam note, marked "not legal advice": Civil Code 2015 Art. 32 requires consent to *use* a person's image, with exceptions for public events and the public interest, and commercial use needs payment; Art. 25: a child's consent comes from a parent or guardian. |
| 5 | `essay` | Tell a story in 8 photos | `photo-essay` | Structure: establishing, medium, detail, portrait, moment, closing. Fill the set to 8 with more moments or details. |
| 6 | `series` | Work a scene and build a series | none | Stay with a scene; return to it; pick one theme for a whole walk. |

- [ ] **Step 4: Other sections**

Key terms: Zone focus (Presetting focus so a whole distance range is sharp.) · Juxtaposition (Two things side by side that make a new meaning.) · Photo essay (A short series of photos that tells one story.) · Establishing shot (A wide photo that shows where the story happens.) · Consent (Permission from the person in the photo.)

Simulator section: heading "Set your sharp zone". Intro: "Pick an aperture and a focus distance. See which people on the sidewalk will be sharp without refocusing." Widget `zone-sim`.

Warm-up: "Shoot 10 frames at golden hour. Note the light color and direction in each."

Mistakes:

| Mistake | Fix |
|---|---|
| Hiding and shooting from far away. | Step closer and stay open and friendly. |
| Using AF Wide in a crowd. | Zone focus so the camera never hunts. |
| Using 1/60 s for people walking. | Use 1/500 s. |
| Publishing or selling a stranger's portrait without asking. | Ask for consent to use it, and check your local law. |

Self-check:

| Question | Answer |
|---|---|
| With the 35mm at f/8 focused at 3 m, what is sharp? | About 1.9 m to 7.2 m. |
| Why use M with ISO AUTO on the street? | You fix f/8 and 1/500 s and the camera picks the ISO. A mode cannot set a minimum shutter speed. |
| Someone asks you to delete their photo. What do you do? | Delete it and thank them. |
| Name the six parts of a photo essay. | Establishing, medium, detail, portrait, moment, closing. |
| What makes a background look larger next to a person? | Standing farther back with a longer lens. |

Learn more:
- Wikipedia, Photography and the law: https://en.wikipedia.org/wiki/Photography_and_the_law
- Vietnam Civil Code 2015 (unofficial English translation): https://hoatieu.vn/phap-luat/the-civil-code-law-no-91-2015-qh13-124913

- [ ] **Step 5: Verify and commit**

Follow the content workflow steps 4–8 for `stages/street.html`. Smoke-test the simulator:
- f/8 at 3 m reads "Sharp from 1.9 m to 7.2 m." and "4 of 6 people".
- f/1.4 at 3 m shrinks the zone to about one person.
- f/16 at 5 m reaches infinity.

```bash
git add src/js/widgets/zone-sim.js stages/street.html src/illustrations
git commit -m "content: street track with zone-focus simulator"
```

---

### Task 15: Track 7c: Landscape and travel, with hyperfocal simulator

**Files:**
- Create: `src/js/widgets/hyperfocal-sim.js`
- Modify: `stages/landscape.html`
- Create: `src/illustrations/hyperfocal.svg`, `nd-stops.svg`

**Interfaces:**
- Consumes: `LENSES`, `aperturesFor`, `depthOfField`, `hyperfocalMm` (Task 1); `describeSharpZone`, `formatAperture`, `formatDistance` (Task 1); controls (Task 6); `svgEl` (Task 5).
- Produces: `mount(host)`.
- Source of facts: spec §5 "Stage 7c"; `docs/research/sony-a7ii.md` rows 9, 10c, 14a; `docs/research/pedagogy-numbers-writing.md` §A3 rows 6, 9, 10, 15.

The hyperfocal math is covered by Task 1 tests (35mm f/8 → 5139 mm, near limit H/2, far limit infinity).

- [ ] **Step 1: Simulator**

`src/js/widgets/hyperfocal-sim.js`:

```js
import { LENSES, aperturesFor, depthOfField, hyperfocalMm } from '../photo-math.js';
import { describeSharpZone, formatAperture, formatDistance } from '../format.js';
import { svgEl } from '../dom.js';
import { liveRegion, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

// Compressed distance scale: 0 → 40, infinity → 560.
const xFor = (mm) => (Number.isFinite(mm) ? 40 + 520 * (mm / (mm + 5000)) : 560);
const TICKS_MM = [1000, 2000, 5000, 10000, 20000];

function createScale() {
  const svg = svgEl('svg', { viewBox: '0 0 640 150', class: 'sim-diagram', 'aria-hidden': 'true' });
  const zone = svgEl('rect', { class: 'd-zone', y: 50, height: 40 });
  const focusMark = svgEl('line', { class: 'd-accent-line', y1: 40, y2: 100 });
  const focusLabel = svgEl('text', { y: 32, 'text-anchor': 'middle' });
  const nearLabel = svgEl('text', { y: 118, 'text-anchor': 'middle' });
  svg.append(
    svgEl('line', { class: 'd-line', x1: 40, y1: 90, x2: 600, y2: 90 }),
    ...TICKS_MM.map((mm) => svgEl('text', { x: xFor(mm), y: 140, 'text-anchor': 'middle', text: formatDistance(mm) })),
    svgEl('text', { x: 590, y: 140, 'text-anchor': 'middle', text: '∞' }),
    svgEl('rect', { class: 'd-muted', x: 6, y: 78, width: 26, height: 20, rx: 4 }),
    zone,
    focusMark,
    focusLabel,
    nearLabel,
  );
  return {
    svg,
    update(hyperfocal, near) {
      const left = xFor(near);
      zone.setAttribute('x', String(left));
      zone.setAttribute('width', String(600 - left));
      const fx = xFor(hyperfocal);
      focusMark.setAttribute('x1', String(fx));
      focusMark.setAttribute('x2', String(fx));
      focusLabel.setAttribute('x', String(fx));
      focusLabel.textContent = `focus ${formatDistance(hyperfocal)}`;
      nearLabel.setAttribute('x', String(left));
      nearLabel.textContent = `sharp from ${formatDistance(near)}`;
    },
  };
}

export function mount(host) {
  const state = { focal: 35, aperture: 8 };
  const scale = createScale();
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Aperture', values: aperturesFor(LENSES[35]), value: 8, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const lens = radioGroup({
    legend: 'Lens',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: 35,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });

  function update(patch) {
    Object.assign(state, patch);
    const hyperfocal = hyperfocalMm(state.focal, state.aperture);
    const dof = depthOfField(state.focal, state.aperture, hyperfocal);
    scale.update(hyperfocal, dof.near);
    const lines = [
      `Focus at ${formatDistance(hyperfocal)}. ${describeSharpZone(dof)}`,
      'That means acceptably sharp, not perfectly sharp. If far detail matters most, focus a little farther.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, { view: [scale.svg], controls: [lens.el, aperture.el], readout, live: live.el });
  update({});
}
```

- [ ] **Step 2: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `hyperfocal.svg` | 0 0 640 220 | Side view of a landscape: a flower close by, a tree in the middle, mountains far away. A camera on the left; a focus mark at 5.1 m; a green band from 2.6 m to the mountains, labelled. | With the 35mm at f/8, focus at about 5.1 m and everything from about 2.6 m to the mountains is acceptably sharp. |
| `nd-stops.svg` | 0 0 640 220 | Three filter circles of increasing darkness labelled "ND8 = 3 stops", "ND64 = 6 stops", "ND1000 = 10 stops". Below, an arrow "1/125 s → 8 s with ND1000". | ND filters cut light in stops: ND8 is 3 stops, ND64 is 6 and ND1000 is 10. With ND1000, 1/125 s becomes about 8 s. |

- [ ] **Step 3: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `plan` | Plan for light and weather | none | Weather, golden and blue hour on SunCalc.org, scouting with maps. Arrive 30 minutes early. |
| 2 | `settings` | Tripod settings for sharp landscapes | none | Tripod; <b class="ui">Drive Mode › Self-timer: 2 Sec</b>; <b class="ui">MENU › Camera Settings › SteadyShot › Off</b> on a tripod (Sony's advice); f/8 to f/11; ISO 100; RAW. Exposures of 1 s or longer start noise reduction that takes as long again, so wait before moving the camera. |
| 3 | `depth` | Front-to-back sharpness | `hyperfocal` | Foreground interest. Hyperfocal: 35mm at f/8 → focus at about 5.1 m, sharp from about 2.6 m to infinity; focus a little farther if distant detail matters most. Layers. |
| 4 | `horizon-weather` | Horizon, texture and weather | none | Place the horizon on purpose; side light shows texture; fog and storms are gifts. |
| 5 | `long-exposure` | Long exposures smooth motion | `nd-stops` | ND8 = 3 stops, ND64 = 6, ND1000 = 10. Example: 1/125 s without the filter becomes 8 s with ND1000. Silky water starts at about 1/2 s, is smoother at 1–2 s and very smooth at 5–10 s. |
| 6 | `bracketing` | Bracket for high contrast | none | <b class="ui">Drive Mode › Cont. Bracket</b>: 3 or 5 frames, steps up to 3.0 EV (for example <b class="ui">1.0EV 5 Image</b> or <b class="ui">2.0EV 3 Image</b>). Merge them with create HDR in darktable (stage 6). |
| 7 | `travel-story` | Tell a travel story | none | People for scale, details, food, transport, night. Respect local culture. |

- [ ] **Step 4: Other sections**

Key terms: ND filter (A dark filter that cuts light so you can use slower shutter speeds.) · Bracketing (Shooting several frames at different exposures.) · Long exposure (A shutter speed long enough to blur motion.) · Foreground interest (Something close to the camera that leads into the scene.) · Hyperfocal distance (The focus distance that keeps infinity acceptably sharp.)

Simulator section: heading "Find the hyperfocal distance". Intro: "Pick a lens and an aperture. The mark shows where to focus so the far horizon stays acceptably sharp." Widget `hyperfocal-sim`.

Warm-up: "Zone-focus a street scene at f/8 and 3 m. Check at 100% what is sharp."

Mistakes:

| Mistake | Fix |
|---|---|
| Leaving SteadyShot on a tripod. | Turn it Off, as Sony advises. |
| Pressing the shutter by hand on a tripod. | Use the 2-second self-timer. |
| Focusing on the far horizon. | Focus at the hyperfocal distance. |
| Putting the horizon in the middle by habit. | Place it on purpose: low for sky, high for land. |
| Arriving when the sun sets. | Arrive 30 minutes early. The best light starts before sunset. |

Self-check:

| Question | Answer |
|---|---|
| With the 35mm at f/8, where do you focus for front-to-back sharpness? | About 5.1 m. Everything from about 2.6 m to infinity is acceptably sharp. |
| You add an ND1000 to a 1/125 s exposure. What is the new shutter speed? | About 8 s. |
| Why turn SteadyShot off on a tripod? | Sony recommends it, because it can cause blur on a tripod. |
| Which bracket setting covers a very bright sky? | <b class="ui">Cont. Bracket</b> at 2.0EV 3 Image or 1.0EV 5 Image. |
| Which way does a higher camera WB number move the color? | Warmer. |

Learn more:
- Wikipedia, Hyperfocal distance: https://en.wikipedia.org/wiki/Hyperfocal_distance
- Wikipedia, Neutral-density filter: https://en.wikipedia.org/wiki/Neutral-density_filter
- SunCalc: https://www.suncalc.org
- darktable 5.6 manual, selected images (create HDR): https://docs.darktable.org/usermanual/5.6/en/module-reference/utility-modules/lighttable/selected-image/

- [ ] **Step 5: Verify and commit**

Follow the content workflow steps 4–8 for `stages/landscape.html`. Smoke-test the simulator:
- 35mm at f/8 reads "Focus at 5.1 m. Sharp from 2.6 m to infinity."
- 85mm at f/1.8 reads "Focus at 134 m."
- The mark moves right when the aperture opens.

```bash
git add src/js/widgets/hyperfocal-sim.js stages/landscape.html src/illustrations
git commit -m "content: landscape track with hyperfocal simulator"
```

---

### Task 16: Track 7d: Night and low light, with star and handheld simulator

**Files:**
- Create: `src/js/widgets/night-sim.js`
- Modify: `stages/night.html`
- Create: `src/illustrations/star-trails.svg`, `light-trails.svg`

**Interfaces:**
- Consumes: `LENSES`, `aperturesFor`, `npfSeconds`, `rule500Seconds`, `handheldLimitSeconds`, `slowestSafeShutter` (Task 1, tested there); `formatAperture`, `formatSeconds`, `formatShutter` (Task 1); controls (Task 6); `el`, `svgEl` (Task 5).
- Produces: `mount(host)`.
- Source of facts: spec §5 "Stage 7d"; `docs/research/sony-a7ii.md` (ISO AUTO range, dials per mode, noise reduction note); `docs/research/pedagogy-numbers-writing.md` §A1 rows 5–8, §A3 rows 4, 7, 8, 18–20, §A4 street lights.

- [ ] **Step 1: Simulator**

`src/js/widgets/night-sim.js`:

```js
import { LENSES, aperturesFor, handheldLimitSeconds, npfSeconds, rule500Seconds, slowestSafeShutter } from '../photo-math.js';
import { formatAperture, formatSeconds, formatShutter } from '../format.js';
import { el, svgEl } from '../dom.js';
import { liveRegion, radioGroup, rangeControl, readoutBox, setReadout, simLayout } from './controls.js';

function starField(count, seed) {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({ x: 10 + next() * 280, y: 10 + next() * 160, r: 0.8 + next() * 1.6 }));
}
const STARS = starField(45, 42);

function createSky(label) {
  const svg = svgEl('svg', { viewBox: '0 0 300 180', role: 'img', 'aria-label': label });
  const stars = svgEl('g');
  svg.append(svgEl('rect', { width: 300, height: 180, fill: '#0b1020' }), stars);
  return {
    svg,
    draw(trailPx) {
      stars.replaceChildren(...STARS.map(({ x, y, r }) => svgEl('line', {
        x1: x, y1: y, x2: x + trailPx, y2: y - trailPx * 0.3, stroke: '#f4f1e8', 'stroke-width': r * 2, 'stroke-linecap': 'round',
      })));
    },
  };
}

const stopsText = (v) => (v === 0 ? 'Off' : `${v} ${v === 1 ? 'stop' : 'stops'}`);

export function mount(host) {
  const state = { focal: 35, aperture: 1.4, stops: 2 };
  const npfSky = createSky('Stars at the NPF time: small dots');
  const ruleSky = createSky('Stars at the 500 rule time: short trails');
  const view = el('div', { class: 'sim-panels' }, [
    el('figure', {}, [npfSky.svg, el('figcaption', { text: 'NPF time' })]),
    el('figure', {}, [ruleSky.svg, el('figcaption', { text: '500 rule time' })]),
  ]);
  const readout = readoutBox();
  const live = liveRegion();
  const aperture = rangeControl({ label: 'Aperture', values: aperturesFor(LENSES[35]), value: 1.4, format: formatAperture, onInput: (v) => update({ aperture: v }) });
  const stabilizer = rangeControl({ label: 'Stabilizer stops you count on', values: [0, 1, 2, 3, 4], value: 2, format: stopsText, onInput: (v) => update({ stops: v }) });
  const lens = radioGroup({
    legend: 'Lens',
    options: [{ value: 35, label: LENSES[35].label }, { value: 85, label: LENSES[85].label }],
    value: 35,
    onChange: (v) => {
      aperture.setValues(aperturesFor(LENSES[v]));
      update({ focal: v, aperture: aperture.value });
    },
  });

  function update(patch) {
    Object.assign(state, patch);
    const npf = npfSeconds(state.focal, state.aperture);
    const rule = rule500Seconds(state.focal);
    npfSky.draw(0.01);
    ruleSky.draw(Math.max(0.01, 6 * (rule / npf - 1)));
    const handheld = slowestSafeShutter(handheldLimitSeconds(state.focal, state.stops));
    const lines = [
      `Stars: the NPF rule says ${formatSeconds(npf)} at ${formatAperture(state.aperture)}.`,
      `The 500 rule says ${formatSeconds(rule)}, ${(rule / npf).toFixed(1)} times longer, so stars smear into short lines.`,
      `Handheld, still scene, stabilizer ${stopsText(state.stops)}: ${formatShutter(handheld)} or faster.`,
      'People still need 1/60 s to 1/250 s, because the stabilizer cannot stop them moving.',
    ];
    setReadout(readout, lines);
    live.announce(lines.join(' '));
  }

  simLayout(host, {
    view: [view],
    controls: [lens.el, aperture.el, stabilizer.el],
    readout,
    live: live.el,
    extra: [el('p', { class: 'sim__credit', text: 'NPF rule © Frédéric Michaud, Société Astronomique du Havre.' })],
  });
  update({});
}
```

- [ ] **Step 2: Illustrations**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `star-trails.svg` | 0 0 640 240 | Two night-sky squares. Left: round star dots, labelled "NPF: 6.5 s". Right: the same stars as short lines, labelled "500 rule: 14 s". Fixed dark sky colors are allowed inside the squares; labels use `i-text`. | The same stars at the NPF time stay dots. At the 500 rule time they smear into short lines. |
| `light-trails.svg` | 0 0 640 220 | A city street at blue hour with red and white streaks along the road, and a tripod icon. Label "tripod, ISO 100, f/8–f/11, 5–30 s". | Car lights become long streaks on a tripod at ISO 100, f/8 to f/11, for 5 to 30 seconds. |

- [ ] **Step 3: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `handheld` | Handheld in low light | none | f/1.4 first. Shutter: 1/60 s for a person holding still (35mm), 1/125 s candid, 1/250 s walking. With IBIS, still scenes down to about 1/8 s (35mm) or 1/20 s (85mm). ISO takes the rest; raise <b class="ui">ISO AUTO Maximum</b> above the default 6400 if needed. Example: dim street (about EV 4), 35mm, f/1.4, 1/125 s, ISO 1600. |
| 2 | `noise-vs-blur` | Choose noise over blur | none | Noise can be reduced in editing (<b class="ui">denoise (profiled)</b>, optional <b class="ui">neural restore</b>); blur cannot be fixed. |
| 3 | `focus-dark` | Focus in the dark | none | Aim at contrast edges; <b class="ui">Manual Focus</b> with magnification and peaking. |
| 4 | `city` | Blue hour, light trails and reflections | `light-trails` | Light trails: tripod, ISO 100, f/8–f/11, 5–30 s; longer = longer trails; if the background is too bright, close to f/11–f/16. Wet streets reflect lights after rain. Exposures of 1 s or longer trigger noise reduction that takes as long again. |
| 5 | `mixed-light` | Mixed light and white balance | none | Orange sodium lamps ≈ 2000–2200 K, white LED street lights ≈ 3000–4000 K; shoot RAW and fix in darktable. |
| 6 | `astro` | Your first star photo | `star-trails` | Dark site (light-pollution map), new moon, focus on a bright star with magnification. NPF: 35mm at f/1.4 ≈ 6.5 s (f/2 ≈ 7.1 s); the 500 rule says 14 s and leaves trails. ISO 3200–6400. Corner stars may look like small comets (coma): test f/2 and f/2.8 on your lens. Expect a dark file and brighten it in darktable. Milky Way core: northern hemisphere about February–October; Vietnam: high in the sky (about 40–50°), best February–April before dawn (rainy season about May–October). Stacking with Sequator (Windows) or Siril (free). Credit the NPF rule to Frédéric Michaud, Société Astronomique du Havre. |
| 7 | `safety` | Stay safe and comfortable | none | Go with a friend, tell someone where you are, carry a headlamp with red light, and keep spare batteries. |

- [ ] **Step 4: Other sections**

Key terms: NPF rule (A formula for the longest star exposure without trails.) · 500 rule (An older, looser rule: 500 divided by focal length.) · Coma (Corner stars that look like small comets.) · Light trails (Streaks from moving lights in a long exposure.) · Light pollution (Sky glow from city lights that hides stars.) · Stacking (Merging many frames to cut noise.)

Simulator section: heading "Find your shutter limits". Intro: "Pick a lens and an aperture to see the longest star exposure. Then set how many stabilizer stops you trust for handheld shots." Widget `night-sim`.

Warm-up: "Shoot a 3-frame bracket of a bright window from inside. Merge it later with create HDR."

Mistakes:

| Mistake | Fix |
|---|---|
| Keeping ISO low and getting blur. | Raise ISO. Noise can be cleaned, blur cannot. |
| Using the 500 rule for stars. | Use the NPF rule. It gives shorter, sharper times. |
| Trusting autofocus in the dark. | Switch to manual focus and magnify a bright light or star. |
| Using one white balance for mixed lamps. | Shoot RAW and adjust in darktable. |
| Leaving with one battery. | Carry 2 spares. |

Self-check:

| Question | Answer |
|---|---|
| Handheld at night with the 35mm, a person standing still: which shutter speed? | About 1/60 s. |
| What does the NPF rule give for the 35mm at f/1.4? | About 6.5 s. |
| Why is noise better than blur? | Noise can be reduced in editing. Blur cannot be fixed. |
| Corner stars look like little comets. What do you try? | Close to f/2 or f/2.8 and raise the ISO. |
| What is the hyperfocal distance for the 35mm at f/8? | About 5.1 m. |

Learn more:
- PhotoPills, Milky Way photography guide: https://www.photopills.com/articles/milky-way-photography-guide
- NPF rule by Frédéric Michaud (SAH): https://sahavre.fr/wp/regle-npf-rule/
- Siril: https://siril.org. Open this link first and drop it if it does not load.
- Light pollution map: https://www.lightpollutionmap.info. Open this link first and drop it if it does not load.

- [ ] **Step 5: Verify and commit**

Follow the content workflow steps 4–8 for `stages/night.html`. Smoke-test the simulator:
- 35mm at f/1.4 reads "6.5 s" and "14.3 s, 2.2 times longer". The right sky shows short lines and the left one dots.
- Stabilizer 2 stops shows "1/8 s or faster" on the 35mm and "1/30 s" on the 85mm.
- The credit line is visible.

```bash
git add src/js/widgets/night-sim.js stages/night.html src/illustrations
git commit -m "content: night track with star and handheld simulator"
```

---

### Task 17: Stage 8: Your own eye and portfolio

**Files:**
- Modify: `stages/your-eye.html`
- Create: `src/illustrations/reading-steps.svg`
- Reuse: `src/illustrations/photo-essay.svg` (Task 14). If Task 14 has not run yet, create it from the Task 14 table.

**Interfaces:**
- Consumes: page skeleton (Task 5). This stage has no simulator; its checklist is the portfolio self-review.
- Source of facts: spec §5 "Stage 8".

- [ ] **Step 1: Illustration**

| File | viewBox | Draw | `aria-label` |
|---|---|---|---|
| `reading-steps.svg` | 0 0 640 200 | Four boxes joined by arrows: "Describe: what do I see?", "Analyze: how was it made?", "Interpret: what does it mean?", "Judge: does it work?". | Read a photo in four steps: describe, analyze, interpret, judge. |

- [ ] **Step 2: Lessons**

| # | `id` | Heading | Illustrations | Must include |
|---|---|---|---|---|
| 1 | `masters` | Learn from the masters | none | A list with one sentence each on what to learn: Henri Cartier-Bresson (the decisive moment and strong geometry), Vivian Maier (everyday street life, self-portraits in reflections), Fan Ho (light and shadow in Hong Kong streets), Saul Leiter (soft color and layers through glass and rain), Steve McCurry (color and faces that tell a story), Sebastião Salgado (long black-and-white documentary projects), Ansel Adams (planning, exposure and printing landscapes), Peter Lindbergh (honest, natural black-and-white portraits), Annie Leibovitz (portraits built on an idea and planned light). |
| 2 | `reading` | Read a photo in four steps | `reading-steps` | Describe → analyze → interpret → judge, with one short example sentence per step about a street photo. |
| 3 | `feedback` | Ask for and give feedback | none | Ask specific questions ("Which photo stays with you? Which would you remove?"). Give feedback that names what works first, then one change. |
| 4 | `projects` | Projects build your style | none | A series of 12; one lens for one month; a weekly theme. |
| 5 | `portfolio` | Build a 12-photo portfolio | `photo-essay` | Cull to your best 12; one consistent edit (use a darktable style); sequence for flow, as in a photo essay; where to share. |
| 6 | `printing` | Print your work | none | Prints show what screens hide; start with 5 photos at 13 × 18 cm or larger; export full size for print (stage 5). |
| 7 | `next` | What to learn next | none | Off-camera flash, video, film. |

- [ ] **Step 3: Other sections**

Key terms: Critique (A careful look at what works in a photo and what does not.) · Series (Several photos on one theme.) · Sequence (The order photos are shown in.) · Portfolio (Your best photos, chosen and ordered.) · Edit, as a noun (The choice of which photos to keep.)

No simulator section. The practice checklist (from `roadmap.js`) is the portfolio self-review.

Warm-up: "Shoot one handheld night frame at f/1.4 and check it at 100%."

Mistakes:

| Mistake | Fix |
|---|---|
| Keeping too many photos in a portfolio. | Show 12. A tight set shows your best work. |
| Mixing very different edits. | Give the set one consistent look. |
| Asking "Do you like it?" | Ask which photo stays with them and which they would remove. |
| Only posting online. | Print a few. Prints teach you a lot. |

Self-check:

| Question | Answer |
|---|---|
| Name the four steps to read a photo. | Describe, analyze, interpret, judge. |
| Which question gets better feedback than "Do you like it?" | "Which photo stays with you, and which would you remove?" |
| Why keep only 12 photos? | A tight set shows your best work and your style. |
| Which shutter speed freezes walking people? | 1/250 s or faster. |

Learn more (open each link first and drop any that does not load):
- Fondation Henri Cartier-Bresson: https://www.henricartierbresson.org
- Vivian Maier: https://www.vivianmaier.com
- Saul Leiter Foundation: https://saulleiterfoundation.org

- [ ] **Step 4: Verify and commit**

Follow the content workflow steps 4–8 for `stages/your-eye.html`. The pager's last link reads "Back to the roadmap".

```bash
git add stages/your-eye.html src/illustrations
git commit -m "content: stage 8 your own eye and portfolio"
```

---

### Task 18: README and final verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: README**

`README.md`:

````markdown
# Learn Photography from Zero

A 16-week, multi-page learning app for one photographer: Sony α7 II, 35mm f/1.4, 85mm f/1.8, darktable 5.6 and GIMP 3.2.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build && pnpm preview
```

The app uses JavaScript modules, so open it through `pnpm dev` or `pnpm preview`, not by double-clicking the HTML files.

## Check it

```bash
pnpm test                 # formulas, progress store, simulator logic, readability checker
pnpm check:readability    # plain-language targets for every page
```

## Where things are

- Design: `docs/superpowers/specs/2026-10-22-photography-roadmap-design.md`
- Research notes (source of every camera and software label): `docs/research/`
- Stage order and practice tasks: `src/data/roadmap.js`
- Lessons: `stages/*.html`; diagrams: `src/illustrations/`; simulators: `src/js/widgets/`
````

- [ ] **Step 2: Automated checks**

Run: `pnpm test` (expected: every suite passes)
Run: `pnpm check:readability` (expected: every section ✓ on all 12 pages, exit 0)
Run: `pnpm build` (expected: 12 HTML pages in `dist/`, no warnings about missing inputs)

- [ ] **Step 3: Full smoke test**

With `pnpm preview` (the built site):
1. Visit all 12 pages. On each: no console errors, every `[data-illus]` shows an SVG, every simulator renders, and the TOC lists every lesson.
2. Keyboard only, on the exposure and portrait pages: skip link, header, TOC links, every simulator control, every checkbox, and the pager are all reachable and visible when focused.
3. Toggle the light theme, reload, and visit a stage. The theme persists, and illustrations and callouts stay readable in both themes.
4. Tick 2 tasks on two stages, reload, and go home. Card statuses and overall progress match. Reset clears them.
5. At 360 px width: no horizontal scrolling, simulators stack, and the drawer opens, traps focus and closes with Escape.
6. Turn on reduced motion in the OS or DevTools emulation. Scrolling is instant.
7. Contrast spot check in DevTools for body text, muted text, links and callout labels in both themes. All reach AA.
8. Block storage (DevTools › Application › Storage › block, or a private window with storage disabled). Pages still render and checkboxes still toggle.
9. Take screenshots of home, exposure and portrait in both themes for the final report.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README with run and check commands"
```

- [ ] **Step 5: Whole-branch review**

Request a code review of the full branch, using the requesting-code-review skill. Give the reviewer the spec, this plan and the Review Focus list. Fix every finding marked important, then run Step 2 again.

