// ---------- Theme toggle ----------
// Shared by every page. The initial theme is set by the inline script in each page's <head> (before first paint).

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Browser toolbar color (phone address bar, installed-app title bar) follows the theme.
function updateThemeColor() {
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = getComputedStyle(root).getPropertyValue('--bg').trim() || '#ffffff';
    document.head.appendChild(meta);
}

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    // Label shows the theme you'd switch to
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    updateThemeColor();
}

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
        localStorage.setItem('theme', next);
    } catch (e) {
        // Storage unavailable (e.g. private mode) - theme just won't persist
    }
});

// Follow the OS setting until the user picks a theme themselves
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try {
        saved = localStorage.getItem('theme');
    } catch (err) {}
    if (!saved) setTheme(e.matches ? 'dark' : 'light');
});

setTheme(root.getAttribute('data-theme') || 'light');

// Printing always uses the light theme (saves ink, easier to read on paper).
// The screen theme comes back afterwards, and nothing is saved.
let themeBeforePrint = null;

window.addEventListener('beforeprint', () => {
    if (root.getAttribute('data-theme') === 'dark') {
        themeBeforePrint = 'dark';
        root.setAttribute('data-theme', 'light');
    }
});

window.addEventListener('afterprint', () => {
    if (themeBeforePrint) {
        root.setAttribute('data-theme', themeBeforePrint);
        themeBeforePrint = null;
    }
});
