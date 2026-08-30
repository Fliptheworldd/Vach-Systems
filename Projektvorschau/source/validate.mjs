import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const errors = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && ['_next', 'source'].includes(entry.name)) return [];
    return entry.isDirectory() ? walk(path) : path.endsWith('.html') ? [path] : [];
  });
}

function localTarget(url) {
  const clean = url.split(/[?#]/)[0];
  if (!clean.startsWith('/Projektvorschau')) return null;
  const rel = clean.replace(/^\/Projektvorschau\/?/, '');
  let target = join(root, rel);
  if (clean.endsWith('/')) target = join(target, 'index.html');
  return target;
}

for (const file of walk(root)) {
  const html = readFileSync(file, 'utf8');
  const label = relative(root, file);
  const h1s = html.match(/<h1\b/g) || [];
  if (h1s.length !== 1) errors.push(`${label}: expected one h1, found ${h1s.length}`);
  if (!/<html lang="(?:de|en)">/.test(html)) errors.push(`${label}: missing valid document language`);
  if (!/<link rel="canonical" href="https:\/\/vachsystems\.de\/Projektvorschau\//.test(html)) errors.push(`${label}: invalid canonical`);
  if ((html.match(/rel="alternate" hreflang=/g) || []).length !== 2) errors.push(`${label}: missing language alternates`);
  if (!/<meta property="og:title"/.test(html) || !/<meta property="og:description"/.test(html)) errors.push(`${label}: incomplete Open Graph metadata`);
  if (/\b(?:src|href)="\/(?!Projektvorschau)/.test(html)) errors.push(`${label}: root-relative URL escapes preview base`);
  if (/href="#"/.test(html)) errors.push(`${label}: contains placeholder link`);
  if (/_next|self\.__next_f|__next/.test(html)) errors.push(`${label}: contains stale framework payload`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`${label}: duplicate IDs ${[...new Set(duplicateIds)].join(', ')}`);

  for (const match of html.matchAll(/<(?:a|link|script|img)[^>]+(?:href|src)="([^"]+)"[^>]*>/g)) {
    const url = match[1];
    const target = localTarget(url);
    if (target && !existsSync(target)) errors.push(`${label}: missing local target ${url}`);
    if (/^https?:/.test(url) && match[0].startsWith('<a') && (!/target="_blank"/.test(match[0]) || !/rel="noopener noreferrer"/.test(match[0]))) {
      errors.push(`${label}: external link lacks safe new-tab attributes: ${url}`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(match[0])) errors.push(`${label}: image without alt text`);
  }
}

const knowledge = readFileSync(join(root, 'wissen', 'index.html'), 'utf8');
if (!/data-search="[^"]*bgp/i.test(knowledge)) errors.push('wissen/index.html: BGP is absent from searchable data');
if (!existsSync(join(root, 'site.css')) || statSync(join(root, 'site.css')).size < 10000) errors.push('site.css: missing or unexpectedly small');
if (!existsSync(join(root, 'site.js')) || statSync(join(root, 'site.js')).size < 5000) errors.push('site.js: missing or unexpectedly small');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${walk(root).length} HTML pages: metadata, links, language pairs, headings and assets are consistent.`);
