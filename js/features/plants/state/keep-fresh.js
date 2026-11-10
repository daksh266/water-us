/**
 * Keeps a page's plants right while it stays open: when the tab is shown again (for example the
 * next morning), and when another tab waters a plant. The store reads the saved dates again.
 */
export function keepFresh(store) {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      store.refresh();
    }
  });
  // Only fires for changes made in other tabs, never for this tab's own.
  window.addEventListener('storage', () => store.refresh());
}
