// MITES page script (theme toggle is in shared/theme.js)

// Demo forms don't submit (pressing Enter would otherwise reload the page)
document.querySelectorAll('form[data-demo]').forEach((f) => {
    f.addEventListener('submit', (e) => e.preventDefault());
});
