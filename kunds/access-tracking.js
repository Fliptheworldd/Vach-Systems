(() => {
  'use strict';

  const endpoint = 'https://api.web3forms.com/submit';
  const accessKey = '0a59ee17-54d5-41a3-b66b-72eb79e6689f';
  const trackingId = 'kunds-metallbau-2026';
  const expectedPassword = 'Brieselang';
  const pendingEvents = new Set();

  const trackingEvents = {
    gate_interaction: {
      subject: 'K&S-Vorschau aktiv geöffnet',
      label: 'Zugangsseite aktiv geöffnet'
    },
    password_success: {
      subject: 'K&S-Passwort erfolgreich eingegeben',
      label: 'Passwort erfolgreich eingegeben'
    }
  };

  function storageKey(type) {
    return `vachsystems-tracking-${trackingId}-${type}`;
  }

  function trackingWasSent(type) {
    try {
      return localStorage.getItem(storageKey(type)) === 'sent';
    } catch {
      return false;
    }
  }

  function rememberTrackingEvent(type) {
    try {
      localStorage.setItem(storageKey(type), 'sent');
    } catch {
      // The notification still works when browser storage is unavailable.
    }
  }

  async function sendTrackingEvent(type) {
    const details = trackingEvents[type];
    if (!details || trackingWasSent(type) || pendingEvents.has(type)) return false;
    pendingEvents.add(type);

    try {
      const timestamp = new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'Europe/Berlin'
      }).format(new Date());
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          access_key: accessKey,
          from_name: 'vachsystems Projektvorschau',
          subject: details.subject,
          projekt: 'K&S Metallbau Brieselang',
          ereignis: details.label,
          zeitpunkt: timestamp,
          zugangskennung: trackingId,
          seite: window.location.pathname
        })
      });
      if (!response.ok) return false;
      rememberTrackingEvent(type);
      return true;
    } catch {
      return false;
    } finally {
      pendingEvents.delete(type);
    }
  }

  function activeGateForEvent(event) {
    const target = event.target;
    if (!(target instanceof Element)) return null;
    const gate = target.closest('.preview-gate');
    return gate && !gate.classList.contains('preview-gate-loading') ? gate : null;
  }

  function trackGateInteraction(event) {
    if (!event.isTrusted || !activeGateForEvent(event)) return;
    void sendTrackingEvent('gate_interaction');
  }

  document.addEventListener('pointerdown', trackGateInteraction, {
    capture: true,
    passive: true
  });
  document.addEventListener('keydown', trackGateInteraction, true);
  document.addEventListener('submit', (event) => {
    if (!event.isTrusted) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.closest('.preview-gate')) return;
    const input = form.querySelector('#preview-password');
    if (input instanceof HTMLInputElement && input.value.trim() === expectedPassword) {
      void sendTrackingEvent('password_success');
    }
  }, true);

  function addPrivacyNotice() {
    const note = document.querySelector('.preview-gate-note');
    if (!note || note.dataset.trackingNotice === 'true') return false;
    note.dataset.trackingNotice = 'true';
    note.textContent = 'Nicht öffentlich · Zugriff nur mit Freigabe · ';
    const link = document.createElement('a');
    link.href = 'https://vachsystems.de/datenschutz';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Zugriffe werden protokolliert';
    link.style.color = 'inherit';
    link.style.textDecoration = 'underline';
    link.style.textUnderlineOffset = '3px';
    note.append(link);
    return true;
  }

  if (!addPrivacyNotice()) {
    const observer = new MutationObserver(() => {
      if (addPrivacyNotice()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 10000);
  }
})();
