const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://vachsystems.de';
const TODAY = '2026-08-28';

const pageInfo = {
  leistungen: {
    title: 'Webdesign & Webentwicklung aus Berlin | vachsystems',
    description: 'Strategie, Gestaltung, Texte und Entwicklung für eigenständige Unternehmenswebsites, Plattformen und digitale Auftritte.',
    label: 'Websites & Plattformen'
  },
  loesungen: {
    title: 'Individuelle Software & Webanwendungen | vachsystems',
    description: 'Individuelle Webanwendungen, Portale und interne Werkzeuge, die zu Ihren Prozessen passen und verständlich bedienbar bleiben.',
    label: 'Software & digitale Werkzeuge'
  },
  'ki-automatisierung-unternehmen': {
    title: 'Automatisierung & KI für Unternehmen | vachsystems',
    description: 'Sinnvolle Automatisierung für wiederkehrende Abläufe: Systeme verbinden, Daten sauber verarbeiten und KI kontrolliert einsetzen.',
    label: 'Automatisierung & KI'
  },
  'ki-workshop-unternehmen': {
    title: 'KI-Workshop für Unternehmen | vachsystems',
    description: 'Praxisnaher KI-Workshop für Teams und Führungskräfte: konkrete Aufgaben, sichere Nutzung, klare Regeln und direkter Transfer in den Arbeitsalltag.',
    label: 'KI-Workshop'
  },
  projekte: {
    title: 'Arbeiten & Konzeptstudien | vachsystems',
    description: 'Einblicke in die eigene Plattform und transparent gekennzeichnete Konzeptstudien für Websites, Software und Automatisierung.',
    label: 'Arbeiten'
  },
  'ueber-uns': {
    title: 'Über vachsystems & Patrick Vach | Digitalstudio Berlin',
    description: 'Direkte Zusammenarbeit mit Patrick Vach: Konzeption, Gestaltung und technische Umsetzung für klare digitale Produkte.',
    label: 'Über uns'
  },
  kontakt: {
    title: 'Projekt besprechen | Kontakt zu vachsystems',
    description: 'Sprechen Sie direkt mit Patrick Vach über Ihre Website, individuelle Software oder ein Automatisierungsvorhaben.',
    label: 'Kontakt'
  },
  impressum: {
    title: 'Impressum | vachsystems',
    description: 'Anbieterkennzeichnung und Kontaktangaben von vachsystems, Inhaber Patrick Vach, Berlin.',
    label: 'Impressum'
  },
  datenschutz: {
    title: 'Datenschutz | vachsystems',
    description: 'Informationen zur Verarbeitung personenbezogener Daten auf vachsystems.de und bei Kontaktanfragen.',
    label: 'Datenschutz'
  }
};

const articleCatalog = [
  ['roi-rechnung-ai-agents-investition-lohnt-sich', '20. August 2026', 'Wirtschaftlichkeit', 'KI-Projekte wirtschaftlich bewerten', 'Ein belastbarer Business Case verbindet Prozessdaten, vollständige Kosten, Qualitätsrisiken und einen begrenzten Pilot zu einer realistischen Entscheidung.'],
  ['hybrid-ai-systems-lokal-cloud-zukunft', '12. August 2026', 'Architektur', 'Lokale KI und Cloud sinnvoll kombinieren', 'Die passende Architektur folgt den Daten, dem Betriebsmodell und der geforderten Kontrolle – nicht einer pauschalen Technologieentscheidung.'],
  ['ai-pragmatismus-2026-hype-zu-produktivitaet', '5. August 2026', 'Praxis', 'Vom KI-Hype zur produktiven Anwendung', 'Produktiver KI-Einsatz beginnt mit einer klar abgegrenzten Aufgabe, messbarer Qualität und einem Ablauf, der im Alltag zuverlässig funktioniert.'],
  ['500-llm-modelle-richtiges-fuer-unternehmen-waehlen', '25. Juli 2026', 'Modellauswahl', 'Sprachmodelle fundiert auswählen', 'Ein anwendungsbezogener Test macht Qualität, Geschwindigkeit, Datenschutz, Integrationsaufwand und laufende Kosten vergleichbar.'],
  ['agentic-automation-guardrails-mittelstand-sicher', '18. Juli 2026', 'Sicherheit', 'Automatisierung mit klaren Leitplanken', 'Berechtigungen, Freigaben, Protokolle und sichere Fehlerwege machen aus einem technischen Experiment einen verantwortbaren Unternehmensprozess.'],
  ['ai-vendor-lock-in-vermeiden-open-source-vs-proprietary', '25. Juni 2026', 'Strategie', 'Abhängigkeiten bei KI-Systemen begrenzen', 'Saubere Schnittstellen, portable Daten und eigene Qualitätsprüfungen erhalten Handlungsfreiheit, wenn Anbieter, Modelle oder Konditionen wechseln.'],
  ['enterprise-ai-stack-2026-richtige-architektur', '12. Juni 2026', 'Architektur', 'Eine tragfähige KI-Architektur planen', 'Eine robuste KI-Lösung verbindet Oberfläche, Prozesslogik, Modelle, Daten, Rechte und Beobachtbarkeit zu einem kontrollierbaren Gesamtsystem.'],
  ['small-language-models-slm-fine-tuning-unternehmen', '28. April 2026', 'Architektur', 'Wann kleinere Sprachmodelle sinnvoll sind', 'Für klar begrenzte Aufgaben können kleinere Modelle wirtschaftlich und kontrollierbar sein – wenn die Qualität am eigenen Anwendungsfall belegt wird.']
];

const retiredArticleSlugs = [
  'claude-opus-5-launch-enterprise-kunden',
  'von-copilot-zu-agent-paradigmenwechsel-automatisierung',
  'llm-kosten-2026-kleinere-modelle-besser',
  'ai-agents-4000-steps-komplexitaet-problem',
  'deepseek-v4-moonshot-kimi-chinesische-ki-modelle',
  'gemini-3-1-pro-reasoning-wichtiger-als-geschwindigkeit',
  '30-prozent-netzwerk-automatisierung-ai-mittelstand',
  'claude-opus-5-vs-gpt-5-5-enterprise-vergleich',
  'ai-first-vs-ai-ready-unternehmen-2026'
];

