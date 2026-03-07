# GitHub Pages Deployment Guide

## 🚀 Setup (einmalig, 10 Minuten)

### 1. GitHub Repository erstellen

```bash
cd vach-systems
git init
git add .
git commit -m "Initial commit - Vach Systems Website"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/vachsystems.de.git
git push -u origin main
```

### 2. GitHub Pages aktivieren

1. Gehe zu: https://github.com/DEIN-USERNAME/vachsystems.de/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Klick auf **Save**

### 3. Custom Domain einrichten

1. Bei deinem Domain-Provider (z.B. Ionos, Strato, Namecheap):
   
   **A-Records** (für Apex Domain `vachsystems.de`):
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   
   **CNAME-Record** (für `www.vachsystems.de`):
   ```
   DEIN-USERNAME.github.io
   ```

2. In GitHub Settings > Pages:
   - Custom domain: `vachsystems.de`
   - ✅ Enforce HTTPS (warte 5-10 Min nach DNS-Setup)

### 4. Kontaktformular aktivieren (Formspree)

1. Gehe zu: https://formspree.io/register
2. Registriere dich mit `contact@vachsystems.de`
3. Erstelle ein neues Formular
4. Kopiere die **Form ID** (sieht aus wie: `xyzabc123`)
5. Öffne `js/script.js` und ersetze:
   ```javascript
   const FORMSPREE_ID = 'YOUR_FORM_ID_HERE'; // ← Hier einfügen!
   ```

**Fertig!** Kontaktanfragen kommen jetzt an `contact@vachsystems.de`

---

## 🔄 Updates deployen (nach Änderungen)

```bash
git add .
git commit -m "Update: Beschreibung der Änderung"
git push
```

→ GitHub Pages updated automatisch in ~1-2 Minuten

---

## ✅ Checklist vor Go-Live

- [ ] Domain DNS-Records gesetzt (A + CNAME)
- [ ] GitHub Pages aktiviert
- [ ] Custom Domain in GitHub eingetragen
- [ ] HTTPS erzwungen (nach DNS-Propagation)
- [ ] Formspree Form ID eingetragen
- [ ] Testmail über Kontaktformular gesendet
- [ ] Alle Seiten getestet (Navigation, Links)
- [ ] Mobile Ansicht geprüft
- [ ] Impressum & Datenschutz ausgefüllt

---

## 🐛 Troubleshooting

**DNS-Änderungen dauern zu lange:**
- Normale Propagation: 1-24h
- Check mit: https://dnschecker.org
- Bei Ionos: Oft schneller (1-2h)

**GitHub Pages zeigt 404:**
- Warte 5-10 Minuten nach erstem Push
- Check GitHub Actions Tab (Build-Log)
- `CNAME` Datei muss im root liegen

**Formspree funktioniert nicht:**
- Form ID korrekt eingetragen?
- Formspree Dashboard checken (Spam-Filter?)
- Browser Console öffnen (F12) → Fehler checken

**HTTPS nicht verfügbar:**
- DNS muss vollständig propagiert sein
- Kann 10-30 Min dauern
- Bei Problemen: Domain entfernen + neu hinzufügen

---

## 📊 Nach dem Launch

**Analytics (optional):**
- Google Analytics
- Plausible (DSGVO-konform)
- Umami (self-hosted)

**Monitoring:**
- Uptime Robot (kostenlos)
- StatusCake

**Performance:**
- PageSpeed Insights: https://pagespeed.web.dev
- GTmetrix: https://gtmetrix.com

---

## 🎯 Kosten

- GitHub Pages: **Kostenlos**
- Formspree Free: **50 E-Mails/Monat**
- Domain: ~12€/Jahr
- **Total: ~1€/Monat** 🚀
