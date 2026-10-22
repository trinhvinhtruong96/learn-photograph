# Research — pedagogy, numbers, plain language

Spec checked: `docs/superpowers/specs/2026-10-22-photography-roadmap-design.md` (§2, §3, §5, §5.1).
Verdicts: **CORRECT** · **WRONG** (correct text given) · **NUANCE** (suggested wording) · **UNVERIFIABLE**.
`[CALC]` = my own computation with the spec's formulas (Python, reproducible). `[INFERENCE]` = reasoned, not stated by a source.

---

## A. Technical claims (§3, §5.1)

### A1. Formulas and reference values (§5.1)

| # | Spec claim | Verified value / source | Verdict |
|---|---|---|---|
| 1 | CoC `c = 0.03 mm` full frame | Wikipedia: “widely used CoC limit is d/1500, or 0.029 mm … Values of 0.030 mm and 0.033 mm are also common” — https://en.wikipedia.org/wiki/Circle_of_confusion . DOFMaster: “calculated using 0.030 mm as the reference CoC for 35mm format” — http://www.dofmaster.com/digital_coc.html . Wikipedia Hyperfocal example also uses 0.03 mm. | **CORRECT.** Keep 0.03 (matches DOFMaster, so learners can cross-check). Optional footnote: “Some calculators use 0.029 mm; results differ by under 4 %.” [CALC: H 35mm f/8 = 5139 mm (c 0.03) vs 5315 mm (c 0.029)] |
| 2 | Hyperfocal `H = f²/(N·c) + f` | Wikipedia “Hyperfocal distance”, Definition 1 formula identical — https://en.wikipedia.org/wiki/Hyperfocal_distance . Focused at H, sharp from H/2 to ∞. | **CORRECT** |
| 3 | Near `s(H−f)/(H+s−2f)`, far `s(H−f)/(H−s)` (∞ if s ≥ H) | Standard thin-lens DoF formulas consistent with Definition-1 H (same source family). My values reproduce every spec row exactly. | **CORRECT** |
| 4 | Blur disc `b = f²/(N(s−f)) · |s_b−s|/s_b` | Wikipedia “Circle of confusion”: `c = |S2−S1|/S2 · f²/(N(S1−f))` — https://en.wikipedia.org/wiki/Circle_of_confusion ; Wikipedia “Depth of field → Foreground and background blur”: `b = (f·m_s/N)·x_d/(s±x_d)` — https://en.wikipedia.org/wiki/Depth_of_field | **CORRECT** (thin-lens/symmetric-lens approximation; fine for teaching) |
| 5 | NPF simplified `(35·N + 30·p)/f` | Primary source (author Frédéric Michaud, Société Astronomique du Havre): “règle NPF simplifiée: t = (35 N + 30 p_µm)/f_mm”; full rule `t = k·(16.9N + 0.10f + 13.7p)/(f·cos δ)`, k 1–3 — https://sahavre.fr/wp/regle-npf-rule/ . PhotoPills implements NPF in Spot Stars — https://www.photopills.com/articles/milky-way-photography-guide | **CORRECT.** ⚠ Licence note on the source page: “Any development using this formula shall give credit to the author and the SAH”; “No commercial use is allowed without prior consent.” → add credit line in the night simulator: “NPF rule © Frédéric Michaud, Société Astronomique du Havre.” |
| 6 | Pixel pitch p = 5.97 µm (35.8 mm / 6000 px) | α7 II sensor 35.8 × 23.9 mm, 6000 × 4000 px — https://en.wikipedia.org/wiki/Sony_%CE%B17_II (secondary; Sony spec page returned HTTP 403). 35.8/6000 = 5.967 µm. | **CORRECT** |
| 7 | NPF 35mm f/1.4 = 6.5 s | [CALC] (35×1.4 + 30×5.967)/35 = **6.51 s**. Cross-check full rule δ=0: k=1 → 3.1 s (very strict), k=2 → 6.2 s, k=3 → 9.3 s. 85mm f/1.8 → 2.85 s. 35mm f/2 → 7.1 s. | **CORRECT** |
| 8 | 500 rule `500/f`; 35mm → 14.3 s | PhotoPills: “exposure time = 500/(crop-factor × focal length)” and “the 500 rule has proven to fail in most of the cases … you end up getting trails” — https://www.photopills.com/articles/milky-way-photography-guide . 500/35 = 14.29 s. | **CORRECT** (spec’s “14 s → visible trails” framing is right: ≈2.2× the NPF limit) |
| 9 | EV `log2(N²/t) − log2(ISO/100)`; offset = sceneEV100 − EV | Wikipedia: `EV = log2(N²/t)`; for ISO S, EV_S = EV100 + log2(S/100) — https://en.wikipedia.org/wiki/Exposure_value . f/16 1/125 ISO 100 → 14.97. | **CORRECT.** Sign convention (positive = too bright) is right. Suggest UI label “light needed (EV100)” rather than bare “EV” to avoid confusing it with exposure compensation. |
| 10 | Handheld `t = (1/f)·2^stops` | Photography Life reciprocal rule; “if you’re getting say, 5 stops of stabilization … on a 100mm lens, instead of 1/100 you might only need 1/3” — https://photographylife.com/what-is-reciprocal-rule-in-photography | **CORRECT** |
| 11 | FOV `2·atan(36/(2f))` → 54.4° / 23.9° | [CALC] 54.43° / 23.91°. (With the real 35.8 mm width: 54.2° / 23.8° — negligible.) | **CORRECT** |
| 12 | Reference rows (H 5139 mm; 35 f/8 @3 m → 1898/7158; 85 f/1.8 @2 m → 1972/2029; 35 f/1.4 @1 m → 968/1034; blur 1.397 mm 3.9 %; 0.297 mm 0.8 %) | [CALC] 5139.2; 1897.7/7158.2; 1971.8/2029.0 (DoF 57 mm); 968.0/1034.2; 1.3974 mm = 3.88 %; 0.2969 mm = 0.82 % | **CORRECT** (all within ±1 %) |

