/*
 * Shows the home page to a first-time visitor, then sends them straight to the plants.
 * A plain script, not a module, so it runs before the page is drawn and nothing flashes.
 * Clicking Home inside the site still opens it, because the visitor arrives from another page here.
 */
(function () {
  var KEY = 'water-us:seen-home:v1';
  try {
    var seen = localStorage.getItem(KEY) === 'yes';
    localStorage.setItem(KEY, 'yes');

    var cameFromTheSite = document.referrer.indexOf(location.origin + '/') === 0;
    var nav = performance.getEntriesByType('navigation')[0];
    var reloading = nav && nav.type === 'reload';

    if (seen && !cameFromTheSite && !reloading) {
      location.replace('plants.html');
    }
  } catch (error) {
    // Storage can be blocked. Then everyone simply sees the home page.
  }
})();
