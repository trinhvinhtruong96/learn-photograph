# Learn Photography from Zero

A 16-week, multi-page learning app for one photographer: Sony α7 II, 35mm f/1.4, 85mm f/1.8, darktable 5.6 and GIMP 3.2. The content is in Vietnamese; camera and software labels stay in English, as they appear on screen.

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
pnpm check:readability    # Vietnamese plain-language targets (syllables per sentence, paragraph length) for every page
```

## Where things are

- Design: `docs/superpowers/specs/2026-10-22-photography-roadmap-design.md`
- Research notes (source of every camera and software label): `docs/research/`
- Vietnamese terms, UI label rules and number formats: `docs/glossary-vi.md`
- Stage order and practice tasks: `src/data/roadmap.js`
- Lessons: `stages/*.html`; diagrams: `src/illustrations/`; simulators: `src/js/widgets/`