### A2. Scene brightness (EV100) — simulator presets and examples

Source for all EV100 values: ANSI exposure tables reproduced in Wikipedia “Exposure value”, Table 2 — https://en.wikipedia.org/wiki/Exposure_value

| Scene | Source EV100 | Spec | Verdict |
|---|---|---|---|
| Bright sun, distinct shadows | **15** (sand/snow 16; hazy sun 14) | sun 15 | **CORRECT** |
| Cloudy bright, no shadows | **13** | — | add if useful |
| Heavy overcast | **12** | — | — |
| Open shade, clear sunlight | **12** | shade 12 | **CORRECT** |
| Sunset (at sunset / just after) | 12 / 9–11 | — | — |
| Home interiors | **5–7** (offices 7–8) | indoor 7 | **NUANCE**: 7 = bright office. Rename “bright indoor (7)” or set home-at-night preset to **5**. |
| Night street | “Night street scenes and window displays” **7–8**; “Bright street scenes” 8; “Night vehicle traffic” 5 | night street 4 | **NUANCE**: ANSI values describe brightly lit shopping streets. Label preset “dim street at night (EV 4)”. Wikipedia itself warns EV tables are “less applicable to scenes with highly atypical luminance distributions, such as city skylines at night”. |
| Milky Way galactic centre | **−11 to −9** | not in sim | add as a night-sim note: at f/1.4, ISO 6400, 6.5 s you are still ~1–3 stops under → normal for astro, lift in editing. [CALC] |

**Consistency of spec examples with these EV values** [CALC: `ISO = 100·2^(log2(N²/t) − EV100)`]:

| Spec example | Settings imply EV100 | Problem | Fix |
|---|---|---|---|
| §2 “Friend in shade: 85mm, f/2, 1/250 s, ISO 200” | 9.0 | Open shade is EV 12 → **3 stops over-exposed** | **WRONG.** Use “Friend in open shade: 85mm, f/2, 1/1000 s, ISO 100 — f/2 blurs the background, 1/1000 s freezes a smile.” (EV 12.0) — or keep 1/250 s ISO 200 but say “in deep shade under trees at dusk”. |
| Stage 1 L4 “Indoor party, 35mm f/1.4, 1/125 s, ISO 1600” | 3.9 | Fine for a dim party; but simulator “indoor = 7” would make it 3 stops too bright | **NUANCE**: write “dim party (about EV 4)”; at EV 5 (home at night) ISO 800; at EV 7 ISO 200. |
| Stage 7d “Night street, 35mm, f/1.4, 1/125 s, ISO 3200” | 2.9 | Simulator night street = 4 → 1 stop too bright | **NUANCE**: use **ISO 1600** to match EV 4, or call the scene “dark side street (EV 3)”. |
| Stage 1 L5 equivalents f/2.8 1/500 = f/4 1/250 = f/5.6 1/125 (ISO 100) | 11.9–12.0 | — | **CORRECT** (= open shade / heavy overcast). |
| Stage 7b “Market at golden hour: f/8, 1/500 s, Auto ISO” | needs EV 15 at ISO 100 | At sunset EV ≈ 12 → camera picks ≈ ISO 800 | **CORRECT**, add “Auto ISO will choose about ISO 800–1600; set Auto ISO maximum to 6400.” |
| Stage 7a “Window portrait: 85mm, f/2, 1/200 s, ISO 800” | 6.6 | plausible for a room on an overcast day | UNVERIFIABLE (no table row for window light); keep. |

### A3. Rules of thumb (§3)

