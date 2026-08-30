import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(sourceDir);
const BASE = '/Projektvorschau';
const ORIGIN = 'https://vachsystems.de';

const routes = {
  de: {
    home: '/', events: '/events/', knowledge: '/wissen/', workingGroups: '/working-groups/', association: '/verein/', denog18: '/denog18/', member: '/mitglieder/', backend: '/backend/', concept: '/konzept/'
  },
  en: {
    home: '/en/', events: '/en/events/', knowledge: '/en/knowledge/', workingGroups: '/en/working-groups/', association: '/en/association/', denog18: '/en/denog18/', member: '/en/member-area/', backend: '/en/editorial-system/', concept: '/en/concept/'
  }
};

const paired = Object.fromEntries(Object.keys(routes.de).flatMap((key) => [
  [`de:${key}`, routes.en[key]],
  [`en:${key}`, routes.de[key]]
]));

function href(path = '/') {
  if (path === '/') return `${BASE}/`;
  return `${BASE}${path}`;
}

function ext(url, label, className = '') {
  return `<a${className ? ` class="${className} external"` : ' class="external"'} href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function brand() {
  return `<span class="brand" aria-label="DENOG e. V."><span>DE</span><span>NOG</span><i>e. V.</i></span>`;
}

function header(locale, active, alternatePath) {
  const de = locale === 'de';
  const r = routes[locale];
  const labels = de
    ? { home: 'Start', events: 'Termine', knowledge: 'Wissen', workingGroups: 'Working Groups', association: 'Verein', join: 'Mitglied werden', menu: 'Menü öffnen', close: 'Menü schließen' }
    : { home: 'Home', events: 'Events', knowledge: 'Knowledge', workingGroups: 'Working Groups', association: 'Association', join: 'Become a member', menu: 'Open menu', close: 'Close menu' };
  const nav = ['home', 'events', 'knowledge', 'workingGroups', 'association'];
  const currentPath = routes[locale][active] || routes[locale].concept;
  const navLinks = nav.map((key) => `<a href="${href(r[key])}"${active === key ? ' aria-current="page"' : ''}>${labels[key]}</a>`).join('');
  return `
    <a class="skip-link" href="#main-content">${de ? 'Zum Inhalt springen' : 'Skip to content'}</a>
    <header class="site-header">
      <a href="${href(r.home)}" aria-label="DENOG ${de ? 'Startseite' : 'home'}">${brand()}</a>
      <nav aria-label="${de ? 'Hauptnavigation' : 'Main navigation'}">${navLinks}</nav>
      <div class="header-actions">
        <div class="lang-switch" aria-label="Language"><a class="${de ? 'active' : ''}" href="${de ? href(currentPath) : href(alternatePath)}" lang="de">DE</a><span>/</span><a class="${de ? '' : 'active'}" href="${de ? href(alternatePath) : href(currentPath)}" lang="en">EN</a></div>
        <a class="primary-link" href="${de ? 'https://www.denog.de/de/governance/become_member.html' : 'https://www.denog.de/en/governance/become_member.html'}" target="_blank" rel="noopener noreferrer">${labels.join} ↗</a>
      </div>
      <button class="menu-button" type="button" aria-label="${labels.menu}" aria-expanded="false" aria-controls="mobile-menu">☰</button>
    </header>
    <aside class="mobile-nav" id="mobile-menu" aria-hidden="true">
      <div class="mobile-nav-head"><a href="${href(r.home)}">${brand()}</a><button class="mobile-nav-close" type="button" aria-label="${labels.close}">×</button></div>
      <nav aria-label="${de ? 'Mobile Navigation' : 'Mobile navigation'}">${navLinks}</nav>
      <p class="mobile-nav-foot"><a href="${href(alternatePath)}">${de ? 'English version' : 'Deutsche Version'} →</a></p>
    </aside>`;
}

function footer(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  return `
    <footer class="site-footer">
      <div>${brand()}<p>German Network Operators Group<br>${de ? 'Von der Community. Für die Community.' : 'By the community. For the community.'}</p></div>
      <nav class="footer-links" aria-label="${de ? 'Fußnavigation' : 'Footer navigation'}">
        <a href="${href(r.events)}">${de ? 'Termine' : 'Events'}</a>
        <a href="${href(r.knowledge)}">${de ? 'Wissen' : 'Knowledge'}</a>
        <a href="${href(r.workingGroups)}">Working Groups</a>
        <a href="${href(r.association)}">${de ? 'Verein & Governance' : 'Association & governance'}</a>
        ${ext('https://www.denog.de/de/kontakt.html', de ? 'Kontakt' : 'Contact')}
        ${ext('https://www.denog.de/de/impressum.html', de ? 'Impressum & Datenschutz' : 'Legal & privacy')}
      </nav>
      <p class="footer-claim">${de ? 'Netze verbinden Menschen.' : 'Networks connect people.'}</p>
      <div class="footer-bottom"><span>DENOG e. V. · ${de ? 'Konzeptansicht' : 'Concept preview'} · 2026</span><span>${de ? 'Offen · unabhängig · technisch' : 'Open · independent · technical'}</span></div>
    </footer>`;
}

function dock(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  return `<nav class="concept-dock" aria-label="${de ? 'Konzeptmodule' : 'Concept modules'}"><span>${de ? 'Konzeptmodus' : 'Concept mode'}</span><a href="${href(r.member)}">${de ? 'Mitglieder' : 'Members'}</a><a href="${href(r.backend)}">${de ? 'Redaktion' : 'Editorial'}</a><a href="${href(r.concept)}">${de ? 'Umfang' : 'Scope'}</a></nav>`;
}

function layout({ locale, key, title, description, content, app = false }) {
  const route = routes[locale][key];
  const alternatePath = paired[`${locale}:${key}`];
  const canonical = `${ORIGIN}${href(route)}`;
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f2f0e8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="noindex, nofollow, nocache">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${locale}" href="${canonical}">
  <link rel="alternate" hreflang="${alternateLocale}" href="${ORIGIN}${href(alternatePath)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${locale === 'de' ? 'de_DE' : 'en_GB'}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ORIGIN}${BASE}/denog-stage.jpg">
  <link rel="icon" href="${BASE}/favicon.svg">
  <link rel="stylesheet" href="${BASE}/site.css">
  <script src="${BASE}/site.js" defer></script>
</head>
<body class="is-locked">
  <noscript><div class="noscript">${locale === 'de' ? 'Für diese interaktive Konzeptansicht muss JavaScript aktiviert sein.' : 'JavaScript must be enabled for this interactive concept preview.'}</div></noscript>
  <div class="page-shell${app ? ' app-preview' : ''}" hidden>
    ${content.trim()}
  </div>
</body>
</html>\n`;
}

