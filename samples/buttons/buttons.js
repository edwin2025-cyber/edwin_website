// Button options page: accent switcher, disabled and large toggles, click log.
// (The theme toggle is in shared/theme.js.)

(function () {
    const html = document.documentElement;
    const grid = document.getElementById('grid');
    const status = document.getElementById('status');
    const buttons = grid.querySelectorAll('.bx');

    // ----- Accent switcher (remembered between visits) -----
    const swatches = document.querySelectorAll('.accent');

    function setAccent(name) {
        if (name === 'red') {
            html.removeAttribute('data-accent');
        } else {
            html.setAttribute('data-accent', name);
        }
        swatches.forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.accent === name)));
        try {
            localStorage.setItem('button-accent', name);
        } catch (e) {}
    }

    swatches.forEach((s) => s.addEventListener('click', () => setAccent(s.dataset.accent)));

    let saved = null;
    try {
        saved = localStorage.getItem('button-accent');
    } catch (e) {}
    if (saved && document.querySelector(`.accent[data-accent="${saved}"]`)) setAccent(saved);

    // ----- Disabled / large toggles -----
    document.getElementById('toggle-disabled').addEventListener('change', (e) => {
        buttons.forEach((b) => { b.disabled = e.target.checked; });
        status.textContent = e.target.checked ? 'All buttons disabled.' : 'Click any button to test it.';
    });

    document.getElementById('toggle-large').addEventListener('change', (e) => {
        grid.classList.toggle('grid--large', e.target.checked);
    });

    // ----- Click log, so you can feel the pressed state -----
    buttons.forEach((b) => {
        b.addEventListener('click', () => {
            status.textContent = `Clicked: ${b.dataset.name}`;
        });
    });
})();
