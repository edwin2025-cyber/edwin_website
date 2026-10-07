# Theme

> **File locations changed:** files now live in folders. `styles.css`, `notes.js`, `notes.json` and `links.js` are in `shared/`, the theme toggle is `shared/theme.js` (was `script.js`), Alabama is in `state/alabama/`, the pink sample is `samples/pink-notes/` and the selection demo is `samples/selection-colors/`. See DESIGN-DECISIONS.md for the full structure. File names in the text below are shown without folders.

Colors for the light and dark themes, and the rules used to derive the dark ones.

## Core colors

| Token | Light | Dark |
|---|---|---|
| Background (`--bg`) | `#ffffff` | `#0a0a0a` |
| Text (`--text`) | `#000000` | `#ffffff` |
| Muted gray (`--text-muted`) | `#6b5f65` | `#a3a3a3` |

The muted gray is used for secondary text, for example the intro line on the sample page: *"Hover a pink term to see its note, then hover a glossary entry at the bottom to see the term light up. Every note is stored in notes.json, not in this file."*

## Supporting colors

| Token | Light | Dark | Role |
|---|---|---|---|
| Surface (`--surface`) | `#ffffff` | `#141414` | Header, corner box background |
| Border (`--border`) | `#eadde3` | `#2a2a2a` | Dividers, buttons |
| Text on solid accent (`--on-pink`) | `#ffffff` | `#0a0a0a` | The "01" chip in the sample's corner box |

## Text selection

The selection color is the **opposite of the theme**: it uses the other theme's background and text.

| Token | Light theme | Dark theme |
|---|---|---|
| Selected text (`--sel-text`) | `#ffffff` | `#000000` |
| Selection highlight (`--sel-bg`) | `#0a0a0a` | `#ffffff` |

```css
::selection {
    background: var(--sel-bg);
    color: var(--sel-text);
}
```

Applied in `styles.css` (MITES and Alabama pages) and `sample.css`. This was option M on `highlight.html`, which also holds the other eleven options if you want to revisit it. Contrast is 19:1 or better in both themes. Browsers only allow color, background and text-decoration inside `::selection`.

## Links

**Article links** (`class="link"`): the text is the normal text color with a 1px underline in the page accent. On hover the text turns the accent, like the `01` superscripts. Visited links look the same as unvisited ones, so returning to the site never shows a color change.

**Address rectangle:** hovering a link to another site shows a square rectangle that follows the pointer with the short address (for example `rocketcenter.com`). Its colors are the opposite of the theme:

| | Light theme | Dark theme |
|---|---|---|
| Rectangle (`--sel-bg`) | `#0a0a0a` | `#ffffff` |
| Its text (`--sel-text`) | `#ffffff` | `#000000` |

Override the text with `data-tip="..."` on the link. Keyboard focus also shows it.

**Footer links** (`class="footer-link"`): on hover the link fades to 55% opacity and its arrow slides. Same tab gets a right arrow that moves right. A new tab (`target="_blank"`) gets a northeast arrow that moves up and right, plus the address rectangle. Links with `data-placeholder` go nowhere.

## Focus ring (Alabama page)

A single 2px ring, 3px off the element, in a variation of the page blue. It is darker on the light theme and lighter on the dark theme, so it contrasts with both the page and the button.

| | Light theme | Dark theme |
|---|---|---|
| Button border and text (`--c-spot`) | `#1f6fd1` | `#5ea1f2` |
| Button text when filled on hover (`--on-accent`) | `#ffffff` | `#0a0a0a` |
| Focus ring (`--focus`) | `#0a3a7a` | `#b5d4fb` |

Other pages fall back to the text color (`outline: 2px solid var(--focus, var(--text))`) until they define their own `--focus`. Buttons are the accent outline style: a rectangle with no radius, a 2px accent border and accent text. Hover fills with the accent, and pressed darkens the fill 20% toward the text color.

## Accent colors (annotations)

Each page has its own accent. All use the same recipe for dark mode.

| Page | Variable | Light | Dark |
|---|---|---|---|
| `sample.html` (pink) | `--pink` | `#e0457b` | `#f25f92` |
| `index.html` (MITES, red) | `--c-spot` | `#d93640` | `#f25f66` |
| `alabama.html` (blue) | `--c-spot` | `#1f6fd1` | `#5ea1f2` |

### Annotation tint strength

The highlight block is the accent mixed with transparent. It is stronger in dark mode because a tint looks weaker over near-black.

| Token | Light | Dark |
|---|---|---|
| `--tint` (resting) | 14% | 20% |
| `--tint-strong` (hover / linked) | 32% | 38% |

```css
background: color-mix(in srgb, var(--pink) var(--tint), transparent);
```

## How to derive a dark-theme color

1. **Keep the hue.** Don't change the color's identity. Pink stays about 339 degrees, red about 357, blue about 213.
2. **Raise lightness, raise saturation a little.** The recipe used here is saturation about 85% and lightness about 66%. Light-mode accents sit around 47-58% lightness and 71-74% saturation.
3. **Check contrast against the background.** Aim for at least 4.5:1 for text and 3:1 for UI elements. All three dark accents are about 6.3-7:1 on `#0a0a0a`.
4. **Strengthen tints.** Transparent color over black looks fainter, so use roughly +6 percentage points.
5. **Flip text-on-accent when needed.** White on the light pink is about 4:1, but white on the dark pink is only about 3:1. Dark text (`#0a0a0a`) on the dark pink is 6.4:1.
6. **Surfaces step up, not down.** In dark mode, raised surfaces (cards, popups) are slightly lighter than the page: `#141414` over `#0a0a0a`.
7. **Use neutral grays for muted text and borders** when the background is a pure neutral. Aim for about 7:1 for muted text.
8. **Test by eye.** If an accent glows too much on black, drop its lightness to about 62% or its saturation to about 78%.

## Where these live in the code

| File | What it holds |
|---|---|
| `sample.css` | Tokens for the pink sample page (`:root` and `:root[data-theme='dark']`) |
| `styles.css` | Shared tokens for `index.html` and `alabama.html`, including `--c-spot`, `--tint`, `--tint-strong` |
| `alabama.css` | Blue override of `--c-spot` for light and dark |

## Known notes

- The light-mode muted gray is `#6b5f65` everywhere now (contrast about 6:1 on white).
- In dark mode, "darker on hover" becomes "more intense". A stronger tint over black is lighter, not darker.
