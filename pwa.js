// Install button + service worker for శ్రీ యాజ్ఞవల్క్య app.
// - Android/desktop Chrome: shows the phone's own install prompt.
// - iPhone/iPad, or when the browser gives no prompt: shows simple Telugu steps
//   instead of silently hiding the button.
(() => {
  let deferredPrompt = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = () => /android/i.test(navigator.userAgent);

  // Capture the prompt as early as possible (it can fire before DOMContentLoaded).
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  function showHelp(installBtn) {
    const dlg = document.getElementById('installDialog');
    if (!dlg) return;
    const show = (id, on) => { const el = document.getElementById(id); if (el) el.hidden = !on; };
    const done = isStandalone();
    show('installDone', done);
    show('installIos', !done && isIOS());
    show('installAndroid', !done && !isIOS() && isAndroid());
    show('installDesktop', !done && !isIOS() && !isAndroid());
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    const closeBtn = dlg.querySelector('.btn[data-close]');
    if (closeBtn) closeBtn.focus();
    dlg.querySelectorAll('[data-close]').forEach((b) => {
      b.onclick = () => { dlg.close ? dlg.close() : dlg.removeAttribute('open'); installBtn.focus(); };
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installBtn');
    if (!installBtn) return;

    // Already running as the installed app → no need for the button.
    if (isStandalone()) installBtn.hidden = true;

    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        try {
          const choice = await deferredPrompt.userChoice;
          if (choice.outcome === 'accepted') installBtn.hidden = true;
        } catch (e) { /* ignore */ }
        deferredPrompt = null;   // a prompt can only be used once
      } else {
        showHelp(installBtn);
      }
    });

    window.addEventListener('appinstalled', () => {
      installBtn.hidden = true;
      deferredPrompt = null;
    });
  });

  // Service worker: offline support + automatic updates.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js', { updateViaCache: 'none' })
        .then((reg) => { reg.update().catch(() => {}); })
        .catch((err) => console.error('Service Worker registration failed:', err));

      // When a new version takes over, reload once so visitors see the latest page.
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        window.location.reload();
      });
    });
  }
})();