function home(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  const t = de ? {
    title: 'DENOG — Das Internet ist Teamarbeit',
    desc: 'Konzept für die neue digitale Heimat der German Network Operators Group.',
    issue: 'German Network Operators Group', since: 'Community seit 2017',
    h1: 'Das Internet<br>ist <i>Teamarbeit.</i>',
    lead: 'Wir bringen die Menschen zusammen, die Netze planen, betreiben und weiterdenken.',
    ticket: 'Tickets für DENOG18', city: 'Essen<br>15.–17. November 2026',
    caption: 'DENOG17 · Community im Austausch', stamp: 'DIE<br>MENSCHEN<br>HINTER<br>DEM NETZ',
    next: 'Als Nächstes', sep: '09 SEP · Meetup Düsseldorf', oct: '01 OKT · Meetup Nürnberg', nov: '15–17 NOV · DENOG18 Essen',
    connection: 'Was uns verbindet', notAudience: 'Kein Publikum. Eine Community.',
    statement: 'Menschen, die das Internet nicht nur benutzen – sondern dafür sorgen, dass es <em>funktioniert.</em>',
    statementText: 'DENOG ist das unabhängige technische Forum für Erfahrungsaustausch, offene Diskussionen und gemeinsame Lösungen. Sachlich, herstellerneutral und von der Community getragen.',
    community: 'Community & Verein entdecken', conference: 'Die Jahreskonferenz', days: 'DENOG<span>18</span>',
    conferenceText: 'Drei Tage Workshops, Vorträge und Begegnungen im Haus der Technik in Essen – mit einem klaren Einstieg für Erstbesucherinnen und Erstbesucher.',
    detail: 'Konferenz entdecken', tickets: 'Ticket sichern', program: '15—17', programMonth: 'NOV 2026', programTitle: 'Wissen teilen.<br>Menschen treffen.', programFoot: 'Workshops · Konferenz · Community-Abend',
    priorities: 'Die Community im Mittelpunkt', prioritiesTitle: 'Mehr als eine Website.', prioritiesText: 'Der neue Auftritt macht Beteiligung einfacher: vom ersten Meetup über Working Groups und Wissensarchiv bis zur Mitgliedschaft.',
    wg: 'Working Groups', wgText: 'Aufgaben, Kontakte, Kanäle, Veröffentlichungen und nächste Termine transparent an einem Ort.',
    welcome: 'Willkommen bei DENOG', welcomeText: 'Ein klarer Einstieg für Studierende, Juniors und erfahrene Neuankömmlinge – inklusive Mentoring.',
    knowledge: 'Offenes Wissen', knowledgeText: 'Vorträge, Best Practices, Routing Guide und Community-Beiträge strukturiert und durchsuchbar.',
    membership: 'DENOG e. V.', membershipTitle: 'Mitmachen ist Teil des Systems.', membershipText: 'Der Verein gibt der Community Struktur. Mitgliedschaft, Dokumente und Vorstandsarbeit werden nachvollziehbar; der Mitgliederbereich bündelt Self-Services und Beteiligung.',
    membershipLink: 'Verein & Governance', memberPreview: 'Mitgliederbereich ansehen'
  } : {
    title: 'DENOG — The Internet is teamwork',
    desc: 'Concept for the new digital home of the German Network Operators Group.',
    issue: 'German Network Operators Group', since: 'Community since 2017',
    h1: 'The Internet<br>is <i>teamwork.</i>', lead: 'We bring together the people who design, operate and advance networks.',
    ticket: 'Tickets for DENOG18', city: 'Essen<br>15–17 November 2026', caption: 'DENOG17 · Community in conversation', stamp: 'THE<br>PEOPLE<br>BEHIND<br>THE NET',
    next: 'Up next', sep: '09 SEP · Düsseldorf meetup', oct: '01 OCT · Nuremberg meetup', nov: '15–17 NOV · DENOG18 Essen',
    connection: 'What connects us', notAudience: 'Not an audience. A community.', statement: 'People who do not merely use the Internet — but make sure it <em>works.</em>',
    statementText: 'DENOG is an independent technical forum for exchanging experience, open discussion and shared solutions. Fact-based, vendor-neutral and community-led.', community: 'Discover community & association',
    conference: 'The annual conference', days: 'DENOG<span>18</span>', conferenceText: 'Three days of workshops, talks and conversation at Haus der Technik in Essen — with a clear path for first-time attendees.', detail: 'Explore the conference', tickets: 'Get a ticket', program: '15—17', programMonth: 'NOV 2026', programTitle: 'Share knowledge.<br>Meet people.', programFoot: 'Workshops · Conference · Community evening',
    priorities: 'Community first', prioritiesTitle: 'More than a website.', prioritiesText: 'The new presence makes participation easier — from a first meetup to working groups, the knowledge archive and membership.',
    wg: 'Working Groups', wgText: 'Scope, contacts, channels, publications and upcoming dates in one transparent place.', welcome: 'Welcome to DENOG', welcomeText: 'A clear entry point for students, juniors and experienced newcomers — including mentoring.', knowledge: 'Open knowledge', knowledgeText: 'Talks, best practices, the Routing Guide and community posts — structured and searchable.',
    membership: 'DENOG e. V.', membershipTitle: 'Participation is part of the system.', membershipText: 'The association gives the community structure. Membership, documents and board work become transparent; the member area brings self-service and participation together.', membershipLink: 'Association & governance', memberPreview: 'View member area'
  };
  const content = `${header(locale, 'home', routes[locale === 'de' ? 'en' : 'de'].home)}
    <main id="main-content">
      <section class="hero">
        <div class="hero-copy"><p class="issue-line"><span>${t.issue}</span><b>${t.since}</b></p><div><h1 tabindex="-1">${t.h1}</h1><p class="hero-deck">${t.lead}</p></div><div class="hero-bottom"><a class="primary-link" href="${href(r.denog18)}">${t.ticket} →</a><p class="hero-meta">${t.city}</p></div></div>
        <figure class="hero-visual"><img src="${BASE}/denog-stage.jpg" alt="${de ? 'Blick in den besetzten Saal einer DENOG-Konferenz' : 'Audience at a DENOG conference'}"><figcaption class="photo-caption"><span>${t.caption}</span></figcaption><b class="photo-stamp">${t.stamp}</b></figure>
      </section>
      <div class="ticker" aria-label="${de ? 'Aktuelle Termine' : 'Upcoming events'}"><span>${t.next}</span><p>${t.sep}</p><i>◆</i><p>${t.oct}</p><i>◆</i><p>${t.nov}</p></div>
      <section class="statement"><p class="side-label">${t.connection}</p><div><p class="eyebrow">${t.notAudience}</p><h2>${t.statement}</h2><div class="statement-foot"><p>${t.statementText}</p><a class="text-link" href="${href(r.association)}">${t.community} →</a></div></div></section>
      <section class="split-feature"><div class="split-feature-copy"><p class="eyebrow light">${t.conference}</p><h2>${t.days}</h2><p>${t.conferenceText}</p><div class="inline-actions"><a class="text-link" href="${href(r.denog18)}">${t.detail} →</a>${ext('https://pretix.eu/denog/denog18/', t.tickets, 'text-link')}</div></div><article class="event-poster"><p class="big-date">${t.program}<small>${t.programMonth}</small></p><h3>${t.programTitle}</h3><div class="event-poster-foot"><span>Essen · Haus der Technik</span><span>${t.programFoot}</span></div></article></section>
      <section class="section"><div class="section-head"><div><p class="eyebrow">${t.priorities}</p><h2>${t.prioritiesTitle}</h2></div><p>${t.prioritiesText}</p></div><div class="cards"><article class="card"><span class="card-number">01</span><h3>${t.wg}</h3><p>${t.wgText}</p><a class="text-link" href="${href(r.workingGroups)}">${de ? 'Arbeitsgruppen öffnen' : 'Open working groups'} →</a></article><article class="card acid"><span class="card-number">02</span><h3>${t.welcome}</h3><p>${t.welcomeText}</p><a class="text-link" href="${href(r.workingGroups)}#welcome">${de ? 'Einstieg finden' : 'Find your way in'} →</a></article><article class="card blue"><span class="card-number">03</span><h3>${t.knowledge}</h3><p>${t.knowledgeText}</p><a class="text-link" href="${href(r.knowledge)}">${de ? 'Wissen durchsuchen' : 'Search knowledge'} →</a></article></div></section>
      <section class="photo-copy"><figure><img src="${BASE}/denog-meetup.jpg" alt="${de ? 'DENOG-Mitglieder im Gespräch bei einem Meetup' : 'DENOG members talking at a meetup'}"></figure><div><p class="eyebrow">${t.membership}</p><h2>${t.membershipTitle}</h2><p>${t.membershipText}</p><div class="inline-actions"><a class="text-link" href="${href(r.association)}">${t.membershipLink} →</a><a class="text-link" href="${href(r.member)}">${t.memberPreview} →</a></div></div></section>
    </main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'home', title: t.title, description: t.desc, content });
}

const events = [
  { day: '09', monthDe: 'SEP 2026', monthEn: 'SEP 2026', type: 'meetup', kickerDe: 'Meetup · Düsseldorf', kickerEn: 'Meetup · Düsseldorf', titleDe: 'Zu Gast bei sipgate', titleEn: 'Hosted by sipgate', detailsDe: '18:30–22:30 · Gladbacher Straße 74', detailsEn: '18:30–22:30 · Gladbacher Straße 74', url: 'https://www.denog.de/de/events/meetup-2026-09.html' },
  { day: '01', monthDe: 'OKT 2026', monthEn: 'OCT 2026', type: 'meetup', kickerDe: 'Meetup · Nürnberg', kickerEn: 'Meetup · Nuremberg', titleDe: 'Zu Gast bei qSkills', titleEn: 'Hosted by qSkills', detailsDe: '18:30–22:30 · Südwestpark 65', detailsEn: '18:30–22:30 · Südwestpark 65', url: 'https://www.denog.de/de/events/meetup-2026-10.html' },
  { day: '15', monthDe: 'NOV 2026', monthEn: 'NOV 2026', type: 'conference', kickerDe: 'Jahreskonferenz · Essen', kickerEn: 'Annual conference · Essen', titleDe: 'DENOG18', titleEn: 'DENOG18', detailsDe: '15.–17. November · Haus der Technik', detailsEn: '15–17 November · Haus der Technik', internal: true }
];

function eventsPage(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  const rows = events.map((event) => `<article class="event-row" data-event-type="${event.type}"><time datetime="2026-${event.monthDe.startsWith('SEP') ? '09-09' : event.monthDe.startsWith('OKT') ? '10-01' : '11-15'}"><b>${event.day}</b><span>${de ? event.monthDe : event.monthEn}</span></time><div><p class="event-type">${de ? event.kickerDe : event.kickerEn}</p><h2>${de ? event.titleDe : event.titleEn}</h2></div><p class="details">${de ? event.detailsDe : event.detailsEn}</p>${event.internal ? `<a class="round-link" href="${href(r.denog18)}" aria-label="DENOG18 ${de ? 'öffnen' : 'open'}">→</a>` : `<a class="round-link" href="${event.url}" target="_blank" rel="noopener noreferrer" aria-label="${de ? event.titleDe : event.titleEn} ${de ? 'extern öffnen' : 'open externally'}">↗</a>`}</article>`).join('');
  const content = `${header(locale, 'events', routes[locale === 'de' ? 'en' : 'de'].events)}<main id="main-content"><section class="page-mast"><p class="kicker">${de ? 'Begegnungen, die weiterbringen' : 'Meetings that move us forward'}</p><div class="mast-grid"><h1 tabindex="-1">${de ? 'Nächster <i>Stopp.</i>' : 'Next <i>stop.</i>'}</h1><p class="lead">${de ? 'Meetups, Workshops, Member Days und die Jahreskonferenz – an einem Ort, filterbar und direkt im eigenen Kalender.' : 'Meetups, workshops, Member Days and the annual conference — in one place, filterable and ready for your calendar.'}</p></div></section><div class="control-bar"><button class="selected" data-event-filter="all">${de ? 'Alle' : 'All'}</button><button data-event-filter="meetup">Meetups</button><button data-event-filter="conference">${de ? 'Konferenz' : 'Conference'}</button><a class="primary-link" href="${BASE}/denog-events-2026.ics" download>${de ? 'Kalender abonnieren' : 'Add calendar'} ↓</a><span class="control-meta" data-event-count>${events.length} ${de ? 'Termine' : 'events'}</span></div><section class="event-list">${rows}<div class="empty-state" data-event-empty hidden>${de ? 'Für diesen Filter sind aktuell keine Termine veröffentlicht.' : 'No events are currently published for this filter.'}</div></section><section class="statement"><p class="side-label">${de ? 'Mitgestalten' : 'Take part'}</p><div><p class="eyebrow">${de ? 'Deine Stadt. Dein Thema.' : 'Your city. Your topic.'}</p><h2>${de ? 'Ein Meetup beginnt mit einer <em>Idee.</em>' : 'A meetup starts with an <em>idea.</em>'}</h2><div class="statement-foot"><p>${de ? 'Hosts, Vortragende und helfende Hände machen das Format möglich. Die neue Website bündelt Einreichung, Organisation und Bewerbung.' : 'Hosts, speakers and volunteers make the format possible. The new website brings submission, organisation and promotion together.'}</p>${ext('https://www.denog.de/de/meetups.html', de ? 'Meetup vorschlagen' : 'Propose a meetup', 'text-link')}</div></div></section></main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'events', title: de ? 'Termine — DENOG' : 'Events — DENOG', description: de ? 'Meetups, Workshops und Konferenzen der DENOG Community.' : 'Meetups, workshops and conferences of the DENOG community.', content });
}

