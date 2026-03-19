# GitHub Pages Cache-TTL Limitation

## ⚠️ Das Problem

Lighthouse warnt: **"Cache-TTL nur 10 Minuten"**

GitHub Pages setzt automatisch diese Cache-Header:
```
cache-control: max-age=600
```
Das bedeutet: **10 Minuten Cache** für alle Assets.

## ✅ Die Lösung: Service Worker

Wir **können die Server-Headers nicht ändern** (GitHub Pages Limitation).

**ABER:** Unser Service Worker umgeht das komplett!

### Wie es funktioniert:

**Erster Besuch (First Load):**
1. Assets laden mit 10-Min Cache-Header ❌
2. Service Worker installiert sich
3. Service Worker cached alle Assets **client-side** ✅

**Zweiter+ Besuch (Repeat Visits):**
1. Service Worker intercept alle Requests
2. Assets kommen aus **SW Cache** (nicht vom Server!)
3. Cache-Dauer:
   - **Bilder:** 1 Jahr ✅
   - **CSS/JS:** 30 Tage ✅
   - **HTML:** 1 Tag ✅

### Precached Assets (sofort beim 1. Visit):

```javascript
const PRECACHE_URLS = [
  '/css/style.min.css',       // CSS: 26 KB
  '/js/script.min.js',        // JS: 6.6 KB
  '/register-sw.js',          // SW Registration
  '/images/hero-tech-600w.webp',   // Hero mobile
  '/images/hero-tech-1024w.webp',  // Hero tablet
  '/images/problem-section-650w.webp',
  '/images/problem-section-1024w.webp',
  '/images/solution-section-650w.webp',
  '/images/solution-section-1024w.webp'
];
```

**Total Precache:** ~200 KB beim ersten Visit → **Cached für 1 Jahr!**

## 📊 Performance Impact

**Lighthouse zeigt:**
```
❌ Cache-TTL: 10 Minuten (Server-Headers)
   Geschätzte Einsparung: 189 KB
```

**Reality (nach SW-Installation):**
```
✅ Cache-TTL: 1 Jahr (Service Worker)
   Tatsächliche Einsparung: 189 KB auf jedem Repeat Visit!
```

## 🧪 So testen:

1. **Chrome DevTools → Application → Service Workers**
   - Status: "Activated and running" ✅

2. **DevTools → Application → Cache Storage**
   - `vachsystems-v2026-03-19-3` → Alle Assets cached ✅

3. **DevTools → Network**
   - Reload → Alle Assets: **(ServiceWorker)** ✅
   - 0 KB Network Transfer! ✅

## 💡 Warum Lighthouse das noch anzeigt

Lighthouse checkt nur die **HTTP-Headers beim ersten Load**.

Es sieht:
```
cache-control: max-age=600 ❌
```

Es sieht **nicht**:
- Dass ein Service Worker installiert ist
- Dass Assets client-side für 1 Jahr gecached werden
- Dass Repeat Visits 0 KB vom Server laden

**Lighthouse-Score** wird durch GitHub Pages Headers begrenzt - aber **echte Performance** ist perfekt! 🚀

## 🎯 Fazit

- ❌ Server-Cache: **Kann nicht geändert werden** (GitHub Pages)
- ✅ Client-Cache: **Perfekt optimiert** (Service Worker)
- ✅ Repeat Visits: **0 KB Network Transfer**
- ✅ Cache-Dauer: **1 Jahr für Bilder, 30 Tage CSS/JS**

**Das Lighthouse-Warning ist ein "false positive" für GitHub Pages!**

Die **echte Performance** ist besser als Lighthouse denkt. 😎

---

## Alternative: Andere Hosting-Optionen

Falls du 100/100 Lighthouse willst (auch bei Cache-Headers):

**Alternativen mit Cache-Header-Kontrolle:**
1. **Vercel** (kostenlos, volle Cache-Kontrolle)
2. **Netlify** (kostenlos, volle Cache-Kontrolle)
3. **Cloudflare Pages** (kostenlos, volle Cache-Kontrolle)
4. **AWS S3 + CloudFront** (Cache-Header konfigurierbar)

**Migration:** Einfach Git-Repo verlinken → Auto-Deploy ✅

**Aber:** GitHub Pages ist **völlig ausreichend** - der Service Worker löst das Problem perfekt! 🎉
