// ---------- Notes from notes.json (shared by every page) ----------
// Each <span class="note" data-key="..."> is looked up in notes.json.
// For every term this builds: superscript number, corner card, glossary
// entry, and a two-way hover link between the term and its glossary entry.
//
// Pages need an empty <ul class="glossary__list"></ul> for the glossary.
//
// NOTE: fetch() does not work when the page is opened straight from disk
// (file://). Serve the folder instead, e.g. VS Code "Live Server" or
// `npx serve` in this folder.

// notes.json sits next to this script, wherever the page lives
const NOTES_URL = new URL('notes.json', document.currentScript.src);

const narrowScreen = window.matchMedia('(max-width: 640px)');
const glossaryList = document.querySelector('.glossary__list');

const pad = (n) => String(n).padStart(2, '0');

function showError(message) {
    if (!glossaryList) return;
    const li = document.createElement('li');
    li.className = 'glossary__error';
    li.textContent = message;
    glossaryList.appendChild(li);
}

async function loadNotes() {
    const res = await fetch(NOTES_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function buildNotes(notes) {
    const numbers = new Map();   // key -> number
    const entries = new Map();   // key -> glossary <li>
    const terms = new Map();     // key -> [term spans]

    document.querySelectorAll('.note[data-key]').forEach((el) => {
        const key = el.dataset.key;
        const data = notes[key];
        if (!data) {
            console.warn(`No note found in notes.json for "${key}"`);
            return;
        }

        const termText = el.textContent.trim();
        const isFirst = !numbers.has(key);
        if (isFirst) numbers.set(key, numbers.size + 1);
        const n = numbers.get(key);
        const num = pad(n);

        // ----- inline markup -----
        el.textContent = '';

        const term = document.createElement('span');
        term.className = 'note__term';
        term.tabIndex = 0;
        term.textContent = termText;

        const sup = document.createElement('sup');
        sup.className = 'note__sup';
        const link = document.createElement('a');
        link.className = 'note__num';
        link.href = `#note-${n}`;
        link.setAttribute('aria-label', `Glossary note ${n}`);
        link.textContent = num;
        if (isFirst) link.id = `note-trigger-${n}`;
        sup.appendChild(link);

        const popup = document.createElement('span');
        popup.className = 'note__popup';
        popup.setAttribute('role', 'note');
        const label = document.createElement('span');
        label.className = 'note__label';
        label.textContent = num;
        popup.append(label, document.createElement('br'), data.note);

        el.append(term, sup, popup);

        // ----- glossary entry (once per key) -----
        if (isFirst) {
            const li = document.createElement('li');
            li.id = `note-${n}`;
            li.className = 'glossary__item';

            const liNum = document.createElement('span');
            liNum.className = 'glossary__num';
            liNum.textContent = num;

            const body = document.createElement('span');
            const liTerm = document.createElement('span');
            liTerm.className = 'glossary__term';
            liTerm.textContent = `${termText}. `;
            const back = document.createElement('a');
            back.className = 'glossary__back';
            back.href = `#note-trigger-${n}`;
            back.setAttribute('aria-label', `Back to ${termText} in the text`);
            back.innerHTML = '&uarr;';
            body.append(liTerm, data.note, ' ', back);

            li.append(liNum, body);
            glossaryList.appendChild(li);
            entries.set(key, li);
            terms.set(key, []);
        }
        terms.get(key).push(el);

        // ----- small screens: tap to expand inline -----
        function toggle() {
            if (!narrowScreen.matches) return;
            const open = el.classList.toggle('is-open');
            term.setAttribute('aria-expanded', String(open));
        }
        term.addEventListener('click', toggle);
        term.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    // ----- two-way hover link -----
    entries.forEach((li, key) => {
        const spans = terms.get(key);
        const on = () => { li.classList.add('is-linked'); spans.forEach((s) => s.classList.add('is-linked')); };
        const off = () => { li.classList.remove('is-linked'); spans.forEach((s) => s.classList.remove('is-linked')); };

        [li, ...spans].forEach((node) => {
            node.addEventListener('pointerenter', on);
            node.addEventListener('pointerleave', off);
            node.addEventListener('focusin', on);
            node.addEventListener('focusout', off);
        });
    });
}

narrowScreen.addEventListener('change', () => {
    document.querySelectorAll('.note.is-open').forEach((n) => n.classList.remove('is-open'));
});

loadNotes()
    .then(buildNotes)
    .catch((err) => {
        console.error('Could not load notes.json', err);
        showError('Could not load notes.json. If you opened this file directly, serve the folder with Live Server or "npx serve" instead.');
    });