const knowledgeEntries = [
  { type: 'guide', topicDe: 'Best Practice · Routing', topicEn: 'Best practice · Routing', titleDe: 'BGP, RPKI und robuste Routing-Policies', titleEn: 'BGP, RPKI and robust routing policies', metaDe: 'Routing Guide · laufend aktualisiert', metaEn: 'Routing Guide · continuously updated', search: 'bgp rpki routing route origin validation rov asn peering policy routing guide', url: 'https://routing.denog.de/' },
  { type: 'video', topicDe: 'Konferenzarchiv', topicEn: 'Conference archive', titleDe: 'DENOG17: Vorträge, Folien und Aufzeichnungen', titleEn: 'DENOG17: talks, slides and recordings', metaDe: 'Video & Folien · 2025', metaEn: 'Video & slides · 2025', search: 'denog17 video folien slides recording conference bgp', url: 'https://media.denog.de/' },
  { type: 'working-group', topicDe: 'Working Group · Routing', topicEn: 'Working Group · Routing', titleDe: 'Austausch aus dem laufenden Netzbetrieb', titleEn: 'Exchange from day-to-day network operations', metaDe: 'Termine & Materialien', metaEn: 'Dates & materials', search: 'routing working group wg betrieb bgp peering', internal: 'workingGroups' },
  { type: 'article', topicDe: 'Community-Blog', topicEn: 'Community blog', titleDe: 'Perspektiven auf Internet, Verein und Community', titleEn: 'Perspectives on the Internet, association and community', metaDe: 'Beiträge · Community', metaEn: 'Posts · Community', search: 'community blog verein association internet outreach', url: 'https://blog.denog.de/' },
  { type: 'guide', topicDe: 'Onboarding', topicEn: 'Onboarding', titleDe: 'Deine erste DENOG-Konferenz: der Einstieg', titleEn: 'Your first DENOG conference: getting started', metaDe: 'Welcome WG · Leitfaden', metaEn: 'Welcome WG · Guide', search: 'newcomer neu junior student conference first mentoring welcome', internal: 'denog18' },
  { type: 'article', topicDe: 'Governance', topicEn: 'Governance', titleDe: 'Vorstandsberichte, Entscheidungen und Vereinsdokumente', titleEn: 'Board reports, decisions and association documents', metaDe: 'Dokumente · transparent', metaEn: 'Documents · transparent', search: 'vorstand board reports protokolle governance satzung documents', internal: 'association' }
];