| # | Spec claim | Source evidence | Verdict / suggested text |
|---|---|---|---|
| 1 | Sunny 16 “f/16, 1/ISO in bright sun” | Wikipedia: “On a sunny day set aperture to f/16 and shutter speed to the [reciprocal of the] ISO”; table: snow/sand f/22, sunny f/16, slight overcast f/11, overcast f/8, heavy overcast f/5.6, open shade/sunset f/4 — https://en.wikipedia.org/wiki/Sunny_16_rule | **CORRECT.** Add the f/11–f/4 ladder to the lesson; it makes the rule usable in Vietnam’s frequent haze/overcast. |
| 2 | Handheld 1/focal length | Photography Life: rule of thumb; “Higher resolution cameras will show more intolerance to camera shake … if you are a pixel peeper”; IBIS makes it “often too conservative” — https://photographylife.com/what-is-reciprocal-rule-in-photography . Cambridge in Colour: “one over focal length rule … just for rough guidance” — https://www.cambridgeincolour.com/tutorials/camera-lenses.htm | **NUANCE**: “Start at 1 ÷ focal length (35mm → 1/40 s, 85mm → 1/100 s). If you check photos at 100 % on a computer, use twice as fast. With IBIS on and a still subject you can often go 2–3 stops slower — test your own limit.” 24 MP needs no special rule unless pixel-peeping. |
| 3 | “IBIS fixes camera shake, not subject motion” | Photography Life: stabilization “only reduce[s] shake from your hands and do[es] nothing to eliminate blurry photos caused by subject movement” — https://photographylife.com/what-is-shutter-speed-in-photography | **CORRECT** |
| 4 | Realistic IBIS benefit (“IBIS for static scenes to ~1/8 s”, simulator 0–4 stops) | Sony: α7 II 5-axis stabilization “equivalent to using a 4.5-step faster shutter speed” (Sony product page, seen in search snippet; page itself 403) — https://www.sony.com/en-eg/electronics/interchangeable-lens-cameras/ilce-7m2-body-kit . CIPA figures are lab values; PL: IBIS “loses effectiveness at longer focal lengths”. | **NUANCE** (spec’s 1/8 s with 35mm = 2 stops [CALC 1/35 × 4 ≈ 1/9 s] is a sensible conservative teaching value). Text: “Sony rates IBIS at 4.5 stops. In real use plan on 2–3 stops: 35mm → about 1/8 s, 85mm → about 1/20 s, for still subjects.” |
| 5 | Freeze motion: walking 1/250, running child 1/1000, portrait ≥ 1/200 | Photography Life table: still people 1/125; moving people **1/200–1/800**; birds in flight 1/2000 — https://photographylife.com/what-is-shutter-speed-in-photography . Cambridge in Colour: 1/250–1/500 everyday sports/action; 1/1000–1/4000 extremely fast up-close — https://www.cambridgeincolour.com/tutorials/camera-exposure.htm . Tamron (manufacturer blog, secondary): sports 1/1000 s or faster — https://tamron-americas.com/blog/sports-photography-guide | **CORRECT** (all inside ranges). Suggested table: still person 1/125 · walking 1/250 · kids playing 1/500 · running/sports 1/1000+ · water splashes frozen 1/1000+ |
| 6 | Silky waterfall 1/2 s on tripod | CiC: “2 – 1/2 second: silky look to flowing water”; PL: “blurring water movement 1–10 seconds (tripod necessary)” | **NUANCE**: “Silky water starts around 1/2 s; 1–2 s looks smoother; 5–10 s for very smooth (tripod).” |
| 7 | Night: 1/60 s still people, 1/125 s moving | PL: “people who pose and stay relatively still 1/125”; moving 1/200+ | **NUANCE**: “1/60 s works for a person holding still on the 35mm; for candid people use 1/125 s; for walking people 1/250 s.” |
| 8 | Light trails: tripod, f/8, 10–20 s | Adobe (secondary): “longer shutter speeds, between 5 and 60 seconds … start with … five seconds or longer and an f/8 aperture”, best in blue hour — https://www.adobe.com/uk/creativecloud/photography/technique/long-exposure/light-trail.html . Canon Europe (light painting, related): ISO 100–200, f/11, 10–30 s — https://www.canon-europe.com/get-inspired/tips-and-techniques/light-painting-photography | **CORRECT** as a starting point. Add: “ISO 100, f/8–f/11. If the background is too bright, close to f/11–f/16; longer exposures = longer trails.” |
| 9 | ND naming ND64 = 6 stops, ND1000 = 10 stops (ND8 = 3) | Wikipedia ratings table: ND8 = ND 0.9 = 3 stops; ND64 = ND 1.8 = 6; ND1000/1024 = ND 3.0 = 10 — https://en.wikipedia.org/wiki/Neutral-density_filter | **CORRECT** (ND1000 is exactly 9.97 stops) |
| 10 | 1/60 s → 16 s with ND1000 | [CALC] 1/60 × 1024 = 17.1 s; × 1000 = 16.7 s; counting camera full stops 1/60→1/30→1/15→1/8→1/4→1/2→1→2→4→8→**15 s** | **NUANCE**: “1/60 s becomes about 15–17 s. Set 15 s (or 20 s) on the dial — the difference is less than 1/2 stop.” |
| 11 | Compression = distance, not focal length | CiC: “strictly speaking, perspective only changes with one’s location relative to their subject … the telephoto lens compresses … for these scenarios only [when you move to keep framing]” — https://www.cambridgeincolour.com/tutorials/camera-lenses.htm | **CORRECT** |
| 12 | 85mm working distances: H&S ~1.5 m, half ~3 m, full ~5–6 m | [CALC] frame height covered = sensor side × (s−f)/f. Vertical (portrait) frame, 36 mm tall: 1.5 m → 0.60 m; 2.5 m → 1.02 m; 3 m → 1.23 m; 5 m → 2.08 m; 6 m → 2.51 m. Horizontal frame (24 mm tall): 1.5 m → 0.40 m; 3.6 m → 1.0 m; 7.2 m → 2.0 m. | **NUANCE**: “Camera held vertically: head-and-shoulders ≈ 1.5 m, waist-up ≈ 2.5 m, full body ≈ 5 m. Held horizontally, step back about 1.5×.” (3 m vertical frames ~1.2 m = mid-thigh; 6 m leaves lots of space.) |
| 13 | “85mm gives ~4.7× the blur of the 35mm in the same setup” | [CALC] true for **same distances** (subject 2 m, background 6 m): 1.397 vs 0.297 mm. With **same framing** (35mm moved to 0.82 m, background still 4 m behind): 1.40 vs 0.92 mm → **≈1.5×**. | **NUANCE**: “From the same spot, the 85mm blurs the background about 4.7× more (but frames much tighter). Framed the same, about 1.5× more.” |
| 14 | Stage 2 L1 “DoF depends on aperture, distance, focal length” | CiC: “focal length has not been listed as influencing depth of field … If the subject occupies the same fraction of the image … total DoF is virtually constant”; “when standing in the same place … a longer focal length … will have a shallower DoF … an effect due to higher magnification” — https://www.cambridgeincolour.com/tutorials/depth-of-field.htm . [CALC] 85 f/1.8 @2 m = 57 mm; 35 f/1.4 framed the same (0.82 m) = 45 mm. | **NUANCE**: “DoF depends on aperture and on how big the subject is in the frame (closer or longer lens = bigger = shallower).” |
| 15 | Hyperfocal 35mm f/8 → focus ~5.1 m, sharp ~2.6 m–∞ | [CALC] H = 5.14 m; near = H/2 = 2.57 m | **CORRECT.** Optional tip (Wikipedia DoF, Merklinger vs Adams): focus slightly beyond H if distant detail matters most. |
| 16 | Zone focus f/8 @3 m → 1.9–7.2 m | [CALC] 1.90–7.16 m | **CORRECT** |
| 17 | Eye AF example 85 f/1.8 @2 m “only ~6 cm sharp” | [CALC] 5.7 cm | **CORRECT** |
| 18 | Coma at f/1.4; “stop to f/2 to reduce coma” | PhotoPills: “Coma is an optical aberration that distorts the stars in the corners … Coma can be reduced by stopping down the lens.” — https://www.photopills.com/articles/milky-way-photography-guide | **NUANCE**: “Wide open, corner stars may look like little comets (coma). Try f/2, then f/2.8, and compare the corners at 100 %. Each stop down halves the light, so raise ISO.” (NPF at f/2 = 7.1 s, f/2.8 = 7.9 s [CALC]). Lens brand unknown → test, don’t promise. |
| 19 | Milky Way core season (NH & tropics) | PhotoPills: NH core “visible from March to October and not visible from November to February”, begins pre-dawn late Jan/Feb, longest Jun–Jul; visible only from latitudes +55° to −90° — https://www.photopills.com/articles/milky-way-photography-guide . [CALC] max altitude of galactic centre (dec ≈ −29°): Ho Chi Minh City 10.8°N ≈ 50°, Hue 16°N ≈ 45°, Hanoi 21°N ≈ 40° (vs 21° at 40°N). Vietnam rainy season “starts in late April/early May and lasts until October” (regional differences; Central coast rains Sep–Dec) — https://en.wikipedia.org/wiki/Climate_of_Vietnam | Spec has no season text → **add**: “In Vietnam the Milky Way core is visible from about February to October and rides high in the sky. Best chances: February–April before dawn and clear nights in May–October between storms. Pick a night near the new moon.” |
| 20 | Astro ISO 3200–6400, f/1.4 | [CALC] f/1.4, 6.5 s, ISO 6400 exposes for EV100 ≈ −7.7; core is −9 to −11 → 1–3 stops under | **CORRECT** as a start; add “expect a dark-looking file; brighten in darktable”. |

