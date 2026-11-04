/** How long the hero takes to slide away before the next page opens, in milliseconds. */
const EXIT_MS = 600;

/** Makes a click anywhere on the hero open the plants page, after a short slide-away. */
export function initHome(hero) {
  const link = hero.querySelector('a');
  let leaving = false;

  function go() {
    if (leaving) {
      return;
    }
    leaving = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hero.classList.add('leaving');
    setTimeout(() => {
      window.location.href = link.href;
    }, reduceMotion ? 0 : EXIT_MS);
  }

  hero.addEventListener('click', (event) => {
    // Let the browser handle opening in a new tab, and so on.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    go();
  });
}