function knowledgePage(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  const items = knowledgeEntries.map((item) => `<article class="knowledge-item" data-knowledge-item data-knowledge-type="${item.type}" data-search="${item.search} ${item.titleDe} ${item.titleEn}"><div><p class="topic">${de ? item.topicDe : item.topicEn}</p><h2>${de ? item.titleDe : item.titleEn}</h2></div><p class="meta">${de ? item.metaDe : item.metaEn}</p>${item.internal ? `<a class="round-link" href="${href(r[item.internal])}" aria-label="${de ? item.titleDe : item.titleEn}">→</a>` : `<a class="round-link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${de ? 'Extern öffnen' : 'Open externally'}">↗</a>`}</article>`).join('');
  const content = `${header(locale, 'knowledge', routes[locale === 'de' ? 'en' : 'de'].knowledge)}<main id="main-content"><section class="page-mast"><p class="kicker">${de ? 'Geteiltes Wissen verbindet' : 'Shared knowledge connects'}</p><div class="mast-grid"><div><h1 tabindex="-1">${de ? 'Wissen, das <i>bleibt.</i>' : 'Knowledge that <i>lasts.</i>'}</h1><label class="search-box"><span class="sr-only">${de ? 'Wissen durchsuchen' : 'Search knowledge'}</span><input data-knowledge-search type="search" placeholder="${de ? 'Suche nach BGP, RPKI, Peering …' : 'Search BGP, RPKI, peering …'}"><span aria-hidden="true">⌕</span></label></div><p class="lead">${de ? 'Vorträge, Leitfäden, Working-Group-Ergebnisse und Vereinswissen – übergreifend durchsuchbar statt über Einzelseiten verstreut.' : 'Talks, guides, working-group output and association knowledge — searchable across one archive instead of scattered pages.'}</p></div></section><section class="knowledge-list"><div class="knowledge-grid"><aside class="filter-side"><p>${de ? 'Filtern nach' : 'Filter by'}</p><button class="selected" data-knowledge-filter="all">${de ? 'Alle Inhalte' : 'All content'}</button><button data-knowledge-filter="guide">Guides</button><button data-knowledge-filter="video">Video</button><button data-knowledge-filter="working-group">Working Groups</button><button data-knowledge-filter="article">${de ? 'Beiträge' : 'Articles'}</button></aside><div><p class="eyebrow" data-knowledge-count>${knowledgeEntries.length} ${de ? 'Ergebnisse' : 'results'}</p>${items}<div class="empty-state" data-knowledge-empty hidden>${de ? 'Keine Treffer. Versuche einen anderen Begriff oder setze den Filter zurück.' : 'No results. Try another term or reset the filter.'}</div></div></div></section></main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'knowledge', title: de ? 'Wissen — DENOG' : 'Knowledge — DENOG', description: de ? 'Technisches Wissen, Vorträge und Leitfäden aus der DENOG Community.' : 'Technical knowledge, talks and guides from the DENOG community.', content });
}

function workingGroupsPage(locale) {
  const de = locale === 'de';
  const groups = [
    { id: 'routing', status: de ? 'Aktiv' : 'Active', name: 'Routing', text: de ? 'Best Practices für einen stabilen, sicheren und nachvollziehbaren Routing-Betrieb – mit offenem Routing Guide und Austausch aus der Praxis.' : 'Best practices for stable, secure and transparent routing operations — with an open Routing Guide and practical exchange.', outputs: 'Routing Guide · GitHub', next: de ? 'Offener Online-Termin' : 'Open online session' },
    { id: 'access', status: de ? 'Im Aufbau' : 'Being formed', name: 'Access', text: de ? 'Austausch zu Zugangsnetzen, Technologien und Betrieb. Der zentrale Beitritt funktioniert ohne verpflichtendes Google-Konto.' : 'Exchange about access networks, technology and operations. The central join path does not require a Google account.', outputs: de ? 'Online-Talks · Materialien' : 'Online talks · Resources', next: de ? 'Themen- und Teilnehmendenaufruf' : 'Call for topics and contributors' },
    { id: 'welcome', status: de ? 'Aktivierung 2026' : 'Activation 2026', name: 'Welcome', text: de ? 'Der Einstieg für Studierende, Juniors, Lehrende und erfahrene Neuankömmlinge – mit Mentoring, Conference Guide und sozialem Onboarding.' : 'An entry point for students, juniors, educators and experienced newcomers — with mentoring, a conference guide and social onboarding.', outputs: de ? 'Mentoring · First Conference Guide' : 'Mentoring · First conference guide', next: 'DENOG18 Onboarding' },
    { id: 'outreach', status: de ? 'Im Aufbau' : 'Being formed', name: 'Outreach', text: de ? 'Klare, faktenbasierte Kommunikation: DENOG als neutrale technische Anlaufstelle für Standards, Best Practices und die deutsche Netzcommunity.' : 'Clear, fact-based communication: DENOG as the neutral technical contact for standards, best practices and the German network community.', outputs: de ? 'Mission · One-Pager · Medienkit' : 'Mission · One-pager · Media kit', next: de ? 'Community Review' : 'Community review' }
  ];
  const cards = groups.map((group, i) => `<article class="wg-card" id="${group.id}"><div class="wg-card-top"><span><i class="status-dot"></i>${group.status}</span><span>0${i + 1}</span></div><h2>${group.name}</h2><p>${group.text}</p><ul class="wg-meta"><li><b>${de ? 'Leitung' : 'Chairs'}</b><span>${de ? 'WG Chairs · Kontakt über DENOG' : 'WG chairs · Contact via DENOG'}</span></li><li><b>${de ? 'Kanäle' : 'Channels'}</b><span>${de ? 'Mailingliste · Community-Chat' : 'Mailing list · Community chat'}</span></li><li><b>${de ? 'Ergebnisse' : 'Outputs'}</b><span>${group.outputs}</span></li><li><b>${de ? 'Nächster Schritt' : 'Next step'}</b><span>${group.next}</span></li><li><b>${de ? 'Mitmachen' : 'Join'}</b><span>${ext('https://www.denog.de/de/wg.html', de ? 'Kontakt & Zugang' : 'Contact & access')}</span></li></ul></article>`).join('');
  const content = `${header(locale, 'workingGroups', routes[locale === 'de' ? 'en' : 'de'].workingGroups)}<main id="main-content"><section class="page-mast"><p class="kicker">${de ? 'Offen arbeiten. Sichtbar berichten.' : 'Work openly. Report visibly.'}</p><div class="mast-grid"><h1 tabindex="-1">Working<br><i>Groups.</i></h1><p class="lead">${de ? 'Jede Gruppe zeigt Aufgabe, Leitung, Kommunikationskanäle, Veröffentlichungen und nächste Termine. So wird Beteiligung nachvollziehbar und der Einstieg einfacher.' : 'Every group shows its scope, chairs, communication channels, publications and upcoming dates. Participation becomes transparent and joining becomes easier.'}</p></div></section><section class="wg-grid">${cards}</section><section class="statement"><p class="side-label">${de ? 'Gemeinsam arbeiten' : 'Work together'}</p><div><p class="eyebrow">${de ? 'Ein Zugang für alle Gruppen' : 'One entry point for every group'}</p><h2>${de ? 'Interesse zeigen. Passende Gruppe finden. <em>Loslegen.</em>' : 'Show interest. Find your group. <em>Get started.</em>'}</h2><div class="statement-foot"><p>${de ? 'Ein zentrales Formular leitet Interessierte an die richtige Working Group weiter. Kein Plattformkonto als Voraussetzung, klare Regeln und regelmäßige öffentliche Berichte.' : 'A central form routes interested people to the right working group. No platform account required, clear rules and regular public reports.'}</p><a class="text-link" href="mailto:info@denog.de?subject=Working%20Groups">${de ? 'Interesse melden' : 'Register interest'} →</a></div></div></section></main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'workingGroups', title: 'Working Groups — DENOG', description: de ? 'Arbeitsgruppen, Kontakte und Ergebnisse der DENOG Community.' : 'Working groups, contacts and output from the DENOG community.', content });
}

