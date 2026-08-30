(() => {
  'use strict';

  const ACCESS_KEY = 'vachsystems-project-access-v3';
  const NOTICE_KEY = 'vachsystems-project-notice-v1';
  const ACCESS_HASH = '2789c64f61f552e96f874a9082bcd2cfd663d000dfbbca78021f5352419484ef';
  const page = document.querySelector('.page-shell');
  const isEnglish = document.documentElement.lang === 'en';

  function unlock() {
    document.body.classList.remove('is-locked');
    if (page) page.hidden = false;
    document.querySelector('.access-gate')?.remove();
    if (page?.dataset.pageTitle) document.title = page.dataset.pageTitle;
  }

  async function hash(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function showGate() {
    const copy = isEnglish ? {
      kicker: 'Non-public area',
      title: 'Protected <i>access.</i>',
      body: 'Please enter the password that you received together with this link.',
      label: 'Password',
      placeholder: 'Enter password',
      button: 'Continue',
      error: 'That password is not correct. Please try again.',
      note: 'vachsystems · confidential project area'
    } : {
      kicker: 'Nicht öffentlicher Bereich',
      title: 'Geschützter <i>Zugang.</i>',
      body: 'Bitte geben Sie das Passwort ein, das Sie zusammen mit diesem Link erhalten haben.',
      label: 'Passwort',
      placeholder: 'Passwort eingeben',
      button: 'Weiter',
      error: 'Das Passwort ist nicht korrekt. Bitte erneut versuchen.',
      note: 'vachsystems · vertraulicher Projektbereich'
    };

    const gate = document.createElement('main');
    gate.className = 'access-gate';
    gate.innerHTML = `
      <section class="access-card" aria-labelledby="access-title">
        <a class="access-brand" href="https://vachsystems.de" aria-label="vachsystems">
          <img src="/assets/logo.webp" alt=""><span>vachsystems</span>
        </a>
        <p class="access-kicker">${copy.kicker}</p>
        <h1 id="access-title">${copy.title}</h1>
        <p class="access-copy">${copy.body}</p>
        <form novalidate>
          <label for="access-password">${copy.label}</label>
          <div class="access-input-row">
            <input id="access-password" type="password" autocomplete="current-password" placeholder="${copy.placeholder}" required>
            <button type="submit">${copy.button}</button>
          </div>
          <p class="access-error" role="alert" aria-live="polite"></p>
        </form>
        <p class="access-note">${copy.note}</p>
      </section>`;
    document.body.prepend(gate);

    const form = gate.querySelector('form');
    const input = gate.querySelector('input');
    const button = gate.querySelector('button');
    const error = gate.querySelector('.access-error');
    input.focus();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      button.disabled = true;
      error.textContent = '';
      try {
        if (await hash(input.value) === ACCESS_HASH) {
          sessionStorage.setItem(ACCESS_KEY, 'granted');
          showNotice();
          return;
        }
        error.textContent = copy.error;
        input.select();
      } catch {
        error.textContent = isEnglish ? 'Access could not be checked in this browser.' : 'Der Zugang konnte in diesem Browser nicht geprüft werden.';
      }
      button.disabled = false;
    });
  }

  function showNotice() {
    document.querySelector('.access-gate')?.remove();
    const copy = isEnglish ? {
      kicker: 'Before you continue',
      title: 'A note on this preview.',
      intro: 'The following presentation is a non-binding concept draft intended solely as a basis for joint discussion.',
      confidential: 'This link, its access details and all provided content are intended only for the designated recipients. Reproduction, disclosure or commercial use requires prior written consent; usage rights are agreed separately.',
      adaptable: 'Content, functions, structure and visual design are proposals and can be fully adjusted.',
      scope: 'The final scope and implementation will be agreed and confirmed separately during the project process.',
      labels: ['Confidential', 'Adaptable', 'Planning status'],
      button: 'Open concept preview',
      note: 'vachsystems · confidential concept presentation'
    } : {
      kicker: 'Vorab zur Einordnung',
      title: 'Hinweis zur Konzeptvorschau.',
      intro: 'Die folgende Darstellung ist ein unverbindlicher Konzeptentwurf und dient ausschließlich als Grundlage für die gemeinsame Abstimmung.',
      confidential: 'Link, Zugangsdaten und sämtliche bereitgestellten Inhalte sind ausschließlich für die vorgesehenen Empfänger bestimmt. Vervielfältigung, Weitergabe oder wirtschaftliche Nutzung bedürfen der vorherigen schriftlichen Zustimmung; Nutzungsrechte werden gesondert vereinbart.',
      adaptable: 'Inhalte, Funktionen, Struktur und Gestaltung sind Vorschläge und können vollständig angepasst werden.',
      scope: 'Der endgültige Leistungsumfang und die Umsetzung werden im weiteren Projektverlauf gesondert abgestimmt und festgelegt.',
      labels: ['Vertraulich', 'Anpassbar', 'Planungsstand'],
      button: 'Konzeptvorschau öffnen',
      note: 'vachsystems · vertrauliche Konzeptpräsentation'
    };

    const notice = document.createElement('main');
    notice.className = 'access-gate concept-notice';
    notice.innerHTML = `
      <section class="notice-card" aria-labelledby="notice-title">
        <a class="access-brand" href="https://vachsystems.de" aria-label="vachsystems">
          <img src="/assets/logo.webp" alt=""><span>vachsystems</span>
        </a>
        <p class="access-kicker">${copy.kicker}</p>
        <h1 id="notice-title">${copy.title}</h1>
        <p class="notice-intro">${copy.intro}</p>
        <div class="notice-points">
          <p><b>01 · ${copy.labels[0]}</b><span>${copy.confidential}</span></p>
          <p><b>02 · ${copy.labels[1]}</b><span>${copy.adaptable}</span></p>
          <p><b>03 · ${copy.labels[2]}</b><span>${copy.scope}</span></p>
        </div>
        <button class="notice-continue" type="button">${copy.button} →</button>
        <p class="access-note">${copy.note}</p>
      </section>`;
    document.body.prepend(notice);
    const button = notice.querySelector('.notice-continue');
    button.addEventListener('click', () => {
      sessionStorage.setItem(NOTICE_KEY, 'acknowledged');
      unlock();
      document.querySelector('.page-shell h1')?.focus({ preventScroll: true });
    });
    button.focus();
  }

  try {
    const granted = sessionStorage.getItem(ACCESS_KEY) === 'granted';
    const acknowledged = sessionStorage.getItem(NOTICE_KEY) === 'acknowledged';
    if (granted && acknowledged) unlock();
    else if (granted) showNotice();
    else showGate();
  } catch {
    showGate();
  }

  const menu = document.querySelector('.mobile-nav');
  const menuButton = document.querySelector('.menu-button');
  const menuClose = document.querySelector('.mobile-nav-close');

  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    if (open) menuClose?.focus();
    else menuButton.focus();
  }

  menuButton?.addEventListener('click', () => setMenu(true));
  menuClose?.addEventListener('click', () => setMenu(false));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('open')) setMenu(false);
  });

  const normalize = (value) => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const eventButtons = [...document.querySelectorAll('[data-event-filter]')];
  const eventRows = [...document.querySelectorAll('[data-event-type]')];
  const eventCount = document.querySelector('[data-event-count]');
  const eventEmpty = document.querySelector('[data-event-empty]');

  function filterEvents(type) {
    let visible = 0;
    eventButtons.forEach((button) => button.classList.toggle('selected', button.dataset.eventFilter === type));
    eventRows.forEach((row) => {
      const show = type === 'all' || row.dataset.eventType === type;
      row.hidden = !show;
      if (show) visible += 1;
    });
    if (eventCount) eventCount.textContent = isEnglish ? `${visible} events` : `${visible} Termine`;
    if (eventEmpty) eventEmpty.hidden = visible !== 0;
  }

  eventButtons.forEach((button) => button.addEventListener('click', () => filterEvents(button.dataset.eventFilter)));

  const search = document.querySelector('[data-knowledge-search]');
  const knowledgeButtons = [...document.querySelectorAll('[data-knowledge-filter]')];
  const knowledgeItems = [...document.querySelectorAll('[data-knowledge-item]')];
  const knowledgeCount = document.querySelector('[data-knowledge-count]');
  const knowledgeEmpty = document.querySelector('[data-knowledge-empty]');
  let activeKnowledgeType = 'all';

  function filterKnowledge() {
    const query = normalize(search?.value || '');
    let visible = 0;
    knowledgeItems.forEach((item) => {
      const matchesType = activeKnowledgeType === 'all' || item.dataset.knowledgeType === activeKnowledgeType;
      const matchesQuery = !query || normalize(item.dataset.search || item.textContent).includes(query);
      const show = matchesType && matchesQuery;
      item.hidden = !show;
      if (show) visible += 1;
    });
    if (knowledgeCount) knowledgeCount.textContent = isEnglish ? `${visible} results` : `${visible} Ergebnisse`;
    if (knowledgeEmpty) knowledgeEmpty.hidden = visible !== 0;
  }

  search?.addEventListener('input', filterKnowledge);
  knowledgeButtons.forEach((button) => button.addEventListener('click', () => {
    activeKnowledgeType = button.dataset.knowledgeFilter;
    knowledgeButtons.forEach((item) => item.classList.toggle('selected', item === button));
    filterKnowledge();
  }));
})();