### A4. Light & colour

| Item | Sources | Verdict / suggested text |
|---|---|---|
| Candle ~1900 K | Wikipedia colour-temperature scale: candle flame **1850 K** — https://en.wikipedia.org/wiki/Template:Color_temperature_scale ; CiC: candlelight 1000–2000 K — https://www.cambridgeincolour.com/tutorials/white-balance.htm | **CORRECT** |
| Tungsten ~3000 K | Wikipedia: standard incandescent 2400 K, soft white 2550 K, studio lamps 3200 K; CiC household tungsten 2500–3500 K | **NUANCE**: “home bulbs ~2700 K; camera ‘Incandescent’ preset assumes ~3200 K” |
| Sunrise/sunset | Wikipedia scale: sunrise/sunset 1850 K; Wikipedia Golden hour: ~2000 K just after sunrise/before sunset, ~3500 K during golden hour, ~5500 K midday — https://en.wikipedia.org/wiki/Golden_hour_(photography) ; CiC: 3000–4000 K (clear sky) | add: “sun at the horizon ~2000 K; golden hour ~3500 K” |
| Daylight ~5500 K | Wikipedia: daylight 5500–6500 K; vertical daylight/flash 5500–6000 K | **CORRECT** |
| Overcast | Wikipedia 6500 K; CiC moderately overcast 6500–8000 K; PhotoPills ~7000 K | add “~6500–7500 K” |
| Shade ~7500 K+ | CiC “Shade or heavily overcast sky 9000–10000 K” | **NUANCE**: “shade ~7500–10 000 K” |
| Blue sky | Wikipedia: clear blue poleward sky 15 000–27 000 K | add if needed for blue-hour lesson |
| Street lights ~3200–4000 K | FDOT (US road agency): old high-pressure sodium **2200 K**; new LED “majority … 4000K”, now mostly 3000 K, 2700 K residential — https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/roadway/training/lightingcct.pdf | **NUANCE**: “Orange sodium lamps ~2000–2200 K; white LED street lights ~3000–4000 K. Mixed streets have both — shoot RAW.” |
| WB direction | PhotoPills: “White balance … works in the opposite direction to color temperature (higher white balance settings for warmer images)” — https://www.photopills.com/articles/mastering-golden-hour-blue-hour-magic-hours-and-twilights | add as a Common mistake |
| Golden hour / blue hour duration | Wikipedia: “The term ‘hour’ is used figuratively … varies according to season and latitude … closer to the Equator … less than an hour”; blue hour “shorter in regions near the equator”, blue “most prominent when the Sun is between 4° and 8° below the horizon” — https://en.wikipedia.org/wiki/Blue_hour . PhotoPills definitions: golden hour = Sun +6° to −4°; blue hour = −4° to −6° | Spec has no duration → **add**. [CALC, geometric, no refraction] Golden (+6°→−4°): HCMC 41–45 min, Hanoi 43–48 min, London 64–87 min. Blue (−4°→−6°): Vietnam 8–10 min (−4°→−8°: 16–19 min); London 13–19 min (26–41 min). Text: “In Vietnam the golden light lasts about 40–50 minutes around sunrise and sunset (only ~25–30 of them with the sun above the horizon). Blue hour lasts 10–20 minutes. Check SunCalc.org for your date.” |
| Hard vs soft = source size relative to subject | Not separately sourced in this pass | UNVERIFIABLE here (standard optics; keep) |

