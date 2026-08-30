(() => {
  'use strict';

  const ACCESS_KEY = 'denog-concept-access-v2';
  const ACCESS_HASH = '2789c64f61f552e96f874a9082bcd2cfd663d000dfbbca78021f5352419484ef';
  const page = document.querySelector('.page-shell');
  const isEnglish = document.documentElement.lang === 'en';

  function unlock() {
    document.body.classList.remove('is-locked');
    if (page) page.hidden = false;
    document.querySelector('.access-gate')?.remove();
  }

  async function hash(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function showGate() {
    const copy = isEnglish ? {
      kicker: 'Interactive concept draft',
      title: 'A new digital <i>home.</i>',
      body: 'Concept for the next DENOG web presence — including the public website, member area and editorial system. Content and functionality provide a concrete basis for joint review.',
      label: 'Presentation password',
      placeholder: 'Enter password',
      button: 'Open concept',
      error: 'That password is not correct. Please try again.',
      note: 'Vachsystems · Concept presentation · August 2026'
    } : {
      kicker: 'Interaktiver Konzeptentwurf',
      title: 'Eine neue digitale <i>Heimat.</i>',
      body: 'Konzept für die Weiterentwicklung der DENOG-Webpräsenz – mit öffentlicher Website, Mitgliederbereich und Redaktionssystem. Inhalte und Funktionen dienen als konkrete Grundlage für die gemeinsame Abstimmung.',
      label: 'Präsentationspasswort',
      placeholder: 'Passwort eingeben',
      button: 'Konzept öffnen',
      error: 'Das Passwort ist nicht korrekt. Bitte erneut versuchen.',
      note: 'Vachsystems · Konzeptpräsentation · August 2026'
    };

    const gate = document.createElement('main');
    gate.className = 'access-gate';
    gate.innerHTML = `
      <section class="access-card" aria-labelledby="access-title">
        <a class="brand" href="https://vachsystems.de" aria-label="Vachsystems">
          <span>VACH</span><span>SYSTEMS</span><i>Digital Studio</i>
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
          unlock();
          document.querySelector('h1')?.focus({ preventScroll: true });
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

  try {
    if (sessionStorage.getItem(ACCESS_KEY) === 'granted') unlock();
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
