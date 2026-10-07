# Design decisions and how to implement them

A running log of the small details decided for this site, with the steps to reproduce each on a new page. Add to it every time something is decided.

Related guides: [THEME.md](THEME.md) has every color value. [ANNOTATIONS.md](ANNOTATIONS.md) has the longer annotation walkthrough.

## Project structure

```
index.html                       MITES page (site entry)
mites/mites.js                   MITES-only script (demo form)
shared/                          used by every page
    styles.css                   tokens, typography, annotations, glossary, links, footer, forms, button
    theme.js                     dark/light toggle, browser toolbar color, light theme while printing
    notes.js + notes.json        annotations and glossary
    links.js                     address rectangle, footer arrows, placeholder links
    video.js                     pause/play button for videos
state/
    alabama/                     alabama.html, alabama.css, images/
samples/
    pink-notes/                  sample.html, sample.css (standalone pink version)
    selection-colors/            highlight.html, .css, .js (twelve selection colors plus the chosen one)
    lilac-content/               content.html, .css, .js (blockquotes, lists, code, tables)
    buttons/                     buttons.html, .css, .js (twelve button variations)
    media/                       media.html, .css (photos and video), video/ (CC0 sample clips)
docs/                            this file, THEME.md, ANNOTATIONS.md
fonts/                           Satoshi
```

Rules for the structure:
- A page lives in its own folder, with its own CSS and JS only if it needs them.
- Anything used by more than one page goes in `shared/`.
- Pages reach shared files with a relative path (`../../shared/styles.css` from two folders deep). `notes.js` finds `notes.json` next to itself, so it works from any folder.
- Fonts load from `fonts/` with a path relative to the CSS file that declares them (`../fonts/` from `shared/styles.css`).
- New states or programs follow the same pattern, for example `state/georgia/georgia.html`.

**Serving:** `notes.js` uses `fetch()`, which does not work from `file://`. Open the project root with VS Code Live Server or run `npx serve`, then browse to the page, for example `/state/alabama/alabama.html`.

## Decision log

