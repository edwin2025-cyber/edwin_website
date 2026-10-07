// Lilac content page: copy buttons for code blocks and sortable tables.
// (The theme toggle is in shared/theme.js.)

(function () {
    // ----- Copy buttons -----
    document.querySelectorAll('.codeblock').forEach((block) => {
        const button = block.querySelector('.codeblock__copy');
        const code = block.querySelector('pre');
        if (!button || !code) return;

        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.textContent = 'Copied';
                button.classList.add('is-copied');
            } catch (e) {
                // Clipboard needs https or localhost; fall back to selecting the text
                const range = document.createRange();
                range.selectNodeContents(code);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                button.textContent = 'Press Ctrl+C';
            }
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('is-copied');
            }, 1800);
        });
    });

    // ----- Sortable tables -----
    document.querySelectorAll('.table--sortable').forEach((table) => {
        const body = table.tBodies[0];
        const headers = table.querySelectorAll('thead th[aria-sort]');

        headers.forEach((th) => {
            const button = th.querySelector('.sort');
            if (!button) return;
            const column = th.cellIndex;

            button.addEventListener('click', () => {
                const next = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';

                // Only one column shows a sort state at a time
                headers.forEach((h) => h.setAttribute('aria-sort', 'none'));
                th.setAttribute('aria-sort', next);

                const rows = Array.from(body.rows);
                rows.sort((a, b) => {
                    const x = a.cells[column].textContent.trim();
                    const y = b.cells[column].textContent.trim();
                    return x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' });
                });
                if (next === 'descending') rows.reverse();
                rows.forEach((r) => body.appendChild(r));
            });
        });
    });
})();
