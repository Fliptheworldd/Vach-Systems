# Homepage Rewrite - Professionelles Layout

## Problem:
- Neues Layout hat zu viele inline-styles
- Sieht "billig" aus
- Altes Layout war professioneller

## Lösung:
- Nutze die GLEICHEN CSS-Klassen wie im Backup
- Behalte die STRUKTUR vom alten Design
- Ändere nur den CONTENT (conversion-optimiert)

## Layout-Struktur (vom Backup):

1. **Hero** - `hero-fullscreen` ✅
2. **Problem** - `section-visual-split` (Bild links, Text rechts)
3. **Lösung** - `section-product-showcase` (zentriert, großes Bild)
4. **Use Cases** - Grid mit Cards (proper CSS classes)
5. **Case Study** - `section-case-study` (Vorher/Nachher)
6. **Prozess** - `section-process` (Timeline)
7. **FAQ** - `section-faq`
8. **CTA** - `section-cta-bold` ✅

## Was ich ÄNDERN muss:

### Aktuell (schlecht):
```html
<div style="padding: 2.5rem; background: var(--lightgray); border-radius: 12px;">
    <h3 style="font-size: 1.5rem; font-weight: 800;">Title</h3>
</div>
```

### Sollte sein (gut):
```html
<div class="feature-card">
    <h3 class="card-title">Title</h3>
</div>
```

## Klassen die ich nutzen sollte:
- `section-visual-split` - Split mit Bild
- `section-product-showcase` - Showcase
- `section-case-study` - Case Study
- `section-process` - Timeline
- `problem-grid` - Grid für Probleme
- `impact-card` - Impact Card
- `split-title` - Titel in Split
- `split-subtitle` - Subtitle
- `section-label` - Label oben

## Plan:
1. Homepage komplett neu schreiben
2. Nutze ALTE Struktur (CSS-Klassen)
3. Nutze NEUEN Content (conversion-optimiert)
4. = Professionelles Layout mit gutem Content!

## Zeitaufwand: 10 Minuten