| # | Area | Decision |
|---|---|---|
| 1 | Light theme | Background `#ffffff`, text `#000000` |
| 2 | Dark theme | Background `#0a0a0a`, text `#ffffff` |
| 3 | Muted gray | `#6b5f65` light, `#a3a3a3` dark |
| 4 | Body text | Satoshi, weight 450 |
| 5 | Annotation highlight | Flat tinted block: 14% accent, 32% on hover (dark: 20% / 38%) |
| 6 | Corner card | Square, 2px border, hard offset shadow, slight tilt, slides in |
| 7 | Two-way hover | Term and glossary entry light up together |
| 8 | Notes storage | `notes.json`, referenced by `data-key` |
| 9 | Small screens | 640px and narrower: tap opens an inline `[text]` note, tint stays light |
| 10 | Text selection | Opposite of the theme: white on `#0a0a0a` (light), black on white (dark) |
| 11 | Article links | Underline in the page accent, text turns accent on hover, no visited color |
| 12 | Address rectangle | Square, opposite-of-theme colors, follows the pointer, sits just above-right of it (`OFFSET_X = 2`, `OFFSET_Y = 1`, almost touching) |
| 13 | Footer links | Weight 600. No arrow at rest. On hover the text fades to 55% and an accent-colored arrow (0.7em, 0.25em gap) glides out from the end of the word, left to right, in about 0.45s. Right arrow for the same tab, northeast arrow plus the address rectangle for a new tab |
| 13b | Link weights | Article links 520 (a tiny bit heavier than the 450 body), footer links 600 |
| 14 | Button | **Accent outline** (variation C, the article color): square, 2px accent border, accent text, fills with the accent on hover. Used for every button, including the theme toggle, code copy button and demo buttons |
| 15 | Focus ring | One 2px ring, 3px offset, a variation of the accent (darker on light, lighter on dark). Defined per page with `--focus` |
| 16 | Accents | MITES red `#d93640`, Alabama blue `#1f6fd1`, sample pink `#e0457b`, lilac `#894dcb` (dark versions in THEME.md) |
| 17 | Headings and body | From the Alabama page, now site-wide: title 800 / line-height 1.05 / -0.02em, section heading 700 / 1.25, article text at line-height 1.6, 68ch column. Sizes are fluid (see 27) |
| 18 | Form controls | `accent-color`, `caret-color` and the scrollbar follow the page accent. Scrollbars are thin. The page scrollbar uses the theme colors (thumb is the text color mixed 85% with the background), while scroll boxes inside the article, like the form's text box, use the accent mixed 75% with the background |
| 19 | Mobile tap flash | Recolored to a 20% tint of the accent instead of the default gray (set it to `transparent` to remove it) |
| 20 | Content styles (sample) | Lilac accent. Blockquote: 4px accent bar and a wash fill, plus quiet and pull-quote variants. Lists: square bullets, accent numerals like the glossary, checklist, definition list. Code: inline chip, labeled block with copy button, kbd keys. Tables: 2px header rule, hover wash, sortable headings, scrolling wrapper. Not yet in `shared/styles.css` |
| 21 | Folder structure | Pages in their own folders, shared code in `shared/`, docs in `docs/` (see Project structure) |
| 22 | Border radius | Square everywhere. `--radius: 0` |
| 23 | Button border and shadow | Tried a 2px border and hard offset shadow, then replaced it with the accent outline (14). No button has a shadow now |
| 24 | Spacing scale | 4px base: `--space-1` to `--space-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96px |
| 25 | Widths | Site `--container` 1100px, article `--measure` 68ch, side padding `--gutter` fluid from 16px (phone) to 32px (desktop) |
| 26 | Breakpoints | Phone up to 640px, tablet 641 to 1023px, desktop 1024px and up. CSS media queries and `notes.js` both use 640 |
| 27 | Fluid type | Sizes shrink on phones: title 30 to 64px, section heading 20 to 24px, body 16 to 17.6px, small 14 to 15.2px (`--fs-*` tokens) |
| 28 | Touch | On touch screens buttons and footer links are at least 44px tall. Header is 56px on phones, 64px from 641px up |
| 29 | Blockquotes, lists, code, tables | Kept as shown on the lilac content page. Which variation to use depends on the content, decided per article |
| 30 | Default theme | Follows the system setting until the visitor picks one with the toggle. Their choice is remembered |
| 31 | Motion | Keep the current short transitions and the reduce-motion handling. No page-level animation |
| 32 | Photos | Square, no border, no hover effect. Caption below in the muted gray |
| 33 | Video | Autoplays muted and looping, with a square pause/play button flush in the bottom-right corner. Button colors are the opposite of the theme (like text selection), accent on hover, focus ring drawn inside. With reduce-motion on, the video starts paused |
| 34 | Buttons | Two styles used together: `.btn` is the accent outline in the article color (variation C), and `.btn--solid` is a flat fill in the website theme colors, black on light and white on dark (variation B in theme colors). One accent outline and one solid per group; swap which is primary per section as needed |
| 35 | Browser toolbar color | `theme-color` meta matches the page background: `#ffffff` light, `#0a0a0a` dark. Updates when the visitor toggles the theme |
| 36 | Print | Always prints light, whatever the screen theme. Header, buttons and corner cards are hidden, notes print as the glossary at the end, external link addresses print after the link text |

## How to implement each

### New page checklist

1. Add the early theme script in `<head>` (copy from any page).
2. Link `shared/styles.css`, then a page CSS file if needed.
3. Add `shared/theme.js`, then `shared/notes.js` and `shared/links.js` as needed, all with `defer`.
4. Set the page accent in its CSS:

```css
:root                    { --c-spot: #1f6fd1; --focus: #0a3a7a; }
:root[data-theme='dark'] { --c-spot: #5ea1f2; --focus: #b5d4fb; }
```

### Tokens in `shared/styles.css`

| Group | Tokens |
|---|---|
| Color | `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--c-spot` (accent), `--on-accent`, `--sel-bg`, `--sel-text`, `--tint`, `--tint-strong`, `--wash` |
| Layout | `--container`, `--measure`, `--gutter`, `--header-h`, `--radius` |
| Spacing | `--space-1` to `--space-9` |
| Type | `--fs-title`, `--fs-h2`, `--fs-body`, `--fs-small` |