function associationPage(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  const docs = [
    [de ? 'Vereinsrecht' : 'Association', de ? 'Satzung & Ordnungen' : 'Statutes & regulations', de ? 'Stand 2025' : 'Updated 2025', 'https://www.denog.de/de/governance/documents.html'],
    [de ? 'Transparenz' : 'Transparency', de ? 'Vorstandsberichte & Beschlüsse' : 'Board reports & decisions', '2023–2026', 'https://www.denog.de/de/governance/board_documents.html'],
    [de ? 'Miteinander' : 'Community', 'Code of Conduct', de ? 'Verbindlicher Rahmen' : 'Binding framework', 'https://www.denog.de/de/governance/documents.html'],
    [de ? 'Mitgliedschaft' : 'Membership', de ? 'Aufnahme- & Beitragsordnung' : 'Admission & contribution rules', de ? 'Aktueller Stand' : 'Current version', 'https://www.denog.de/de/governance/documents.html']
  ].map(([kind, title, date, url]) => `<a class="document-row" href="${url}" target="_blank" rel="noopener noreferrer"><span class="doc-kind">${kind}</span><h3>${title}</h3><time>${date}</time><span aria-hidden="true">↗</span></a>`).join('');
  const content = `${header(locale, 'association', routes[locale === 'de' ? 'en' : 'de'].association)}<main id="main-content"><section class="page-mast"><p class="kicker">DENOG e. V. · ${de ? 'Offen und unabhängig' : 'Open and independent'}</p><div class="mast-grid"><h1 tabindex="-1">${de ? 'Community mit <i>Rückgrat.</i>' : 'Community with a <i>backbone.</i>'}</h1><p class="lead">${de ? 'Der Verein schafft den verlässlichen Rahmen für eine neutrale technische Community. Entscheidungen, Dokumente, Beteiligungswege und Zuständigkeiten werden sichtbar.' : 'The association provides a dependable framework for a neutral technical community. Decisions, documents, ways to participate and responsibilities become visible.'}</p></div></section><section class="section"><div class="section-head"><div><p class="eyebrow">${de ? 'Wofür DENOG steht' : 'What DENOG stands for'}</p><h2>${de ? 'Fachlich. Neutral. Gemeinsam.' : 'Technical. Neutral. Together.'}</h2></div><p>${de ? 'DENOG bringt Netzbetreiber, Administratorinnen, technische Expertinnen, Unternehmen und Partner zusammen – faktenbasiert, herstellerneutral und ohne parteipolitische Positionierung.' : 'DENOG brings network operators, administrators, technical experts, companies and partners together — fact-based, vendor-neutral and without party-political positioning.'}</p></div><div class="cards"><article class="card"><span class="card-number">01</span><h3>${de ? 'Mitglied werden' : 'Become a member'}</h3><p>${de ? 'Einfacher Antrag, verständliche Mitgliedsmodelle und klarer Status.' : 'A simple application, understandable membership models and clear status.'}</p>${ext('https://www.denog.de/de/governance/become_member.html', de ? 'Antrag öffnen' : 'Open application', 'text-link')}</article><article class="card acid"><span class="card-number">02</span><h3>${de ? 'Vorstandsarbeit' : 'Board work'}</h3><p>${de ? 'Berichte, Entscheidungen und Zuständigkeiten in einer durchsuchbaren Chronik.' : 'Reports, decisions and responsibilities in a searchable timeline.'}</p>${ext('https://www.denog.de/de/governance/board_documents.html', de ? 'Berichte lesen' : 'Read reports', 'text-link')}</article><article class="card blue"><span class="card-number">03</span><h3>${de ? 'Selbst verwalten' : 'Self-service'}</h3><p>${de ? 'Stammdaten, Status, Beitragsdokumente und Beteiligung sicher an einem Ort.' : 'Profile, status, contribution documents and participation securely in one place.'}</p><a class="text-link" href="${href(r.member)}">${de ? 'Funktionsvorschau' : 'Feature preview'} →</a></article></div></section><section class="section" style="padding-top:20px"><div class="section-head"><div><p class="eyebrow">${de ? 'Dokumente & Governance' : 'Documents & governance'}</p><h2>${de ? 'Nachvollziehbar statt versteckt.' : 'Traceable, not hidden.'}</h2></div><p>${de ? 'Die öffentliche Dokumentenbibliothek ordnet zentrale Vereinsunterlagen nach Typ und Aktualität. Vorstandsberichte erhalten eine eigene, leicht auffindbare Chronik.' : 'The public document library organises key association documents by type and date. Board reports receive a dedicated, easy-to-find timeline.'}</p></div><div class="document-list">${docs}</div></section><section class="split-feature"><div class="split-feature-copy"><p class="eyebrow light">${de ? 'Fördermitglieder & Partner' : 'Sustaining members & partners'}</p><h2>${de ? 'Tragen.<br><span>Ermöglichen.</span>' : 'Support.<br><span>Enable.</span>'}</h2><p>${de ? 'Fördermitglieder machen Community-Formate möglich. Ein eigenständiger Bereich erklärt Wirkung, Modelle und Ansprechpartner und würdigt Partner sichtbar, ohne die fachliche Neutralität zu verwässern.' : 'Sustaining members enable community programmes. A dedicated area explains impact, models and contacts and visibly recognises partners without weakening technical neutrality.'}</p></div><article class="event-poster"><p class="eyebrow">${de ? 'Transparenzversprechen' : 'Transparency promise'}</p><h3>${de ? 'Klare Rollen.<br>Offene Berichte.<br>Lebendiger CoC.' : 'Clear roles.<br>Open reports.<br>A living CoC.'}</h3><div class="event-poster-foot"><span>DENOG e. V.</span><span>${de ? 'Community first' : 'Community first'}</span></div></article></section></main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'association', title: de ? 'Verein & Governance — DENOG' : 'Association & governance — DENOG', description: de ? 'Mitgliedschaft, Governance und Dokumente des DENOG e. V.' : 'Membership, governance and documents of DENOG e. V.', content });
}

function denog18Page(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  const agenda = [
    ['SO · 15 NOV', de ? 'Workshops' : 'Workshops', de ? 'Hands-on Sessions, Community-Auftakt und erster Kontakt für Neuankömmlinge.' : 'Hands-on sessions, community kick-off and first contact for newcomers.'],
    ['MO · 16 NOV', de ? 'Konferenztag 1' : 'Conference day 1', de ? 'Technische Vorträge, Austauschpausen und gemeinsamer Community-Abend.' : 'Technical talks, exchange breaks and a shared community evening.'],
    ['DI · 17 NOV', de ? 'Konferenztag 2' : 'Conference day 2', de ? 'Vorträge, Working-Group-Updates und gemeinsamer Abschluss.' : 'Talks, working-group updates and a shared closing session.']
  ].map(([time, label, text]) => `<div class="agenda-row"><time>${time}</time><b>${label}</b><p>${text}</p></div>`).join('');
  const content = `${header(locale, 'denog18', routes[locale === 'de' ? 'en' : 'de'].denog18)}<main id="main-content"><section class="detail-hero"><div class="detail-date"><span>DENOG18 · ESSEN</span><b>15—17</b><span>NOVEMBER · 2026</span></div><div class="detail-copy"><p class="eyebrow light">${de ? 'Die Jahreskonferenz' : 'The annual conference'}</p><h1 tabindex="-1">${de ? 'Das Netz trifft sich.' : 'The network meets.'}</h1><p>${de ? 'Drei Tage technisches Programm, Workshops und Gespräche im Haus der Technik. Für erfahrene Operator genauso wie für Menschen, die DENOG zum ersten Mal erleben.' : 'Three days of technical programming, workshops and conversations at Haus der Technik. For experienced operators and people experiencing DENOG for the first time.'}</p><div class="inline-actions" style="margin-top:38px">${ext('https://pretix.eu/denog/denog18/', de ? 'Ticket sichern' : 'Get a ticket', 'primary-link')}${ext('https://www.denog.de/de/meetings/denog18/', de ? 'Offizielle Informationen' : 'Official information', 'text-link')}</div></div></section><section class="section"><div class="section-head"><div><p class="eyebrow">${de ? 'Rahmenprogramm · Konzeptansicht' : 'Programme framework · Concept preview'}</p><h2>${de ? 'Drei Tage. Ein gemeinsamer Fokus.' : 'Three days. One shared focus.'}</h2></div><p>${de ? 'Die Struktur zeigt Orientierung, bevor das vollständige Vortragsprogramm veröffentlicht ist. Programmpunkte werden später automatisch aus dem Conference-System übernommen.' : 'This structure provides orientation before the full programme is published. Sessions will later be synchronised automatically from the conference system.'}</p></div><div class="agenda">${agenda}</div></section><section class="section" style="background:var(--paper-2)"><div class="section-head"><div><p class="eyebrow">${de ? 'Zum ersten Mal dabei?' : 'First time at DENOG?'}</p><h2>${de ? 'Du musst niemanden kennen.' : 'You do not need to know anyone.'}</h2></div><p>${de ? 'Ein kurzer First-Conference-Guide erklärt Ablauf, Orte, Fachbegriffe und Ansprechpersonen. Mentoring, Welcome Desk und klare soziale Einstiegspunkte helfen beim Ankommen.' : 'A concise first-conference guide explains the schedule, venues, terminology and contacts. Mentoring, a welcome desk and clear social entry points help people settle in.'}</p></div><div class="cards"><article class="card"><span class="card-number">01</span><h3>${de ? 'Vorbereiten' : 'Prepare'}</h3><p>${de ? 'Anreise, Barrierefreiheit, Programm und Code of Conduct auf einen Blick.' : 'Travel, accessibility, programme and Code of Conduct at a glance.'}</p></article><article class="card acid"><span class="card-number">02</span><h3>${de ? 'Ankommen' : 'Arrive'}</h3><p>${de ? 'Welcome Desk, Buddy-Angebot und ausgewiesene Treffpunkte.' : 'Welcome desk, buddy offer and clearly marked meeting points.'}</p></article><article class="card blue"><span class="card-number">03</span><h3>${de ? 'Dabeibleiben' : 'Stay involved'}</h3><p>${de ? 'Working Groups, Meetups, Mentoring und Mitgliedschaft als nächster Schritt.' : 'Working groups, meetups, mentoring and membership as next steps.'}</p><a class="text-link" href="${href(r.workingGroups)}">Working Groups →</a></article></div></section></main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'denog18', title: 'DENOG18 — Essen 2026', description: de ? 'DENOG18 vom 15. bis 17. November 2026 in Essen.' : 'DENOG18, 15–17 November 2026 in Essen.', content });
}

