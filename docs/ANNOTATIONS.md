# Annotations guide: highlight, superscript, corner box, glossary

> **File locations changed:** files now live in folders. `styles.css`, `notes.js`, `notes.json` and `links.js` are in `shared/`, the theme toggle is `shared/theme.js` (was `script.js`), Alabama is in `state/alabama/`, the pink sample is `samples/pink-notes/` and the selection demo is `samples/selection-colors/`. See DESIGN-DECISIONS.md for the full structure. File names in the text below are shown without folders.

How the annotation system on this site works, how to add your own, and ideas for making it yours.

## What it does

| Piece | Behavior |
|---|---|
| **Highlight** | A term sits in a light tinted block. Hover and it gets darker. |
| **Superscript number** | A small `01` next to the term. Black with a red/blue underline, and it changes to the accent color when you hover it. Clicking it scrolls to the glossary. |
| **Corner box** (wide screens) | Hovering the term shows a bordered box in the bottom-right corner with the number and the note. |
| **Inline note** (screens 640px and narrower) | Tapping the term expands the note right there as `[text]`, with the tint kept light. |
| **Glossary** | A list at the bottom: red/blue number, the note, and an `↑` that scrolls back to the term. |

> **Current setup (supersedes Way 1 and Way 2 below for the live pages):** `index.html`, `alabama.html` and `sample.html` now all share the same system: the retro corner card, two-way hover, and notes loaded from `notes.json`. The shared code is `notes.js`, the shared styles are in `styles.css` (class names `note`, `note__term`, `note__popup`, `glossary__list` ...), and each term is just `<span class="note" data-key="mites">MITES</span>` plus an empty `<ul class="glossary__list"></ul>`. Serve the folder (Live Server or `npx serve`), because `fetch()` does not work from `file://`. Way 1 and Way 2 are kept as history of how the older versions worked.

## Files

| File | Role |
|---|---|
| `styles.css` | Theme colors, `.annotation-*` styles, `.glossary*` styles (shared by both pages) |
| `script.js` | Theme toggle + small-screen tap behavior for `index.html` |
| `alabama.css` | Page-only extras (title, figures) and the blue accent override |
| `alabama.js` | Theme toggle + **builds the numbers, popups and glossary for you** |
| `sample.html` / `sample.css` / `sample.js` | Standalone pink version with the upgrades (see "Upgrades" below) |
| `notes.json` | Note text for the sample, looked up by `data-key` |

There are two ways to write an annotation. Pick one per page.

---

## Way 1: Automatic (used in `alabama.html`, recommended)

You write only the term and its note. `alabama.js` does the numbering, popup and glossary.

### 1. Load the files

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="alabama.css">   <!-- optional page extras -->
<script src="alabama.js" defer></script>
```

### 2. Add an empty glossary section after the article body

```html
<section class="glossary" aria-labelledby="glossary-title">
    <h2 id="glossary-title" class="glossary_title">Glossary</h2>
    <ul class="glossary_list"></ul>
</section>
```

The list stays empty in the HTML. The script fills it.

### 3. Mark a term in your text

```html
<span class="annotation-mod" data-note="Alabama's highest point at 2,413 feet.">Cheaha Mountain</span>
```

- The text inside the span is the visible term.
- `data-note` is the explanation. It appears in the corner box, the inline note, and the glossary.
- Numbers (`01`, `02`, ...) are assigned in the order terms appear on the page.
- If the note contains a double quote, use `&quot;` or switch to single quotes around the attribute.

That is all. Add as many as you want.

---

## Way 2: Manual (used in `index.html`)

You write every piece of markup yourself. It is more work, but you control every detail.

```html
<p>
    Learn more about:
    <span class="annotation-mod">
        <span class="annotation_text" tabindex="0" aria-describedby="annotation-1-note">MITES</span><sup class="annotation_number_wrap"><a id="annotation-trigger-1" class="annotation_number" href="#annotation-1" aria-label="Glossary note 1">01</a></sup>
        <span class="annotation" id="annotation-1-note" role="note">
            <span class="annotation_label">01</span>
            MITES (MIT Introduction to Technology, Engineering, and Science) is a free, pre-college STEM outreach program.
        </span>
    </span>
    After visiting the website...
