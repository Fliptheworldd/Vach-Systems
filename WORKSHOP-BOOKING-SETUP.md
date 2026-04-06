# Workshop Booking System – Setup Guide

## Was wurde erstellt?

Ein vollständiges Buchungssystem für den KI-Workshop mit:

1. **Kalenderauswahl** (`workshop-buchen.html`)
   - Feste Termine: Dienstag & Donnerstag, 08:00 Uhr
   - Alle 2 Wochen verfügbar
   - 6 Slots gleichzeitig sichtbar

2. **Fragebogen** (7 Fragen)
   - Unternehmensname, Branche, Mitarbeiteranzahl
   - KI-Nutzung, Tools, Zeitfresser
   - Konkretes Ziel

3. **E-Mail-System**
   - Sendet Buchungen an deine E-Mail
   - Strukturierte Zusammenfassung aller Daten
   - Bestätigungsseite für Kunden

## Setup: Formspree Integration (5 Minuten)

### Schritt 1: Formspree Account erstellen

1. Gehe zu: https://formspree.io/
2. Klicke **"Sign Up"** (kostenlos)
3. Registriere dich mit deiner E-Mail (contact@vachsystems.de)

### Schritt 2: Neues Formular erstellen

1. Nach Login: Klicke **"+ New Form"**
2. Name: "Workshop Buchungen"
3. Email Address: Deine E-Mail (wo Buchungen ankommen sollen)
4. Klicke **"Create Form"**

### Schritt 3: Endpoint kopieren

1. Nach Erstellung siehst du einen **Endpoint** wie:
   ```
   https://formspree.io/f/xyzabc123
   ```
2. **Kopiere diesen Link!**

### Schritt 4: Endpoint in JavaScript eintragen

1. Öffne: `js/workshop-booking.js`
2. Finde Zeile 11:
   ```javascript
   formspreeEndpoint: 'YOUR_FORMSPREE_ENDPOINT_HERE',
   ```
3. Ersetze durch deinen Endpoint:
   ```javascript
   formspreeEndpoint: 'https://formspree.io/f/xyzabc123',
   ```
4. Speichern!

### Schritt 5: Testen

1. Öffne: `workshop-buchen.html` im Browser
2. Wähle einen Termin
3. Fülle Fragebogen aus
4. Klicke "Workshop anfragen"
5. Du solltest eine E-Mail erhalten!

## E-Mail-Benachrichtigung Beispiel

Nach einer Buchung erhältst du eine E-Mail wie:

```
Betreff: Workshop-Buchung: Müller GmbH

NEUE WORKSHOP-BUCHUNG
=====================

TERMIN
------
Dienstag, 15. April 2026, 08:00 Uhr

UNTERNEHMEN
-----------
Name: Müller GmbH
Branche: Handwerk (Elektrik, Sanitär, Heizung, etc.)
Mitarbeiter: 6-10 Mitarbeiter

KI-NUTZUNG
----------
Status: Erste Versuche – einzelne Mitarbeiter probieren
Tools: ChatGPT

ZEITFRESSER
-----------
Angebote erstellen, E-Mails beantworten

ZIEL
----
Angebote schneller erstellen und E-Mails automatisieren

KONTAKT
-------
E-Mail: info@mueller-gmbh.de
Telefon: 030 12345678

Anfrage gesendet am: 06.04.2026, 20:32
```

## Bestätigung/Ablehnung per E-Mail

**Manueller Prozess:**

1. Du erhältst Buchungsanfrage per E-Mail
2. Du antwortest dem Kunden direkt:

**Bestätigung:**
```
Betreff: Workshop-Termin bestätigt

Hallo [Name],

vielen Dank für Ihre Buchung! 

Ihr Workshop-Termin ist bestätigt:
📅 Dienstag, 15. April 2026
🕐 08:00 Uhr (4-6 Stunden)
📍 Bei Ihnen vor Ort

Wir melden uns 2-3 Tage vorher für die finale Abstimmung.

Beste Grüße,
[Dein Name]
Vach Systems
```

**Ablehnung/Alternative:**
```
Betreff: Workshop-Termin – Alternative

Hallo [Name],

leider ist der gewählte Termin bereits vergeben.

Alternativen:
📅 Donnerstag, 17. April 2026, 08:00 Uhr
📅 Dienstag, 22. April 2026, 08:00 Uhr

Welcher Termin passt besser?

Beste Grüße,
[Dein Name]
Vach Systems
```

## Features

✅ **Automatische Terminberechnung** (immer 3+ Tage Vorlauf)  
✅ **Mobile responsive** (funktioniert auf allen Geräten)  
✅ **Formular-Validierung** (Pflichtfelder + E-Mail-Check)  
✅ **Strukturierte E-Mails** (alle Daten übersichtlich)  
✅ **Bestätigungsseite** (Kunde sieht Erfolg)  
✅ **Professionelles Design** (passt zur Website)

## Kosten

**Formspree Free Tier:**
- 50 Submissions/Monat
- E-Mail-Benachrichtigungen
- Spam-Schutz
- DSGVO-konform

→ Perfekt für Workshops (erwarte ~5-10 Buchungen/Monat)

## Nächste Schritte

1. ✅ Formspree einrichten
2. ✅ Endpoint in `workshop-booking.js` eintragen
3. ✅ Testbuchung durchführen
4. ✅ Link auf Workshop-Seite setzen
5. ✅ Auf GitHub pushen

## Integration auf ki-workshop-unternehmen.html

Ändere alle "Workshop anfragen" Links zu:

```html
<a href="workshop-buchen" class="btn-cta-large">Workshop buchen →</a>
```

## Support

Falls Formspree nicht funktioniert:
- Alternative: EmailJS (ähnlicher Service)
- Alternative: Eigener Server mit PHP/Node.js
- Alternative: Google Forms (weniger professionell)

---

**Status:** ✅ Bereit für Produktion (nach Formspree-Setup)