Use the spacing and type tokens instead of one-off values. Older components still use their own rem values, so moving them onto the scale is a later cleanup.

### Annotations with a glossary

```html
<span class="note" data-key="cheaha">Cheaha Mountain</span>
...
<section class="glossary" aria-labelledby="glossary-title">
    <h2 id="glossary-title" class="glossary__title">Glossary</h2>
    <ul class="glossary__list"></ul>
</section>
```

Add the text to `notes.json`:

```json
{ "cheaha": { "note": "Alabama's highest point at 2,413 feet." } }
```

The script numbers terms in order, builds the superscript, the corner card, the glossary entry with an up-arrow back to the term, and the two-way hover. The same key can be reused anywhere on the page.

### Article link with the address rectangle

```html
<a class="link" href="https://www.rocketcenter.com/">U.S. Space &amp; Rocket Center</a>
```

- The rectangle shows the host without `www.` (`rocketcenter.com`). Override with `data-tip="..."`.
- It sits right above and to the right of the pointer, almost touching it. The gaps are two constants at the top of `links.js`: `OFFSET_X = 2` and `OFFSET_Y = 1`. Raise them to float it further away.
- Near the right edge it flips to the left of the pointer. Near the top edge it flips below.
- It is skipped for touch input and for links to the same site. Keyboard focus shows it above the link.

### Footer

```html
<footer class="site-footer">
    <div class="container footer-inner">
        <nav class="footer-nav" aria-label="Footer">
            <a class="footer-link" href="#" data-placeholder>Help</a>
            <a class="footer-link" href="https://example.com/" target="_blank" rel="noopener noreferrer">Visit</a>
        </nav>
    </div>
</footer>
```

- `data-placeholder` makes a link go nowhere (use for unfinished pages).
- Arrows are added automatically by `links.js`: right arrow normally, northeast arrow when `target="_blank"`.
- The arrow is hidden at rest. It sits just outside the end of the word (`left: 100%`, 0.25em gap, 0.7em size), so it never shifts the layout. On hover or keyboard focus it is wiped in left to right (`clip-path`) while gliding about 0.25em out (0.35s fade, 0.45s ease-out), in the page accent.
- Keep the gap between footer links wider than the arrow, about 1.25em.
- Only footers containing `.footer-nav` get the top rule and spacing.

### Button

```html
<p class="cta"><button class="btn" type="button">Learn more</button></p>
```

- `.btn` and `.cta` live in `shared/styles.css`. The look is the accent outline: `2px solid var(--c-spot)`, accent text, transparent fill, no radius.
- Hover fills with the accent and switches the text to `--on-accent`. Pressed darkens the fill 20% toward the text color. Disabled is 45% opacity.
- A second button, `.btn--solid`, is a flat fill in the theme colors (`--text` fill, `--bg` text) that does not change with the article accent. Put the two in a `<div class="btn-row">`.
- The theme toggle, the code copy button and the selection demo's Select button use the same outline style.
- To try a different style, open `samples/buttons/buttons.html`. It has twelve variations with accent, disabled and large toggles.

### Focus ring

One rule in `shared/styles.css`: `outline: 2px solid var(--focus, var(--text))` with a 3px offset. A page only needs to define `--focus`. Without it the ring uses the text color.

### Form controls, scrollbar and tap flash

Already global in `shared/styles.css` on `html`, all driven by the page accent:

```css
html {
    accent-color: var(--c-spot);
    caret-color: var(--c-spot);
    scrollbar-color: color-mix(in srgb, var(--text) 85%, var(--bg)) var(--bg);   /* page: theme colors */
    scrollbar-width: thin;
    -webkit-tap-highlight-color: color-mix(in srgb, var(--c-spot) 20%, transparent);
}

.article {
    scrollbar-color: color-mix(in srgb, var(--c-spot) 75%, var(--bg)) var(--bg); /* inside the article: accent */
}
```

The **tap flash** is the translucent rectangle phones paint over a link or button for a moment when you tap it. A demo form (checkboxes, radios, slider, text box, scrolling textarea) is on `index.html`. Form styles (`.form`, `.choice`) are in `shared/styles.css`.

