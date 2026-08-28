// Remove the former offline cache. The public site is intentionally delivered
// network-first so new design and content updates are visible immediately.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}
if ('caches' in window) {
  caches.keys().then(names => {
    names.filter(name => name.startsWith('vachsystems-')).forEach(name => caches.delete(name));
  });
}
