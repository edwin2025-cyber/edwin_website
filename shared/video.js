// ---------- Video pause / play button (shared) ----------
// Each <div class="video"> holds a <video class="video__el"> and a
// <button class="video__toggle">. The button's label and icon follow the
// video's real state, so they stay right if the video is paused another way
// (browser controls, keyboard, the page losing focus on some phones).
//
// Motion: when the visitor's system asks for reduced motion, videos do not
// autoplay. They start paused and the button shows "Play".

(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.video').forEach((box) => {
        const video = box.querySelector('.video__el');
        const button = box.querySelector('.video__toggle');
        if (!video || !button) return;

        function sync() {
            const paused = video.paused;
            box.classList.toggle('is-paused', paused);
            button.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
        }

        button.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(sync);
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', sync);
        video.addEventListener('pause', sync);
        video.addEventListener('ended', sync);

        if (reduceMotion.matches) {
            video.removeAttribute('autoplay');
            video.pause();
        } else if (video.autoplay) {
            // Some browsers block autoplay; the button then correctly shows "Play"
            video.play().catch(sync);
        }

        sync();
    });
})();