### A5. Street photography — law & ethics

| Item | Source | Verdict / suggested text |
|---|---|---|
| “Ethics & law vary by country; respect children and vulnerable people; delete if asked” | Wikipedia “Photography and the law”: “Laws vary between jurisdictions, and what is not illegal in one place may be illegal in another.” — https://en.wikipedia.org/wiki/Photography_and_the_law | **CORRECT** (general). |
| Vietnam | Civil Code 2015 (Law 91/2015/QH13) **Article 32** “Rights of an individual with respect to his/her image”: “The use of an image of an individual must have his/her consent”; commercial use → remuneration; no consent needed “for national and public benefits” or “public activities, including conventions, seminars, sports activities, art shows … that do not infringe the honor, dignity or prestige”; victim may ask a court to make you “revoke, destroy or terminate the use of the image, compensate”. **Article 25(2)**: personal rights of a minor are exercised “with the consent of his/her legal representative”. Unofficial English translation — https://hoatieu.vn/phap-luat/the-civil-code-law-no-91-2015-qh13-124913 (official text: Bộ luật Dân sự 2015, Điều 32). | Suggested text: “In Vietnam, Civil Code 2015, Article 32 says you need a person’s consent to **use** their image (publish, sell). Public events are an exception if the photo does not hurt their dignity. For children, ask a parent. Obey ‘no photography’ signs. This is general information, not legal advice.” |

---

## B. Teaching approach

### B1. How respected beginner resources order topics

| Resource | Order | URL |
|---|---|---|
| Photography Life “Photography Basics” (13 chapters) | Intro → What is photography → Equipment → **Shutter speed → Aperture → ISO** → Composition → Metering → Camera modes → Focusing → Flash → Sharp pictures → Tips | https://photographylife.com/what-is-shutter-speed-in-photography (TOC) |
| Cambridge in Colour “Concepts” (basics) | Sensors → Exposure (aperture/ISO/shutter) → Metering → Depth of field → Lenses → White balance → Autofocus; then bit depth, sharpness, noise, dynamic range | https://www.cambridgeincolour.com/learn-photography-concepts.htm |
| Digital Photography School “Photography 101” | dedicates an early lesson to “Exposure and Stops” (“If you only come away … learned one thing … stops”) | https://digital-photography-school.com/photography-1014-exposure-and-stops |

**Recommended order for this app** (keeps spec stages; adds two changes):
1. Camera in hand + A mode + RAW (spec S1 L1) — PL’s author: “I find that most of the time, I would rather select my aperture and ISO manually, while allowing the camera to float the shutter speed”.
2. **Stops first**, then aperture → shutter → ISO → histogram/EC (all resources teach the doubling/halving unit early).
3. Focus & sharpness → 4. Composition → 5. Light & colour → 6. Editing → tracks.
- **Change 1 [INFERENCE from deliberate-practice criterion 3, “immediate informative feedback”]:** add a 15-minute “review loop” in Stage 1: import to darktable lighttable, view at 100 %, read EXIF. Learners cannot judge sharpness or the histogram well on the camera screen; the full editing stage can stay at Stage 5.
- **Change 2:** interleave — every later stage repeats one exposure + one focus exercise (Dunlosky: interleaved practice “moderate utility”; distributed practice “high utility”).