</p>

<section class="glossary" aria-labelledby="glossary-title">
    <h2 id="glossary-title" class="glossary_title">Glossary</h2>
    <ul class="glossary_list">
        <li id="annotation-1">
            <span class="glossary_num">01</span>
            <span>MITES (MIT Introduction to ...) <a class="glossary_back" href="#annotation-trigger-1" aria-label="Back to MITES in the text">&uarr;</a></span>
        </li>
    </ul>
</section>
```

The ids must match, and the number must be updated in four places for each term:

| Id | Used by |
|---|---|
| `annotation-trigger-N` | the superscript link, and the glossary `↑` points back to it |
| `annotation-N` | the glossary `<li>`, and the superscript link points to it |
| `annotation-N-note` | the popup, referenced by `aria-describedby` |
| visible `0N` | the superscript, the popup label and the glossary number |

`script.js` only handles the small-screen tap. On wide screens it is pure CSS.

---

## How the CSS works (in `styles.css`)

| Selector | What it does |
|---|---|
| `.annotation-mod` | The tinted block. `box-decoration-break: clone` keeps the tint and padding correct when a term wraps across two lines. |
| `.annotation-mod:hover / :focus-within / .is-open` | Darker tint. Keyboard focus works too. |
| `.annotation_text` | The term itself (font weight 450). |
| `.annotation_number_wrap` | The `<sup>`. Small size, `line-height: 0` so it does not push line spacing. |
| `.annotation_number` | The number link: text color, accent underline, accent on hover. |
| `.annotation` | The note. On wide screens it is `position: fixed` bottom-right, hidden with `opacity: 0` and `visibility: hidden`, and shown on `:hover` / `:focus-within`. |
| `@media (max-width: 640px)` | Makes `.annotation` inline, adds red/blue bold `[` `]` with `::before` / `::after`, hides the label, and only shows it when `.is-open` is set. Also locks the tint so tapping does not darken it. |
| `.glossary*` | Top rule, two-column grid (`2.5rem 1fr`) for number and text, and the `↑` link. |
| `scroll-margin-top: 40vh` | When a link jumps to a target, it lands in the middle of the screen instead of under the header. |

Everything uses `var(--c-spot)` for the accent. Override it per page:

```css
:root                    { --c-spot: #1f6fd1; }   /* light mode */
:root[data-theme='dark'] { --c-spot: #5aa2f2; }   /* dark mode  */
```

The tints are built with `color-mix(in srgb, var(--c-spot) 14%, transparent)`. Change `14%` (light) or `32%` (hover) to make them stronger or softer.

## How the JavaScript works

`alabama.js` (Way 1) loops over every `.annotation-mod[data-note]`, then for each one:

1. Reads the term text and `data-note`.
2. Rebuilds the span with the term, `<sup>` link and popup.
3. Appends a matching `<li>` to `.glossary_list`.
4. Wires up tap/Enter/Space to toggle `.is-open`, only when `matchMedia('(max-width: 640px)')` matches.

If you change the 640px breakpoint, change it in **both** the CSS `@media` rule and the JS `matchMedia` call.

---

## Upgrades (all working together in `sample.html`)

`sample.html`, `sample.css`, `sample.js` and `notes.json` are a standalone, pink version of the system with four upgrades. The original corner box and the other approaches above still work and are unchanged. Everything below is an add-on you can mix in.

### A. Retro corner box (alternative to the original box)

Original: thin border, soft look. New: square card with a dark 2px border, a hard pink offset shadow, a slight tilt, and a slide-in. The label becomes a solid chip.

```css
.note__popup {
    position: fixed;
    right: 1.75rem;
    bottom: 1.75rem;
    width: min(330px, calc(100vw - 3.5rem));
    padding: 1rem 1.1rem 1.1rem;
    background: var(--surface);
    border: 2px solid var(--text);
    border-radius: 0;
    box-shadow: 7px 7px 0 var(--pink);   /* the retro part */
    opacity: 0;
    visibility: hidden;
    transform: translateX(14px) rotate(-1.5deg);
    transition: opacity 0.18s ease, transform 0.22s ease, visibility 0.18s;
}

.note:hover .note__popup,
.note:focus-within .note__popup {
    opacity: 1;
    visibility: visible;
    transform: rotate(-1deg);
}

.note__label {            /* "01" chip */
    display: inline-block;
    padding: 1px 8px;
    background: var(--pink);
    color: #fff;
    font-weight: 800;
}
```

Tweak the personality: change `7px 7px 0` for a bigger or smaller shadow, set `rotate(0)` for no tilt, or use `border-radius: 12px` for a softer card. The small-screen `[text]` behavior is the same as before.

### B. Two-way hover link

Hover a term and its glossary entry lights up. Hover a glossary entry and every instance of that term lights up. Keyboard focus does the same.

In JS, after the entries are built (see `sample.js`):

```js
entries.forEach((li, key) => {
    const spans = terms.get(key);
    const on  = () => { li.classList.add('is-linked');    spans.forEach((s) => s.classList.add('is-linked')); };
    const off = () => { li.classList.remove('is-linked'); spans.forEach((s) => s.classList.remove('is-linked')); };

    [li, ...spans].forEach((node) => {
        node.addEventListener('pointerenter', on);
        node.addEventListener('pointerleave', off);
        node.addEventListener('focusin', on);
        node.addEventListener('focusout', off);
    });
});
```

In CSS, give `.is-linked` the same look as `:hover`, and style the glossary side:

```css
.glossary__item.is-linked { background: var(--pink-wash); }
```

Each highlight style below already lists `.is-linked` next to `:hover`.

### C. Notes in `notes.json`

Notes live in one file instead of inside the HTML.

`notes.json`:

```json
{
    "cheaha": { "note": "Alabama's highest point at 2,413 feet." },
    "jubilee": { "note": "A rare event on Mobile Bay..." }
}
```

HTML (only a key, no note text):

```html
<span class="note hl-underline" data-key="cheaha">Cheaha Mountain</span>
```

JS:

```js
const res = await fetch('notes.json');
const notes = await res.json();
// notes['cheaha'].note
```

Why it is nice:
- Edit a note once and every page that uses the key updates.
- The same key can appear many times. It gets one number and one glossary entry.
- You can add fields later (`source`, `url`, `category`) without touching the HTML.

**Important:** `fetch()` does not work when you open the HTML by double-clicking it (`file://`). Serve the folder with VS Code's **Live Server** extension, or run `npx serve` in the project folder. If the file cannot be loaded, `sample.js` shows a message in the glossary area.

### D. Highlight: flat tinted block (the chosen style)

After trying several alternatives (underline that grows into a box, outlined box, dotted or wavy underline, gradient text, outlined pill, brackets), the flat tinted block won. It is the look from `index.html` and `alabama.html`, now in pink in `sample.css`:

```css
.note {
    padding: 2px 3px;
    margin: 0 2px;
    background: color-mix(in srgb, var(--pink) 14%, transparent);   /* light tint */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;      /* keeps the block intact across line wraps */
    cursor: help;
    transition: background-color 0.2s ease;
}

@media (min-width: 641px) {
    .note:hover,
    .note:focus-within,
    .note.is-linked {                 /* is-linked = its glossary entry is hovered */
        background: color-mix(in srgb, var(--pink) 32%, transparent);   /* darker */
    }
}
```

Things to tweak: the `14%` and `32%` set how light and dark it is, `border-radius: 3px` softens the corners, and `--pink` sets the color. The darker state only applies on wide screens, so on phones the block stays light and only the `[text]` note opens on tap.

Note: `transform` does not work on inline elements, so avoid moving the word on hover. Use `background`, `box-shadow` or `border-color` instead.

---

## Quick troubleshooting

| Problem | Likely cause |
|---|---|
| Nothing is highlighted | `styles.css` is not linked, or the span class is misspelled (`annotation-mod`). |
| Glossary is empty | Missing `<ul class="glossary_list">`, or the script is not loaded. |
| Number link does not scroll | The ids do not match (Way 2). |
| Highlight gaps on wrapped lines | `box-decoration-break: clone` was removed. |
| Corner box overlaps something | Change `right` / `bottom` / `width` in `.annotation`. |
| Tap does nothing on phone | Breakpoint mismatch between CSS and JS. |

---

## Ideas to make it more yours

Roughly easiest to most ambitious.

### Look and feel (CSS only, 5-30 minutes each)

1. **Your own accent per page or section.** You already did this with blue. Try one color per topic (blue for geography, green for nature) by setting `--c-spot` on a wrapper like `.section--history`.
2. **A different highlight style.** Replace the filled block with a marker-pen underline: a `linear-gradient` background covering only the lower 40% of the text, or a hand-drawn wavy `text-decoration`.
3. **Change the corner box shape.** Try a thick left border only, a folded corner using `clip-path`, a slight rotation (`rotate(-1deg)`), or a hard offset shadow (`box-shadow: 6px 6px 0 var(--c-spot)`) for a retro look.
4. **A signature typeface for notes.** Use a different font for the popup and glossary (a serif or a monospace) so notes feel like marginalia.
5. **Animate it.** Slide the box in from the right, make the highlight "paint" left to right on hover using `background-size`, or bounce the superscript when its glossary entry is targeted.
6. **Use a real symbol for the number.** Swap `01` for letters (a, b, c), dots, or small icons.

### Behavior (small JS)

7. **Rich notes.** Allow a link, an image, or bold text inside a note. Use `<template>` elements or a JS object instead of `data-note`, which only holds plain text.
8. **Pin a note.** Click a term on desktop to keep the corner box open until you click again or press Escape.
9. **Close on Escape and on outside tap** (small screens). Right now you have to tap the term again.
10. **Highlight the term when you hover the glossary entry** (and the reverse). That makes the connection between the two obvious.
11. **Reading progress.** Track which notes a reader has opened and style those entries as "seen" in the glossary.
12. **Stack multiple corner boxes** if two terms are close together, instead of overlapping.

### Content and structure

13. **Glossary types.** Add categories (People, Places, Events) with small colored tags, and filter the glossary.
14. **A "Sources" line per note.** Add `data-source` and `data-url` and show a small "Read more" link in the box and glossary.
15. **Pull annotations out of the HTML.** Move all notes into a `notes.json` file and look them up by `data-key="cheaha"`. Then the same term can be reused across pages and edited in one place.
16. **A table-of-contents sidebar** built the same way the glossary is, from your `<h2>` headings.

### Make the whole page feel like yours

17. **A real layout.** Your Alabama page is one centered column. Try a wide hero image at the top, a sticky sidebar with the facts, or a two-column layout where notes live in the margin on large screens (like a Tufte-style sidenote).
18. **Your own images.** Photos you took, or your own illustrations, are the quickest way to stop looking like a template. Credit anything you did not make.
19. **A distinct voice.** Your colors, a favorite font pairing, a logo or monogram in the header, and a consistent tone in the notes do more than any single feature.
20. **Rebuild it without looking.** Delete the CSS for one piece (say the corner box) and write it again from scratch from memory. You will understand it better and it will drift toward your style.

### Suggested path

If you want the biggest change for the least effort: start with **(2)** a custom highlight style, **(3)** a new corner-box shape, **(10)** the two-way hover link, and **(15)** moving notes into a JSON file. Those four make it feel like your own system.