function appPage(locale, kind) {
  const de = locale === 'de';
  const member = kind === 'member';
  const r = routes[locale];
  const title = member ? (de ? 'Mein DENOG' : 'My DENOG') : (de ? 'DENOG Redaktion' : 'DENOG editorial');
  const notice = member
    ? (de ? 'Funktionsvorschau · Keine echten Mitgliederdaten. Diese Ansicht zeigt das geplante Self-Service-Portal.' : 'Feature preview · No real member data. This view shows the planned self-service portal.')
    : (de ? 'Funktionsvorschau · Keine produktive Redaktion. Inhalte und Status dienen der Konzeptpräsentation.' : 'Feature preview · Not a production CMS. Content and states are part of the concept presentation.');
  const sidebar = member
    ? [de ? 'Übersicht' : 'Overview', de ? 'Mein Profil' : 'My profile', de ? 'Mitgliedschaft' : 'Membership', 'Working Groups', de ? 'Dokumente' : 'Documents', de ? 'Mentoring' : 'Mentoring']
    : [de ? 'Übersicht' : 'Overview', de ? 'Seiten' : 'Pages', de ? 'Veranstaltungen' : 'Events', 'Working Groups', de ? 'Dokumente' : 'Documents', de ? 'Mitglieder' : 'Members', de ? 'Rollen & Rechte' : 'Roles & permissions'];
  const main = member ? `
    <div class="app-heading"><div><h1 tabindex="-1">${de ? 'Guten Morgen, Alex.' : 'Good morning, Alex.'}</h1><p>${de ? 'Hier ist dein persönlicher DENOG-Überblick.' : 'Here is your personal DENOG overview.'}</p></div><span class="badge"><i class="status-dot"></i>${de ? 'Mitglied aktiv' : 'Active member'}</span></div>
    <div class="app-grid"><article class="app-card wide"><span class="app-label">${de ? 'Mitgliedschaft' : 'Membership'}</span><h2>${de ? 'Ordentliches Mitglied' : 'Regular member'}</h2><p>${de ? 'Stammdaten vollständig · Beitragsstatus aktuell' : 'Profile complete · contributions current'}</p><div class="progress"><span></span></div></article><article class="app-card"><span class="app-label">${de ? 'Nächster Termin' : 'Next event'}</span><h2>DENOG18</h2><p>15.–17. November · Essen</p></article><article class="app-card"><span class="app-label">Working Groups</span><h2>Routing</h2><p>${de ? '2 neue Beiträge · Online-Termin geplant' : '2 new posts · online session planned'}</p></article><article class="app-card"><span class="app-label">${de ? 'Mentoring' : 'Mentoring'}</span><h2>${de ? 'Interesse hinterlegt' : 'Interest registered'}</h2><p>${de ? 'Matching für DENOG18 startet im Oktober.' : 'Matching for DENOG18 starts in October.'}</p></article><section class="app-table"><div class="app-table-row header"><span>${de ? 'Dokument' : 'Document'}</span><span>${de ? 'Bereich' : 'Area'}</span><span>${de ? 'Stand' : 'Date'}</span><span>Status</span></div><div class="app-table-row"><strong>${de ? 'Mitgliedsbestätigung 2026' : 'Membership confirmation 2026'}</strong><span>${de ? 'Mitgliedschaft' : 'Membership'}</span><span>03.01.2026</span><span class="badge">PDF</span></div><div class="app-table-row"><strong>${de ? 'Beitragsübersicht' : 'Contribution summary'}</strong><span>${de ? 'Finanzen' : 'Finance'}</span><span>03.01.2026</span><span class="badge">PDF</span></div></section></div>` : `
    <div class="app-heading"><div><h1 tabindex="-1">${de ? 'Redaktionsübersicht' : 'Editorial overview'}</h1><p>${de ? 'Öffentliche Website, Mitgliederinhalte und Prozesse in einem System.' : 'Public website, member content and workflows in one system.'}</p></div><button class="primary-link">${de ? 'Neuen Inhalt anlegen' : 'Create content'} +</button></div>
    <div class="app-grid"><article class="app-card"><span class="app-label">${de ? 'Heute veröffentlicht' : 'Published today'}</span><h2>3 ${de ? 'Inhalte' : 'items'}</h2><p>${de ? '2 Termine · 1 Working-Group-Update' : '2 events · 1 working-group update'}</p></article><article class="app-card"><span class="app-label">${de ? 'Zur Freigabe' : 'Awaiting review'}</span><h2>4 ${de ? 'Entwürfe' : 'drafts'}</h2><p>${de ? 'Rollenbasierter Vier-Augen-Workflow' : 'Role-based four-eyes workflow'}</p></article><article class="app-card"><span class="app-label">${de ? 'Sprachstatus' : 'Language status'}</span><h2>92 % DE / EN</h2><p>${de ? '3 Übersetzungen sind noch offen.' : '3 translations are still open.'}</p></article><section class="app-table"><div class="app-table-row header"><span>${de ? 'Inhalt' : 'Content'}</span><span>${de ? 'Typ' : 'Type'}</span><span>${de ? 'Geändert' : 'Changed'}</span><span>Status</span></div><div class="app-table-row"><strong>Meetup Düsseldorf</strong><span>${de ? 'Termin' : 'Event'}</span><span>${de ? 'heute' : 'today'}</span><span class="badge">Live</span></div><div class="app-table-row"><strong>Working Group Routing</strong><span>Working Group</span><span>${de ? 'heute' : 'today'}</span><span class="badge">Live</span></div><div class="app-table-row"><strong>${de ? 'DENOG18 First Conference Guide' : 'DENOG18 first conference guide'}</strong><span>Guide</span><span>${de ? 'gestern' : 'yesterday'}</span><span class="badge draft">Review</span></div><div class="app-table-row"><strong>${de ? 'Vorstandsbericht April 2026' : 'Board report April 2026'}</strong><span>${de ? 'Dokument' : 'Document'}</span><span>10.04.</span><span class="badge">Live</span></div></section><article class="app-card wide"><span class="app-label">Open Source · Digital Independence</span><h2>${de ? 'Selbstbestimmt betreibbar' : 'Self-determined operation'}</h2><p>${de ? 'Offenes CMS, exportierbare Inhalte, EU-/DE-Hosting, Rollen und Rechte, revisionsfähige Veröffentlichungen und dokumentierte Schnittstellen.' : 'Open CMS, exportable content, EU/German hosting, roles and permissions, auditable publishing and documented interfaces.'}</p></article><article class="app-card"><span class="app-label">${de ? 'Systemstatus' : 'System status'}</span><h2>Alle Systeme grün</h2><p>Web · Mail · Calendar · Identity</p></article></div>`;
  const content = `<header class="app-topbar"><a href="${href(r.home)}">${brand()}</a><p>${title} · ${de ? 'Konzeptansicht' : 'Concept preview'}</p><a class="app-back" href="${href(r.home)}">← ${de ? 'Zur öffentlichen Website' : 'Public website'}</a></header><div class="app-frame"><aside class="app-sidebar"><div class="app-user"><span class="avatar">${member ? 'AM' : 'RV'}</span><b>${member ? 'Alex Muster' : (de ? 'Redaktion Verein' : 'Association editorial')}</b><span>${member ? 'alex@example.org' : 'redaktion@denog.de'}</span></div><nav>${sidebar.map((item, index) => `<span class="${index === 0 ? 'active' : ''}">${item}</span>`).join('')}</nav></aside><main class="app-main" id="main-content"><div class="app-notice">${notice}</div>${main}</main></div>`;
  return layout({ locale, key: member ? 'member' : 'backend', title: `${title} — ${de ? 'Funktionsvorschau' : 'Feature preview'}`, description: notice, content, app: true });
}