### Text selection

Already global in `shared/styles.css` and `samples/pink-notes/sample.css`. To change it, edit `--sel-bg` and `--sel-text` in both themes. The address rectangle uses the same two values.

### Content styles (blockquotes, lists, code, tables)

All in `samples/lilac-content/content.css` for now. To use them on another page, copy the rules you need, or move them into `shared/styles.css`. They follow `--c-spot`, so the page accent re-colors them.

## Behaviors to remember

- Visited links never change color.
- Annotation hover effects only run on wide screens, so phones stay calm.
- `transform` does not work on inline text, so hover effects on text use background, border, shadow or opacity instead.
- Dark-mode "darker on hover" really means "more intense", because a stronger tint over black is lighter.
- The 640px phone breakpoint is in the CSS `@media` rules and in the `matchMedia` call in `shared/notes.js`. Change both together.
- The animations respect the system "reduce motion" setting. With it on, the footer arrow only fades. If you do not see an animation, check Windows *Settings, Accessibility, Visual effects, Animation effects*.
- Videos need a pause button (anything that moves for more than five seconds should be stoppable). Use `.video` plus `shared/video.js`.
- Verify the facts and addresses written from memory before publishing: Alabama dates and figures, `rocketcenter.com`, `alabama.travel`.

## Still to decide

| Area | Question |
|---|---|
| Site-level | Favicon, page titles and descriptions, link-preview (Open Graph) tags |
| Accessibility | Contrast check on the light-mode "01" chip (white on `#e0457b` is about 4:1) and on pink accent text (about 4:1), keyboard and screen-reader pass |
| Pages | Apply the corner card, links and footer to the MITES page if wanted |
| Cleanup | Move older components onto the spacing and type tokens; move content styles into `shared/styles.css` once chosen |

## Change log

| Step | Change |
|---|---|
| 1 | Annotations: tinted highlight, superscript, corner box, glossary on the MITES and Alabama pages |
| 2 | Alabama article with photos |
| 3 | Sample page: pink accent, retro corner card, two-way hover, notes in `notes.json` |
| 4 | Theme colors for light and dark, derived dark accents |
| 5 | Shared `notes.js` and `styles.css` across all pages |
| 6 | Selection color options, option M chosen |
| 7 | Links, address rectangle, footer, button, focus ring, muted gray `#6b5f65` |
| 8 | Address rectangle moved above-right of the pointer, with edge flipping |
| 9 | Rectangle gap tightened from 14px / 18px to 6px / 4px so it sits almost touching the pointer instead of floating |
| 10 | Final gap set by hand to 2px right / 1px up (`OFFSET_X = 2`, `OFFSET_Y = 1`), which works best |
| 11 | Footer arrows hidden until hover and slide out of the word smoothly; footer links 600 weight, article links 520 |
| 12 | Footer arrow slowed with a left-to-right wipe, colored with the page accent |
| 13 | Footer arrow shortened to 0.45s with a short travel, starting flush at the end of the word |
| 14 | Typography promoted from the Alabama page into `shared/styles.css`; form controls, caret, scrollbar and tap flash follow the accent; demo form added to the MITES page |
| 15 | Page scrollbar uses the theme colors while article scroll boxes keep the accent; footer arrows moved closer to the word |
| 16 | Footer arrow made smaller (0.9em to 0.7em) with a slightly bigger gap (0.15em to 0.25em) |
| 17 | Files reorganized into folders; theme toggle moved to `shared/theme.js`; lilac content-styles sample page added |
| 18 | Square corners, spacing scale, widths, breakpoints, fluid type scale and touch targets added; button shadow trial |
| 19 | Button options page with twelve variations |
| 20 | Accent outline (variation C) chosen and applied to every button; the shadow trial removed; this doc brought up to date |
| 21 | Default theme, motion, photo and video rules, secondary button, toolbar color and print styles decided; `samples/media` page, `shared/video.js` and print styles added |
| 22 | Button pair: accent outline (C) plus a solid theme-color button (B, `.btn--solid`), replacing the black and white outline secondary |
