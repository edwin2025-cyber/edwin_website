// ---------- Links (shared) ----------
// - External links get a square rectangle that follows the pointer and shows
//   the short address (e.g. rocketcenter.com). Override with data-tip="...".
// - Footer links get an arrow: right for same tab, northeast for new tab.
// - Links marked data-placeholder go nowhere (useful for unfinished pages).

(function () {
    const SELECTOR = 'a.link, a.footer-link';
    const OFFSET_X = 2;   // gap to the right of the pointer
    const OFFSET_Y = 1;   // gap above the pointer (small, so it nearly touches)

    const isExternal = (a) => /^https?:$/.test(a.protocol) && a.origin !== window.location.origin;
    const tipText = (a) => a.dataset.tip || a.hostname.replace(/^www\./, '');

    // ----- placeholder links -----
    document.querySelectorAll('a[data-placeholder]').forEach((a) => {
        a.addEventListener('click', (e) => e.preventDefault());
    });

    // ----- footer arrows -----
    const SVG_NS = 'http://www.w3.org/2000/svg';
    function arrow(kind) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('class', `arrow arrow--${kind}`);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'square');
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', kind === 'ne' ? 'M7 17L17 7M8 7h9v9' : 'M4 12h16M14 6l6 6-6 6');
        svg.appendChild(path);
        return svg;
    }

    document.querySelectorAll('a.footer-link').forEach((a) => {
        if (a.querySelector('.arrow')) return;
        a.appendChild(arrow(a.target === '_blank' ? 'ne' : 'right'));
    });

    // ----- pointer-following rectangle -----
    const tip = document.createElement('div');
    tip.className = 'link-tip';
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    function place(x, y) {
        const w = tip.offsetWidth;
        const h = tip.offsetHeight;
        // Default: above and to the right of the pointer
        let left = x + OFFSET_X;
        let top = y - h - OFFSET_Y;
        // Flip to the left of the pointer near the right edge
        if (left + w > window.innerWidth - 8) left = x - w - OFFSET_X;
        // Flip below the pointer near the top edge
        if (top < 8) top = y + OFFSET_Y;
        tip.style.transform = `translate(${Math.max(8, left)}px, ${Math.max(8, top)}px)`;
    }

    function show(a) {
        tip.textContent = tipText(a);
        tip.classList.add('is-visible');
    }

    function hide() {
        tip.classList.remove('is-visible');
    }

    document.querySelectorAll(SELECTOR).forEach((a) => {
        if (!a.dataset.tip && !isExternal(a)) return;

        a.addEventListener('pointerenter', (e) => {
            if (e.pointerType !== 'mouse') return;
            show(a);
            place(e.clientX, e.clientY);
        });
        a.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'mouse') place(e.clientX, e.clientY);
        });
        a.addEventListener('pointerleave', hide);

        // Keyboard: park the rectangle just above the link's left edge
        a.addEventListener('focus', () => {
            if (!a.matches(':focus-visible')) return;
            const r = a.getBoundingClientRect();
            show(a);
            place(r.left - OFFSET_X, r.top + OFFSET_Y - 2);
        });
        a.addEventListener('blur', hide);
    });
})();