function conceptPage(locale) {
  const de = locale === 'de';
  const r = routes[locale];
  const priorities = [
    [de ? 'Inhalte zuerst' : 'Content first', de ? 'Klare Struktur, belastbarer Elevator Pitch, aktuelle Informationen und konsequent gepflegte DE-/EN-Fassungen.' : 'Clear structure, a strong elevator pitch, current information and consistently maintained German/English versions.'],
    ['Working Groups', de ? 'Aufgabe, Leitung, Kanäle, Veröffentlichungen, GitHub und Termine werden pro Gruppe transparent.' : 'Scope, chairs, channels, publications, GitHub and events become transparent for every group.'],
    [de ? 'Mitgliedschaft' : 'Membership', de ? 'Einfacher Antrag plus Self-Service für Profil, Status, Dokumente, Beteiligung und Identität.' : 'A simple application plus self-service for profile, status, documents, participation and identity.'],
    [de ? 'Digitale Unabhängigkeit' : 'Digital independence', de ? 'Offene Software, portierbare Daten, dokumentierte Schnittstellen und Hosting ohne vermeidbaren Plattform-Lock-in.' : 'Open software, portable data, documented interfaces and hosting without avoidable platform lock-in.']
  ];
  const architecture = priorities.map(([title, text], i) => `<article><b>0${i + 1}</b><h3>${title}</h3><p>${text}</p></article>`).join('');
  const timeline = [
    ['01–02', de ? 'Analyse' : 'Discovery', de ? 'Inhalte, Prozesse, Rollen, Technik' : 'Content, processes, roles, technology'],
    ['03–05', de ? 'UX & Design' : 'UX & design', de ? 'Struktur, Prototyp, Designsystem' : 'Structure, prototype, design system'],
    ['06–09', de ? 'Umsetzung' : 'Build', de ? 'CMS, Frontend, Migration, Schnittstellen' : 'CMS, frontend, migration, integrations'],
    ['10–11', de ? 'Qualität' : 'Quality', de ? 'Barrierefreiheit, Performance, Sicherheit' : 'Accessibility, performance, security'],
    ['12', 'Go-live', de ? 'Schulung, Übergabe, Monitoring' : 'Training, handover, monitoring']
  ].map(([week, title, text]) => `<article><b>${de ? 'WOCHE' : 'WEEK'} ${week}</b><h3>${title}</h3><p>${text}</p></article>`).join('');
  const content = `${header(locale, '', routes[locale === 'de' ? 'en' : 'de'].concept)}<main id="main-content"><section class="page-mast"><p class="kicker">${de ? 'Konzeptumfang · Entscheidungsgrundlage' : 'Concept scope · Basis for decision'}</p><div class="mast-grid"><h1 tabindex="-1">${de ? 'Vom Auftritt zum <i>System.</i>' : 'From website to <i>system.</i>'}</h1><p class="lead">${de ? 'Die öffentliche Website, der Mitgliederbereich und das Redaktionssystem greifen ineinander. Der Umfang orientiert sich an den öffentlich dokumentierten Prioritäten des DENOG-Vorstands und der Working Groups.' : 'The public website, member area and editorial system work together. Scope is based on the publicly documented priorities of the DENOG board and working groups.'}</p></div></section><section class="section"><div class="section-head"><div><p class="eyebrow">${de ? 'Vier Leitplanken' : 'Four guardrails'}</p><h2>${de ? 'Was die Lösung leisten muss.' : 'What the solution must deliver.'}</h2></div><p>${de ? 'Nicht jedes Modul muss am ersten Tag maximal ausgebaut sein. Entscheidend ist eine tragfähige Architektur, die den öffentlichen Relaunch beschleunigt und interne Prozesse schrittweise integrieren kann.' : 'Not every module has to be fully developed on day one. What matters is a sustainable architecture that accelerates the public relaunch and can gradually integrate internal processes.'}</p></div><div class="architecture">${architecture}</div></section><section class="section" style="background:var(--paper-2)"><div class="section-head"><div><p class="eyebrow">${de ? 'Technischer Rahmen' : 'Technical framework'}</p><h2>${de ? 'Offen, zugänglich, wartbar.' : 'Open, accessible, maintainable.'}</h2></div><p>${de ? 'Open-Source-CMS mit maßgeschneidertem Theme, mobile-first, WCAG 2.1 AA, DSGVO-konforme Einbindungen, performante Auslieferung, Rollen/Rechte und redaktionelle Vorschau.' : 'Open-source CMS with a custom theme, mobile-first, WCAG 2.1 AA, privacy-compliant integrations, performant delivery, roles and permissions, and editorial preview.'}</p></div><div class="cards"><article class="card"><span class="card-number">CMS</span><h3>${de ? 'Einfach redigieren' : 'Easy editing'}</h3><p>${de ? 'Strukturierte Inhaltstypen für Termine, Wissen, Working Groups, Dokumente und Personen.' : 'Structured content types for events, knowledge, working groups, documents and people.'}</p><a class="text-link" href="${href(r.backend)}">${de ? 'Redaktion ansehen' : 'View editorial system'} →</a></article><article class="card acid"><span class="card-number">IDENTITY</span><h3>${de ? 'Sicher selbst verwalten' : 'Secure self-service'}</h3><p>${de ? 'Schrittweise Kopplung von Mitgliederverwaltung, Identity und Kommunikationsplattform.' : 'Gradual connection of membership management, identity and the communication platform.'}</p><a class="text-link" href="${href(r.member)}">${de ? 'Mitgliederbereich ansehen' : 'View member area'} →</a></article><article class="card blue"><span class="card-number">API</span><h3>${de ? 'Systeme verbinden' : 'Connect systems'}</h3><p>${de ? 'Kalender, Conference-System, Newsletter, Medienarchiv und GitHub über dokumentierte Schnittstellen.' : 'Calendar, conference system, newsletter, media archive and GitHub through documented interfaces.'}</p></article></div></section><section class="section"><div class="section-head"><div><p class="eyebrow">${de ? 'Realisierungsplan' : 'Delivery plan'}</p><h2>12 ${de ? 'Wochen bis Go-live.' : 'weeks to go-live.'}</h2></div><p>${de ? 'Ein fokussierter Ablauf mit früher Inhaltsarbeit, verbindlichen Abnahmen und gezielter Migration. Funktionsmodule können priorisiert in denselben Rahmen eingeplant werden.' : 'A focused process with early content work, binding approvals and targeted migration. Functional modules can be prioritised within the same framework.'}</p></div><div class="timeline">${timeline}</div></section></main>${footer(locale)}${dock(locale)}`;
  return layout({ locale, key: 'concept', title: de ? 'Konzeptumfang — DENOG Relaunch' : 'Concept scope — DENOG relaunch', description: de ? 'Konzeptumfang, Architektur und Realisierungsplan für den DENOG Relaunch.' : 'Concept scope, architecture and delivery plan for the DENOG relaunch.', content });
}

