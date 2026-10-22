# GIMP 3.2 fact check (for spec §3 Stage 6 items 8–11, §11)

The official manual exists for 3.2: `https://docs.gimp.org/3.2/en/`. Any URL in this file starting with `.../3.2/en/` was read for this check. Text marked [INFERENCE] was not confirmed in a primary source.

## Verification table

| # | Item | Verified value / exact UI wording | Source | Spec status |
|---|---|---|---|---|
| 0 | Current version | "The current stable release of GIMP is 3.2.6 (2026-09-10)". GIMP 3.2.0 announced 2026-03-14 | https://www.gimp.org/downloads/ ; https://www.gimp.org/news/2026/03/14/gimp-3-2-released/ | CORRECT |
| 1 | Heal tool | **Tools → Paint tools → Heal**. Shortcut **H**. Hold **Ctrl** and click to set the source. Hold **Shift** to heal along a straight line. Tool Options include "Hard edge", "Sample merged" and "Alignment" (works as in the Clone tool) | https://docs.gimp.org/3.2/en/gimp-tool-heal.html | CORRECT (the spec only says "Heal & clone") |
| 1b | Clone tool | **Tools → Paint Tools → Clone**. Shortcut **C**. **Ctrl+click** sets the source. Alignment modes: **None**, **Aligned**, **Registered**, **Fixed**. With "Aligned" the offset stays the same across strokes. Ctrl+click again to change it | https://docs.gimp.org/3.2/en/gimp-tool-clone.html | CORRECT |
| 1c | Heal vs Clone | The manual says healing takes the surrounding pixels at the edges into account, so "colors are much less transferred". Use Heal for skin and dust. Use Clone for hard structures and edges | gimp-tool-heal.html §3.13.4 | add to content |
| 2 | Wavelet decompose | Still present in 3.2: **Filters → Enhance → Wavelet decompose** (no hyphen in the menu wording). Options: **Scales** (default 5), "Create a layer group to store the decomposition", "Add a layer mask to each scale layer". It creates "scale" layers (finest detail in scale 1) in **Grain merge** mode plus a bottom "**residual**" layer. Integer-precision images get *legacy* grain merge. Painting a scale with 50% gray erases detail. The manual itself recommends it for skin smoothing | https://docs.gimp.org/3.2/en/plug-in-wavelet-decompose.html | CORRECT, but change "Wavelet-decompose" → "Wavelet decompose" |
| 2b | A "better" built-in frequency separation? | None found. The 3.2 release notes add no frequency-separation or skin tool. Wavelet decompose is the built-in method the manual documents. A manual two-layer method (Gaussian blur + Grain extract/merge) is possible but has more steps | https://www.gimp.org/release-notes/gimp-3.2.html | Keep Wavelet decompose |
| 3 | Dodge/Burn tool | **Tools → Paint Tools → Dodge / Burn**. Shortcut **Shift+D**. **Ctrl** temporarily switches between dodge and burn. Options: **Type** (Dodge/Burn), **Range** = *Shadows / Midtones / Highlights*, **Exposure** (0–100, default 50) | https://docs.gimp.org/3.2/en/gimp-tool-dodge-burn.html | CORRECT |
| 3b | 50% gray layer modes | Layer mode names in 3.2: **Overlay**, **Soft light** (lower-case "l"), Hard light, Linear light (all in the **Contrast** group). **Grain extract** and **Grain merge** are in the **Inversion** group. Set the mode in the "**Mode** drop-down menu at the top of the Layers Dialog" | https://docs.gimp.org/3.2/en/layer-mode-group-contrast.html ; .../layer-mode-group-inversion.html ; .../gimp-concepts-layer-modes.html | CORRECT; give the exact names "Overlay" / "Soft light" |
| 4 | Non-destructive filters (3.0+) | The manual calls them "**Layer Effects**". An **fx** icon appears next to the layer name in the Layers dialog. "Most GEGL filters can be layer effects… No other types of filters or plug-ins can be". The filter dialog has a "**Merge Filter**" checkbox: checked = applied destructively. Click **fx** to open the Layer Effects dialog with **Edit Layer Effects**, **Remove Layer Effects**, Up/Down, visibility and **Merge Down** (merges all effects). After a merge, Edit → "Undo Rasterize filters" restores them. Effects are saved in XCF. Filters that need an auxiliary image (e.g. a bump map) always merge | https://docs.gimp.org/3.0/en/gimp-using-layer-effects.html ; https://www.gimp.org/release-notes/gimp-3.0.html | CORRECT |
| 4b | 3.2 NDE changes | Filters can now be applied non-destructively to **channels**. An empty layer group set to **Pass through** works like an adjustment layer for all layers below it. On text, link and vector layers you must use **Layer → Rasterize** before merging filters ("Revert Rasterize" exists). New GEGL **Vibrance** filter (protects skin from oversaturation). Press **/** to search for filters | https://www.gimp.org/release-notes/gimp-3.2.html | add to content |
| 5 | Layer mask | **Layer → Mask → Add Layer Masks…** (or right-click the layer in the Layers dialog, or use the button at the bottom of the dialog). "Initialize Layer Mask to": **White (full opacity)**, **Black (full transparency)**, plus other options in the dialog (Layer's alpha channel, Selection, Grayscale copy of layer, Channel — listed from GIMP 2.10/3.0 [INFERENCE], not re-read for 3.2). 3.2 adds an "**Edit Mask Immediately**" checkbox | https://docs.gimp.org/3.2/en/gimp-layer-mask-add.html ; 3.2 release notes | CORRECT |
| 6 | Precision menu | **WRONG name if the spec says "Image > Precision".** In 3.x it is **Image → Encoding**. Choices: 8-bit integer, 16-bit integer, 32-bit integer, 16-bit floating point, 32-bit floating point; channel encoding **Linear light** / **Non-linear**. All internal processing is 32-bit float. A 16-bit TIFF opens as 16-bit integer, so leave it unchanged. Converting down to 8-bit opens a dithering dialog | https://docs.gimp.org/3.2/en/gimp-image-encoding.html | Spec doesn't name the menu. Use "Image → Encoding" |
| 6b | Colour profile on open | Edit → Preferences → Color Management → Policies → "**File Open Behavior**", default "**Ask what to do**". Options: "Keep embedded profile" / "Convert to built-in sRGB or grayscale profile" / "Convert to preferred RGB…". Beginner tip: choose **Keep** (the TIFF's embedded profile) | https://docs.gimp.org/3.2/en/gimp-prefs-color-management.html | add to content |
| 6c | darktable → GIMP integration | Not a built-in darktable command. Options: (a) the darktable Lua script **gimp.lua** adds the export target "**Edit with GIMP**". It is enabled via the *script manager*. You save in GIMP with **File → Overwrite…** and the result is re-imported and grouped with the original. (b) The generic **ext_editor.lua**. (c) The reverse direction is built in: GIMP opens RAW files through darktable (darktable must be on the PATH). GIMP runs `darktable --gimp file <path>`, darktable opens in darkroom-only mode, and on close it hands an **EXR** temp file to GIMP. Edits made in that session are **not** saved to darktable's database. To choose the loader: Edit → Preferences → **Image Import & Export** → "**Raw Image Importer**". 3.2 also adds ART as a RAW loader | https://docs.darktable.org/lua/stable/lua.scripts.manual/scripts/contrib/gimp/ ; https://docs.darktable.org/usermanual/5.6/en/special-topics/program-invocation/gimp-integration/ ; https://docs.gimp.org/3.2/en/gimp-prefs-import-export.html ; 3.2 release notes | Spec's "export 16-bit TIFF" is CORRECT and is the simplest beginner route. Mention the Lua script as optional |
| 7 | Save vs Export | **Save** writes **.xcf** only ("saving can only be done in this format"). **File → Export As…** = **Shift+Ctrl+E** to choose a format. **File → Export…/Overwrite…**: for an XCF it is named "Export" (re-exports to the last target); for an imported file it is named "**Overwrite *filename.ext***" and writes the original format with no dialog. Shortcuts Ctrl+S (Save) and Ctrl+E (Export/Overwrite) are [INFERENCE]: standard defaults, not shown on these doc pages | https://docs.gimp.org/3.2/en/gimp-file-export.html ; .../gimp-file-export-as.html ; https://docs.gimp.org/3.0/en/gimp-images-out.html | CORRECT |
| 7b | JPEG dialog | "Export Image as JPEG", **Quality** 0–100. The manual says "default quality of 85" and "values above 95, or even 90, are rarely useful". There is a "Show Preview in image window" checkbox. Warning: **Overwrite** on the TIFF would overwrite the TIFF, so beginners should use Export As → name.jpg | https://docs.gimp.org/3.2/en/file-jpeg-export.html | add to content (recommend 90) |
| 8 | Content-aware remove | **No built-in content-aware fill** in 3.2 (none in the release notes or manual). The third-party **Resynthesizer** (bootchk) provides **Heal selection**. Resynthesizer 3.0.1 "is compatible with GIMP 3.0 or later". The README says "An MS Windows build is not tested" (secondary/GitHub source). For a Windows beginner, teach Heal/Clone and treat Resynthesizer as optional | https://github.com/bootchk/resynthesizer | UNVERIFIABLE that it works on Windows. Don't promise it |
| 9 | 3.2 features useful for photos | Link layers (an external file embedded live). Vibrance filter. NDE on channels and pass-through groups (adjustment-layer workflow). Import of Photoshop .acv/.alv presets into Curves/Levels. **Shift+X** switches to the previous tool. "Edit Mask Immediately". Better TIFF metadata support | https://www.gimp.org/release-notes/gimp-3.2.html | optional extras |
| 10 | Panorama | GIMP has no stitching tool (none in the 3.2 manual menus or release notes; this is an absence check). darktable has no stitching module in its 5.6 module reference. It has a contrib Lua script "hugin" that only hands images to Hugin. **Hugin** current stable is **2025.0.1 (released 2025-12-13)**. 2026.0.beta1 exists but is a beta | https://hugin.sourceforge.io/ (via search snippet; site returned 403 to a direct fetch) ; https://hugin.sourceforge.io/releases/ ; https://docs.darktable.org/lua/stable/lua.scripts.manual/ | CORRECT ("Hugin, optional") |

## Beginner-safe step lists

### A. darktable → GIMP round trip (recommended route)
1. In darktable lighttable, open the **export** module. Set format **TIFF**, bit depth **16 bit**, profile sRGB (or Adobe RGB if you know why), and size 0×0 (full size). Click **export**.
2. In GIMP: **File → Open…** and pick the .tif.
3. If GIMP asks about the colour profile, choose **Keep** (keep the embedded profile).
4. Check the image is high bit depth: **Image → Encoding** should show **16-bit integer**. Leave it as it is.
5. Duplicate the layer (Layer → Duplicate Layer) and retouch the copy. The original stays untouched underneath.
6. **File → Save** (Ctrl+S) keeps an editable .xcf with layers.
7. Use **File → Export As…** (Shift+Ctrl+E) and name the file `name.jpg` (or `name-edit.tif`). For JPEG set **Quality 90** and click **Export**. Don't use "Overwrite" unless you mean to replace the TIFF.
8. Optional: import the JPEG/TIFF back into darktable to keep it in your library.

### B. Blemish removal (Heal)
1. Duplicate the layer.
2. Press **H** (Heal). Set a soft brush slightly larger than the spot and Hardness low.
3. **Ctrl+click** clean skin next to the spot, at the same brightness and texture.
4. Click once on the spot. Re-sample (Ctrl+click) often and work at 100% zoom.
5. If the result smears, Undo (Ctrl+Z) and try again with a smaller brush or a closer source.
6. Toggle the layer's eye icon to compare before and after.

### C. Sensor dust removal
1. Find dust: it is most visible in plain sky at f/8–f/16. Zoom to 100% and pan systematically.
2. Duplicate the layer and press **H**.
3. For each dark soft dot: **Ctrl+click** nearby clean sky, then click the dot once.
4. Where the dust sits on an edge (horizon, roofline), use **Clone (C)** with Alignment **Aligned** so the line continues correctly.
5. Tip: fix dust on one frame. The same spots appear on every frame shot in that session.

### D. Frequency-separation skin retouch (Wavelet decompose)
1. Finish blemishes first (B). Then **Layer → New from Visible** (or duplicate the layer) to get one clean layer.
2. **Filters → Enhance → Wavelet decompose**: Scales **5**, tick "Create a layer group", and click OK.
3. You get scale layers (scale 1 = finest pores) plus a **residual** layer. Hide and show each scale to see what it holds.
4. Leave scales 1–2 alone. They contain the skin texture you want to keep.
5. On a middle scale (often 3–4, which holds blotches and uneven tone), select the scale layer. Use **Heal** or a soft Paintbrush at low opacity (10–20%) with neutral gray, or apply Gaussian blur inside a selection of the skin only. Avoid eyes, lips, brows and hair.
6. Lower the group's opacity if the effect looks too strong. Real skin keeps pores.
7. Compare with the group visible and hidden, then Save .xcf.

### E. Dodge & burn (two options)
- **Option 1 (non-destructive, recommended)**
  1. **Layer → New Layer…**, Fill with a 50% gray foreground colour (R=G=B=50%).
  2. In the Layers dialog **Mode** drop-down, choose **Soft light** (gentle) or **Overlay** (stronger). The gray disappears.
  3. Paintbrush (P) with a soft brush at opacity 5–15%. Paint **white to lighten (dodge)** and **black to darken (burn)**.
  4. Build up slowly. Adjust the layer opacity at the end, and erase mistakes by painting 50% gray.
- **Option 2 (tool)**
  - **Shift+D** Dodge / Burn on a duplicate layer. Range **Midtones**, Exposure about **10–20**. Hold **Ctrl** to switch between dodge and burn.
  - This option is destructive, so always work on a copy.

## Suggested spec text fixes
- Item 10: "frequency separation via **Wavelet decompose** (Filters → Enhance → Wavelet decompose)". Add the layer mode names "**Soft light** / **Overlay**".
- Item 8: add "check **Image → Encoding** = 16-bit integer; keep the embedded colour profile". Optional: the darktable Lua script "Edit with GIMP".
- Item 11: call non-destructive filters "**layer effects (fx icon)**" and the merge option "**Merge Filter**".
- §11: the Wavelet decompose path is verified, and so are Heal **H**, Clone **C**, Dodge/Burn **Shift+D**.
