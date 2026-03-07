# 📧 Formspree Setup-Anleitung

## Was ist Formspree?

Formspree ist ein kostenloser Service, der Kontaktformular-Submissions in E-Mails umwandelt.

**Kostenlos:** 50 Submissions/Monat  
**Keine Kreditkarte:** Nur E-Mail-Bestätigung nötig  
**Dauert:** 2 Minuten Setup

---

## 🚀 Setup in 3 Schritten

### Schritt 1: Account erstellen

1. Gehe zu: https://formspree.io/register
2. Registriere dich mit: **contact@vachsystems.de** (wichtig!)
3. Bestätige deine E-Mail

### Schritt 2: Neues Formular erstellen

1. Nach Login → Klicke **"New Form"**
2. Form Name: `Vach Systems Kontakt`
3. Email: `contact@vachsystems.de` (wo die Anfragen ankommen)
4. **Submit** klicken

### Schritt 3: Form ID kopieren & einfügen

Nach dem Erstellen siehst du:
```
https://formspree.io/f/YOUR_FORM_ID
```

**Kopiere die Form ID** (z.B. `myzgabcd`)

#### In kontakt.html ändern:

Öffne `kontakt.html` und suche:
```html
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID"
```

Ersetze `YOUR_FORM_ID` mit deiner echten ID:
```html
<form id="contactForm" action="https://formspree.io/f/myzgabcd"
```

#### Speichern & Pushen:

```bash
cd vach-systems
git add kontakt.html
git commit -m "Add Formspree form ID"
git push
```

Warte 2 Minuten bis GitHub Pages deployed → **Fertig!** 🎉

---

## 🧪 Testen

1. Gehe zu: https://vachsystems.de/kontakt.html
2. Fülle das Formular aus
3. Klicke "Nachricht senden"
4. Du solltest erhalten:
   - ✓ Grüne Notification: "Nachricht erfolgreich gesendet"
   - 📧 E-Mail an `contact@vachsystems.de`

**Erste Submission:** Formspree sendet dir eine Bestätigungs-E-Mail. Klicke auf "Confirm Form" - dann funktioniert alles!

---

## 📱 Mobile vs Desktop

**Desktop (≥640px):**
- Vollständiges Formular auf der Seite
- Direkte Submission via Formspree
- Felder: Name, E-Mail, Telefon, Unternehmen, Nachricht

**Mobile (<640px):**
- Nur Button: "📧 E-Mail senden"
- Öffnet E-Mail-App mit vorausgefüllter Nachricht
- Einfacher für Mobilnutzer

---

## ⚙️ Formspree Features (kostenlos)

✅ **Spam-Schutz:** reCAPTCHA eingebaut  
✅ **E-Mail-Benachrichtigungen:** Sofort wenn Submission eingeht  
✅ **Dashboard:** Alle Submissions einsehbar  
✅ **Export:** CSV-Download möglich  
✅ **Auto-Reply:** Optional (in Formspree Settings)  

---

## 🔧 Troubleshooting

### "403 Forbidden" Error
→ Form ID ist falsch. Checke in Formspree Dashboard die korrekte ID.

### "Submission failed"
→ Formspree-Account noch nicht bestätigt. Checke deine E-Mails!

### Keine E-Mail erhalten
→ Spam-Ordner checken!  
→ In Formspree Settings: E-Mail-Adresse korrekt?

### "Email not verified"
→ Erste Submission nach Formspree-Erstellung: Klicke auf "Confirm Form" in der E-Mail!

---

## 💰 Upgrade (optional)

Wenn du mehr als 50 Submissions/Monat bekommst:

**Gold Plan:** $10/Monat  
- 1.000 Submissions/Monat  
- Custom Thank You Page  
- File Uploads  
- Webhooks  

Für die meisten B2B-Websites reichen 50/Monat locker! 🚀

---

## 📧 Support

**Formspree Docs:** https://help.formspree.io/  
**Formspree Support:** support@formspree.io  

**Vach Systems Contact:** contact@vachsystems.de

---

**Setup dauert wirklich nur 2 Minuten! 🚀**
