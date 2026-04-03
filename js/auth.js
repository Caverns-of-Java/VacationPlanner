(function () {
  if (sessionStorage.getItem('__s') === '1') return;

  const _o = document.createElement('div');
  _o.id = 'auth-overlay';
  _o.innerHTML = `
    <div class="auth-card">
      <h1 class="auth-title">Vacation Planner</h1>
      <p class="auth-subtitle">Enter the access code to continue</p>
      <input id="auth-input" type="password" placeholder="Access code" autocomplete="off" />
      <button id="auth-btn">Continue →</button>
      <p id="auth-error" class="auth-error" aria-live="polite"></p>
    </div>
  `;

  document.body.appendChild(_o);
  _o.querySelector('#auth-input').focus();

  function _d(str) {
    const enc = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', enc).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  function _v() {
    const _i = _o.querySelector('#auth-input');
    _d(_i.value).then(function (h) {
      if (h === window.__cit) {
        sessionStorage.setItem('__s', '1');
        _o.classList.add('auth-fade-out');
        _o.addEventListener('animationend', function () { _o.remove(); }, { once: true });
      } else {
        const _e = _o.querySelector('#auth-error');
        _e.textContent = 'Incorrect access code — try again.';
        _i.value = '';
        _i.classList.remove('auth-shake');
        void _i.offsetWidth;
        _i.classList.add('auth-shake');
        _i.addEventListener('animationend', function () { _i.classList.remove('auth-shake'); }, { once: true });
        _i.focus();
      }
    });
  }

  _o.querySelector('#auth-btn').addEventListener('click', _v);
  _o.querySelector('#auth-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') _v();
  });
})();
