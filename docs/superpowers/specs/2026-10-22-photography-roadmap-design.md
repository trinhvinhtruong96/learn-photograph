# Learn Photography — From Zero to Photographer — Design

Date: 2026-10-22
Status: Draft for review (rev 2 — research folded in)

## 1. Goal

A multi-page web app that takes one learner from **zero knowledge to a working photographer** with their own kit:

- Camera: Sony α7 II (ILCE-7M2): 24 MP full frame, 5-axis IBIS (rated 4.5 stops), shutter 30 s – 1/8000 s + Bulb, ISO 100–25600
- Lenses: 35mm f/1.4, 85mm f/1.8 (brands unknown)
- Editing: darktable 5.6 (RAW editing) and GIMP 3.2 (retouching), both free
- Focus genres: portrait, street/documentary, landscape/travel, night/low light

Success = the learner follows the roadmap stage by stage, understands every concept without prior knowledge, tries it in an interactive simulator, practices it with their own camera, and tracks progress until they have a 12-image portfolio.

### Assumptions
- The learner reads English as a second language → readability targets in §3 use the stricter second-language grade.
- Location-specific notes (golden-hour length, Milky Way season, photo law) assume **Vietnam (≈10–21°N)**. Every such note is paired with the general rule. To be confirmed by the user.
- Lens brands are unknown → no brand-specific claims (coma, embedded lens corrections, IBIS lens data). Lessons tell the learner to test their own lens.