const publicArticleSlugs = new Set(articleCatalog.map(item => item[0]));

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function json(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function head({ title, description, slug = '', prefix = '', type = 'website', schema, extraStyles = '' }) {
  const canonical = slug ? `${BASE}/${slug}` : `${BASE}/`;
  const structured = schema || {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'vachsystems',
    url: `${BASE}/`,
    email: 'contact@vachsystems.de',
    founder: { '@type': 'Person', name: 'Patrick Vach' },
    address: { '@type': 'PostalAddress', addressLocality: 'Berlin', addressCountry: 'DE' },
    areaServed: 'DE'
  };
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#050608">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${prefix}favicon.svg">
  <link rel="stylesheet" href="${prefix}css/studio-system.css?v=20260828-5">
${extraStyles ? `  ${extraStyles}\n` : ''}  <link rel="stylesheet" href="${prefix}css/studio-header.css?v=20260828-5">
  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="de_DE">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BASE}/images/vachsystems-object-og.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Abstraktes digitales Objekt von vachsystems">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${BASE}/images/vachsystems-object-og.webp">
  <script>document.documentElement.classList.add('js')</script>
  <script type="application/ld+json">${json(structured)}</script>`;
}

function nav(active = '', prefix = '') {
  const item = (href, label, key) => `<a href="${prefix}${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<a class="studio-skip" href="#main">Zum Inhalt springen</a>
<header class="studio-header" data-header>
  <nav class="studio-nav" aria-label="Hauptnavigation">
    <a class="studio-brand" href="${prefix || '/'}" aria-label="vachsystems Startseite"><span>vachsystems</span><i aria-hidden="true"></i></a>
    <div class="studio-links" id="studio-navigation" data-navigation>
      ${item('leistungen', 'Websites', 'leistungen')}
      ${item('loesungen', 'Software', 'loesungen')}
      ${item('ki-automatisierung-unternehmen', 'Automatisierung', 'automatisierung')}
      ${item('projekte', 'Arbeiten', 'projekte')}
      ${item('ueber-uns', 'Über uns', 'ueber-uns')}
    </div>
    <a class="studio-nav-cta" href="${prefix}kontakt">Projekt besprechen <span aria-hidden="true">↗</span></a>
    <button class="studio-menu-button" type="button" aria-expanded="false" aria-controls="studio-navigation" aria-label="Menü öffnen" data-menu-button><span></span><span></span></button>
  </nav>
</header>`;
}

function footer(prefix = '') {
  return `<footer class="studio-footer">
  <div class="studio-footer-main">
    <a class="studio-brand" href="${prefix || '/'}" aria-label="vachsystems Startseite"><span>vachsystems</span><i aria-hidden="true"></i></a>
    <div class="studio-footer-links"><span>Leistungen</span><a href="${prefix}leistungen">Websites</a><a href="${prefix}loesungen">Software</a><a href="${prefix}ki-automatisierung-unternehmen">Automatisierung</a><a href="${prefix}ki-workshop-unternehmen">KI-Workshop</a></div>
    <div class="studio-footer-links"><span>vachsystems</span><a href="${prefix}projekte">Arbeiten</a><a href="${prefix}ueber-uns">Über uns</a><a href="${prefix}blog/">Einblicke</a><a href="${prefix}kontakt">Kontakt</a></div>
  </div>
  <div class="studio-footer-legal"><span>© 2026 vachsystems · Berlin · ohne Tracking</span><div><a href="${prefix}impressum">Impressum</a><a href="${prefix}datenschutz">Datenschutz</a></div></div>
</footer>
<script src="${prefix}js/studio-system.js?v=20260828-3" defer></script>
<script src="${prefix}js/site-cleanup.js?v=20260828-1" defer></script>`;
}

function hero(kicker, title, mutedTitle, text, tags = []) {
  return `<section class="page-hero"><div class="page-hero-inner">
  <div class="reveal"><p class="page-kicker">${kicker}</p><h1>${title}<br><span>${mutedTitle}</span></h1></div>
  <div class="page-hero-aside reveal"><p>${text}</p>${tags.length ? `<div class="hero-tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>` : ''}</div>
</div></section>`;
}

function cta(title, text, button = 'Projekt besprechen', prefix = '') {
  return `<section class="cta-stage"><div class="cta-inner reveal"><p class="page-kicker">Ihr Vorhaben</p><h2>${title}</h2><div class="cta-row"><p>${text}</p><a class="button light" href="${prefix}kontakt"><span>${button}</span><span aria-hidden="true">↗</span></a></div></div></section>`;
}

function page(slug, active, main) {
  const meta = pageInfo[slug];
  return `${head({ ...meta, slug })}
</head><body>
${nav(active)}
<main id="main">${main}</main>
${footer()}
</body></html>\n`;
}

function interfaceVisual(title = 'Projektübersicht') {
  return `<div class="interface reveal" aria-label="Beispiel einer von vachsystems konzipierten digitalen Oberfläche">
    <div class="interface-top"><span class="interface-brand">vachsystems<i>.</i> system</span><span>Beispieldaten · Entwurfsansicht</span></div>
    <div class="interface-grid"><div class="interface-side"><span class="active">Übersicht</span><span>Vorgänge</span><span>Dokumente</span><span>Einstellungen</span></div>
    <div class="interface-main"><h3>${title}</h3><p>Wichtige Informationen zuerst. Details dort, wo sie gebraucht werden.</p><div class="signal-grid"><div class="signal"><small>Heute</small><strong>Übersicht</strong><em>klar priorisiert</em></div><div class="signal"><small>Status</small><strong>Prüfbar</strong><em>mit Verlauf</em></div><div class="signal"><small>Nächster Schritt</small><strong>Direkt</strong><em>ohne Umwege</em></div></div><div class="flow"><span>Eingang</span><i></i><span>Prüfung</span><i></i><span>Freigabe</span></div></div></div>
  </div>`;
}

function methodStory(label, title, text, items) {
  return `<section class="section dark method-section"><div class="section-inner"><div class="method-story">
    <div class="method-lead reveal"><p class="section-label">${label}</p><h2>${title}</h2><p>${text}</p></div>
    <div class="method-notes">${items.map(([cue, heading, copy]) => `<article class="method-note reveal"><span>${cue}</span><div><h3>${heading}</h3><p>${copy}</p></div></article>`).join('')}</div>
  </div></div></section>`;
}

const pages = {};

pages.leistungen = page('leistungen', 'leistungen', `
${hero('Websites & Plattformen', 'Ihre Marke.', 'Digital auf den Punkt.', 'Wir verbinden Positionierung, Sprache, Gestaltung und Entwicklung zu einem Auftritt mit eigener Handschrift und klarer Wirkung.', ['Strategie', 'UX & Design', 'Entwicklung', 'SEO & Performance'])}
<section class="section"><div class="section-inner">
  <div class="section-head reveal"><div><p class="section-label">Ein zusammenhängender Auftritt</p><h2>Eine gute Website führt zu einer klaren Entscheidung.</h2></div><p>Sie macht verständlich, wofür Ihr Unternehmen steht, welchen Wert Sie schaffen und welcher nächste Schritt sinnvoll ist.</p></div>
  <div class="discipline-stack">
    <article class="discipline reveal"><p class="discipline-cue">Grundlage</p><div><h3>Strategie & Struktur</h3><p>Wir ordnen Angebote, Zielgruppen und Inhalte, bevor das erste Layout entsteht.</p></div><p class="discipline-scope">Positionierung · Informationsarchitektur · Nutzerwege · Content-Plan</p></article>
    <article class="discipline reveal"><p class="discipline-cue">Charakter</p><div><h3>Gestaltung & Sprache</h3><p>Eine visuelle und sprachliche Richtung, die Wiedererkennung schafft und sich konsequent durchzieht.</p></div><p class="discipline-scope">Art Direction · UI-Design · Responsive Design · Webtexte</p></article>
    <article class="discipline reveal"><p class="discipline-cue">Substanz</p><div><h3>Entwicklung & Betrieb</h3><p>Schnelle, zugängliche und wartbare Umsetzung – passend zum Inhalt und zum Team dahinter.</p></div><p class="discipline-scope">Frontend · CMS · Formulare · Technisches SEO</p></article>
  </div>
</div></section>
<section class="section dark"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Gestaltung mit Funktion</p><h2>Das Design zeigt, wie das System funktioniert.</h2></div><p>Wir gestalten reale Zustände, Hierarchien und Interaktionen. So bleibt die Qualität vom ersten Eindruck bis ins Detail konsistent.</p></div>${interfaceVisual('Ihre Website. Ein System.')}</div></section>
${methodStory('So entsteht der Auftritt', 'Ein präziser Prozess für ein eigenständiges Ergebnis.', 'Die Reihenfolge schafft Verbindlichkeit. Die inhaltliche und gestalterische Richtung entsteht aus Ihrem Unternehmen, Ihrer Zielgruppe und dem tatsächlichen Angebot.', [
  ['Verstehen', 'Ausgangslage klären', 'Unternehmen, Zielgruppen, bestehende Inhalte und technische Rahmenbedingungen zusammenbringen.'],
  ['Verdichten', 'Eine Richtung festlegen', 'Kernaussage, Struktur und visuelle Haltung so schärfen, dass sie Entscheidungen tragen.'],
  ['Bauen', 'Konsequent umsetzen', 'Design und Entwicklung eng miteinander auf allen Bildschirmgrößen ausarbeiten.'],
  ['Schärfen', 'Prüfen und starten', 'Inhalte, Bedienung, Technik und Auffindbarkeit vor der Veröffentlichung kontrollieren.']
])}
${cta('Machen wir Ihre Qualität auf den ersten Blick sichtbar.', 'Erzählen Sie kurz, was Ihr Unternehmen auszeichnet und was der heutige Auftritt noch nicht vermittelt. Sie erhalten eine klare Einschätzung zu Richtung, Aufwand und nächsten Schritten.', 'Website besprechen')}`);

pages.loesungen = page('loesungen', 'loesungen', `
${hero('Software & digitale Werkzeuge', 'Software, die sich', 'Ihrer Arbeit anpasst.', 'Portale, interne Werkzeuge und Webanwendungen für Aufgaben, die mit Standardsoftware unnötig kompliziert bleiben.', ['Webanwendungen', 'Portale', 'Dashboards', 'Schnittstellen'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Individuell, wo es zählt</p><h2>Software entsteht aus dem Ablauf, den sie verbessern soll.</h2></div><p>Wir verbinden vorhandene Systeme und entwickeln gezielt dort neu, wo ein eigener Lösungsweg Arbeit verständlicher, schneller oder kontrollierbarer macht.</p></div>
  <div class="editorial-grid"><article class="editorial-item reveal"><small>Interne Werkzeuge</small><h3>Weniger Suchen. Mehr Überblick.</h3><p>Informationen, Aufgaben und Status in einer Oberfläche, die den täglichen Ablauf abbildet.</p></article><article class="editorial-item reveal"><small>Kundenportale</small><h3>Der richtige Zugang für jede Rolle.</h3><p>Dokumente, Vorgänge und Kommunikation sicher und nachvollziehbar bereitstellen.</p></article><article class="editorial-item reveal"><small>Schnittstellen</small><h3>Systeme sprechen miteinander.</h3><p>Daten dort verfügbar machen, wo sie gebraucht werden – ohne doppelte Pflege.</p></article></div>
</div></section>
<section class="section dark"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Lösungsbilder</p><h2>Konkrete Abläufe werden zu verständlichen Oberflächen.</h2></div><p>Die Konzeptstudien zeigen, wie wir Informationen ordnen, Entscheidungen führen und komplexe Vorgänge in eine klare Bedienlogik übersetzen.</p></div>
<div class="tabs-shell reveal" data-tabs><div class="tab-list" role="tablist" aria-label="Beispielhafte Softwarelösungen">
  <button class="tab-button" id="solution-tab-1" role="tab" aria-selected="true" aria-controls="solution-panel-1"><strong>Operations-Portal</strong><span>Konzeptstudie</span></button>
  <button class="tab-button" id="solution-tab-2" role="tab" aria-selected="false" aria-controls="solution-panel-2"><strong>Kundenbereich</strong><span>Konzeptstudie</span></button>
  <button class="tab-button" id="solution-tab-3" role="tab" aria-selected="false" aria-controls="solution-panel-3"><strong>Wissenssystem</strong><span>Konzeptstudie</span></button>
</div><div>
  <article class="tab-panel" id="solution-panel-1" role="tabpanel" aria-labelledby="solution-tab-1"><span class="panel-kicker">Übersicht für den Alltag</span><h3>Offene Vorgänge zuerst sehen.</h3><p>Aufgaben, Status und Verantwortlichkeiten werden in einer klaren Arbeitsoberfläche gebündelt. Beispieldaten machen sichtbar, wie Priorisierung und Übergaben funktionieren.</p><div class="flow"><span>Eingang</span><i></i><span>Bearbeitung</span><i></i><span>Abschluss</span></div><div class="panel-note">Freie Konzeptstudie · Beispieldaten</div></article>
  <article class="tab-panel" id="solution-panel-2" role="tabpanel" aria-labelledby="solution-tab-2" hidden><span class="panel-kicker">Transparenter Service</span><h3>Kunden wissen, wie es weitergeht.</h3><p>Ein geschützter Bereich zeigt Dokumente, Ansprechpartner, Termine und den aktuellen Stand in einem durchgängigen Serviceerlebnis.</p><div class="flow"><span>Anfrage</span><i></i><span>Status</span><i></i><span>Dokumente</span></div><div class="panel-note">Freie Konzeptstudie · Beispieldaten</div></article>
  <article class="tab-panel" id="solution-panel-3" role="tabpanel" aria-labelledby="solution-tab-3" hidden><span class="panel-kicker">Wissen auffindbar machen</span><h3>Antworten mit nachvollziehbarer Quelle.</h3><p>Dokumente werden strukturiert, rollenbasiert durchsuchbar und mit klaren Quellen angezeigt. Fachliche Kontrolle bleibt sichtbar im Ablauf verankert.</p><div class="flow"><span>Frage</span><i></i><span>Quellen</span><i></i><span>Geprüfte Antwort</span></div><div class="panel-note">Freie Konzeptstudie · Beispieldaten</div></article>
</div></div></div></section>
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Unser Maßstab</p><h2>Verständlich. Wartbar. Anschlussfähig.</h2></div><p>Eine gute individuelle Lösung bleibt auch nach dem Launch klar: für Nutzer, für Verantwortliche und für diejenigen, die sie später weiterentwickeln.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Bedienung</small><h3>Der nächste Schritt ist sichtbar.</h3><p>Klare Zustände und Handlungen statt überladener Dashboards.</p></article><article class="editorial-item reveal"><small>Technik</small><h3>Saubere Grenzen im System.</h3><p>Modulare Architektur, dokumentierte Schnittstellen und passende Rechte.</p></article><article class="editorial-item reveal"><small>Betrieb</small><h3>Fehler werden nicht versteckt.</h3><p>Nachvollziehbare Abläufe, Monitoring und kontrollierte Rückfallwege.</p></article></div></div></section>
${cta('Ein besonderer Ablauf braucht manchmal ein eigenes Werkzeug.', 'Beschreiben Sie kurz, welche Aufgabe heute unnötig aufwendig ist. Wir prüfen, ob eine individuelle Anwendung wirklich die richtige Antwort ist.', 'Software-Idee besprechen')}`);

pages['ki-automatisierung-unternehmen'] = page('ki-automatisierung-unternehmen', 'automatisierung', `
${hero('Automatisierung & KI', 'Weniger Handarbeit.', 'Mehr Verlässlichkeit.', 'Wir verbinden Systeme, strukturieren wiederkehrende Abläufe und setzen KI dort ein, wo sie einen klaren, kontrollierbaren Nutzen bringt.', ['Workflows', 'Dokumente', 'Datenflüsse', 'KI-Assistenten'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Der Prozess gibt die Richtung vor</p><h2>Automatisierung beginnt mit einem klaren Ablauf.</h2></div><p>Wiederkehrende Arbeit, eindeutige Regeln und prüfbare Ergebnisse bilden die Grundlage. Die Technik wird passend dazu ausgewählt.</p></div>
  <figure class="automation-map reveal" aria-labelledby="automation-map-title"><figcaption id="automation-map-title">Beispiel eines kontrollierten Informationsflusses</figcaption>
    <div class="automation-entry"><span>E-Mail</span><span>Formular</span><span>Dokument</span></div>
    <div class="automation-core"><p>Ordnen</p><strong>Information wird dort nutzbar, wo sie gebraucht wird.</strong><div><span>Regeln prüfen</span><span>Kontext ergänzen</span><span>Unsicherheit markieren</span></div></div>
    <div class="automation-exit"><span>CRM / ERP</span><span>Freigabe</span><span>Benachrichtigung</span></div>
    <p class="automation-human">Kritische Entscheidungen bleiben beim Menschen.</p>
  </figure>
</div></section>
${methodStory('Kontrolle ist Teil des Systems', 'Verantwortung bleibt im Ablauf sichtbar.', 'Eindeutige Eingaben, Regeln, Fehlerwege und Zuständigkeiten werden von Anfang an als Teil der Lösung entwickelt.', [
  ['Eingang', 'Herkunft bleibt sichtbar', 'Quelle, Format und Berechtigung werden erfasst, bevor Informationen weiterverarbeitet werden.'],
  ['Prüfung', 'Regeln greifen vor der Aktion', 'Pflichtfelder, Plausibilität und mögliche Risiken werden transparent kontrolliert.'],
  ['Verarbeitung', 'Systeme übernehmen Routine', 'Daten werden übertragen, ergänzt oder für eine Entscheidung vorbereitet.'],
  ['Freigabe', 'Menschen behalten Verantwortung', 'Kritische Fälle landen mit Kontext und Verlauf bei der richtigen Person.']
])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Sicher einführen</p><h2>Klein starten. Messen. Kontrolliert erweitern.</h2></div><p>Ein begrenzter Pilot zeigt schneller als ein großes Konzeptpapier, ob Qualität, Zeitgewinn und Akzeptanz tatsächlich stimmen.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Pilot</small><h3>Eine Aufgabe, ein klares Ziel.</h3><p>Volumen, Aufwand und Qualitätsmaß werden vorab definiert.</p></article><article class="editorial-item reveal"><small>Kontrolle</small><h3>Ausnahmen sind Teil des Designs.</h3><p>Unsicherheit wird sichtbar und führt in einen sicheren Prüfweg.</p></article><article class="editorial-item reveal"><small>Betrieb</small><h3>Ergebnisse bleiben nachvollziehbar.</h3><p>Versionen, Kosten und Entscheidungen lassen sich später prüfen.</p></article></div></div></section>
${cta('Welche wiederkehrende Aufgabe soll verlässlich leichter werden?', 'Wir analysieren den tatsächlichen Ablauf und entwickeln daraus eine passende, kontrollierbare Lösung.', 'Ablauf besprechen')}`);

pages['ki-workshop-unternehmen'] = page('ki-workshop-unternehmen', '', `
${hero('KI-Workshop für Unternehmen', 'KI verstehen.', 'Im Alltag sicher nutzen.', 'Ein praxisnaher Workshop für Teams und Führungskräfte. Mit Aufgaben aus Ihrem Unternehmen, klaren Grenzen und umsetzbaren Regeln.', ['Individuell vorbereitet', 'Vor Ort oder remote', 'Für Teams', 'Ohne Vorkenntnisse'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Individuell vorbereitet</p><h2>Der Workshop arbeitet mit den Aufgaben Ihres Teams.</h2></div><p>So entsteht ein gemeinsames Verständnis dafür, wo KI unterstützt, welche Daten sensibel sind, wie Ergebnisse geprüft werden und welche Anwendungen in Ihrem Alltag tragfähig sind.</p></div><div class="tabs-shell reveal" data-tabs><div class="tab-list" role="tablist" aria-label="Workshop-Inhalte"><button class="tab-button" id="workshop-tab-1" role="tab" aria-selected="true" aria-controls="workshop-panel-1"><strong>Verstehen</strong><span>Möglichkeiten & Grenzen</span></button><button class="tab-button" id="workshop-tab-2" role="tab" aria-selected="false" aria-controls="workshop-panel-2"><strong>Anwenden</strong><span>Aufgaben aus dem Alltag</span></button><button class="tab-button" id="workshop-tab-3" role="tab" aria-selected="false" aria-controls="workshop-panel-3"><strong>Regeln</strong><span>Daten, Qualität & Freigaben</span></button></div><div><article class="tab-panel" id="workshop-panel-1" role="tabpanel" aria-labelledby="workshop-tab-1"><span class="panel-kicker">Realistische Einordnung</span><h3>Möglichkeiten und Grenzen sicher unterscheiden.</h3><p>Wir erklären verständlich, wie Sprachmodelle arbeiten, warum Ergebnisse schwanken und wann Quellen oder Fachwissen unverzichtbar sind.</p><div class="panel-note">Ergebnis: ein gemeinsames Vokabular und realistische Erwartungen.</div></article><article class="tab-panel" id="workshop-panel-2" role="tabpanel" aria-labelledby="workshop-tab-2" hidden><span class="panel-kicker">Direkt ausprobieren</span><h3>Die eigene Arbeit wird zum Ausgangspunkt.</h3><p>Texte, Dokumente, Recherche oder Auswertungen: Die Übungen orientieren sich an Tätigkeiten, die in Ihrem Team wirklich vorkommen.</p><div class="panel-note">Ergebnis: wiederverwendbare Arbeitsweisen für sinnvolle Aufgaben.</div></article><article class="tab-panel" id="workshop-panel-3" role="tabpanel" aria-labelledby="workshop-tab-3" hidden><span class="panel-kicker">Sicherer Rahmen</span><h3>Verantwortung wird konkret geregelt.</h3><p>Gemeinsam definieren wir einfache Regeln für sensible Informationen, Quellenprüfung, Freigaben und dokumentierte Verantwortung.</p><div class="panel-note">Ergebnis: konkrete Leitplanken für den Arbeitsalltag.</div></article></div></div></div></section>
${methodStory('Vom Gespräch zum Transfer', 'Der Workshop beginnt vor dem Workshop.', 'Vorab klären wir Rollen, Werkzeuge und typische Aufgaben. So passt der Termin zu Ihrem Unternehmen und endet nicht bei allgemeinen Folien.', [
  ['Vorgespräch', 'Die Situation erfassen', 'Teilnehmer, heutige Nutzung und wiederkehrende Aufgaben gemeinsam einordnen.'],
  ['Vorbereitung', 'Passende Beispiele auswählen', 'Übungen und Materialien auf die tatsächliche Gruppe und ihre Arbeit zuschneiden.'],
  ['Workshop', 'Gemeinsam arbeiten', 'Verstehen, ausprobieren, Ergebnisse prüfen und Grenzen offen diskutieren.'],
  ['Transfer', 'Verbindlich weitergehen', 'Geeignete Anwendungsfälle und einfache Regeln für den Alltag festhalten.']
])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Format</p><h2>Passend zu Team, Aufgaben und Erfahrungsstand.</h2></div><p>Teilnehmerzahl, Dauer, Vorbereitung sowie Vor-Ort- oder Remote-Format klären wir im Erstgespräch. Danach erhalten Sie eine klare Leistungsbeschreibung mit Festpreis.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Führung & Verwaltung</small><h3>Entscheiden und kommunizieren.</h3><p>Recherche, Dokumente, Auswertung und verantwortlicher Einsatz.</p></article><article class="editorial-item reveal"><small>Service & Vertrieb</small><h3>Vorbereiten und strukturieren.</h3><p>Kundenkommunikation, Zusammenfassungen und Wissenszugriff.</p></article><article class="editorial-item reveal"><small>Technische Teams</small><h3>Dokumentieren und prüfen.</h3><p>Analyse, Wissensarbeit und kontrollierte Automatisierung.</p></article></div></div></section>
${cta('Machen wir aus ersten Experimenten eine klare Arbeitsweise.', 'Schildern Sie kurz, wer teilnehmen soll, welche Werkzeuge bereits genutzt werden und wo heute Unsicherheit besteht.', 'Workshop besprechen')}`);

function workVisual(type, title) {
  if (type === 'flow') return `<div class="work-visual"><div class="browser-bar"><i></i><i></i><i></i><span>workflow · beispieldaten</span></div><div class="flow" style="margin-top:56px"><span>Eingang</span><i></i><span>Prüfung</span><i></i><span>Freigabe</span></div></div>`;
  if (type === 'data') return `<div class="work-visual"><div class="browser-bar"><i></i><i></i><i></i><span>operations · beispieldaten</span></div><div class="mini-data"><div><small>STATUS</small><b>Prüfung</b></div><div><small>PRIORITÄT</small><b>Heute</b></div><div><small>VERANTWORTUNG</small><b>Zugeordnet</b></div></div></div>`;
  return `<div class="work-visual"><div class="browser-bar"><i></i><i></i><i></i><span>${type}</span></div><div class="mini-layout"><strong>${title}</strong><div class="mini-lines"><i></i><i></i><i></i><i></i></div></div></div>`;
}

pages.projekte = page('projekte', 'projekte', `
${hero('Arbeiten & Konzeptstudien', 'Qualität wird', 'im Detail sichtbar.', 'Ausgewählte Arbeiten zeigen, wie aus Positionierung, Gestaltung und technischer Logik ein durchgängiges digitales Produkt entsteht.', ['Eigene Plattform', 'Konzeptstudien', 'Beispieldaten', 'Klare Einordnung'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Ausgewählte Einblicke</p><h2>Die Qualität liegt im Zusammenspiel.</h2></div><p>Jede Arbeit verbindet Aussage, visuelle Richtung und technische Logik. Konzeptstudien sind direkt gekennzeichnet und machen einzelne Gestaltungs- und Systementscheidungen nachvollziehbar.</p></div><div class="work-grid">
  <article class="work-case reveal"><div class="work-meta"><span>Eigene Plattform · 2026</span><span>Live</span></div><h3>vachsystems.de</h3><p>Positionierung, Art Direction, Texte und Frontend als zusammenhängender Neuaufbau. Das Ziel: eine Seite, die den eigenen Anspruch sichtbar einlöst.</p>${workVisual('vachsystems.de', 'Ihr Unternehmen ist stark. Der Auftritt sollte es auch sein.')}</article>
  <article class="work-case reveal"><div class="work-meta"><span>Konzeptstudie · Website</span><span>Freie Arbeit</span></div><h3>Komplexe Inhalte, klare Orientierung.</h3><p>Eine redaktionelle Plattform mit Events, Wissen und Community wird über Struktur, Hierarchie und wiederkehrende Muster zugänglich.</p>${workVisual('community-platform.de', 'Eine Plattform, die sich sofort versteht.')}</article>
  <article class="work-case reveal"><div class="work-meta"><span>Konzeptstudie · Software</span><span>Beispieldaten</span></div><h3>Ein Operations-Cockpit für offene Vorgänge.</h3><p>Status, Verantwortung und nächster Schritt stehen im Vordergrund. Dekorative Kennzahlen weichen Informationen, die eine Handlung auslösen.</p>${workVisual('data', '')}</article>
  <article class="work-case reveal"><div class="work-meta"><span>Konzeptstudie · Automatisierung</span><span>Beispielprozess</span></div><h3>Ein Ablauf mit sichtbarer Kontrolle.</h3><p>Eingänge werden geprüft und vorbereitet. Unsichere oder kritische Fälle gehen nachvollziehbar an die zuständige Person.</p>${workVisual('flow', '')}</article>
</div></div></section>
<section class="section dark"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Unser Qualitätsmaßstab</p><h2>Jede Entscheidung trägt das Ganze.</h2></div><p>Ein überzeugendes digitales Produkt entsteht, wenn Aussage, Nutzerführung, visuelle Sprache und technische Umsetzung dieselbe Richtung verfolgen.</p></div><div class="editorial-grid" style="border-color:var(--line-light)"><article class="editorial-item reveal" style="border-color:var(--line-light)"><small>Aussage</small><h3>Der Wert wird sofort verständlich.</h3><p>Positionierung und Inhalt führen Interessenten zu einer klaren Einordnung.</p></article><article class="editorial-item reveal" style="border-color:var(--line-light)"><small>System</small><h3>Komplexität bekommt eine Ordnung.</h3><p>Hierarchie, Zustände und Interaktionen bleiben über alle Seiten hinweg konsistent.</p></article><article class="editorial-item reveal" style="border-color:var(--line-light)"><small>Umsetzung</small><h3>Qualität reicht bis in den Betrieb.</h3><p>Performance, Zugänglichkeit und Wartbarkeit werden als Teil des Produkts entwickelt.</p></article></div></div></section>
${cta('Ihr Projekt bekommt eine Richtung, die zu Ihrem Unternehmen gehört.', 'Wir entwickeln sie aus Ihrer Positionierung, Ihrer Zielgruppe und der Aufgabe, die gelöst werden soll.', 'Eigenes Projekt besprechen')}`);

pages['ueber-uns'] = page('ueber-uns', 'ueber-uns', `
${hero('Über vachsystems', 'Direkte Zusammenarbeit.', 'Klare Verantwortung.', 'vachsystems ist ein unabhängiges Digitalstudio aus Berlin. Konzeption, Gestaltung und technische Umsetzung bleiben eng miteinander verbunden.', ['Inhabergeführt', 'Berlin', 'Direkter Kontakt', 'Gezieltes Partnernetzwerk'])}
<section class="section founder-section"><div class="section-inner"><div class="founder-profile"><figure class="founder-portrait reveal"><img src="assets/patrick-vach.webp" alt="Patrick Vach, Inhaber von vachsystems" width="399" height="400" loading="lazy"></figure><div class="founder-copy reveal"><p class="section-label">Inhaber & Projektleitung</p><h2>Patrick Vach</h2><p>Sie sprechen mit der Person, die Ihr Projekt versteht, strukturiert und begleitet. Dadurch bleiben Entscheidungen schnell, Zusammenhänge erhalten und Verantwortung klar.</p><p class="founder-scope">Konzeption · Art Direction · Entwicklung · Projektleitung</p></div><p class="founder-statement reveal">Ein gutes digitales Produkt fühlt sich nicht nach einzelnen Gewerken an. Es wirkt wie eine klare Entscheidung.</p></div></div></section>
${methodStory('Arbeitsweise', 'Präzise geführt. Verlässlich umgesetzt.', 'vachsystems verbindet strategische Beratung, Gestaltung und Entwicklung in einer durchgängigen Projektführung. Für Spezialthemen werden gezielt passende Fachpartner eingebunden.', [
  ['Analyse', 'Eine belastbare Grundlage schaffen', 'Ziele, Nutzer, Inhalte und technische Rahmenbedingungen werden zu einem klaren Briefing verdichtet.'],
  ['Konzeption', 'Die Richtung verbindlich festlegen', 'Struktur, Funktion und Gestaltung werden nachvollziehbar entschieden, bevor unnötiger Aufwand entsteht.'],
  ['Umsetzung', 'Qualität konsequent ausarbeiten', 'Inhalt, Design und Technik werden integriert entwickelt und über alle Bildschirmgrößen hinweg geprüft.'],
  ['Projektführung', 'Verantwortung transparent halten', 'Abstimmungen, Prioritäten und nächste Schritte bleiben während des gesamten Projekts klar.']
])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Drei Disziplinen</p><h2>Web, Software und Automatisierung gehören zusammen.</h2></div><p>Ein professioneller Auftritt endet nicht an der Oberfläche. Gute digitale Arbeit verbindet verständliche Kommunikation mit funktionierenden Werkzeugen und sauberen Abläufen.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Web</small><h3>Haltung sichtbar machen.</h3><p>Unternehmen klar positionieren und eigenständig präsentieren.</p></article><article class="editorial-item reveal"><small>Software</small><h3>Arbeit verständlich abbilden.</h3><p>Digitale Werkzeuge an echte Aufgaben und Rollen anpassen.</p></article><article class="editorial-item reveal"><small>Automatisierung</small><h3>Wiederholung reduzieren.</h3><p>Systeme verbinden und kontrollierbare Abläufe schaffen.</p></article></div></div></section>
${cta('Direkte Zusammenarbeit. Klare Verantwortung. Hoher Anspruch.', 'Schildern Sie kurz, was Sie aufbauen oder verändern möchten. Sie erhalten eine fundierte erste Einschätzung.', 'Kennenlernen')}`);

pages.kontakt = page('kontakt', '', `
${hero('Projekt besprechen', 'Erzählen Sie,', 'was besser werden soll.', 'Eine kurze Beschreibung reicht für den Anfang. Sie erhalten eine konkrete Rückmeldung zu Richtung, Machbarkeit und sinnvollen nächsten Schritten.', ['Direkter Kontakt', 'Unverbindliche Ersteinschätzung', 'Berlin & remote'])}
<section class="section"><div class="section-inner"><div class="contact-layout"><div class="reveal"><p class="section-label">Ihre Anfrage</p><h2 style="font-size:clamp(2.7rem,5vw,5.1rem);margin-bottom:48px">Worum geht es?</h2><form class="contact-form" action="https://formspree.io/f/mdawknwo" method="POST">
  <div class="field"><label for="name">Name *</label><input id="name" name="name" autocomplete="name" required></div>
  <div class="field"><label for="company">Unternehmen / Organisation</label><input id="company" name="company" autocomplete="organization"></div>
  <div class="field"><label for="email">E-Mail *</label><input id="email" type="email" name="email" autocomplete="email" inputmode="email" required></div>
  <div class="field"><label for="project">Thema</label><select id="project" name="project"><option value="">Bitte auswählen</option><option>Website oder Relaunch</option><option>Individuelle Software</option><option>Automatisierung oder KI</option><option>KI-Workshop</option><option>Etwas anderes</option></select></div>
  <div class="field"><label for="message">Nachricht *</label><textarea id="message" name="message" required placeholder="Was besteht heute, was soll besser werden und gibt es einen zeitlichen Rahmen?"></textarea></div>
  <input type="hidden" name="_subject" value="Neue Projektanfrage über vachsystems.de">
  <p class="form-note">Mit dem Absenden werden Ihre Angaben zur Bearbeitung der Anfrage an Formspree übermittelt. Mehr dazu in der <a href="datenschutz">Datenschutzerklärung</a>.</p>
  <button class="button" type="submit"><span>Anfrage senden</span><span aria-hidden="true">↗</span></button>
</form></div><aside class="contact-aside reveal" aria-label="Direkter Kontakt"><div class="contact-detail"><small>Ansprechpartner</small><span>Patrick Vach</span></div><div class="contact-detail"><small>E-Mail</small><a href="mailto:contact@vachsystems.de">contact@vachsystems.de</a></div><div class="contact-detail"><small>WhatsApp</small><a href="https://wa.me/491636683867" target="_blank" rel="noopener noreferrer">+49 163 6683867</a></div><div class="contact-detail"><small>Standort</small><span>Berlin, Deutschland</span></div><div class="contact-detail"><small>Rückmeldung</small><span>In der Regel innerhalb eines Werktags.</span></div></aside></div></div></section>
${methodStory('Danach', 'Ein klares Gespräch schafft die richtige Grundlage.', 'Wir klären offene Fragen, ordnen das Vorhaben ein und entwickeln daraus einen sinnvollen nächsten Schritt.', [
  ['Anfrage', 'Wir lesen zuerst', 'Was besteht heute, was soll sich verändern und woran würde man eine Verbesserung erkennen?'],
  ['Rückfragen', 'Wir klären nur das Nötige', 'Ziel, Umfang und Rahmen werden in einem direkten Gespräch konkret.'],
  ['Einschätzung', 'Sie erhalten eine klare Richtung', 'Wir skizzieren die sinnvollen nächsten Schritte in verständlicher Form.'],
  ['Entscheidung', 'Ein Angebot kommt erst danach', 'Erst wenn Leistung und Vorgehen klar sind, wird es konkret.']
])}`);

pages.impressum = page('impressum', '', `
${hero('Rechtliches', 'Impressum', 'Anbieterangaben.', 'Die gesetzlich vorgesehenen Informationen zum Anbieter dieser Website.', [])}
<section class="section"><div class="section-inner"><div class="legal-copy">
  <p>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>
  <section><h2>Anbieter</h2><p><strong>vachsystems</strong><br>Inhaber: Patrick Vach<br>Charlottenburger Str. 142<br>13086 Berlin<br>Deutschland</p></section>
  <section><h2>Kontakt</h2><p>E-Mail: <a href="mailto:contact@vachsystems.de">contact@vachsystems.de</a><br>Website: <a href="https://vachsystems.de/">vachsystems.de</a></p></section>
  <section><h2>Umsatzsteuer</h2><p>Als Kleinunternehmer im Sinne von § 19 Abs. 1 Umsatzsteuergesetz (UStG) wird keine Umsatzsteuer berechnet.</p></section>
  <section><h2>Verantwortlich für redaktionelle Inhalte</h2><p>Verantwortlich nach § 18 Abs. 2 Medienstaatsvertrag (MStV):<br>Patrick Vach, Anschrift wie oben.</p></section>
  <section><h2>Verbraucherstreitbeilegung</h2><p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p></section>
</div></div></section>`);

pages.datenschutz = page('datenschutz', '', `
${hero('Rechtliches', 'Datenschutz', 'klar erklärt.', 'Welche Daten beim Besuch der Website und bei einer Kontaktaufnahme verarbeitet werden.', [])}
<section class="section"><div class="section-inner"><div class="legal-copy">
  <p>Stand: 28. August 2026. Diese Website setzt derzeit keine Analyse- oder Marketingdienste und keine nicht notwendigen Cookies ein.</p>
  <section><h2>1. Verantwortlicher</h2><p><strong>vachsystems</strong><br>Inhaber: Patrick Vach<br>Charlottenburger Str. 142<br>13086 Berlin<br>Deutschland<br>E-Mail: <a href="mailto:contact@vachsystems.de">contact@vachsystems.de</a></p></section>
  <section><h2>2. Hosting über GitHub Pages</h2><p>Diese Website wird über GitHub Pages bereitgestellt. Beim Abruf können technisch erforderliche Verbindungsdaten verarbeitet werden, insbesondere IP-Adresse, Zeitpunkt, aufgerufene Ressource, Referrer sowie Browser- und Geräteinformationen. Die Verarbeitung dient der sicheren und stabilen Bereitstellung der Website auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</p><p>Weitere Informationen: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von GitHub</a>.</p></section>
  <section><h2>3. Kontaktformular über Formspree</h2><p>Wenn Sie das Kontaktformular verwenden, werden die eingegebenen Angaben an Formspree übermittelt und zur Zustellung und Bearbeitung Ihrer Anfrage verarbeitet. Dazu gehören je nach Eingabe Name, Unternehmen, E-Mail-Adresse, Thema und Nachricht.</p><p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um eine Vertragsanbahnung geht, ansonsten Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen: <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Formspree</a>.</p></section>
  <section><h2>4. Kontakt per E-Mail oder WhatsApp</h2><p>Bei einer Kontaktaufnahme per E-Mail oder WhatsApp verarbeiten wir die übermittelten Angaben zur Bearbeitung Ihrer Anfrage. Bei WhatsApp gelten zusätzlich die Datenschutzbestimmungen des jeweiligen Anbieters. Wenn Sie diesen Kanal nicht nutzen möchten, schreiben Sie bitte direkt per E-Mail.</p></section>
  <section><h2>5. Keine Reichweitenmessung oder Marketing-Cookies</h2><p>Auf dieser Website ist derzeit kein Webanalyse-, Werbe- oder Remarketingdienst eingebunden. Es wird deshalb kein Einwilligungsbanner angezeigt. Externe Seiten werden erst aufgerufen, wenn Sie einen entsprechenden Link anklicken.</p></section>
  <section><h2>6. Speicherdauer</h2><p>Anfragedaten werden nur so lange gespeichert, wie sie für die Bearbeitung, eine mögliche Zusammenarbeit oder gesetzliche Aufbewahrungspflichten benötigt werden.</p></section>
  <section><h2>7. Ihre Rechte</h2><p>Sie haben im Rahmen der gesetzlichen Voraussetzungen insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung können Sie mit Wirkung für die Zukunft widerrufen.</p><p>Zur Ausübung Ihrer Rechte schreiben Sie an <a href="mailto:contact@vachsystems.de">contact@vachsystems.de</a>. Außerdem besteht ein Beschwerderecht bei einer zuständigen Datenschutzaufsichtsbehörde.</p></section>
</div></div></section>`);

for (const [slug, html] of Object.entries(pages)) {
  fs.writeFileSync(path.join(ROOT, `${slug}.html`), html);
}

function blogIndex() {
  const title = 'Einblicke zu Web, Software & Automatisierung | vachsystems';
  const description = 'Nüchterne Einordnungen zu digitalen Produkten, Automatisierung und KI im Unternehmen – mit Quellen, Kontext und klarer Autorenschaft.';
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Einblicke von vachsystems', url: `${BASE}/blog/`, description, publisher: { '@type': 'Organization', name: 'vachsystems', url: `${BASE}/` } };
  const entries = articleCatalog.map(([slug, date, category, itemTitle, excerpt]) => `<a class="journal-entry reveal" href="${slug}"><time>${date}<br>${category}</time><div><h2>${itemTitle}</h2><p>${excerpt}</p></div><span aria-hidden="true">↗</span></a>`).join('');
  return `${head({ title, description, slug: 'blog/', prefix: '../', schema, extraStyles: '<link rel="stylesheet" href="../css/editorial-studio.css?v=20260828-2">' })}
</head><body>
${nav('', '../')}
<main id="main"><header class="journal-hero"><div class="journal-hero-inner"><p class="page-kicker">Einblicke</p><h1>Technik einordnen.<br><span>Besser entscheiden.</span></h1><div class="journal-hero-row"><p>Fundierte Beiträge zu digitalen Produkten, Automatisierung und KI. Geschrieben für Entscheider, die aus technischen Möglichkeiten tragfähige Lösungen entwickeln wollen.</p><small>Redaktion: Patrick Vach<br>Stand und Quellen sind direkt am Beitrag ausgewiesen.</small></div></div></header><section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Ausgewählte Beiträge</p><h2>Substanz für digitale Entscheidungen.</h2></div><p>Klare Aufgaben, saubere Daten, kontrollierte Abläufe und messbare Qualität bilden die Grundlage für dauerhaft gute Systeme.</p></div><div class="journal-list">${entries}</div></div></section>${cta('Bringen wir ein konkretes Vorhaben in eine klare Form.', 'Schildern Sie kurz, welche Aufgabe oder welches digitale Produkt Sie verbessern möchten.', 'Projekt besprechen', '../')}</main>
${footer('../')}
</body></html>\n`;
}

fs.writeFileSync(path.join(ROOT, 'blog/index.html'), blogIndex());

const officialSources = {
  openai: ['OpenAI: GPT-5.5', 'https://openai.com/index/introducing-gpt-5-5/'],
  anthropic: ['Anthropic: Claude Opus 5', 'https://www.anthropic.com/news/claude-opus-5'],
  gemini: ['Google: Gemini 3.1 Pro', 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/'],
  deepseek: ['DeepSeek: V4 Preview Release', 'https://api-docs.deepseek.com/news/news260424/'],
  kimi: ['Moonshot AI: Kimi API Platform', 'https://platform.moonshot.ai/'],
  nist: ['NIST: AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework'],
  eu: ['Europäische Kommission: AI Act', 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'],
  bsi: ['BSI: Chancen und Risiken generativer KI-Modelle', 'https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/KI/Generative_KI-Modelle.html'],
  microsoft: ['Microsoft: Enterprise Data Protection in Copilot', 'https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection']
};

const sourceKeys = {
  'roi-rechnung-ai-agents-investition-lohnt-sich': ['nist', 'bsi'],
  'hybrid-ai-systems-lokal-cloud-zukunft': ['bsi', 'nist'],
  'ai-pragmatismus-2026-hype-zu-produktivitaet': ['nist', 'bsi'],
  '500-llm-modelle-richtiges-fuer-unternehmen-waehlen': ['openai', 'anthropic', 'gemini'],
  'agentic-automation-guardrails-mittelstand-sicher': ['nist', 'eu', 'bsi'],
  'ai-vendor-lock-in-vermeiden-open-source-vs-proprietary': ['nist', 'bsi'],
  'enterprise-ai-stack-2026-richtige-architektur': ['nist', 'bsi'],
  'small-language-models-slm-fine-tuning-unternehmen': ['nist', 'bsi']
};

const articleBodies = {
  'roi-rechnung-ai-agents-investition-lohnt-sich': `
    <p>Die Wirtschaftlichkeit eines KI-Projekts lässt sich nicht aus einer Produktdemo ableiten. Entscheidend ist, ob ein klar definierter Ablauf nach der Einführung verlässlich besser funktioniert. Dafür braucht es eine belastbare Ausgangslage, vollständige Kosten und ein Qualitätsmaß, das zum Prozess passt.</p>
    <h2>Die heutige Arbeit zuerst messbar machen</h2>
    <p>Vor der Lösung steht die Baseline. Wie häufig tritt die Aufgabe auf? Wie viel Bearbeitungszeit bindet sie? Wo entstehen Wartezeiten, Rückfragen oder Korrekturen? Welche Fälle müssen aus fachlichen oder rechtlichen Gründen ohnehin von einem Menschen geprüft werden?</p>
    <p>Die Baseline muss nicht perfekt sein. Eine repräsentative Stichprobe aus echten Vorgängen ist meist wertvoller als eine große Schätzung. Sie zeigt, wie unterschiedlich die Fälle wirklich sind und welcher Teil der Arbeit standardisierbar ist.</p>
    <h2>Alle Kosten in dieselbe Rechnung nehmen</h2>
    <p>Lizenz- oder Modellkosten sind nur ein Teil des Aufwands. Hinzu kommen Konzeption, Integration, Datenaufbereitung, Qualitätssicherung, Betrieb, Überwachung und die Zeit der Fachleute. Auch Ausnahmen und Fehlentscheidungen haben einen Preis.</p>
    <p>Ein seriöser Business Case trennt einmalige Einführungskosten von laufenden Kosten. Er rechnet außerdem nicht mit vollständiger Automatisierung, wenn Freigaben, Sonderfälle oder Nacharbeit realistisch bestehen bleiben.</p>
    <h2>Nutzen als Prozessverbesserung bewerten</h2>
    <p>Zeitgewinn ist nur dann wertvoll, wenn er im Ablauf tatsächlich ankommt. Kürzere Durchlaufzeiten, weniger Rückfragen, konsistentere Dokumentation oder ein besserer Zugang zu Wissen können ebenso relevant sein wie eingesparte Minuten. Für jedes Ziel braucht es eine nachvollziehbare Messgröße.</p>
    <div class="highlight-box"><p><strong>Der entscheidende Test:</strong> Würde das Vorhaben auch dann überzeugen, wenn Volumen, Automatisierungsgrad und Zeitgewinn konservativer ausfallen als erhofft?</p></div>
    <h2>Mit einem begrenzten Pilot entscheiden</h2>
    <p>Ein guter Pilot beantwortet eine wirtschaftliche Frage. Er arbeitet mit echten, freigegebenen Beispielen, klaren Qualitätskriterien und einem definierten Prüfweg. Am Ende steht eine Entscheidung: ausbauen, gezielt nachbessern oder beenden.</p>
    <p>So wird aus einer allgemeinen Erwartung ein belastbarer Investitionsentscheid. Der Business Case wächst mit den gemessenen Ergebnissen – nicht mit der Zahl der Funktionen.</p>`,

  'hybrid-ai-systems-lokal-cloud-zukunft': `
    <p>Lokaler Betrieb und Cloud sind keine gegensätzlichen Weltanschauungen. Sie sind Betriebsmodelle mit unterschiedlichen Stärken. Eine tragfähige Architektur ordnet Daten und Aufgaben so zu, dass Schutzbedarf, Qualität, Geschwindigkeit und Verantwortung zusammenpassen.</p>
    <h2>Die Entscheidung beginnt bei Daten und Verantwortung</h2>
    <p>Welche Informationen verarbeitet werden, wer darauf zugreifen darf und welche Nachweise erforderlich sind, bestimmt den Lösungsraum. Vertrauliche Inhalte, personenbezogene Daten oder geschäftskritische Entscheidungen brauchen andere Leitplanken als öffentliches Marketingmaterial.</p>
    <p>Ebenso wichtig ist die Betriebsverantwortung. Ein lokales Modell schafft nicht automatisch Kontrolle. Updates, Zugriffsrechte, Protokollierung, Kapazität und Sicherheitsmaßnahmen müssen auch dort professionell betrieben werden.</p>
    <h2>Lokaler Betrieb schafft Nähe und Planbarkeit</h2>
    <p>Lokale oder dedizierte Modelle können sinnvoll sein, wenn Daten das eigene Umfeld nicht verlassen sollen, geringe Netzabhängigkeit gefragt ist oder eine stabile, eng begrenzte Aufgabe häufig ausgeführt wird. Sie ermöglichen eine genaue Kontrolle über Versionen und Infrastruktur.</p>
    <p>Dafür trägt das Unternehmen mehr technische Verantwortung. Hardware, Skalierung, Modellpflege und Überwachung werden Teil des eigenen Betriebs. Diese Kosten gehören in die Architekturentscheidung.</p>
    <h2>Cloud-Dienste schaffen Zugriff auf Breite und Skalierung</h2>
    <p>Cloud-Angebote erleichtern den Zugang zu leistungsfähigen Modellen, verwalteter Infrastruktur und neuen Funktionen. Sie können Last flexibel abfangen und den Einstieg beschleunigen. Gleichzeitig müssen Verträge, Datenverarbeitung, Regionen, Aufbewahrung und technische Abhängigkeiten geprüft werden.</p>
    <h2>Eine klare Grenze macht das hybride System beherrschbar</h2>
    <p>In einer hybriden Architektur bleibt nicht einfach ein Teil lokal und ein anderer in der Cloud. Entscheidend ist eine bewusst definierte Grenze: Welche Daten werden vorverarbeitet? Welche Informationen dürfen das System verlassen? Welcher Modelltyp bearbeitet welche Klasse von Aufgabe? Was geschieht bei einem Ausfall?</p>
    <p>Diese Regeln gehören in die technische Umsetzung und in den Betrieb. Erst dann verbindet ein hybrides System die Vorteile beider Modelle, ohne Verantwortlichkeiten zu verwischen.</p>`,

  'ai-pragmatismus-2026-hype-zu-produktivitaet': `
    <p>KI wird produktiv, wenn sie eine konkrete Arbeit zuverlässig verbessert. Die Qualität eines Vorhabens zeigt sich deshalb nicht in der Modernität des Werkzeugs, sondern im Ablauf: klare Eingaben, überprüfbare Ergebnisse und eine verantwortliche Person.</p>
    <h2>Von der Aufgabe aus denken</h2>
    <p>Ein guter Anwendungsfall lässt sich in einem Satz beschreiben. Er benennt die heutige Arbeit, das gewünschte Ergebnis und die Person, die damit weiterarbeitet. Je klarer diese drei Punkte sind, desto leichter lässt sich prüfen, ob KI überhaupt der passende Baustein ist.</p>
    <p>Aufgaben mit wiederkehrenden Mustern, ausreichend Beispielen und einem klaren Qualitätsurteil eignen sich besser als seltene Entscheidungen mit hohem Risiko und unklarer Datenlage.</p>
    <h2>Qualität vor der Demo definieren</h2>
    <p>Vor dem ersten Test muss feststehen, woran ein brauchbares Ergebnis erkannt wird. Das kann fachliche Richtigkeit, Vollständigkeit, Tonalität, Quellenbezug oder die korrekte Zuordnung zu einem Vorgang sein. Mehrere Kriterien sind häufig nötig.</p>
    <p>Eine kleine, repräsentative Sammlung realer Fälle schafft Vergleichbarkeit. Sie zeigt auch, bei welchen Ausnahmen ein Modell Unterstützung braucht oder der Prozess an einen Menschen übergeben werden muss.</p>
    <h2>Den kleinsten vollständigen Ablauf bauen</h2>
    <p>Ein produktiver Pilot umfasst mehr als einen Prompt. Er regelt, woher die Eingaben kommen, wie sensible Informationen behandelt werden, wie Ergebnisse geprüft und wohin sie übertragen werden. Fehler und Unsicherheit brauchen einen sichtbaren Weg.</p>
    <p>Dieser kleine vollständige Ablauf liefert bessere Erkenntnisse als ein breiter Funktionskatalog. Er zeigt, ob die Lösung in bestehende Verantwortung, Systeme und Arbeitsgewohnheiten passt.</p>
    <h2>Erst nach belegter Qualität erweitern</h2>
    <p>Wenn Qualität und Betrieb stimmen, kann der Umfang wachsen. Weitere Fälle, mehr Volumen oder zusätzliche Systeme werden schrittweise angebunden. So bleibt sichtbar, welche Veränderung welchen Nutzen bringt.</p>
    <p>Pragmatismus bedeutet dabei nicht, klein zu denken. Er bedeutet, große Wirkung auf einer belastbaren Grundlage aufzubauen.</p>`,

  '500-llm-modelle-richtiges-fuer-unternehmen-waehlen': `
    <p>Die Zahl verfügbarer Sprachmodelle ist für die Auswahl weniger wichtig als die eigene Aufgabe. Ein Modell ist dann passend, wenn es die benötigte Qualität im vorgesehenen Betrieb erreicht – mit vertretbarer Geschwindigkeit, kontrollierbaren Datenflüssen und nachvollziehbaren Kosten.</p>
    <h2>Das Anforderungsprofil vor dem Modell festlegen</h2>
    <p>Texterstellung, Extraktion, Klassifikation, Recherche und Softwareentwicklung stellen unterschiedliche Anforderungen. Sprache, Kontextlänge, Antwortzeit, Werkzeugnutzung und strukturierte Ausgabe müssen aus dem konkreten Prozess abgeleitet werden.</p>
    <p>Dazu kommen betriebliche Fragen: Wo darf die Verarbeitung stattfinden? Welche Verfügbarkeit ist nötig? Wie werden Versionen gewechselt? Welche Protokolle und Vertragsbedingungen braucht das Unternehmen?</p>
    <h2>Mit eigenen Fällen vergleichen</h2>
    <p>Öffentliche Ranglisten können eine Vorauswahl unterstützen, ersetzen aber keinen Anwendungstest. Eine repräsentative Testmenge aus freigegebenen, anonymisierten oder synthetischen Fällen zeigt, wie Modelle mit der tatsächlichen Sprache und den Ausnahmen des Unternehmens umgehen.</p>
    <p>Die Bewertung sollte pro Kriterium erfolgen. Fachliche Richtigkeit, Vollständigkeit, Format, Quellenbezug und notwendige Nacharbeit lassen sich getrennt betrachten. So wird sichtbar, warum ein Ergebnis brauchbar oder unbrauchbar ist.</p>
    <h2>Das Gesamtsystem statt nur die Antwort bewerten</h2>
    <p>Ein leistungsfähiges Modell kann im Alltag trotzdem die schlechtere Wahl sein, wenn Latenz, Integration oder Betrieb nicht passen. Umgekehrt kann ein kleineres Modell in einem eng geführten Ablauf zuverlässiger und wirtschaftlicher arbeiten.</p>
    <p>Auch Sicherheitsmechanismen, Rollen, Datenaufbewahrung und Beobachtbarkeit gehören in den Vergleich. Die Modellantwort ist ein Bestandteil des Produkts, nicht das Produkt selbst.</p>
    <h2>Die Auswahl als wiederholbaren Prozess aufbauen</h2>
    <p>Modelle und Konditionen ändern sich. Deshalb sollte die Testmenge erhalten bleiben und bei relevanten Änderungen erneut ausgeführt werden. Eine klar dokumentierte Bewertung ermöglicht Wechsel, ohne die gesamte Entscheidung von vorne zu beginnen.</p>`,

  'agentic-automation-guardrails-mittelstand-sicher': `
    <p>Je selbstständiger ein System handelt, desto klarer müssen seine Grenzen sein. Leitplanken sind kein Zusatz für den späteren Betrieb. Sie bestimmen von Anfang an, welche Informationen ein System sehen, welche Aktionen es auslösen und wann es Verantwortung übergeben darf.</p>
    <h2>Berechtigungen folgen der Aufgabe</h2>
    <p>Ein automatisierter Ablauf erhält nur die Zugriffe, die er für seinen konkreten Zweck benötigt. Lesen, Entwerfen, Ändern und endgültiges Ausführen sind unterschiedliche Rechte. Diese Trennung begrenzt Fehler und macht Freigaben gezielt möglich.</p>
    <p>Temporäre Zugangsdaten, getrennte Umgebungen und klar zugeordnete technische Identitäten erleichtern die Kontrolle. Ein allgemeines Konto mit weitreichenden Rechten erschwert sie.</p>
    <h2>Freigaben an das Risiko koppeln</h2>
    <p>Routinehandlungen mit begrenzter Wirkung können automatisiert laufen. Finanzielle, rechtliche oder kundenwirksame Aktionen brauchen abhängig vom Risiko eine fachliche Freigabe. Entscheidend ist, dass der Mensch den nötigen Kontext erhält und nicht nur einen Ja-oder-Nein-Knopf.</p>
    <p>Unsicherheit muss ein sichtbarer Systemzustand sein. Wenn Daten fehlen, Regeln widersprechen oder ein Ergebnis außerhalb definierter Grenzen liegt, führt der Ablauf in eine Prüfung.</p>
    <h2>Jede relevante Aktion nachvollziehbar machen</h2>
    <p>Protokolle sollten zeigen, welche Eingabe vorlag, welche Regel oder Modellversion verwendet wurde, welche Aktion geplant war und wer sie freigegeben hat. Dabei müssen Datenschutz und Aufbewahrungsfristen berücksichtigt werden.</p>
    <p>Nachvollziehbarkeit ist nicht nur für Audits wertvoll. Sie hilft im Alltag, Fehler zu verstehen, Qualität zu messen und Verbesserungen gezielt vorzunehmen.</p>
    <h2>Fehlerwege und Abschaltung mitentwickeln</h2>
    <p>Ein sicherer Ablauf kann pausiert werden, ohne weitere Vorgänge zu beschädigen. Wiederholungen sind kontrolliert, externe Systeme werden nicht unbemerkt mehrfach beschrieben und ein manueller Ersatzweg bleibt verfügbar.</p>
    <p>Mit diesen Grundlagen kann Automatisierung schrittweise mehr Verantwortung übernehmen. Vertrauen entsteht durch beobachtbares Verhalten, nicht durch eine weitreichende technische Freigabe am ersten Tag.</p>`,

  'ai-vendor-lock-in-vermeiden-open-source-vs-proprietary': `
    <p>Abhängigkeit entsteht selten durch eine einzelne Modellentscheidung. Sie wächst, wenn Datenformate, Prozesslogik, Qualitätsprüfungen und Betriebswissen untrennbar an einen Anbieter gebunden werden. Wer diese Ebenen bewusst gestaltet, erhält auch in einem dynamischen Markt Handlungsfreiheit.</p>
    <h2>Die tatsächlichen Abhängigkeiten sichtbar machen</h2>
    <p>Proprietäre und offene Modelle haben jeweils eigene Stärken. Für die Wechselbarkeit ist entscheidend, welche Teile des Systems austauschbar sind. Modellzugang, Vektorspeicher, Identitätsverwaltung, Beobachtbarkeit und Hosting können jeweils Bindungen erzeugen.</p>
    <p>Eine Architekturübersicht sollte zeigen, welche Daten wo liegen, welche Schnittstellen genutzt werden und welche Funktionen anbieterspezifisch sind. Erst daraus lässt sich ein realistisches Wechselrisiko ableiten.</p>
    <h2>Prozesslogik außerhalb des Modells halten</h2>
    <p>Geschäftsregeln, Berechtigungen und Freigaben gehören in kontrollierbare Anwendungskomponenten. Ein Modell kann Inhalte strukturieren oder Vorschläge erzeugen, sollte aber nicht die einzige Stelle sein, an der wesentliche Regeln verborgen sind.</p>
    <p>Eine klar definierte Modellschnittstelle erleichtert den Vergleich verschiedener Anbieter. Sie muss Unterschiede in Ausgabeformat, Kontext und Werkzeugnutzung berücksichtigen, statt vollständige Gleichheit vorzutäuschen.</p>
    <h2>Daten und Qualitätswissen portabel halten</h2>
    <p>Eigene Dokumente, Metadaten, Testfälle und Bewertungen sind langfristig wertvoller als ein einzelner Prompt. Sie sollten in nachvollziehbaren Formaten gespeichert und unabhängig von einer Herstelleroberfläche gepflegt werden.</p>
    <p>Eine eigene Testmenge macht einen Modellwechsel messbar. Sie zeigt, ob die neue Variante fachlich mindestens gleichwertig ist und wo der Prozess angepasst werden muss.</p>
    <h2>Den Ausstieg praktisch prüfen</h2>
    <p>Verträge sollten Datenexport, Löschung, Aufbewahrung, Preisänderungen und das Ende des Dienstes abdecken. Technisch lohnt sich ein begrenzter Wechseltest, bevor eine Lösung geschäftskritisch wird.</p>
    <p>Das Ziel ist nicht vollständige Anbieterunabhängigkeit um jeden Preis. Es ist eine bewusste Bindung mit bekanntem Nutzen, dokumentierten Grenzen und einem realistischen Ausweg.</p>`,

  'enterprise-ai-stack-2026-richtige-architektur': `
    <p>Eine tragfähige KI-Architektur ist keine Liste moderner Produkte. Sie verbindet einen klaren Nutzerweg mit Prozesslogik, Datenzugriff, Modellen, Berechtigungen und Betrieb. Erst dieses Zusammenspiel macht aus einer Modellfunktion ein verlässliches digitales Werkzeug.</p>
    <h2>Die Oberfläche führt die Verantwortung</h2>
    <p>Nutzer müssen erkennen, welche Informationen verwendet wurden, welchen Status ein Ergebnis hat und was als Nächstes geschieht. Entwurf, fachlich geprüft und freigegeben sind unterschiedliche Zustände. Die Oberfläche macht sie sichtbar.</p>
    <p>Gute Interaktion begrenzt außerdem Eingaben, stellt Kontext bereit und verhindert Aktionen, für die keine Berechtigung besteht. Damit beginnt Governance bereits in der Bedienung.</p>
    <h2>Prozesslogik hält das System zusammen</h2>
    <p>Zwischen Oberfläche und Modell liegt der eigentliche Ablauf. Er beschafft erlaubte Daten, wendet Regeln an, ruft passende Funktionen auf und entscheidet über Freigaben oder Fehlerwege. Diese Logik sollte versioniert und testbar sein.</p>
    <p>Das Modell übernimmt klar benannte Aufgaben innerhalb dieses Ablaufs. Es ist austauschbarer, wenn Zuständigkeiten und Ausgabeformate sauber definiert sind.</p>
    <h2>Datenzugriff braucht Kontext und Grenzen</h2>
    <p>Ein System sollte nur die Informationen abrufen, die für den jeweiligen Vorgang nötig und erlaubt sind. Rollen, Mandanten, Aktualität und Herkunft müssen beim Zugriff berücksichtigt werden. Quellenhinweise helfen Nutzern, Ergebnisse fachlich einzuordnen.</p>
    <h2>Betrieb macht Qualität dauerhaft</h2>
    <p>Beobachtbarkeit umfasst mehr als technische Verfügbarkeit. Antwortqualität, Laufzeit, Kosten, Fehlerraten, Abbrüche und manuelle Korrekturen liefern ein Bild davon, ob der Prozess funktioniert. Modell- und Prompt-Versionen müssen den Ergebnissen zugeordnet werden können.</p>
    <p>Eine solche Architektur kann klein beginnen. Ein einziger vollständig geführter Ablauf ist eine bessere Grundlage als eine breite Plattform ohne klare Verantwortung.</p>`,

  'small-language-models-slm-fine-tuning-unternehmen': `
    <p>Größer ist bei Sprachmodellen nicht automatisch besser. Für eng definierte Aufgaben können kleinere Modelle schnell, wirtschaftlich und kontrollierbar arbeiten. Entscheidend ist, ob sie die erforderliche Qualität mit den verfügbaren Daten und unter den gewünschten Betriebsbedingungen erreichen.</p>
    <h2>Klare Aufgaben begünstigen kleinere Modelle</h2>
    <p>Klassifikation, Extraktion, Routing oder standardisierte Textbausteine haben oft einen begrenzten Erwartungsraum. Wenn Eingaben strukturiert sind und das Ergebnis eindeutig bewertet werden kann, lässt sich ein kleineres Modell gezielt testen und führen.</p>
    <p>Offene Recherche, komplexe Fachfragen oder stark wechselnde Aufgaben können dagegen mehr Modellbreite, zusätzliche Werkzeuge oder einen anderen Prozess benötigen.</p>
    <h2>Kontextzugriff und Fine-Tuning unterscheiden</h2>
    <p>Aktuelles Unternehmenswissen wird häufig besser über einen kontrollierten Dokumentzugriff bereitgestellt. Das Modell erhält zur Anfrage passende Quellen, ohne dass Inhalte dauerhaft in seinen Gewichten verankert werden. Aktualisierungen bleiben dadurch einfacher.</p>
    <p>Fine-Tuning ist sinnvoll, wenn Verhalten, Terminologie oder ein wiederkehrendes Ausgabeformat mit genügend hochwertigen Beispielen stabilisiert werden sollen. Es ersetzt weder saubere Daten noch einen klaren Qualitätsmaßstab.</p>
    <h2>Den Betrieb als Teil der Auswahl rechnen</h2>
    <p>Ein lokal betriebenes kleines Modell kann Datenwege und Versionen gut kontrollierbar machen. Gleichzeitig entstehen Verantwortung für Infrastruktur, Sicherheit, Aktualisierung und Überwachung. Bei einer API liegen andere Teile dieser Verantwortung beim Anbieter.</p>
    <p>Deshalb werden Qualität, Laufzeit, Durchsatz, Kosten und Betriebsaufwand gemeinsam betrachtet. Nur so ist der Vergleich vollständig.</p>
    <h2>Mit einer dauerhaften Testmenge entscheiden</h2>
    <p>Repräsentative Beispiele und klare Bewertungskriterien zeigen, ob ein kleineres Modell tatsächlich genügt. Diese Tests sollten bei Modell-, Daten- oder Prozessänderungen wiederholt werden.</p>
    <p>In einer guten Architektur kann je nach Aufgabe unterschiedlich geroutet werden. Ein kleineres Modell übernimmt den häufigen Standardfall; anspruchsvollere oder riskante Fälle gehen an einen leistungsfähigeren Dienst oder direkt an einen Menschen.</p>`
};

function articlePage(item) {
  const [slug, displayDate, category, cleanTitle, catalogExcerpt] = item;
  const lead = catalogExcerpt;
  const content = articleBodies[slug];
  if (!content) throw new Error(`Kein redaktioneller Artikelinhalt vorhanden: ${slug}`);
  const description = lead.slice(0, 160);
  const isoDate = (() => {
    const months = { Januar:'01', Februar:'02', März:'03', April:'04', Mai:'05', Juni:'06', Juli:'07', August:'08', September:'09', Oktober:'10', November:'11', Dezember:'12' };
    const match = displayDate.match(/(\d{1,2})\. (\w+) (\d{4})/);
    return match ? `${match[3]}-${months[match[2]]}-${match[1].padStart(2, '0')}` : TODAY;
  })();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cleanTitle,
    description,
    datePublished: isoDate,
    dateModified: TODAY,
    mainEntityOfPage: `${BASE}/blog/${slug}`,
    author: { '@type': 'Person', name: 'Patrick Vach' },
    publisher: { '@type': 'Organization', name: 'vachsystems', url: `${BASE}/` },
    image: `${BASE}/images/vachsystems-object-og.webp`
  };
  const sources = (sourceKeys[slug] || ['nist', 'bsi']).map(key => officialSources[key]);
  const sourcesHtml = `<section class="sources"><h2>Quellen & Weiterführendes</h2><ul>${sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join('')}</ul></section>`;
  return `${head({ title: `${cleanTitle} | vachsystems`, description, slug: `blog/${slug}`, prefix: '../', type: 'article', schema, extraStyles: '<link rel="stylesheet" href="../css/editorial-studio.css?v=20260828-2">' })}
</head><body class="article-shell">
${nav('', '../')}
<main id="main"><article>
  <header class="article-masthead"><div class="article-masthead-inner"><div class="article-meta"><span>${category}</span><time datetime="${isoDate}">${displayDate}</time><span>Stand: 28. August 2026</span></div><h1>${cleanTitle}</h1><p class="article-lead">${esc(lead)}</p><div class="article-byline"><span>Text & Einordnung: <strong>Patrick Vach</strong></span><span>Fachliche Einordnung für Entscheider und Projektverantwortliche.</span></div></div></header>
  <div class="article-layout"><div class="article-content">${content}${sourcesHtml}<p class="editorial-note">Die genannten Rahmenwerke dienen der fachlichen Einordnung. Architektur, Datenschutz und Wirtschaftlichkeit müssen für den konkreten Einsatzfall geprüft werden.</p></div><aside class="article-aside" aria-label="Artikelhinweise"><div class="article-aside-block"><small>Autor</small><p>Patrick Vach<br>Inhaber, vachsystems</p></div><div class="article-aside-block"><small>Stand</small><p>28. August 2026</p></div><div class="article-aside-block"><small>Themen</small><p>Digitale Produkte, Automatisierung und verantwortbarer KI-Einsatz.</p></div><div class="article-aside-block"><small>Zurück</small><a href="/blog/">Alle Einblicke</a></div></aside></div>
</article>${cta('Machen wir aus der Einordnung einen konkreten nächsten Schritt.', 'Wir betrachten Aufgabe, Daten und Verantwortlichkeiten gemeinsam und entwickeln daraus einen tragfähigen Lösungsweg.', 'Projekt besprechen', '../')}</main>
${footer('../')}
</body></html>\n`;
}

for (const item of articleCatalog) {
  fs.writeFileSync(path.join(ROOT, 'blog', `${item[0]}.html`), articlePage(item));
}

function retiredArticlePage() {
  const title = 'Beitrag aktualisiert | vachsystems';
  const description = 'Dieser ältere Beitrag wurde aus dem kuratierten Archiv genommen. Aktuelle, belastbare Einordnungen finden Sie unter Einblicke.';
  return `${head({ title, description, slug: 'blog/', prefix: '../' }).replace('index, follow, max-image-preview:large', 'noindex, follow')}
</head><body>
${nav('', '../')}
<main id="main">${hero('Einblicke', 'Dieser Beitrag wurde', 'neu eingeordnet.', 'Unser öffentliches Archiv konzentriert sich auf belastbare, dauerhaft relevante Fachbeiträge. Die aktuellen Einordnungen finden Sie gesammelt unter Einblicke.', [])}<section class="section"><div class="section-inner"><a class="button" href="/blog/"><span>Zu den aktuellen Einblicken</span><span aria-hidden="true">↗</span></a></div></section></main>
${footer('../')}
</body></html>\n`;
}

for (const slug of retiredArticleSlugs) {
  fs.writeFileSync(path.join(ROOT, 'blog', `${slug}.html`), retiredArticlePage());
}

// Homepage: bestehende maßgeschneiderte Gestaltung behalten, Tracking-Banner entfernen
// und die öffentliche Informationsarchitektur im Footer vervollständigen.
const homePath = path.join(ROOT, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
home = home
  .replace(/\s*<script src="js\/consent\.js[^"]*" defer><\/script>/, '')
  .replace(/<a class="studio-skip"[\s\S]*?<\/header>/, nav('', ''))
  .replace(/css\/studio-header\.css\?v=[^"]+/, 'css/studio-header.css?v=20260828-5')
  .replace('<a href="ueber-uns">Über uns</a><a href="kontakt">Kontakt</a>', '<a href="ueber-uns">Über uns</a><a href="blog/">Einblicke</a><a href="kontakt">Kontakt</a>')
  .replace('Websites, Webanwendungen und Automatisierungen, die zu Ihrem Unternehmen passen – nicht zum nächsten Baukasten.', 'Eigenständige Websites, digitale Werkzeuge und Automatisierungen, die die Qualität Ihres Unternehmens sichtbar und nutzbar machen.')
  .replace('Wir gestalten eigenständige Websites, entwickeln digitale Werkzeuge und automatisieren Abläufe. Ohne Baukastenoptik. Ohne unnötiges Theater.', 'Wir gestalten eigenständige Websites, entwickeln digitale Werkzeuge und automatisieren Abläufe – mit einer klaren Idee und konsequenter Umsetzung.')
  .replace('Eine gute Website erklärt nicht, wie professionell Sie sind. <em>Sie lässt es spüren.</em>', 'Eine gute Website macht Ihre Qualität sichtbar. <em>Vom ersten Augenblick an.</em>')
  .replace('Damit am Ende nicht nur eine schöne Fassade entsteht, denken wir Inhalt, Bedienung und technische Umsetzung von Anfang an zusammen.', 'Inhalt, Bedienung und technische Umsetzung werden von Anfang an als ein zusammenhängendes Produkt entwickelt.')
  .replace('Ein Auftritt, den niemand mit einer Vorlage verwechselt.', 'Ein Auftritt mit einer unverwechselbaren eigenen Handschrift.')
  .replace('Software, die zu Ihrem Ablauf passt – nicht umgekehrt.', 'Software, die Ihren Ablauf verständlich und wirksam unterstützt.')
  .replace('Übersichtliche Portale, interne Werkzeuge und Webanwendungen für Aufgaben, die mit Standardsoftware unnötig kompliziert bleiben.', 'Übersichtliche Portale, interne Werkzeuge und Webanwendungen für anspruchsvolle Aufgaben und klare Prozesse.')
  .replace('Nicht möglichst viel. Sondern genau das Richtige – konsequent gemacht.', 'Genau das Richtige. Konsequent bis ins Detail.')
  .replace('Wir beginnen nicht mit Effekten oder einem fertigen System. Wir beginnen mit Ihrem Unternehmen: Was muss sofort verständlich sein? Was soll sich besser anfühlen? Und was muss technisch zuverlässig funktionieren?', 'Ihr Unternehmen gibt die Richtung vor: Was muss sofort verständlich sein? Was soll sich besser anfühlen? Und was muss technisch zuverlässig funktionieren?')
  .replace('Die entscheidenden Fragen stehen nicht im Lastenheft.', 'Die entscheidenden Fragen schärfen das Ergebnis.')
  .replace('Die Gestaltung entsteht aus Ihrer Haltung, Ihrem Markt und Ihrer Arbeit – nicht aus einem austauschbaren Stilpaket.', 'Die Gestaltung entsteht aus Ihrer Haltung, Ihrem Markt und der Qualität Ihrer Arbeit.')
  .replace('Konzeption, Gestaltung und Umsetzung werden direkt begleitet. Ohne Vertriebsschleife und ohne wechselnde Ansprechpartner. Für Spezialthemen kommen gezielt passende Partner dazu.', 'Konzeption, Gestaltung und Umsetzung werden direkt begleitet. Für Spezialthemen ergänzen gezielt ausgewählte Partner das Projektteam.')
  .replace(/© 2026 vachsystems · Berlin(?: · ohne Tracking)*/g, '© 2026 vachsystems · Berlin · ohne Tracking');
if (!home.includes('js/site-cleanup.js')) {
  home = home.replace('</body>', '    <script src="js/site-cleanup.js?v=20260828-1" defer></script>\n</body>');
}
fs.writeFileSync(homePath, home);

// Sitemap: ausschließlich die öffentlich verlinkten, kanonischen Seiten.
const coreUrls = ['', ...Object.keys(pageInfo), 'blog/'];
const allUrls = [...coreUrls, ...articleCatalog.map(item => `blog/${item[0]}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map(slug => `  <url><loc>${BASE}/${slug}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /kunds/\nDisallow: /Projektvorschau/\n\nSitemap: ${BASE}/sitemap.xml\n`);

console.log(`Neu aufgebaut: ${Object.keys(pages).length} Kernseiten, 1 Blog-Index, ${articleCatalog.length} Artikel, Sitemap und Robots.`);
