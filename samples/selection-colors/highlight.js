// Selection color demo: shows each option's hex values for the current theme
// and lets you select a line with a button instead of dragging.
// (Theme toggle lives in script.js, annotations in notes.js.)

(function () {
    const rows = document.querySelectorAll('.row');

    // Read the current theme's values straight from the CSS variables
    function updateHex() {
        rows.forEach((row) => {
            const styles = getComputedStyle(row);
            const text = styles.getPropertyValue('--sel-text').trim();
            const bg = styles.getPropertyValue('--sel-bg').trim();
            row.querySelector('.row__hex').textContent = `text ${text} / bg ${bg}`;
        });
    }

    // Select the whole sentence so the color is visible without dragging
    rows.forEach((row) => {
        const sentence = row.querySelector('.row__sentence');
        row.querySelector('.row__select').addEventListener('click', () => {
            const range = document.createRange();
            range.selectNodeContents(sentence);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        });
    });

    updateHex();

    // Refresh the hex labels whenever the theme changes
    new MutationObserver(updateHex).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });
})();
