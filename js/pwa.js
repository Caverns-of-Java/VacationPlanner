let deferredInstallPrompt = null;

function createInstallPrompt() {
  if (document.getElementById('pwa-install-banner')) return;

  const banner = document.createElement('section');
  banner.id = 'pwa-install-banner';
  banner.className = 'pwa-install-banner hidden';
  banner.innerHTML = `
    <p>Install Vacation Planner for faster access on your phone.</p>
    <div class="pwa-actions">
      <button id="pwa-install-btn" type="button">Install</button>
      <button id="pwa-dismiss-btn" type="button" class="pwa-dismiss">Not now</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    banner.classList.add('hidden');
    sessionStorage.setItem('pwa-install-dismissed', '1');
  });

  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    banner.classList.add('hidden');
  });
}

function setupInstallPrompt() {
  createInstallPrompt();
  const banner = document.getElementById('pwa-install-banner');
  if (!banner) return;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    const dismissed = sessionStorage.getItem('pwa-install-dismissed') === '1';
    if (!dismissed) {
      banner.classList.remove('hidden');
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    banner.classList.add('hidden');
    sessionStorage.removeItem('pwa-install-dismissed');
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}

setupInstallPrompt();
registerServiceWorker();