/** Fades each part of the home page in as it scrolls into view, and darkens the backdrop once the hero is behind. */
export function initChapters(hero, scene) {
  const main = hero.parentElement;
  measureFrame();
  window.addEventListener('resize', measureFrame);
  const parts = main.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    return;
  }

  main.classList.add('reveal-ready');

  const revealer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.3 },
  );
  parts.forEach((part) => revealer.observe(part));

  new IntersectionObserver(
    ([entry]) => scene.classList.toggle('is-dimmed', entry.intersectionRatio < 0.5),
    { threshold: [0.5] },
  ).observe(hero);
}

/** Tells the CSS how tall the header and footer are, since they wrap onto more lines on a phone. */
function measureFrame() {
  const root = document.documentElement.style;
  root.setProperty('--header-h', `${document.querySelector('.site-header').offsetHeight}px`);
  root.setProperty('--footer-h', `${document.querySelector('.site-footer').offsetHeight}px`);
}