function notFoundPage() {
  const content = `${header('de', '', routes.en.home)}<main id="main-content"><section class="page-mast"><p class="kicker">404 · Nicht gefunden</p><div class="mast-grid"><h1 tabindex="-1">Falsche <i>Route.</i></h1><p class="lead">Diese Seite existiert nicht oder wurde verschoben. Über die Startseite findest du zurück ins DENOG-Netz.</p></div><div style="margin-top:48px"><a class="primary-link" href="${href(routes.de.home)}">Zur Startseite →</a></div></section></main>${footer('de')}`;
  return layout({ locale: 'de', key: 'home', title: 'Seite nicht gefunden — DENOG', description: 'Die angeforderte DENOG-Seite wurde nicht gefunden.', content });
}

function writeRoute(route, html) {
  const relative = route === '/' ? 'index.html' : join(route.replace(/^\//, ''), 'index.html');
  const target = join(rootDir, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html, 'utf8');
}

for (const locale of ['de', 'en']) {
  writeRoute(routes[locale].home, home(locale));
  writeRoute(routes[locale].events, eventsPage(locale));
  writeRoute(routes[locale].knowledge, knowledgePage(locale));
  writeRoute(routes[locale].workingGroups, workingGroupsPage(locale));
  writeRoute(routes[locale].association, associationPage(locale));
  writeRoute(routes[locale].denog18, denog18Page(locale));
  writeRoute(routes[locale].member, appPage(locale, 'member'));
  writeRoute(routes[locale].backend, appPage(locale, 'backend'));
  writeRoute(routes[locale].concept, conceptPage(locale));
}

writeRoute('/404/', notFoundPage());
writeRoute('/_not-found/', notFoundPage());
writeFileSync(join(rootDir, '404.html'), notFoundPage(), 'utf8');
copyFileSync(join(sourceDir, 'site.css'), join(rootDir, 'site.css'));
copyFileSync(join(sourceDir, 'site.js'), join(rootDir, 'site.js'));
console.log('Built 18 concept pages, fallback pages and shared assets.');