### B2. Common misconceptions → one-line correction

**Exposure**
| Misconception | Correction | Source |
|---|---|---|
| ISO makes the sensor more sensitive | The sensor has one sensitivity; ISO brightens what was captured | PL ISO “myths” https://photographylife.com/what-is-iso-in-photography |
| High ISO causes noise | Too little light causes noise; ISO makes it visible. Still, in-camera ISO beats brightening later | PL ISO (same page) |
| The exposure triangle has 3 equal sides | Aperture and shutter change the light captured; ISO only changes brightness | PL ISO: “ISO is not part of exposure” |
| Bigger f-number = bigger hole | f/2 is bigger than f/8 (f-number is a fraction) | CiC: “counterintuitive, because the area of the opening increases as the f-stop decreases” https://www.cambridgeincolour.com/tutorials/camera-exposure.htm |
| A good histogram is a centred hill | “There is no one ‘ideal histogram’” | CiC https://www.cambridgeincolour.com/tutorials/histograms1.htm |
| The meter knows snow is white | Meters push the average to mid-grey → use +EV for snow, −EV for dark scenes | CiC histograms (auto exposure brings average to midtones) |
| Under-exposing is always safe | Dark areas come back with noise; blown highlights “can never be recovered” | CiC histograms |
| IBIS freezes moving people | IBIS fixes your shake only | PL shutter speed |
| Real photographers shoot only in M | A mode + EC is a pro workflow | PL shutter speed (author’s own practice) |

**Focus**
| Misconception | Correction | Source |
|---|---|---|
| f/1.8 always gives a blurry background | Blur also grows with subject→background distance and subject size in frame | Wikipedia DoF blur formula |
| Telephoto lenses have less DoF | Framed the same, DoF is almost equal; the telephoto enlarges the background blur | CiC DoF https://www.cambridgeincolour.com/tutorials/depth-of-field.htm |
| DoF is ⅓ in front, ⅔ behind | Near portrait distances it is ~1:1; at hyperfocal all extra DoF is behind | Wikipedia DoF “Near:far distribution” |
| Sharp/unsharp is an on/off line | Sharpness fades gradually | CiC DoF |
| Smallest aperture = sharpest | Very small apertures soften by diffraction | CiC DoF “Other notes” |
| Focus on the face is enough | At 85mm f/1.8, 2 m only ~6 cm is sharp → nearest eye | [CALC] |
| Blurry = bad lens | Usually shutter too slow or missed focus | PL reciprocal rule; CiC exposure |
| Focus-and-recompose is safe at f/1.4 | Turning the camera moves the sharp plane off the eye | [INFERENCE: geometry] |

**Composition**
| Misconception | Correction | Source |
|---|---|---|
| Telephoto “compresses” | Distance changes perspective; the lens only crops | CiC lenses |
| Zooming = walking closer | Walking changes perspective; zoom/crop changes only framing | CiC lenses (“change of perspective was achieved by zooming out and getting closer”) |
| Rule of thirds is a rule | A guideline; symmetry and centre framing work | [teaching practice; spec S3 L2] |
| Fill the frame with everything | Simplify: one subject, clean edges | [teaching practice] |
| One frame per scene | Work the scene: many angles/distances | [teaching practice] |

**Light & colour**
| Misconception | Correction | Source |
|---|---|---|
| Sunny noon is the best light | Low sun is softer and warmer; noon gives hard contrast | Wikipedia Golden hour |
| Golden hour = 60 minutes | It depends on latitude/season; ~40–50 min in Vietnam | Wikipedia; [CALC] |
| Higher K setting makes the photo cooler | Higher WB number makes the photo **warmer** | PhotoPills light guide |
| Warm colour = high temperature | Lower Kelvin = more orange | Wikipedia Color temperature (“opposite of the cultural associations”) |
| AWB is always right | AWB is fooled by dominant colours and mixed light | CiC white balance |
| Soft light = dim light | Soft = big source relative to subject | [standard teaching; not sourced here] |

**Editing**
| Misconception | Correction | Source |
|---|---|---|
| RAW looks flat, so JPEG is better | RAW is unprocessed; it lets you set WB after shooting | CiC white balance (“set the WB *after* the photo has been taken”) |
| Editing changes my original | darktable is non-destructive (edits in XMP) | spec S5; darktable peer |
| RAW can rescue any blown sky | Fully white areas hold no detail | CiC histograms |
| Sharpening fixes missed focus / denoise fixes blur | Neither can create detail that was never captured | [INFERENCE] |
| Export Adobe RGB for the web | Web images expect sRGB | Wikipedia Color temperature: “The sRGB standard commonly used for images on the Internet” |
| More saturation = better | Judge against a before/after; edit for the story | [teaching practice] |