### Non-goals
- No backend, accounts, sync, or hosting setup
- No real photographs bundled (illustrations are SVG; the learner's own photos can be added later)
- No real sunrise/sunset calculation (link to SunCalc.org instead)
- No i18n (English only), no PWA/offline mode
- No camera-menu reference stage ("Know your α7 II" was removed by request). Camera basics needed from zero are in Stage 1, lesson 1; camera-specific steps appear inline per lesson.

## 2. Research basis

All facts come from research notes committed in `docs/research/`:

| File | Covers | Main sources |
|---|---|---|
| `sony-a7ii.md` | Exact α7 II menu paths, ranges, quirks | Sony Help Guide ILCE-7M2, Sony spec pages, firmware history |
| `darktable-5.6.md` | Workflow order, module names, shortcuts | darktable 5.6 user manual, 5.2–5.6 release notes, source at release-5.6.2 |
| `gimp-3.2.md` | Tool names, menu paths, retouch steps | GIMP 3.2 manual, gimp.org release notes |
| `pedagogy-numbers-writing.md` | Numbers/formulas check, misconceptions, analogies, practice design, writing standard | Cambridge in Colour, Photography Life, PhotoPills, Wikipedia (ANSI EV tables, formulas), GOV.UK, plainlanguage.gov, NN/g, Ericsson, Dunlosky et al. |

Rules:
- Camera and software labels are copied **verbatim** from these notes. Nothing is paraphrased.
- A fact not in these notes is verified against an official source before it is written, or it is left out.
- Each stage page ends with **Learn more**: 2–4 links to primary sources (Sony Help Guide, darktable/GIMP manual, Cambridge in Colour, Photography Life, PhotoPills).

## 3. Writing standard (plain language)

Numeric targets per lesson section:

| Check | Target |
|---|---|
| Flesch Reading Ease | ≥ 60 (aim 65–75); technical boxes ≥ 50 |
| Flesch-Kincaid grade | ≤ 7 (second-language reader) |
| Average sentence length | ≤ 15 words; no sentence over 25 words |
| Paragraph | 1 idea, ≤ 3 sentences, ≤ 60 words |

Rules:
1. **Front-load**: the first sentence of a section says what it is or what to do.
2. Active voice, present tense, "you".
3. Define jargon at first use in ≤ 12 words, mark it with `<dfn>`, and add it to the Key terms box. One term per concept (always "shutter speed", never also "exposure time").
4. Spell out abbreviations once: "in-body image stabilization (IBIS)", "depth of field (DoF)".
5. Numerals for 2 and up, always with units. Fixed notation: `f/2.8`, `1/250 s`, `ISO 400`, `85mm` (lens), `2 m`, `5500 K`, `+1 EV`.
6. Lists for 3+ parallel items; numbered lists for steps.
7. **Bold only for exact camera/software labels**, with paths joined by ›: **MENU › Camera Settings › Quality**. New terms use `<dfn>` (italic), never bold.
8. Lesson headings are short statements ("Aperture controls light and blur"); self-check items are questions.
9. Avoid "simply/just/obviously", hype words, noun chains, negative contractions ("do not", not "don't").

Example (aperture):
- Before (grade ~21): "The aperture is an adjustable diaphragm within the lens whose diameter, expressed as an f-number representing the ratio of the focal length to the entrance pupil diameter, determines both the quantity of light reaching the sensor and the depth of field."
- After (grade ~2): "The aperture is a hole inside your lens. You set its size with the f-number. A small number, like f/1.8, means a big hole. A big hole lets in more light and blurs the background. A big number, like f/8, means a small hole. You get less light, but more of the scene is sharp."

Check: `pnpm check:readability` (a small Node script, no new dependency) extracts lesson text per section from the stage HTML, computes the four metrics with a heuristic syllable counter, prints a table, and exits non-zero when a section misses a target. Scores may differ ±5 from Hemingway/Word.

## 4. Teaching design

### 4.1 Lesson shape (every lesson)
1. **In one sentence** — the idea in plain words.
2. **Picture it** — an everyday analogy (from the approved list in §4.3).
3. **Illustration** — an SVG diagram of the idea.
4. **Example** — a real scene with real settings on the learner's kit, and *why* (e.g. "Friend in open shade: 85mm, f/2, 1/1000 s, ISO 100 — f/2 blurs the background, 1/1000 s freezes a smile.").
5. **On your α7 II** (or **In darktable** / **In GIMP**) — exact path to the control.
6. **Try it now** — a 5–10 minute exercise.

### 4.2 Stage page parts
- Header: number, level badge, weeks, "what you'll learn"
- Lessons (§4.1)
- **Key terms** box
- **Interactive simulator** (§7)
- **Warm-up** (from Stage 2 on): one short exercise repeating an earlier skill (interleaving/spacing)
- **Practice assignments** (3–5, saved), written with the template in §4.4
- **Common mistakes**: misconception → one-line correction (lists in `pedagogy-numbers-writing.md` §B2)
- **Self-check**: 3–5 questions, answers revealed with `<details>`; 1–2 questions revisit earlier stages (retrieval practice)
- **Learn more**: 2–4 primary links
- Prev / next stage links

### 4.3 Analogies
Use: rain in a bucket (opening width = aperture, time = shutter, overflow = blown highlights); f-number as a fraction (f/2 = ½, f/8 = ⅛ → bigger number, smaller hole); pupil of the eye; volume knob for ISO (turning up also makes hiss louder); staircase of doubles for stops; laser pointer for shake with longer lenses; slab of glass with soft edges for depth of field.

Avoid (they mislead): "ISO = sensor sensitivity"; the equal-sided exposure triangle; "telephoto compresses"; "golden *hour*" taken literally; "warm light = high Kelvin"; "bokeh = amount of blur"; "hyperfocal = everything perfectly sharp".

### 4.4 Practice assignment template
1. **Goal, one variable**: "Same subject, same light; change only the aperture, f/1.4 → f/16."
2. **Constraint**: one lens, one place, one theme, or a fixed time (e.g. 20 minutes).
3. **Success check you can see**: "nearest eye sharp at 100%", "no clipping on the face".
4. **Compare & reflect**: side by side in darktable culling mode; one line per frame: setting → result → why.
5. **Repeat**: redo the weakest frame the next day.

Outside feedback (from other people) comes in Stage 8.

## 5. Roadmap (curriculum)

Suggested pace: ~3–5 hours/week, 16 weeks. Stages 1–6 are sequential; tracks 7a–7d are independent and can be taken in any order after Stage 6; Stage 8 comes last.

| # | id | Stage | Level | Weeks |
|---|---|---|---|---|
| 1 | `exposure` | Exposure — control light | Beginner | 1–2 |
| 2 | `focus` | Focus & sharpness | Beginner | 3 |
| 3 | `composition` | Composition | Intermediate | 4–5 |
| 4 | `light` | Light & color | Intermediate | 6–7 |
| 5 | `editing` | Editing workflow (darktable) | Intermediate | 8 |
| 6 | `advanced-editing` | Advanced editing (darktable + GIMP) | Advanced | 9–10 |
| 7a | `portrait` | Track: Portrait (85mm) | Advanced | 11 |
| 7b | `street` | Track: Street & documentary (35mm) | Advanced | 12 |
| 7c | `landscape` | Track: Landscape & travel | Advanced | 13 |
| 7d | `night` | Track: Night & low light | Advanced | 14 |
| 8 | `your-eye` | Your own eye & portfolio | Advanced | 15–16 |

### Stage 1 — Exposure (control light)
1. **How a camera makes a photo (start here)** — light → lens → aperture → shutter → sensor; exposure = how much light you collect (bucket analogy). Camera setup from zero:
   - Hold it: left hand under the lens, elbows in.
   - Mode dial to **A** (Aperture Priority).
   - Half-press to focus, full press to shoot.
   - **MENU › Camera Settings › Quality › RAW** (needed for darktable).
   - Turn on the histogram: **MENU › Custom Settings › DISP Button › Monitor** (and **Finder**) › tick **Histogram**.
   - Battery NP-FW50 lasts about 270 shots with the viewfinder → carry 2 spares.
2. **Stops** — each stop doubles or halves the light (staircase). Aperture, shutter and ISO all move in stops.
3. **Aperture** — fraction analogy; ladder f/1.4 · 2 · 2.8 · 4 · 5.6 · 8 · 11 · 16. Example: 85mm f/1.8 portrait vs f/8 group photo.
4. **Shutter speed** — freeze vs blur. Guide: still person 1/125 s · walking 1/250 s · kids playing 1/500 s · running/sports 1/1000 s+ · splashes 1/1000 s+ · silky water from 1/2 s (smoother 1–2 s, very smooth 5–10 s, tripod). Handheld: start at 1 ÷ focal length (35mm → 1/40 s, 85mm → 1/100 s). IBIS is rated 4.5 stops; plan on 2–3 for still subjects (35mm ≈ 1/8 s, 85mm ≈ 1/20 s). IBIS cancels your shake, not a moving subject.
5. **ISO** — the sensor has one sensitivity; ISO brightens what was captured (volume knob). Noise mostly comes from too little light; raising ISO in camera still beats brightening later. Example: dim party (about EV 4): 35mm, f/1.4, 1/125 s, ISO 1600. ISO 50 is an extended setting that lowers dynamic range → start at ISO 100.
6. **Putting it together** — aperture and shutter let light in; ISO brightens it. Equivalent exposures (open shade, ISO 100): f/2.8 1/500 s = f/4 1/250 s = f/5.6 1/125 s. Sunny 16 ladder at 1/ISO: snow/sand f/22 · sunny f/16 · slight overcast f/11 · overcast f/8 · heavy overcast f/5.6 · open shade/sunset f/4.
7. **Modes, metering, histogram** — A mode is a pro workflow: you pick the aperture, the camera picks the shutter. M + **ISO AUTO** when you need a fixed shutter speed. Exposure compensation dial ±3 EV (menu ±5 EV only with the dial at 0; in M it works only with ISO AUTO). **Metering Mode**: Multi / Center / Spot. The meter aims for mid-grey → snow +1 EV, black cat −1 EV. There is no ideal histogram shape; avoid clipping highlights — white areas hold no detail. **Zebra** (70–100, 100+).
8. **Review loop (15 minutes)** — copy photos to a dated folder, darktable lighttable **add to library**, view at 100% (hold **W**), read the settings in **image information**. Repeat after every practice shoot.

Key terms: exposure, stop, aperture, f-number, shutter speed, ISO, noise, EV, histogram, clipping, metering.
Practice: aperture ladder (one subject, 35mm, f/1.4 → f/16); shutter ladder (moving water or traffic, 1/1000 → 1/4 s); ISO test (dark room, find your highest acceptable ISO); 30 frames in A mode, corrected with the dial using the histogram; Sunny 16 in M mode.
Mistakes: bigger f-number = bigger hole; judging exposure on the screen instead of the histogram; shutter too slow for moving people; "real photographers only use M"; fear of high ISO; JPEG only.

### Stage 2 — Focus & sharpness
1. **What "in focus" means** — one plane is sharp; sharpness fades gradually (slab of glass with soft edges). Depth of field depends on aperture and on how big the subject is in the frame (closer or longer lens = bigger = shallower). Near portrait distances the sharp zone splits about evenly in front of and behind the subject.
2. **Focus Mode** — **Single-shot AF** (AF-S, still subjects) / **Continuous AF** (AF-C, moving) / **DMF** / **Manual Focus**. Examples: café portrait AF-S; child running AF-C.
3. **Focus Area** — **Wide / Zone / Center / Flexible Spot (S/M/L) / Lock-on AF**. Beginner default **Flexible Spot M**; move it by assigning **Focus Standard** to a key (firmware 4.00+).
4. **Eye AF** — assign it: **MENU › Custom Settings › Custom Key Settings** › a key › **Eye AF**. Hold that key while you press the shutter. Use it in AF-S (Sony warns it may not work in AF-C). Example: 85mm, f/1.8, 2 m → only 5.7 cm is sharp → the nearest eye must be in that slab.
5. **Back-button focus** — **MENU › Custom Settings › AF w/ shutter › Off**, then **Custom Key Settings › AEL Button › AF On** (switch lever on AEL).
6. **Manual focus** — **Peaking Level** is Off by default → set **Mid**; **Peaking Color** Red/Yellow/White; **MF Assist › On** for automatic magnification.
7. **Sharpness killers** — slow shutter (most "bad lens" blur), subject motion, missed focus, focus-and-recompose at f/1.4 (turning the camera moves the sharp plane), very small apertures (diffraction, around f/16 and smaller), dirty lens. **SteadyShot Adjust. › Manual** + **SteadyS. Focal Len.** only for lenses without electronic contacts. At about 1/2000 s and faster wide open, odd bokeh edges → try **e-Front Curtain Shut. › Off**.

Key terms: focal plane, depth of field, bokeh (the *look* of blur), AF-S/AF-C, focus area, peaking, diffraction, hyperfocal.
Practice: nearest eye at f/1.8 vs f/4; AF-C tracking a friend walking toward you; find your handheld limit with each lens (1/60 → 1/4 s, check at 100%); manual focus with peaking.
Mistakes: focusing on the nose or ears; Wide area picking the background; DoF is ⅓ in front, ⅔ behind (only true far away); smallest aperture = sharpest.

### Stage 3 — Composition
1. **Simplify** — name the subject, remove distractions, check edges and background.
2. **Rule of thirds — a guideline**; symmetry and center framing also work.
3. **Leading lines, framing, layers** (foreground / middle / background).
4. **Negative space & figure-ground** — the subject must contrast with its background.
5. **Point of view & perspective** — get low or high. Perspective comes from *distance*: with the 85mm you stand farther away, so the background looks larger and closer. Zooming or cropping changes framing, not perspective. The 35mm shows context.
6. **Balance, patterns, look room** — repetition and breaking it, odd numbers, space where the subject looks or moves.
7. **Work the scene** — 10+ variations of one subject.
Example: "Street vendor: 35mm, step closer, frame through the stall, vendor on the right third, look room on the left."

Key terms: rule of thirds, leading line, negative space, figure-ground, perspective, look room.
Practice: 20 compositions of one subject; same framing with 35mm vs 85mm (walk to match); one day of only leading lines; one subject from 3 heights.
Mistakes: telephoto "compresses"; zooming = walking closer; fill the frame with everything; one frame per scene.

### Stage 4 — Light & color
1. **Hard vs soft light** — soft light comes from a source that is large compared with the subject (closer = softer). Noon sun vs cloudy day vs window.
2. **Direction** — front, 45°, side, back, rim, top (noon "raccoon eyes").
3. **Time of day** — golden hour and blue hour vary with latitude and season (golden ≈ sun from 6° above to 4° below the horizon). Vietnam: golden light ≈ 40–50 minutes, blue hour ≈ 10–20 minutes. Check times on SunCalc.org. Midday tactics: open shade, backlight.
4. **Reading light** — shadows on your hand; catchlights in eyes.
5. **Color temperature & white balance** — candle ≈ 1850 K, home bulbs ≈ 2700 K, sun at the horizon ≈ 2000 K, golden hour ≈ 3500 K, daylight ≈ 5500 K, overcast ≈ 6500–7500 K, shade ≈ 7500–10 000 K. Lower K = more orange. On the camera, a *higher* WB setting makes the photo *warmer*. **MENU › Camera Settings › White Balance** (presets, or **C.Temp./Filter** 2500–9900 K). AWB is fooled by dominant colors and mixed light; RAW lets you fix WB later.
6. **Color harmony** — complementary (orange/teal), analogous, limited palettes.
7. **Free modifiers** — white wall, cheap 5-in-1 reflector, curtains.
Example: "Portrait at noon: move the subject to the edge of open shade, facing the bright area → soft light + catchlights."

Key terms: hard/soft light, catchlight, golden hour, blue hour, color temperature, white balance.
Practice: one place at 4 times of day; rotate a subject relative to a window (0/45/90/135/180°); AWB vs **Daylight** vs **Shade** at sunset; find 5 complementary-color scenes.
Mistakes: noon is the best light; soft = dim; higher WB number = cooler photo; AWB is always right.

### Stage 5 — Editing workflow (darktable 5.6)
1. **Why RAW + non-destructive editing** — darktable never changes the original; edits live in a sidecar (`DSC01234.ARW.xmp`). Back up sidecars with the RAWs.
2. **Organize & cull** — copy to `YYYY/YYYY-MM-DD_event`, then lighttable **import › add to library**. Hover a thumbnail: **0–5** stars, **R** reject, **F1–F5** color labels. Culling mode **X** (fixed) / **Ctrl+X** (dynamic); hold **W** for full preview.
3. **One-time setup** — preferences › processing › **auto-apply pixel workflow defaults** = "scene-referred (sigmoid)" (the 5.6 default). The manual's getting-started page still shows filmic rgb; the app teaches **sigmoid**.
4. **The basic edit, in working order** — **lens correction** (turn on first; vignetting fix changes brightness) → **exposure** (auto +0.7 EV, like a camera's JPEG; **Ctrl+B** color assessment mode) → **sigmoid** (contrast) → **color calibration** (white balance, if needed) → **color balance rgb** (preset "basic colorfulness", then global vibrance) → **denoise (profiled)** (has an α7 II profile) → **local contrast** or **diffuse or sharpen** → **rotate and perspective** & **crop** → **retouch**. The processing order inside darktable is fixed; this is the order you *work* in.
5. **Compare** — **snapshots** module: **take snapshot**, then click it for a split view. Click older **history stack** items to step back.
6. **Edit a whole set** — **Ctrl+C / Ctrl+V** copy and paste; **Ctrl+Shift+C / Ctrl+Shift+V** to choose modules. Plain copy skips white balance and lens correction.
7. **Export** — **export** module: file format JPEG, quality 90, set size in pixels with max size 2048 × 2048 for web (0 × 0 = full size for print), profile sRGB.
8. **Backup** — 3-2-1 rule (3 copies, 2 media, 1 off-site), sidecars included.
Worked example: an underexposed sunset street RAW taken from import to export, one module at a time.

Key terms: RAW, sidecar (XMP), module, history stack, snapshot, culling, export, sRGB.
Practice: cull a shoot to the top 10; edit those 10 with the working order; export a web set; set up a backup.
Mistakes: RAW looks flat so JPEG is better; editing changes the original; RAW can rescue a pure-white sky; sharpening fixes missed focus; Adobe RGB for the web.

### Stage 6 — Advanced editing (darktable + GIMP)
darktable:
1. **Masks** — drawn shapes: brush, circle, ellipse, path, gradient; parametric masks by brightness or color; **combine masks**; **feathering radius** and **blurring radius** for soft edges. Example: gradient mask on the sky in **exposure**, −0.7 EV.
2. **AI object mask (optional, new in 5.6)** — off by default; enable AI in preferences and download a model. Click to add, **Shift+click** to exclude, right-click to apply. Example: select a person, lift +0.3 EV.
3. **Tone equalizer** — dodge & burn by brightness zones; tabs simple / advanced / masking; hover over the image and scroll to lift or lower that zone. Example: lift a backlit face +1 EV.
4. **Curves** — S-curve for contrast; lifted blacks for a matte look.
5. **Color grading** — **color balance rgb**: start with global vibrance/chroma; then the **4 ways** tab (shadows lift, highlights gain, power, global offset). Example: warm highlights + teal shadows while skin stays natural.
6. **Styles** — a style saves several modules (a preset is one module). Create in the lighttable **styles** module or from the **history stack**; apply by double-clicking. Apply one style to a 6-frame set.
7. **Noise & lens fixes** — **denoise (profiled)**; optional **neural restore** (AI raw denoise → new DNG, needs AI enabled); **rotate and perspective**.
8. **HDR & panoramas** — RAW bracket on a tripod → lighttable **selected image[s] › create HDR** → new DNG. Panoramas: neither darktable nor GIMP stitches; use the free tool Hugin (optional).

GIMP 3.2:
9. **Round trip** — darktable export as 16-bit TIFF → open in GIMP (**Image › Encoding** shows the bit depth) → retouch → **File › Export As** (**Shift+Ctrl+E**) JPEG at quality 90 (GIMP's default is 85). **Save** writes `.xcf` only.
10. **Heal (H) & Clone (C)** — **Ctrl+click** to set the source; blemishes, sensor dust, small distractions. GIMP has no built-in content-aware remove.
11. **Skin retouching** — **Filters › Enhance › Wavelet decompose** (scale layers + residual); work on the right scale so pores stay; keep texture.
12. **Dodge & burn** — **Dodge / Burn** tool (**Shift+D**, **Ctrl** toggles), or a new 50% grey layer in **Overlay** / **Soft light** mode painted with low-opacity white/black.
13. **Layers, masks, effects** — **Layer › Mask › Add Layer Masks…**; non-destructive filters appear as **Layer Effects** (the **fx** icon) and can be edited or merged later.

Key terms: mask, feather, dodge & burn, curve, color grading, style, preset, HDR, frequency separation.
Practice: graduated sky on a landscape; one portrait retouch that keeps skin texture; one style applied to a 6-frame set; HDR merge from a bracket.
Mistakes: more saturation = better; over-smoothed "plastic" skin; masks with hard edges; editing each photo of a set differently.

### Stage 7a — Track: Portrait (85mm)
1. **Lens & distance** — camera held vertically: head-and-shoulders ≈ 1.5 m, waist-up ≈ 2.5 m, full body ≈ 5 m; held horizontally, step back about 1.5×. No nose distortion at these distances.
2. **Settings** — f/1.8 for one person, f/2.8–4 for two people at different distances. Shutter ≥ 1/200 s: use M + ISO AUTO (A mode cannot set a minimum shutter on the α7 II). Still subject: AF-S + Eye AF (hold the key). Moving subject: AF-C + Flexible Spot or Lock-on AF.
3. **Background** — more distance from subject to background = more blur. From the same spot, the 85mm blurs the background ≈ 4.7× more than the 35mm; framed the same, ≈ 1.5× more (see simulator).
4. **Light** — open shade, window at 45°, backlight + reflector, golden-hour rim light; avoid noon top light.
5. **Posing & directing** — body at 45°, weight on the back foot, chin forward and slightly down, give hands a job; direct with actions ("walk toward me"), not poses; talk and show results on the screen.
6. **Framing** — avoid cropping at joints; eyes near the upper third.
7. **Environmental portrait** with the 35mm.
Example: "Window portrait: 85mm, f/2, 1/200 s, ISO 800, subject 1 m from the window at 45°."
Practice: 5-frame set of one person (tight, half, full, environmental 35mm, candid); 3 lighting setups; posing checklist.

### Stage 7b — Track: Street & documentary (35mm)
1. **Why 35mm** — context plus closeness.
2. **Settings** — M + ISO AUTO: f/8, 1/500 s, ISO AUTO with **ISO AUTO Maximum** 6400; the exposure dial still adjusts brightness. Zone focus: Manual Focus at 3 m → sharp from ≈ 1.9 m to ≈ 7.2 m. Alternative: A mode, AF-C, Wide. The α7 II has no silent shutter — be open, not sneaky.
3. **Seeing** — light & shadow, layers, gestures, juxtaposition, color, repetition; "fishing" (wait in one spot) vs "hunting".
4. **Getting close, ethics & law** — confidence, body language, smiling; respect children and vulnerable people; delete if asked. Laws differ by country. Vietnam (not legal advice): Civil Code 2015 Art. 32 requires consent to *use* a person's image (exceptions for public events and the public interest; commercial use needs payment); Art. 25: a child's consent comes from a parent or guardian.
5. **Documentary storytelling** — photo-essay structure: establishing, medium, detail, portrait, moment, closing.
6. **Working a scene** and building a themed series.
Example: "Market at golden hour: 35mm, M mode, f/8, 1/500 s, ISO AUTO (the camera picks about ISO 800–1600), zone focus 3 m. Find a shaft of light and wait for someone to walk into it."
Practice: 1 hour, 35mm only, one theme; 20-minute fishing exercise; 8-image photo essay.

### Stage 7c — Track: Landscape & travel
1. **Plan** — weather, golden/blue hour (SunCalc.org), scouting with maps.
2. **Settings** — tripod; **Self-timer: 2 Sec**; **SteadyShot › Off** on a tripod (Sony's advice); f/8–f/11; ISO 100; RAW.
3. **Depth** — foreground interest; hyperfocal: 35mm at f/8 → focus at ≈ 5.1 m, sharp from ≈ 2.6 m to infinity (focus slightly farther if distant detail matters most); layers.
4. **Horizon, side light for texture, weather** (fog and storms are gifts).
5. **Long exposure** — ND filters: ND8 = 3 stops, ND64 = 6, ND1000 = 10. Example: 1/125 s without the filter → 8 s with ND1000.
6. **Bracketing for high contrast** — **Drive Mode › Cont. Bracket**: 3 or 5 frames, steps up to 3.0 EV (e.g. 1.0EV 5 Image or 2.0EV 3 Image); merge in Stage 6.
7. **Travel storytelling** — people for scale, details, food, transport, night; respect local culture.
Practice: plan and shoot one sunrise or sunset; one long exposure; a 6-frame travel story.

### Stage 7d — Track: Night & low light
1. **Handheld low light** — f/1.4 first; shutter 1/60 s for a person holding still (35mm), 1/125 s candid, 1/250 s walking; IBIS for still scenes down to ≈ 1/8 s (35mm) or ≈ 1/20 s (85mm); ISO takes the rest. Raise **ISO AUTO Maximum** above the default 6400 if needed. Example: dim street (about EV 4): 35mm, f/1.4, 1/125 s, ISO 1600.
2. **Noise vs blur** — noise can be reduced in editing (**denoise (profiled)**, optional **neural restore**); blur cannot be fixed.
3. **Focusing in the dark** — aim at contrast edges; Manual Focus + magnification.
4. **Blue-hour city, light trails, reflections** — trails: tripod, ISO 100, f/8–f/11, 5–30 s; longer exposure = longer trails.
5. **Mixed light & white balance** — orange sodium lamps ≈ 2000–2200 K, white LED street lights ≈ 3000–4000 K; shoot RAW.
6. **Astro basics** — dark site (light-pollution map), new moon, focus on a bright star with magnification. Max shutter: NPF rule → 35mm at f/1.4 ≈ 6.5 s (f/2 ≈ 7.1 s); the 500 rule says 14 s and leaves visible trails. ISO 3200–6400. Corner stars may look like small comets (coma): test f/2 and f/2.8 on your lens. Expect a dark file; brighten in darktable. Milky Way core: northern hemisphere ≈ February–October; Vietnam: high in the sky (≈ 40–50°), best February–April before dawn (rainy season ≈ May–October). Stacking with Sequator (Windows) or Siril (free).
7. **Safety & comfort** at night.
Practice: handheld night street series; light trails; one astro attempt.

### Stage 8 — Your own eye & portfolio
1. **Study the masters** — Henri Cartier-Bresson, Vivian Maier, Fan Ho, Saul Leiter, Steve McCurry, Sebastião Salgado, Ansel Adams, Peter Lindbergh, Annie Leibovitz: one sentence each on *what to learn from them*.
2. **Reading a photo** — describe → analyze → interpret → judge.
3. **Feedback** — how to ask for and give critique.
4. **Projects** — series of 12, one lens for one month, weekly theme.
5. **Portfolio** — cull to your best 12, consistent edit, sequencing, where to share.
6. **Printing your work.**
7. **What next** — off-camera flash, video, film.
Practice: analyze 3 master photos; build a 12-image portfolio; get feedback from 3 people; print 5 photos.

## 6. Architecture

Vanilla HTML/CSS/JS (ES modules), no framework. Vite as dev server and multi-page build.

```
index.html                    home
stages/<id>.html              11 stage pages (ids from §5)
src/
  data/roadmap.js             stages: id, number, title, level, weeks, path, assignments[{id, text}]
  js/main.js                  shared header, sidebar TOC, prev/next, theme toggle, checklist rendering
  js/progress.js              progress store (localStorage)
  js/photo-math.js            pure formulas (§7.1)
  js/widgets/<name>.js        one module per simulator; each exports mount(rootEl)
  styles/tokens.css           colors, spacing, type scale (dark + light)
  styles/base.css             reset, typography, layout
  styles/components.css       cards, callouts, simulators, checklist
  illustrations/*.svg         static diagrams (inlined via Vite `?raw` import or placed inline)
scripts/readability.js        `pnpm check:readability` (§3)
vite.config.js                build.rollupOptions.input lists all 12 HTML pages
tests/                        vitest unit tests
```

Dependencies: `vite`, `vitest` (dev); `@fontsource-variable/inter`, `@fontsource-variable/fraunces` (self-hosted fonts). Nothing else.

Rules:
- `roadmap.js` is the single source of truth for stage order, titles, levels and assignments. Header, prev/next, home cards and checklists are generated from it.
- Lesson prose is static HTML in each stage page.
- A page declares its widgets with `<div data-widget="exposure-sim"></div>`; `main.js` dynamically imports and mounts them.
- `photo-math.js` has no DOM access; widgets only call it and render.

## 7. Interactive simulators

All simulators use native `<input type="range">` / radio / checkbox controls with labels, an `<output>` readout, and an SVG scene changed through SVG filters (`feGaussianBlur`, `feComponentTransfer`, `feTurbulence`). Readouts are announced with `aria-live="polite"`.

| Stage | Widget id | Inputs | Shows |
|---|---|---|---|
| exposure | `exposure-sim` | scene light (bright sun 15 / cloudy bright 13 / open shade 12 / home at night 5 / dim street at night 4, labelled "light in scene (EV100)"), lens (35 f/1.4 / 85 f/1.8), mode (M / A), aperture, shutter (30 s – 1/8000 s), ISO (100–25600), full stops | scene brightness, background blur, motion blur on a moving cyclist, grain, illustrative histogram with clipping warning, ±EV readout, shake warning |
| focus | `dof-sim` | lens, aperture, subject distance 0.5–10 m | near/far limits, total DoF, side-view sharp zone, blurred preview |
| composition | `composition-sim` | overlay toggles (thirds, phi grid, diagonals, center); lens toggle 35/85 | overlays on a scene; same subject size at 35 vs 85 field of view (54.4° vs 23.9°), background coverage |
| light | `light-sim` | light angle 0–360°, hard/soft; scene light K + camera WB K (2500–9900 K, the camera's range) | face shading + pattern name; color cast from WB mismatch |
| editing | `edit-steps` | step stepper (working order from Stage 5), before/after divider (range) | scene evolving through the basic edit |
| advanced-editing | `curve-sim`, `mask-sim` | shadows/mid/highlights output sliders; mask show, sky EV −2..+2, feather | live tone curve applied to the scene; masked sky adjustment |
| portrait | `background-sim` | lens, aperture, subject distance, background distance, "same spot / same framing" toggle | blur disc as % of frame width, preview |
| street | `zone-sim` | aperture, focus distance (35mm fixed) | sharp-from/to distances |
| landscape | `hyperfocal-sim` | lens, aperture | hyperfocal distance, near limit |
| night | `night-sim` | lens, aperture, IBIS stops 0–4 | NPF and 500-rule max exposure; slowest handheld shutter for still scenes; credit line "NPF rule © Frédéric Michaud, Société Astronomique du Havre" |
| your-eye | (none) | — | portfolio self-review checklist uses the progress store |

### 7.1 Formulas (`photo-math.js`)
Circle of confusion c = 0.03 mm (full frame, same as DOFMaster). Pixel pitch p = 5.97 µm (35.8 mm / 6000 px). Distances in mm internally.

- Settings EV at ISO: `EV = log2(N²/t) − log2(ISO/100)`; exposure offset = `sceneEV100 − EV` (positive = brighter than correct).
- Hyperfocal: `H = f²/(N·c) + f`.
- DoF near: `s(H−f)/(H+s−2f)`; far: `s(H−f)/(H−s)` if `s < H`, else ∞.
- Background blur disc: `b = f²/(N(s−f)) · |s_b − s|/s_b`, shown as % of 36 mm frame width.
- Same-framing distance for the other lens: `s₂ = f₂ + (s₁ − f₁)·f₂/f₁` (magnification kept equal), background kept at the same distance behind the subject.
- 500 rule: `500/f`. NPF (simplified, Michaud/SAH): `(35·N + 30·p)/f`.
- Handheld limit: `t = (1/f) · 2^stops`.
- Horizontal field of view: `2·atan(36/(2f))`.

Reference values (unit-test expectations, ±1%), all reproduced in research:
| Case | Expected |
|---|---|
| H, 35mm f/8 | 5139 mm |
| 35mm f/8 focus 3 m | near 1898 mm, far 7158 mm |
| 85mm f/1.8 focus 2 m | near 1972 mm, far 2029 mm (5.7 cm DoF) |
| 35mm f/1.4 focus 1 m | near 968 mm, far 1034 mm |
| blur, 85mm f/1.8, s 2 m, bg 6 m | 1.397 mm (3.9% of width) |
| blur, 35mm f/1.4, s 2 m, bg 6 m | 0.297 mm (0.8% of width) |
| same framing as 85mm @ 2 m → 35mm distance | 0.82 m |
| blur, same framing, bg 4 m behind subject: 85mm f/1.8 vs 35mm f/1.4 @ 0.82 m | 1.397 mm vs 0.920 mm (ratio ≈ 1.5) |
| NPF, 35mm f/1.4 / f/2 | 6.5 s / 7.1 s |
| 500 rule, 35mm | 14.3 s |
| EV, f/16 1/125 s ISO 100 | 15.0 |
| FOV 35mm / 85mm | 54.4° / 23.9° |
| ND1000 (×1024), 1/125 s | 8.2 s |

## 8. Illustrations

Hand-made SVG, theme-aware (`currentColor` + CSS custom properties), each with `role="img"` and a `<title>` (decorative ones `aria-hidden="true"`). Minimum set:

- Stage 1: camera light path, bucket analogy, staircase of stops, f-number as fraction, aperture sizes per f-stop, shutter freeze vs blur, ISO volume knob, histogram shapes (dark/bright/clipped)
- Stage 2: focal plane & DoF slab with soft edges, Focus Area modes, nearest-eye focus, focus-recompose error
- Stage 3: thirds/phi grids, leading lines, framing, layers, 35 vs 85 perspective (top-down camera distance diagram)
- Stage 4: hard vs soft shadow, light directions around a head (top view), Kelvin scale (with the camera-setting direction), color-wheel harmonies, sun-angle diagram for golden/blue hour
- Stage 5: working-order pipeline, culling funnel, 3-2-1 backup
- Stage 6: mask types, tone zones, S-curve, frequency-separation layers, darktable → GIMP round trip
- Tracks: portrait lighting setups (top view), portrait distances, zone-focus diagram, hyperfocal diagram, ND stops chart, NPF vs 500-rule star trails
- Stage 8: photo-essay storyboard

## 9. Visual design & UX

- **Theme:** "darkroom" dark theme by default (follows `prefers-color-scheme` on first visit), light theme toggle, choice saved. Warm amber accent (golden hour). WCAG AA contrast in both themes.
- **Type:** Fraunces for headings, Inter for body/UI; text column ~70ch; simulators break out wider.
- **Home:** hero "From zero to photographer"; your-kit card; "How to use this" (read → play → practice → review → tick); 16-week plan; roadmap path (stages 1–6 in a line, branching into 7a–7d, merging into 8), each card with level, weeks and progress; overall progress; reset progress (with confirm).
- **Stage page:** header (number, level badge, weeks, what you'll learn); sticky TOC sidebar on desktop (≥ 1080 px) generated from lesson headings; slide-out drawer on mobile; distinct callout styles for *In one sentence*, *Picture it*, *Example*, *On your α7 II*, *Try it now*, *Common mistake*.
- **Responsive:** breakpoints 720 px and 1080 px; usable from 360 px width.
- **Motion:** subtle transitions only; disabled under `prefers-reduced-motion`.

## 10. Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, ordered headings, skip link.
- All simulator controls are native inputs with visible labels; range inputs set `aria-valuetext` to human values ("f/2.8", "1/250 second", "ISO 3200").
- Readouts in `<output aria-live="polite">` (debounced while dragging).
- Visible focus styles; full keyboard operation; drawer traps focus while open and closes on Escape.
- Checklist uses real checkboxes with labels.

## 11. Progress data

- localStorage key `lp:progress:v1` → `{ "<stageId>": ["<assignmentId>", ...] }`.
- Theme key `lp:theme` → `"dark" | "light"`.
- Stage status: not started (0), in progress, done (all assignments). Home shows per-stage % and overall %.
- Unparseable or wrong-shaped stored data is treated as empty progress (and overwritten on next save).
- Assignment ids are stable strings in `roadmap.js`; stale ids in stored data are ignored.

## 12. Verification

- **Unit (vitest):** `photo-math.js` against the §7.1 reference table; `progress.js` (toggle, persistence, completion %, corrupt data → empty, stale ids ignored).
- **Readability:** `pnpm check:readability` passes for every stage page (§3 targets).
- **Facts:** every camera/software label in the pages matches `docs/research/` verbatim.
- **Build:** `pnpm build` succeeds and emits all 12 pages.
- **Smoke (real browser, dev server):** visit every page; operate every simulator by mouse and keyboard; tick assignments and confirm home progress updates after reload; theme toggle persists; 375 px mobile layout; no console errors; screenshots of home + representative stages.

## 13. Still unverified (check before writing that text, or leave it out)

- darktable: exact control names inside **sigmoid**; names of the curve and per-color modules (**rgb curve**, **color equalizer**); the module-group preset name "workflow: scene-referred".
- GIMP: **Ctrl+S** / **Ctrl+E** shortcuts; full list of layer-mask start options in 3.2; current Hugin version.
- Sony: the 4.5-stop IBIS rating came from Sony pages via search snippet and spec page (keep "rated 4.5 stops").
- Golden/blue-hour minutes for Vietnam are geometric calculations, not a published source → present as "about".
