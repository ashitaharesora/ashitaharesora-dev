(() => {
  const hero = document.querySelector('.home-page [data-hero-slideshow]');
  if (!hero) return;

  const slides = hero.querySelectorAll('[data-slide-src]');
  if (slides.length !== 2) return;

  const secondSlide = slides[1];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let imagesReady = false;
  let timer;

  function updatePlayback() {
    window.clearInterval(timer);
    secondSlide.classList.remove('is-active');

    if (!imagesReady || reducedMotion.matches || document.hidden) return;

    timer = window.setInterval(() => {
      secondSlide.classList.toggle('is-active');
    }, 6000);
  }

  function preloadImage(slide) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        if (image.decode) {
          image.decode().then(resolve, reject);
        } else {
          resolve();
        }
      };
      image.onerror = reject;
      image.src = new URL(slide.dataset.slideSrc, document.baseURI).href;
    });
  }

  reducedMotion.addEventListener('change', updatePlayback);
  document.addEventListener('visibilitychange', updatePlayback);

  Promise.all(Array.from(slides, preloadImage))
    .then(() => {
      imagesReady = true;
      updatePlayback();
    })
    .catch(() => {
      window.clearInterval(timer);
      secondSlide.classList.remove('is-active');
    });
})();