### B3. Analogies

**Use**
| Analogy | Teaches | Caveat |
|---|---|---|
| Rain in a bucket (CiC) | width = aperture, time = shutter; overflow = clipped highlights | CiC maps ISO to “quantity you want” — replace that part with the volume knob |
| Pupil of the eye (spec) | aperture opens in the dark | doesn’t explain inverted f-numbers → pair with fraction analogy |
| f-number as a fraction / pizza slice | f/2 = ½, f/8 = ⅛ → bigger number, smaller hole | CiC confirms the inversion confuses beginners |
| Volume knob (spec) | ISO = amplification; hiss gets louder too | say the hiss is mostly from “too little light” (PL) |
| Laser pointer (CiC lenses) | long lenses magnify hand shake | — |
| Slab of glass with soft edges | DoF plane; fades gradually | stress “soft edges” (CiC) |
| Staircase of doubles | each stop = ×2 or ÷2 light | — |

**Avoid**
| Analogy | Why | Source |
|---|---|---|
| “ISO = sensor sensitivity” / film speed | Wrong mechanism | PL ISO |
| Equal-sided exposure triangle | ISO isn’t exposure | PL ISO |
| “Telephoto compresses” | Distance does | CiC lenses |
| “Golden *hour*” literally | Duration varies | Wikipedia |
| “Warm = hot Kelvin” | Inverted | Wikipedia Color temperature |
| “Bokeh = amount of blur” | Bokeh is the *look* of out-of-focus areas | CiC DoF |
| “Hyperfocal = everything perfectly sharp” | Only “acceptably” sharp | Wikipedia Hyperfocal (“entirely dependent upon what level of sharpness is considered acceptable”) |

### B4. What makes practice assignments work

Sources: Ericsson (2020) restating the 1993 criteria — https://pmc.ncbi.nlm.nih.gov/articles/PMC8049893/ ; Dunlosky et al. 2013 — https://doi.org/10.1177/1529100612453266 (summary: https://files.eric.ed.gov/fulltext/EJ1021069.pdf); Learning Scientists — https://www.learningscientists.org/downloadable-materials

- **Deliberate-practice criteria (Ericsson):** (1) well-defined task with a clear goal; (2) learner can do it alone; (3) “immediate informative and actionable feedback”; (4) “repeatedly perform the same or similar tasks”; (5) teacher guidance. Without (5) it is “purposeful practice” — the app can still meet 1–4.
- **Dunlosky:** “Practice testing and distributed practice received high utility assessments”; interleaved practice moderate. → self-check questions, revisited in later stages; spaced repeats.
- **Learning Scientists’ six strategies:** spaced practice, retrieval practice, elaboration, interleaving, concrete examples, dual coding → matches spec’s “Picture it + Illustration + Example”.

**Assignment template (checkable):**
1. One goal, one variable: “Same subject, same light; change only aperture f/1.4 → f/16.” (controlled comparison)
2. Constraint: one lens, one place, one theme, fixed time (e.g. 20 minutes).
3. Success criterion you can see: “nearest eye sharp at 100 %”, “no highlight clipping on the face”.
4. Compare & reflect: side-by-side in darktable compare view; write one line per frame: setting → result → why.
5. Repeat: redo the weakest frame the next day (spacing).
6. Outside feedback in Stage 8 (closest substitute for criterion 5).

---

## C. Plain-language standard for lesson text

### C1. Sources (primary)
- GOV.UK “Use clear language”: “Paragraphs should have no more than 5 sentences each. Try to split up sentences that are over 25 words long”; active voice; explain specialist terms “the first time you use them”; avoid negative contractions; suggests the Hemingway app — https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/
- GOV.UK “Create a clear structure”: frontload; headings “descriptive … frontloaded … active”; headings should not “be questions”; users “only read 20 to 28% of text” and read in an F-pattern — https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/
- GOV.UK A to Z: numerals for 2 and above; “Use ‘one’ unless … a step”; bold only for interface elements (“Select **Start**”), “Do not use bold … to emphasise text”; explain abbreviations on first use — https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
- GOV.UK reading age 9: earlier “Writing for GOV.UK” page (“By age 9, you’re building up your ‘common words’ vocabulary”) — http://www.gov.uk/guidance/content-design/writing-for-gov-uk (now redirects; text seen in search snippet; Wayback returned HTTP 429). Current pages keep the plain-English rule but no longer state “age 9”.
- plainlanguage.gov (archived on GitHub; now digital.gov): one idea per sentence; paragraphs “no more than 150 words in three to eight sentences … never longer than 250”; question headings are the most useful type; use the same term consistently; define unavoidable technical terms — https://github.com/GSA/plainlanguage.gov/tree/main/_pages/guidelines ; https://digital.gov/guides/plain-language/writing
- NN/g: 79 % scan; use highlighted keywords, meaningful sub-headings, bulleted lists, one idea per paragraph, inverted pyramid, half the word count (concise +58 %, scannable +47 %, combined +124 % usability) — https://www.nngroup.com/articles/how-users-read-on-the-web/ ; “Aim at an 8th-grade reading level if targeting a broad consumer audience”; Flesch-Kincaid in Word; Cloze test for comprehension — https://www.nngroup.com/articles/legibility-readability-comprehension/
- Flesch formulas and bands: FRE 60–70 “Plain English … 13- to 15-year-olds”; 70–80 “fairly easy” (7th grade) — https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests

**Conflicts resolved for this app**
- Question headings (plainlanguage.gov yes / GOV.UK no) → lesson headings = short statements (“Aperture controls light and blur”); self-check items = questions.
- Bold (NN/g highlight keywords / GOV.UK UI-only) → **bold only for camera/software labels** (**MENU**, **Focus Mode**, **Export**) so “where to click” stands out; mark new terms with `<dfn>` (italic) at first use instead of bold.

### C2. Checklist (every lesson section)

| # | Check | Target |
|---|---|---|
| 1 | Flesch Reading Ease | **≥ 60** per section (aim 65–75); technical boxes ≥ 50 |
| 2 | Flesch-Kincaid grade | **≤ 8** (≤ 7 if English is the learner’s second language — GOV.UK notes such users) |
| 3 | Average sentence length | **≤ 15 words**; no sentence > **25 words** [derivation: with technical vocabulary ≈1.5 syllables/word, FRE ≥ 65 needs ≤ 14.7 words/sentence — CALC from Flesch formula] |
| 4 | Paragraph | 1 idea, **≤ 3 sentences, ≤ 60 words** on screen (stricter than GOV.UK 5 sentences, per NN/g “half the word count”) |
| 5 | Front-load | First sentence of every section answers “what do I do / what is it?” |
| 6 | Voice | Active, present tense, “you” (GOV.UK “Addressing the user”) |
| 7 | Jargon | Define at first use in ≤ 12 words + add to Key terms box; one term per concept (e.g. always “shutter speed”, never also “exposure time”) |
| 8 | Abbreviations | Spell out first time: “in-body image stabilization (IBIS)”, “depth of field (DoF)” |
| 9 | Numbers | Numerals for 2+; always with unit; camera notation consistent: `f/2.8`, `1/250 s`, `ISO 400`, `85mm` (lens), `2 m`, `5500 K`, `+1 EV` |
| 10 | Lists | Use a list when there are ≥ 3 parallel items or steps; numbered for steps |
| 11 | UI wording | Exact labels copied from the Sony Help Guide / darktable / GIMP manuals, in bold, path joined with ›: **MENU › [tab] › [item]** (fill from the peer research files; do not paraphrase labels) |
| 12 | Avoid | negative contractions (“don’t” → “do not”), “-tion/-ment” noun chains, “simply/just/obviously”, hype words |
| 13 | Check | Run each section through Hemingway Editor (https://hemingwayapp.com/) or Word readability stats; once per stage, run a Cloze test on one key paragraph — pass = “60% or more right on average” (https://www.nngroup.com/articles/cloze-test-reading-comprehension/) |

Tooling note: the spec allows no extra runtime dependencies. If an automated check is wanted, a ~30-line Flesch function in `tests/` (word/sentence/syllable heuristics) is enough; scores will differ ±5 from Hemingway/Word because syllable counting is heuristic.

### C3. Before / after (scores from my heuristic Flesch script; tools will differ slightly)

**1. Aperture**
- Before (FRE 22, grade 21.6, 46-word sentence): “The aperture is an adjustable diaphragm within the lens whose diameter, expressed as an f-number representing the ratio of the focal length to the entrance pupil diameter, determines both the quantity of light reaching the sensor and the depth of field of the resulting image.”
- After (FRE 96, grade 2.2, avg 9 words): “The aperture is a hole inside your lens. You set its size with the f-number. A small number, like f/1.8, means a big hole. A big hole lets in more light and blurs the background. A big number, like f/8, means a small hole. You get less light, but more of the scene is sharp.”

**2. Camera shake**
- Before (FRE 22, grade 21.8): “Camera shake induced blur may be mitigated by the selection of a shutter speed that is at least equivalent to the reciprocal of the focal length, and although in-body image stabilization systems can extend this limit, it should be noted that subject motion is not compensated.”
- After (FRE 88, grade 3.0): “Shaky hands blur photos. A safe start is a shutter speed of 1 divided by the focal length. With the 85mm lens, use 1/100 s or faster. Your camera’s stabilizer (IBIS) can let you go slower. It cancels your shake. It does not stop a person who moves.”

**3. White balance**
- Before (FRE 7, grade 21.5): “Since the colour temperature of illumination varies considerably, with tungsten sources being significantly lower in kelvin than overcast daylight, the white balance setting must be adjusted so that neutral tones are rendered without an undesirable colour cast.”
- After (FRE 95, grade 2.0): “Light has a colour. Lamps at home look orange. Shade on a sunny day looks blue. White balance tells the camera what light you are in, so white things look white. Shoot RAW and you can fix it later in darktable.”

What changed each time: one idea per sentence; active voice + “you”; jargon replaced or defined (“stabilizer (IBIS)”); concrete numbers with units on the learner’s own lens; consequence stated last and briefly.
