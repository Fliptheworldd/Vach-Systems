# Workshop Booking System – Calendly Integration

## Was wurde erstellt?

Ein professionelles Buchungssystem mit **Calendly** – besser als custom Lösung!

### Vorteile von Calendly

✅ **Automatische Bestätigungs-E-Mails** (an Kunde & dich)  
✅ **Kalender-Integration** (Google Calendar, Outlook, iCal)  
✅ **Automatische Reminder** (24h vorher, 1h vorher)  
✅ **Reschedule & Cancel** (Kunde kann selbst umbuchen)  
✅ **Zeitzonenhandling** (automatisch)  
✅ **Professionell & bewährt** (Millionen Nutzer)  
✅ **Fragebogen integriert** (Custom Questions)  
✅ **DSGVO-konform**  

## Setup: Calendly (bereits fertig!)

Dein Calendly-Link ist bereits eingebunden:
```
https://calendly.com/vachsystems/ki-workshop
```

### Was du in Calendly konfigurieren kannst:

1. **Verfügbarkeit:**
   - Dienstag & Donnerstag, 08:00 Uhr
   - Dauer: 4-6 Stunden
   - Buffer: 1-2 Tage Vorlauf

2. **Custom Questions** (Fragebogen):
   ```
   - Unternehmensname
   - Branche
   - Mitarbeiteranzahl
   - Aktuelle KI-Nutzung
   - Genutzte Tools
   - Größte Zeitfresser
   - Konkretes Ziel
   ```

3. **E-Mail-Benachrichtigungen:**
   - Bestätigung an Kunde
   - Benachrichtigung an dich
   - Reminder (24h + 1h vorher)

4. **Kalender-Sync:**
   - Google Calendar verbinden
   - Automatische Blockierung
   - Keine Doppelbuchungen

## Calendly Einstellungen optimieren

### 1. Event Type bearbeiten

Gehe zu: https://calendly.com/event_types

**Was einstellen:**
- **Name:** "KI Workshop für Unternehmen"
- **Location:** "Bei Ihnen vor Ort" oder "Wird nach Buchung geklärt"
- **Duration:** 4-6 Stunden (wähle 4h, erkläre im Text)
- **Minimum notice:** 3 Tage
- **Buffer:** 1 Tag zwischen Terminen

### 2. Custom Questions hinzufügen

**Questions & Answers → Add Custom Questions:**

1. **Unternehmensname** (Text, Required)
2. **Branche** (Multiple Choice, Required)
   - Handwerk
   - Dienstleistung
   - Handel
   - Produktion
   - IT
   - Gesundheit
   - Sonstiges

3. **Mitarbeiteranzahl** (Multiple Choice, Required)
   - 1-5
   - 6-10
   - 11-25
   - 26-50
   - 51+

4. **Aktuelle KI-Nutzung** (Multiple Choice, Required)
   - Keine – wir nutzen noch keine KI
   - Erste Versuche – einzelne Mitarbeiter probieren
   - Regelmäßig – aber nicht effizient

5. **Genutzte Tools** (Text, Optional)
   - Placeholder: "z.B. Microsoft Copilot, ChatGPT, Claude..."

6. **Größte Zeitfresser** (Multiple Choice, Required, Allow Multiple)
   - Angebote erstellen
   - E-Mails beantworten
   - Informationen suchen
   - Rechnungen / Buchhaltung
   - Kundenservice / Support
   - Projektplanung
   - Sonstiges

7. **Konkretes Ziel** (Text Area, Required)
   - Placeholder: "z.B. Angebote schneller erstellen, E-Mails automatisieren..."

8. **Telefon** (Text, Optional)

### 3. Notifications anpassen

**Notifications & Workflows:**

**E-Mail an Kunde (Confirmation):**
```
Betreff: Workshop-Termin bestätigt

Hallo {{invitee_name}},

vielen Dank für Ihre Buchung!

Ihr Workshop-Termin:
📅 {{event_date}}
🕐 {{event_time}} (4-6 Stunden)
📍 Bei Ihnen vor Ort

In den nächsten Tagen senden wir Ihnen:
- Vorbereitungs-Fragebogen (5 Minuten)
- Anfahrtsplanung
- Kontaktdaten für Rückfragen

Beste Grüße,
Patrick Vach
Vach Systems
```

**E-Mail an dich (Event Scheduled):**
```
Neue Workshop-Buchung!

Unternehmen: {{question_1_answer}}
Branche: {{question_2_answer}}
Mitarbeiter: {{question_3_answer}}

KI-Nutzung: {{question_4_answer}}
Tools: {{question_5_answer}}
Zeitfresser: {{question_6_answer}}
Ziel: {{question_7_answer}}

Kontakt:
E-Mail: {{invitee_email}}
Telefon: {{question_8_answer}}
```

### 4. Reminder aktivieren

**Reminders → Enable:**
- 24 Stunden vorher
- 1 Stunde vorher

## Integration auf Website

✅ **Bereits fertig!** Die Seite `workshop-buchen.html` bindet Calendly ein.

**Verlinkt auf:**
- Homepage → Hero CTA
- Workshop-Seite → Alle CTAs
- Navigation → "Termin buchen"

## Kosten

**Calendly Free Tier:**
- 1 Event Type
- Unlimited Bookings
- E-Mail-Benachrichtigungen
- Kalender-Integration
- Custom Questions (3 Fragen)

**Calendly Essentials (8€/Monat):**
- Unlimited Event Types
- Unlimited Custom Questions
- Workflows (automatisierte Follow-ups)
- Custom Branding (Logo)
- Zapier Integration

→ **Free reicht für Workshops!** (3 Custom Questions + Standard-Felder)

## E-Mail nach Buchung (Beispiel)

**Du erhältst:**
```
Neue Buchung: KI Workshop

Termin: Dienstag, 15. April 2026, 08:00 Uhr

Name: Max Müller
E-Mail: max@mueller-gmbh.de
Telefon: 030 12345678

Unternehmen: Müller GmbH
Branche: Handwerk
Mitarbeiter: 6-10
KI-Nutzung: Erste Versuche
Tools: ChatGPT
Zeitfresser: Angebote, E-Mails
Ziel: Angebote schneller erstellen
```

**Kunde erhält:**
```
Ihr Workshop-Termin ist bestätigt!

Dienstag, 15. April 2026
08:00 Uhr (4-6 Stunden)

+ Kalender-Einladung (ICS-Datei)
+ Google Calendar / Outlook Link
+ Reminder (24h + 1h vorher)
```

## Nächste Schritte

1. ✅ Calendly-Link eingebunden (bereits live)
2. ⏳ Calendly Custom Questions hinzufügen (5 Minuten)
3. ⏳ E-Mail-Templates anpassen
4. ⏳ Kalender verbinden (Google/Outlook)
5. ⏳ Testbuchung durchführen
6. ✅ **Fertig!**

## Support

Falls du Hilfe bei Calendly-Setup brauchst:
- Calendly Help Center: https://help.calendly.com/
- Video-Tutorials: https://www.youtube.com/calendly

---

**Status:** ✅ Bereit für Produktion (Calendly optimieren empfohlen)  
**Vorteil vs. Custom:** Keine Wartung, professioneller, automatisiert
