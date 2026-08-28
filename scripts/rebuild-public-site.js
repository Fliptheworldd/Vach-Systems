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
    description: 'Praxisnaher KI-Workshop für Teams und Führungskräfte: konkrete Aufgaben, sichere Nutzung und klare Regeln statt Zukunftstheater.',
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
  ['roi-rechnung-ai-agents-investition-lohnt-sich', '20. August 2026', 'Wirtschaftlichkeit', 'KI-Projekte wirtschaftlich bewerten', 'Welche Kosten, Risiken und Einsparungen in einen belastbaren Business Case gehören.'],
  ['hybrid-ai-systems-lokal-cloud-zukunft', '12. August 2026', 'Architektur', 'Lokale KI und Cloud sinnvoll kombinieren', 'Eine nüchterne Entscheidungshilfe für Daten, Betrieb, Kosten und Skalierung.'],
  ['ai-pragmatismus-2026-hype-zu-produktivitaet', '5. August 2026', 'Praxis', 'Vom KI-Hype zur produktiven Anwendung', 'Warum ein klarer Prozess wertvoller ist als die nächste Werkzeug-Demo.'],
  ['500-llm-modelle-richtiges-fuer-unternehmen-waehlen', '25. Juli 2026', 'Modellauswahl', 'Das passende Sprachmodell für ein Unternehmen wählen', 'Qualität, Kosten, Datenschutz und Betrieb anhand konkreter Anforderungen sinnvoll vergleichen.'],
  ['agentic-automation-guardrails-mittelstand-sicher', '18. Juli 2026', 'Sicherheit', 'Automatisierung mit klaren Leitplanken', 'Freigaben, Rollen, Protokolle und Rückfallwege für kontrollierte Agenten.'],
  ['claude-opus-5-launch-enterprise-kunden', '10. Juli 2026', 'Modelle', 'Claude Opus 5 im Unternehmenseinsatz eingeordnet', 'Was Herstellerangaben bedeuten – und was vor einer Einführung getestet werden muss.'],
  ['ai-vendor-lock-in-vermeiden-open-source-vs-proprietary', '25. Juni 2026', 'Strategie', 'Abhängigkeiten bei KI-Systemen begrenzen', 'Wie Schnittstellen, Datenhaltung und Modellwahl einen späteren Wechsel ermöglichen.'],
  ['von-copilot-zu-agent-paradigmenwechsel-automatisierung', '18. Juni 2026', 'Automatisierung', 'Von Assistenz zu eigenständigen Abläufen', 'Wo die Grenze zwischen Copilot und Agent liegt und warum sie organisatorisch wichtig ist.'],
  ['enterprise-ai-stack-2026-richtige-architektur', '12. Juni 2026', 'Architektur', 'Eine tragfähige KI-Architektur planen', 'Die nötigen Bausteine zwischen Oberfläche, Modell, Daten, Rechten und Monitoring.'],
  ['llm-kosten-2026-kleinere-modelle-besser', '5. Juni 2026', 'Kosten', 'Warum kleinere Modelle oft die bessere Wahl sind', 'Aufgaben nach Komplexität routen, Qualität messen und laufende Kosten kontrollieren.'],
  ['ai-agents-4000-steps-komplexitaet-problem', '28. Mai 2026', 'Agenten', 'Wann agentische Abläufe zu komplex werden', 'Warum mehr Schritte nicht automatisch mehr Leistung bedeuten und wo Kontrolle verloren geht.'],
  ['deepseek-v4-moonshot-kimi-chinesische-ki-modelle', '22. Mai 2026', 'Modelle', 'DeepSeek und Kimi sachlich vergleichen', 'Leistung, Offenheit, Betrieb und Governance jenseits pauschaler Herstellervergleiche.'],
  ['gemini-3-1-pro-reasoning-wichtiger-als-geschwindigkeit', '15. Mai 2026', 'Modelle', 'Gemini 3.1 Pro: Qualität vor reiner Geschwindigkeit', 'Wie Reasoning, Latenz und Kosten je nach Aufgabe unterschiedlich gewichtet werden.'],
  ['30-prozent-netzwerk-automatisierung-ai-mittelstand', '10. Mai 2026', 'Infrastruktur', 'Netzwerk-Automatisierung im Mittelstand', 'Welche Aufgaben standardisierbar sind und wo Freigaben durch Fachleute unverzichtbar bleiben.'],
  ['claude-opus-5-vs-gpt-5-5-enterprise-vergleich', '5. Mai 2026', 'Modelle', 'Claude Opus 5 und GPT-5.5 im Vergleich', 'Ein anwendungsbezogener Vergleich von Stärken, Grenzen und Betrieb ohne pauschalen Testsieger.'],
  ['small-language-models-slm-fine-tuning-unternehmen', '28. April 2026', 'Architektur', 'Wann kleine Sprachmodelle sinnvoll sind', 'Über spezialisierte Modelle, Fine-Tuning, Betriebskosten und kontrollierbare Aufgaben.'],
  ['ai-first-vs-ai-ready-unternehmen-2026', '25. April 2026', 'Organisation', 'Erst KI-bereit, dann KI-getrieben', 'Welche Grundlagen Prozesse, Daten, Zuständigkeiten und sichere Einführung brauchen.']
];

