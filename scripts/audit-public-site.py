#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
import json
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://vachsystems.de/'
START = ROOT / 'index.html'
EXCLUDED = ('kunds/', 'Projektvorschau/')


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.images = []
        self.scripts = []
        self.styles = []
        self.ids = set()
        self.labels_for = []
        self.inputs = []
        self.h1 = 0
        self.main = 0
        self.canonical = []
        self.descriptions = []
        self.jsonld = 0
        self.skip = False
        self.title_depth = 0
        self.title = ''

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
            if attrs['href'] == '#main':
                self.skip = True
        elif tag == 'img' and attrs.get('src'):
            self.images.append(attrs['src'])
        elif tag == 'script':
            if attrs.get('src'):
                self.scripts.append(attrs['src'])
            if attrs.get('type') == 'application/ld+json':
                self.jsonld += 1
        elif tag == 'link':
            if attrs.get('rel') == 'canonical' and attrs.get('href'):
                self.canonical.append(attrs['href'])
            if attrs.get('rel') == 'stylesheet' and attrs.get('href'):
                self.styles.append(attrs['href'])
        elif tag == 'meta' and attrs.get('name') == 'description':
            self.descriptions.append(attrs.get('content', ''))
        elif tag == 'label' and attrs.get('for'):
            self.labels_for.append(attrs['for'])
        elif tag in ('input', 'textarea', 'select') and attrs.get('id'):
            self.inputs.append(attrs['id'])
        elif tag == 'h1':
            self.h1 += 1
        elif tag == 'main':
            self.main += 1
        elif tag == 'title':
            self.title_depth += 1

    def handle_endtag(self, tag):
        if tag == 'title':
            self.title_depth = max(0, self.title_depth - 1)

    def handle_data(self, data):
        if self.title_depth:
            self.title += data


def to_file(page, href):
    if href.startswith(('#', 'mailto:', 'tel:', 'javascript:')):
        return None
    parsed = urlparse(href)
    if parsed.scheme or parsed.netloc:
        return None
    base_url = BASE + page.relative_to(ROOT).as_posix()
    target = urlparse(urljoin(base_url, href)).path.lstrip('/')
    if not target:
        return ROOT / 'index.html'
    if any(target.startswith(prefix) for prefix in EXCLUDED):
        return None
    target = re.sub(r'/+$', '', target)
    candidates = [ROOT / target, ROOT / f'{target}.html', ROOT / target / 'index.html']
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return candidates[1]


queue = [START]
visited = set()
errors = []
records = []

while queue:
    page = queue.pop(0).resolve()
    if page in visited:
        continue
    visited.add(page)
    if not page.is_file():
        errors.append(f'Fehlende Seite: {page.relative_to(ROOT)}')
        continue
    parser = PageParser()
    text = page.read_text(encoding='utf-8')
    parser.feed(text)
    rel = page.relative_to(ROOT).as_posix()
    records.append({'file': rel, 'title': parser.title.strip(), 'links': len(parser.links)})

    if parser.h1 != 1:
        errors.append(f'{rel}: {parser.h1} H1-Elemente')
    if parser.main != 1:
        errors.append(f'{rel}: {parser.main} Main-Elemente')
    if not parser.skip:
        errors.append(f'{rel}: Skip-Link fehlt')
    if len(parser.canonical) != 1:
        errors.append(f'{rel}: {len(parser.canonical)} Canonical-Angaben')
    if len(parser.descriptions) != 1 or not (70 <= len(parser.descriptions[0]) <= 180):
        errors.append(f'{rel}: Meta-Description fehlt oder hat ungünstige Länge')
    if parser.jsonld < 1:
        errors.append(f'{rel}: strukturierte Daten fehlen')
    if text.count('<header class="studio-header"') != 1:
        errors.append(f'{rel}: gemeinsame Kopfzeile fehlt oder ist doppelt')
    if not parser.styles or 'studio-header.css' not in parser.styles[-1]:
        errors.append(f'{rel}: Kopfzeilen-CSS wird nicht als letzte Stildefinition geladen')
    missing_labels = set(parser.inputs) - set(parser.labels_for) - {'_subject'}
    if missing_labels:
        errors.append(f'{rel}: Formfelder ohne Label: {sorted(missing_labels)}')

    if rel.startswith('blog/') and rel != 'blog/index.html':
        if text.count('class="sources"') != 1:
            errors.append(f'{rel}: Quellenbereich fehlt oder ist doppelt')
        if text.count('class="editorial-note"') != 1:
            errors.append(f'{rel}: redaktioneller Hinweis fehlt oder ist doppelt')
        if text.count('href="/blog/"') != 1:
            errors.append(f'{rel}: unerwartete oder fehlgeleitete Blog-Verlinkung')

    for phrase in ('Beispielhafte Beispiel', 'Beispielhafte Test', 'Beispielhafte Case', 'Kill Bad Projects', 'Pragmatic KI Stack'):
        if phrase.lower() in text.lower():
            errors.append(f'{rel}: auffällige Formulierung „{phrase}“')

    for resource in parser.images + parser.scripts + parser.styles:
        target = to_file(page, resource.split('?', 1)[0])
        if target is not None and not target.exists():
            errors.append(f'{rel}: fehlende Ressource {resource}')

    for href in parser.links:
        target = to_file(page, href)
        if target is None:
            continue
        if not target.exists():
            errors.append(f'{rel}: defekter Link {href}')
        elif target.suffix == '.html' and ROOT in target.parents and not any(part in EXCLUDED for part in target.parts):
            queue.append(target)

expected = (ROOT / 'sitemap.xml').read_text(encoding='utf-8').count('<loc>')
if len(visited) != expected:
    errors.append(f'Öffentlich erreichbare HTML-Seiten: {len(visited)} statt {expected}')

print(json.dumps({'pages': len(visited), 'errors': errors, 'records': records}, ensure_ascii=False, indent=2))
sys.exit(1 if errors else 0)