const publicArticleSlugs = new Set(articleCatalog.map(item => item[0]));

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function json(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function head({ title, description, slug = '', prefix = '', type = 'website', schema }) {
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
  <link rel="stylesheet" href="${prefix}css/studio-system.css?v=20260828-4">
  <link rel="stylesheet" href="${prefix}css/studio-header.css?v=20260828-3">
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
${hero('Websites & Plattformen', 'Digital, aber nicht', 'austauschbar.', 'Wir bringen Positionierung, Sprache, Gestaltung und Entwicklung in ein System. Das Ergebnis sieht nach Ihrem Unternehmen aus – nicht nach der verwendeten Technik.', ['Strategie', 'UX & Design', 'Entwicklung', 'SEO & Performance'])}
<section class="section"><div class="section-inner">
  <div class="section-head reveal"><div><p class="section-label">Ein zusammenhängender Auftritt</p><h2>Eine gute Website ist keine Ansammlung schöner Seiten.</h2></div><p>Sie ist ein klar geführtes Gespräch: Wer sind Sie? Was lösen Sie? Warum sollte man Ihnen vertrauen? Und was ist der nächste sinnvolle Schritt?</p></div>
  <div class="discipline-stack">
    <article class="discipline reveal"><p class="discipline-cue">Grundlage</p><div><h3>Strategie & Struktur</h3><p>Wir ordnen Angebote, Zielgruppen und Inhalte, bevor das erste Layout entsteht.</p></div><p class="discipline-scope">Positionierung · Informationsarchitektur · Nutzerwege · Content-Plan</p></article>
    <article class="discipline reveal"><p class="discipline-cue">Charakter</p><div><h3>Gestaltung & Sprache</h3><p>Eine visuelle und sprachliche Richtung, die Wiedererkennung schafft und sich konsequent durchzieht.</p></div><p class="discipline-scope">Art Direction · UI-Design · Responsive Design · Webtexte</p></article>
    <article class="discipline reveal"><p class="discipline-cue">Substanz</p><div><h3>Entwicklung & Betrieb</h3><p>Schnelle, zugängliche und wartbare Umsetzung – passend zum Inhalt und zum Team dahinter.</p></div><p class="discipline-scope">Frontend · CMS · Formulare · Technisches SEO</p></article>
  </div>
</div></section>
<section class="section dark"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Nicht nur Fassade</p><h2>Das Design zeigt, wie das System funktioniert.</h2></div><p>Wir gestalten reale Zustände, Hierarchien und Interaktionen. So entsteht eine Oberfläche, die nicht nur im ersten Entwurf gut aussieht.</p></div>${interfaceVisual('Ihre Website. Ein System.')}</div></section>
${methodStory('So entsteht der Auftritt', 'Ein Prozess ohne Schablone.', 'Die Reihenfolge ist klar, die Lösung nicht vorgefertigt. Jede Entscheidung wird aus Ihrem Unternehmen und dem tatsächlichen Inhalt abgeleitet.', [
  ['Verstehen', 'Ausgangslage klären', 'Unternehmen, Zielgruppen, bestehende Inhalte und technische Rahmenbedingungen zusammenbringen.'],
  ['Verdichten', 'Eine Richtung festlegen', 'Kernaussage, Struktur und visuelle Haltung so schärfen, dass sie Entscheidungen tragen.'],
  ['Bauen', 'Konsequent umsetzen', 'Design und Entwicklung eng miteinander auf allen Bildschirmgrößen ausarbeiten.'],
  ['Schärfen', 'Prüfen und starten', 'Inhalte, Bedienung, Technik und Auffindbarkeit vor der Veröffentlichung kontrollieren.']
])}
${cta('Ihr Unternehmen hat mehr verdient als die nächste Vorlage.', 'Erzählen Sie kurz, wo Ihr heutiger Auftritt nicht mehr mithält. Sie bekommen eine klare Einschätzung zu Richtung, Aufwand und sinnvollen nächsten Schritten.', 'Website besprechen')}`);

pages.loesungen = page('loesungen', 'loesungen', `
${hero('Software & digitale Werkzeuge', 'Software, die sich', 'Ihrer Arbeit anpasst.', 'Portale, interne Werkzeuge und Webanwendungen für Aufgaben, die mit Standardsoftware unnötig kompliziert bleiben.', ['Webanwendungen', 'Portale', 'Dashboards', 'Schnittstellen'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Individuell, wo es zählt</p><h2>Neu gebaut wird nicht aus Prinzip. Sondern mit gutem Grund.</h2></div><p>Wir prüfen zuerst, was bestehende Werkzeuge bereits leisten. Eine individuelle Lösung ist dann sinnvoll, wenn sie einen klaren Ablauf deutlich verständlicher, schneller oder kontrollierbarer macht.</p></div>
  <div class="editorial-grid"><article class="editorial-item reveal"><small>Interne Werkzeuge</small><h3>Weniger Suchen. Mehr Überblick.</h3><p>Informationen, Aufgaben und Status in einer Oberfläche, die den täglichen Ablauf abbildet.</p></article><article class="editorial-item reveal"><small>Kundenportale</small><h3>Der richtige Zugang für jede Rolle.</h3><p>Dokumente, Vorgänge und Kommunikation sicher und nachvollziehbar bereitstellen.</p></article><article class="editorial-item reveal"><small>Schnittstellen</small><h3>Systeme sprechen miteinander.</h3><p>Daten dort verfügbar machen, wo sie gebraucht werden – ohne doppelte Pflege.</p></article></div>
</div></section>
<section class="section dark"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Lösungsbilder</p><h2>Ein konkreter Anwendungsfall statt einer Funktionsliste.</h2></div><p>Die folgenden Ansichten sind bewusst als Konzeptstudien gekennzeichnet. Sie zeigen Arbeitsweise und Gestaltung – keine erfundenen Kundenprojekte.</p></div>
<div class="tabs-shell reveal" data-tabs><div class="tab-list" role="tablist" aria-label="Beispielhafte Softwarelösungen">
  <button class="tab-button" id="solution-tab-1" role="tab" aria-selected="true" aria-controls="solution-panel-1"><strong>Operations-Portal</strong><span>Konzeptstudie</span></button>
  <button class="tab-button" id="solution-tab-2" role="tab" aria-selected="false" aria-controls="solution-panel-2"><strong>Kundenbereich</strong><span>Konzeptstudie</span></button>
  <button class="tab-button" id="solution-tab-3" role="tab" aria-selected="false" aria-controls="solution-panel-3"><strong>Wissenssystem</strong><span>Konzeptstudie</span></button>
</div><div>
  <article class="tab-panel" id="solution-panel-1" role="tabpanel" aria-labelledby="solution-tab-1"><span class="panel-kicker">Übersicht für den Alltag</span><h3>Offene Vorgänge zuerst sehen.</h3><p>Aufgaben, Status und Verantwortlichkeiten werden in einer klaren Arbeitsoberfläche gebündelt. Beispieldaten machen sichtbar, wie Priorisierung und Übergaben funktionieren.</p><div class="flow"><span>Eingang</span><i></i><span>Bearbeitung</span><i></i><span>Abschluss</span></div><div class="panel-note">Konzeptstudie · keine Kundendaten · kein veröffentlichter Auftrag</div></article>
  <article class="tab-panel" id="solution-panel-2" role="tabpanel" aria-labelledby="solution-tab-2" hidden><span class="panel-kicker">Transparenter Service</span><h3>Kunden wissen, wie es weitergeht.</h3><p>Ein geschützter Bereich zeigt Dokumente, Ansprechpartner, Termine und den aktuellen Stand – ohne Rückfragen über mehrere Kanäle.</p><div class="flow"><span>Anfrage</span><i></i><span>Status</span><i></i><span>Dokumente</span></div><div class="panel-note">Konzeptstudie · keine Kundendaten · kein veröffentlichter Auftrag</div></article>
  <article class="tab-panel" id="solution-panel-3" role="tabpanel" aria-labelledby="solution-tab-3" hidden><span class="panel-kicker">Wissen auffindbar machen</span><h3>Antworten mit nachvollziehbarer Quelle.</h3><p>Dokumente werden strukturiert, rollenbasiert durchsuchbar und mit klaren Quellen angezeigt. KI kann unterstützen, aber nicht die Kontrolle ersetzen.</p><div class="flow"><span>Frage</span><i></i><span>Quellen</span><i></i><span>Geprüfte Antwort</span></div><div class="panel-note">Konzeptstudie · keine Kundendaten · kein veröffentlichter Auftrag</div></article>
</div></div></div></section>
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Unser Maßstab</p><h2>Verständlich. Wartbar. Anschlussfähig.</h2></div><p>Eine gute individuelle Lösung bleibt auch nach dem Launch klar: für Nutzer, für Verantwortliche und für diejenigen, die sie später weiterentwickeln.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Bedienung</small><h3>Der nächste Schritt ist sichtbar.</h3><p>Klare Zustände und Handlungen statt überladener Dashboards.</p></article><article class="editorial-item reveal"><small>Technik</small><h3>Saubere Grenzen im System.</h3><p>Modulare Architektur, dokumentierte Schnittstellen und passende Rechte.</p></article><article class="editorial-item reveal"><small>Betrieb</small><h3>Fehler werden nicht versteckt.</h3><p>Nachvollziehbare Abläufe, Monitoring und kontrollierte Rückfallwege.</p></article></div></div></section>
${cta('Ein besonderer Ablauf braucht manchmal ein eigenes Werkzeug.', 'Beschreiben Sie kurz, welche Aufgabe heute unnötig aufwendig ist. Wir prüfen, ob eine individuelle Anwendung wirklich die richtige Antwort ist.', 'Software-Idee besprechen')}`);

pages['ki-automatisierung-unternehmen'] = page('ki-automatisierung-unternehmen', 'automatisierung', `
${hero('Automatisierung & KI', 'Weniger Handarbeit.', 'Mehr Verlässlichkeit.', 'Wir verbinden Systeme, strukturieren wiederkehrende Abläufe und setzen KI dort ein, wo sie einen klaren, kontrollierbaren Nutzen bringt.', ['Workflows', 'Dokumente', 'Datenflüsse', 'KI-Assistenten'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Erst der Prozess, dann das Werkzeug</p><h2>Automatisierung beginnt nicht mit KI.</h2></div><p>Sie beginnt mit einer nüchternen Frage: Welche Arbeit wiederholt sich, folgt klaren Regeln und lässt sich zuverlässig prüfen?</p></div>
  <figure class="automation-map reveal" aria-labelledby="automation-map-title"><figcaption id="automation-map-title">Beispiel eines kontrollierten Informationsflusses</figcaption>
    <div class="automation-entry"><span>E-Mail</span><span>Formular</span><span>Dokument</span></div>
    <div class="automation-core"><p>Ordnen</p><strong>Information wird dort nutzbar, wo sie gebraucht wird.</strong><div><span>Regeln prüfen</span><span>Kontext ergänzen</span><span>Unsicherheit markieren</span></div></div>
    <div class="automation-exit"><span>CRM / ERP</span><span>Freigabe</span><span>Benachrichtigung</span></div>
    <p class="automation-human">Kritische Entscheidungen bleiben beim Menschen.</p>
  </figure>
</div></section>
${methodStory('Kontrolle ist Teil des Systems', 'Automatisch heißt nicht unkontrolliert.', 'Jeder Ablauf braucht eindeutige Eingaben, Regeln, Fehlerwege und Verantwortung. Wir bauen diese Kontrolle nicht später an, sondern von Anfang an mit ein.', [
  ['Eingang', 'Herkunft bleibt sichtbar', 'Quelle, Format und Berechtigung werden erfasst, bevor Informationen weiterverarbeitet werden.'],
  ['Prüfung', 'Regeln greifen vor der Aktion', 'Pflichtfelder, Plausibilität und mögliche Risiken werden transparent kontrolliert.'],
  ['Verarbeitung', 'Systeme übernehmen Routine', 'Daten werden übertragen, ergänzt oder für eine Entscheidung vorbereitet.'],
  ['Freigabe', 'Menschen behalten Verantwortung', 'Kritische Fälle landen mit Kontext und Verlauf bei der richtigen Person.']
])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Sicher einführen</p><h2>Klein starten. Messen. Kontrolliert erweitern.</h2></div><p>Ein begrenzter Pilot zeigt schneller als ein großes Konzeptpapier, ob Qualität, Zeitgewinn und Akzeptanz tatsächlich stimmen.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Pilot</small><h3>Eine Aufgabe, ein klares Ziel.</h3><p>Volumen, Aufwand und Qualitätsmaß werden vorab definiert.</p></article><article class="editorial-item reveal"><small>Kontrolle</small><h3>Ausnahmen sind Teil des Designs.</h3><p>Unsicherheit wird sichtbar und führt in einen sicheren Prüfweg.</p></article><article class="editorial-item reveal"><small>Betrieb</small><h3>Ergebnisse bleiben nachvollziehbar.</h3><p>Versionen, Kosten und Entscheidungen lassen sich später prüfen.</p></article></div></div></section>
${cta('Welche wiederkehrende Aufgabe kostet heute unnötig Zeit?', 'Wir schauen gemeinsam auf den echten Ablauf – ohne vorab eine bestimmte Technologie zu verkaufen.', 'Ablauf besprechen')}`);

pages['ki-workshop-unternehmen'] = page('ki-workshop-unternehmen', '', `
${hero('KI-Workshop für Unternehmen', 'KI verstehen.', 'Im Alltag sicher nutzen.', 'Ein praxisnaher Workshop für Teams und Führungskräfte. Mit Aufgaben aus Ihrem Unternehmen, klaren Grenzen und umsetzbaren Regeln.', ['Individuell vorbereitet', 'Vor Ort oder remote', 'Für Teams', 'Ohne Vorkenntnisse'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Kein Standardseminar</p><h2>Ihr Team braucht keine achtzig Folien über die Zukunft.</h2></div><p>Es braucht ein gemeinsames Verständnis dafür, wo KI hilft, welche Daten sensibel sind, wie Ergebnisse geprüft werden und welche Aufgaben überhaupt geeignet sind.</p></div><div class="tabs-shell reveal" data-tabs><div class="tab-list" role="tablist" aria-label="Workshop-Inhalte"><button class="tab-button" id="workshop-tab-1" role="tab" aria-selected="true" aria-controls="workshop-panel-1"><strong>Verstehen</strong><span>Möglichkeiten & Grenzen</span></button><button class="tab-button" id="workshop-tab-2" role="tab" aria-selected="false" aria-controls="workshop-panel-2"><strong>Anwenden</strong><span>Aufgaben aus dem Alltag</span></button><button class="tab-button" id="workshop-tab-3" role="tab" aria-selected="false" aria-controls="workshop-panel-3"><strong>Regeln</strong><span>Daten, Qualität & Freigaben</span></button></div><div><article class="tab-panel" id="workshop-panel-1" role="tabpanel" aria-labelledby="workshop-tab-1"><span class="panel-kicker">Klarheit vor Begeisterung</span><h3>Was kann KI – und wo liegt sie überzeugend falsch?</h3><p>Wir erklären verständlich, wie Sprachmodelle arbeiten, warum Ergebnisse schwanken und wann Quellen oder Fachwissen unverzichtbar sind.</p><div class="panel-note">Ergebnis: ein gemeinsames Vokabular und realistische Erwartungen.</div></article><article class="tab-panel" id="workshop-panel-2" role="tabpanel" aria-labelledby="workshop-tab-2" hidden><span class="panel-kicker">Direkt ausprobieren</span><h3>Echte Aufgaben statt Demo-Prompts.</h3><p>Texte, Dokumente, Recherche oder Auswertungen: Die Übungen orientieren sich an Tätigkeiten, die in Ihrem Team wirklich vorkommen.</p><div class="panel-note">Ergebnis: wiederverwendbare Arbeitsweisen für sinnvolle Aufgaben.</div></article><article class="tab-panel" id="workshop-panel-3" role="tabpanel" aria-labelledby="workshop-tab-3" hidden><span class="panel-kicker">Sicherer Rahmen</span><h3>Wer darf was – mit welchen Daten?</h3><p>Gemeinsam definieren wir einfache Regeln für sensible Informationen, Quellenprüfung, Freigaben und dokumentierte Verantwortung.</p><div class="panel-note">Ergebnis: konkrete Leitplanken statt allgemeiner Vorsichtshinweise.</div></article></div></div></div></section>
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
${hero('Arbeiten & Konzeptstudien', 'Einblicke statt', 'erfundener Erfolge.', 'Wir zeigen, wie wir digitale Produkte denken und gestalten. Eigene Arbeiten und freie Konzeptstudien sind klar voneinander getrennt. Keine anonymen Erfolgsgeschichten. Keine Fantasiezahlen.', ['Eigene Plattform', 'Konzeptstudien', 'Beispieldaten', 'Transparente Einordnung'])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Ausgewählte Einblicke</p><h2>Die Qualität liegt im Zusammenspiel.</h2></div><p>Jede Arbeit verbindet Aussage, visuelle Richtung und technische Logik. Die Studien zeigen unseren Ansatz, nicht vorgetäuschte Kundenresultate.</p></div><div class="work-grid">
  <article class="work-case reveal"><div class="work-meta"><span>Eigene Plattform · 2026</span><span>Live</span></div><h3>vachsystems.de</h3><p>Positionierung, Art Direction, Texte und Frontend als zusammenhängender Neuaufbau. Das Ziel: eine Seite, die den eigenen Anspruch sichtbar einlöst.</p>${workVisual('vachsystems.de', 'Ihr Unternehmen ist stark. Der Auftritt sollte es auch sein.')}</article>
  <article class="work-case reveal"><div class="work-meta"><span>Konzeptstudie · Website</span><span>Freie Arbeit</span></div><h3>Komplexe Inhalte, klare Orientierung.</h3><p>Eine redaktionelle Plattform mit Events, Wissen und Community wird über Struktur, Hierarchie und wiederkehrende Muster zugänglich.</p>${workVisual('community-platform.de', 'Eine Plattform, die sich sofort versteht.')}</article>
  <article class="work-case reveal"><div class="work-meta"><span>Konzeptstudie · Software</span><span>Beispieldaten</span></div><h3>Ein Operations-Cockpit für offene Vorgänge.</h3><p>Status, Verantwortung und nächster Schritt stehen im Vordergrund. Dekorative Kennzahlen weichen Informationen, die eine Handlung auslösen.</p>${workVisual('data', '')}</article>
  <article class="work-case reveal"><div class="work-meta"><span>Konzeptstudie · Automatisierung</span><span>Beispielprozess</span></div><h3>Ein Ablauf mit sichtbarer Kontrolle.</h3><p>Eingänge werden geprüft und vorbereitet. Unsichere oder kritische Fälle gehen nachvollziehbar an die zuständige Person.</p>${workVisual('flow', '')}</article>
</div></div></section>
<section class="section dark"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Was wir bewusst nicht zeigen</p><h2>Keine Zahlen ohne Herkunft.</h2></div><p>Vertrauliche Projekte werden nicht mit ausgedachten Branchenetiketten und Erfolgswerten ersetzt. Wenn Referenzen oder Ergebnisse veröffentlicht werden, dann nur mit belastbarer Grundlage und klarer Freigabe.</p></div><div class="editorial-grid" style="border-color:var(--line-light)"><article class="editorial-item reveal" style="border-color:var(--line-light)"><small>Transparenz</small><h3>Studie bleibt Studie.</h3><p>Freie Arbeiten und Beispieldaten werden direkt am Objekt gekennzeichnet.</p></article><article class="editorial-item reveal" style="border-color:var(--line-light)"><small>Vertraulichkeit</small><h3>Internes bleibt intern.</h3><p>Geschützte Kundenbereiche und nicht freigegebene Inhalte bleiben außerhalb dieser Seite.</p></article><article class="editorial-item reveal" style="border-color:var(--line-light)"><small>Belegbarkeit</small><h3>Behauptungen brauchen Belege.</h3><p>Ergebnisse werden nicht zur Dekoration erfunden oder aus allgemeinen Annahmen abgeleitet.</p></article></div></div></section>
${cta('Ihr Projekt soll hier nicht wie jedes andere aussehen.', 'Wir entwickeln die Richtung aus Ihrem Unternehmen, Ihrer Zielgruppe und dem Problem, das gelöst werden soll.', 'Eigenes Projekt besprechen')}`);

pages['ueber-uns'] = page('ueber-uns', 'ueber-uns', `
${hero('Über vachsystems', 'Direkte Zusammenarbeit.', 'Klare Verantwortung.', 'vachsystems ist ein unabhängiges Digitalstudio aus Berlin. Konzeption, Gestaltung und technische Umsetzung bleiben eng miteinander verbunden.', ['Inhabergeführt', 'Berlin', 'Direkter Kontakt', 'Gezieltes Partnernetzwerk'])}
<section class="section founder-section"><div class="section-inner"><div class="founder-profile"><figure class="founder-portrait reveal"><img src="assets/patrick-vach.webp" alt="Patrick Vach, Inhaber von vachsystems" width="399" height="400" loading="lazy"></figure><div class="founder-copy reveal"><p class="section-label">Inhaber & Projektleitung</p><h2>Patrick Vach</h2><p>Sie sprechen mit der Person, die Ihr Projekt versteht, strukturiert und begleitet. Dadurch bleiben Entscheidungen schnell, Zusammenhänge erhalten und Verantwortung klar.</p><p class="founder-scope">Konzeption · Art Direction · Entwicklung · Projektleitung</p></div><p class="founder-statement reveal">Ein gutes digitales Produkt fühlt sich nicht nach einzelnen Gewerken an. Es wirkt wie eine klare Entscheidung.</p></div></div></section>
${methodStory('Arbeitsweise', 'Klein genug für kurze Wege. Sorgfältig genug für große Ansprüche.', 'Für Spezialthemen kommen gezielt passende Partner hinzu. Die inhaltliche und gestalterische Linie bleibt dennoch in einer Hand.', [
  ['Zuhören', 'Das echte Problem verstehen', 'Keine fertige Lösung verkaufen, bevor Ziel und Kontext klar sind.'],
  ['Entscheiden', 'Eine klare Richtung setzen', 'Alternativen offen bewerten und Entscheidungen nachvollziehbar machen.'],
  ['Umsetzen', 'Details konsequent lösen', 'Inhalt, Gestaltung und Technik nicht in getrennten Silos behandeln.'],
  ['Verantwortung', 'Auch Nein sagen', 'Wenn eine kleinere Lösung reicht oder wir nicht passen, sagen wir das offen.']
])}
<section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Drei Disziplinen</p><h2>Web, Software und Automatisierung gehören zusammen.</h2></div><p>Ein professioneller Auftritt endet nicht an der Oberfläche. Gute digitale Arbeit verbindet verständliche Kommunikation mit funktionierenden Werkzeugen und sauberen Abläufen.</p></div><div class="editorial-grid"><article class="editorial-item reveal"><small>Web</small><h3>Haltung sichtbar machen.</h3><p>Unternehmen klar positionieren und eigenständig präsentieren.</p></article><article class="editorial-item reveal"><small>Software</small><h3>Arbeit verständlich abbilden.</h3><p>Digitale Werkzeuge an echte Aufgaben und Rollen anpassen.</p></article><article class="editorial-item reveal"><small>Automatisierung</small><h3>Wiederholung reduzieren.</h3><p>Systeme verbinden und kontrollierbare Abläufe schaffen.</p></article></div></div></section>
${cta('Sie suchen keinen großen Apparat, sondern einen starken direkten Partner?', 'Schildern Sie kurz, was Sie aufbauen oder verändern möchten. Sie bekommen eine ehrliche erste Einschätzung.', 'Kennenlernen')}`);

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
${methodStory('Danach', 'Kein Verkaufstheater. Ein klares Gespräch.', 'Wir klären offene Fragen, ordnen das Vorhaben ein und sagen Ihnen, ob und wie eine Zusammenarbeit sinnvoll ist.', [
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
  return `${head({ title, description, slug: 'blog/', prefix: '../', schema })}
  <link rel="stylesheet" href="../css/editorial-studio.css?v=20260828-1">
</head><body>
${nav('', '../')}
<main id="main"><header class="journal-hero"><div class="journal-hero-inner"><p class="page-kicker">Einblicke</p><h1>Technik einordnen.<br><span>Besser entscheiden.</span></h1><div class="journal-hero-row"><p>Nüchterne Beiträge zu digitalen Produkten, Automatisierung und KI. Mit Autor, Prüfdatum und Quellen – und mit dem Hinweis, wenn Angaben zeitabhängig sind.</p><small>Redaktion: Patrick Vach<br>Technische Angaben werden vor einer Projektentscheidung neu geprüft.</small></div></div></header><section class="section"><div class="section-inner"><div class="section-head reveal"><div><p class="section-label">Alle Beiträge</p><h2>Praxis vor Hype.</h2></div><p>Modelle und Preise ändern sich schnell. Dauerhaft wichtig bleiben ein klares Problem, saubere Daten, kontrollierte Abläufe und messbare Qualität.</p></div><div class="journal-list">${entries}</div></div></section>${cta('Lieber ein konkretes Problem lösen als zehn Trends verfolgen?', 'Schildern Sie kurz, welche Aufgabe oder welches digitale Produkt Sie verbessern möchten.', 'Projekt besprechen', '../')}</main>
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
  'claude-opus-5-launch-enterprise-kunden': ['anthropic', 'nist'],
  'ai-vendor-lock-in-vermeiden-open-source-vs-proprietary': ['nist', 'bsi'],
  'von-copilot-zu-agent-paradigmenwechsel-automatisierung': ['microsoft', 'nist'],
  'enterprise-ai-stack-2026-richtige-architektur': ['nist', 'bsi'],
  'llm-kosten-2026-kleinere-modelle-besser': ['openai', 'anthropic', 'gemini'],
  'ai-agents-4000-steps-komplexitaet-problem': ['nist', 'bsi'],
  'deepseek-v4-moonshot-kimi-chinesische-ki-modelle': ['deepseek', 'kimi', 'nist'],
  'gemini-3-1-pro-reasoning-wichtiger-als-geschwindigkeit': ['gemini', 'nist'],
  '30-prozent-netzwerk-automatisierung-ai-mittelstand': ['bsi', 'nist'],
  'claude-opus-5-vs-gpt-5-5-enterprise-vergleich': ['anthropic', 'openai', 'nist'],
  'small-language-models-slm-fine-tuning-unternehmen': ['nist', 'bsi'],
  'ai-first-vs-ai-ready-unternehmen-2026': ['eu', 'nist', 'bsi']
};

function textOnly(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeContent(html, slug) {
  let result = html
    .replace(/<img\b[\s\S]*?>/gi, '')
    .replace(/<div class="blog-cta"[\s\S]*?<\/div>/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/❌|✅|🚀|💡|⚠️|🎯|→/g, '')
    .replace(/\bReal-World\b/gi, 'Beispielhafte')
    .replace(/\bUse Case\b/gi, 'Anwendungsfall')
    .replace(/\bUse Cases\b/gi, 'Anwendungsfälle')
    .replace(/\bAI Agents\b/g, 'KI-Agenten')
    .replace(/\bAI Agent\b/g, 'KI-Agent')
    .replace(/\bAI\b/g, 'KI')
    .replace(/Mit echten Zahlen, Beispielen, Break-Even-Analysen\.?/gi, 'Mit nachvollziehbaren Rechenbeispielen und einer Break-even-Betrachtung.')
    .replace(/<a href="([^"]+)"([^>]*)>/gi, (match, href, attrs) => {
      if (/^(https?:|mailto:|tel:|#|\.\.\/)/.test(href)) return match;
      const clean = href.replace(/\.html$/, '').replace(/^\.\//, '');
      if (publicArticleSlugs.has(clean)) return `<a href="${clean}"${attrs}>`;
      return '<a href="/blog/">';
    });

  if (slug === 'roi-rechnung-ai-agents-investition-lohnt-sich') {
    result = `<div class="highlight-box"><p><strong>Transparenz:</strong> Sämtliche Beträge und Szenarien in diesem Beitrag sind Rechenbeispiele. Sie sind keine veröffentlichten Kundenergebnisse und müssen mit echten Prozessdaten validiert werden.</p></div>${result}`
      .replace(/Mit echten Zahlen/gi, 'Mit nachvollziehbaren Rechenbeispielen')
      .replace(/Typischer Mittelständler:/gi, 'Vereinfachtes Rechenbeispiel:')
      .replace(/Selbst komplexe Setups ROI >100% im ersten Jahr!/gi, 'Ob sich ein komplexes Vorhaben rechnet, hängt vollständig von den realen Prozessdaten und Risiken ab.')
      .replace(/Schwer messbar, aber real!/gi, 'Schwer messbare Effekte sollten getrennt und vorsichtig bewertet werden.')
      .replace(/Break-Even meist nach 4-6 Monaten!/gi, 'In dieser vereinfachten Tabelle liegt der rechnerische Break-even bei fünf Monaten.')
      .replace(/3-5 KI-Agenten → 100-300K€ Ersparnis\/Jahr bei 20-50K€ Investment\./gi, 'Mehrere Automatisierungen sollten einzeln bewertet und erst nach einem messbaren Pilot schrittweise erweitert werden.');
  }

  return result;
}

function articlePage(item) {
  const [slug, displayDate, category, cleanTitle, catalogExcerpt] = item;
  const file = path.join(ROOT, 'blog', `${slug}.html`);
  const old = fs.readFileSync(file, 'utf8');
  const oldDescription = (old.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1];
  const leadMatch = old.match(/<p class="article-(?:lead|excerpt)">([\s\S]*?)<\/p>/i);
  const contentMatch = old.match(/<(section|div) class="article-content"[^>]*>([\s\S]*?)<\/\1>/i);
  if (!contentMatch) throw new Error(`Kein Artikelinhalt gefunden: ${slug}`);
  const lead = catalogExcerpt || (leadMatch ? textOnly(leadMatch[1]) : oldDescription);
  const content = sanitizeContent(contentMatch[2], slug);
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
  return `${head({ title: `${cleanTitle} | vachsystems`, description, slug: `blog/${slug}`, prefix: '../', type: 'article', schema })}
  <link rel="stylesheet" href="../css/editorial-studio.css?v=20260828-1">
</head><body class="article-shell">
${nav('', '../')}
<main id="main"><article>
  <header class="article-masthead"><div class="article-masthead-inner"><div class="article-meta"><span>${category}</span><time datetime="${isoDate}">${displayDate}</time><span>Zuletzt geprüft: 28. August 2026</span></div><h1>${cleanTitle}</h1><p class="article-lead">${esc(lead)}</p><div class="article-byline"><span>Text & Einordnung: <strong>Patrick Vach</strong></span><span>Technische Angaben sind zeitabhängig und werden vor Projektentscheidungen neu geprüft.</span></div></div></header>
  <div class="article-layout"><div class="article-content">${content}${sourcesHtml}<p class="editorial-note">Redaktioneller Hinweis: Herstellerangaben und Modellstände werden als solche eingeordnet. Beispiele ersetzen keine Prüfung der eigenen Daten, Prozesse, Verträge und rechtlichen Anforderungen.</p></div><aside class="article-aside" aria-label="Artikelhinweise"><div class="article-aside-block"><small>Autor</small><p>Patrick Vach<br>Inhaber, vachsystems</p></div><div class="article-aside-block"><small>Stand</small><p>Geprüft am 28.08.2026</p></div><div class="article-aside-block"><small>Einordnung</small><p>Keine Rechts- oder Anlageberatung. Technische Entscheidungen immer am konkreten Einsatzfall prüfen.</p></div><div class="article-aside-block"><small>Zurück</small><a href="/blog/">Alle Einblicke</a></div></aside></div>
</article>${cta('Passt das Thema zu einer konkreten Aufgabe in Ihrem Unternehmen?', 'Wir ordnen den Anwendungsfall gemeinsam ein und sagen offen, ob eine technische Umsetzung sinnvoll ist.', 'Projekt besprechen', '../')}</main>
${footer('../')}
</body></html>\n`;
}

for (const item of articleCatalog) {
  fs.writeFileSync(path.join(ROOT, 'blog', `${item[0]}.html`), articlePage(item));
}

// Homepage: bestehende maßgeschneiderte Gestaltung behalten, Tracking-Banner entfernen
// und die öffentliche Informationsarchitektur im Footer vervollständigen.
const homePath = path.join(ROOT, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
home = home
  .replace(/\s*<script src="js\/consent\.js[^"]*" defer><\/script>/, '')
  .replace('<a href="ueber-uns">Über uns</a><a href="kontakt">Kontakt</a>', '<a href="ueber-uns">Über uns</a><a href="blog/">Einblicke</a><a href="kontakt">Kontakt</a>')
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
