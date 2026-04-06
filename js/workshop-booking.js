// Workshop Booking System
// Generiert verfügbare Termine und verarbeitet Buchungen

(function() {
    'use strict';

    // KONFIGURATION
    const CONFIG = {
        // Formspree Endpoint - MUSS VOM NUTZER ANGEPASST WERDEN
        // Registrierung: https://formspree.io/
        formspreeEndpoint: 'YOUR_FORMSPREE_ENDPOINT_HERE',
        
        // Workshop-Zeiten
        workshopDays: ['tuesday', 'thursday'], // Dienstag = 2, Donnerstag = 4
        workshopTime: '08:00 Uhr',
        
        // Verfügbare Slots (alle 2 Wochen, nächste 6 Termine)
        weeksAhead: 12, // 12 Wochen = 6 mögliche Termine (alle 2 Wochen)
        slotsToShow: 6
    };

    // DOM Elemente
    const calendarGrid = document.getElementById('calendarGrid');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const bookingForm = document.getElementById('bookingForm');
    const selectedDateInput = document.getElementById('selectedDate');
    const confirmedDateEl = document.getElementById('confirmedDate');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    let selectedSlot = null;

    // Generiere verfügbare Termine
    function generateSlots() {
        const slots = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let week = 0; week < CONFIG.weeksAhead; week += 2) {
            CONFIG.workshopDays.forEach(day => {
                const dayNum = day === 'tuesday' ? 2 : 4;
                const date = getNextWeekday(today, dayNum, week);
                
                // Nur zukünftige Termine (mindestens 3 Tage vorher)
                const minDate = new Date(today);
                minDate.setDate(minDate.getDate() + 3);
                
                if (date >= minDate && slots.length < CONFIG.slotsToShow) {
                    slots.push(date);
                }
            });
        }

        return slots.slice(0, CONFIG.slotsToShow);
    }

    // Berechne nächsten Wochentag
    function getNextWeekday(fromDate, targetDay, weeksAhead) {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + (weeksAhead * 7));
        
        const currentDay = date.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;
        
        date.setDate(date.getDate() + daysUntilTarget);
        return date;
    }

    // Formatiere Datum für Anzeige
    function formatDate(date) {
        const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        
        return {
            day: days[date.getDay()],
            date: `${date.getDate()}. ${months[date.getMonth()]}`,
            full: `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
        };
    }

    // Render Kalender
    function renderCalendar() {
        const slots = generateSlots();
        
        calendarGrid.innerHTML = slots.map((date, index) => {
            const formatted = formatDate(date);
            return `
                <div class="calendar-slot" data-slot="${index}" data-date="${date.toISOString()}">
                    <div class="slot-date">${formatted.date}</div>
                    <div class="slot-day">${formatted.day}</div>
                    <div class="slot-time">${CONFIG.workshopTime}</div>
                </div>
            `;
        }).join('');

        // Event Listener für Slots
        document.querySelectorAll('.calendar-slot').forEach(slot => {
            slot.addEventListener('click', handleSlotClick);
        });
    }

    // Slot-Auswahl
    function handleSlotClick(e) {
        const slot = e.currentTarget;
        
        // Deselect all
        document.querySelectorAll('.calendar-slot').forEach(s => s.classList.remove('selected'));
        
        // Select current
        slot.classList.add('selected');
        selectedSlot = {
            date: slot.dataset.date,
            formatted: formatDate(new Date(slot.dataset.date)).full
        };

        // Scroll zu Schritt 2
        setTimeout(() => {
            step2.classList.remove('hidden');
            step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

        // Setze verstecktes Feld
        selectedDateInput.value = selectedSlot.formatted;
    }

    // Formular-Validierung
    function validateForm() {
        const companyName = document.getElementById('companyName').value.trim();
        const industry = document.getElementById('industry').value;
        const employeeCount = document.getElementById('employeeCount').value;
        const aiUsage = document.getElementById('aiUsage').value;
        const goal = document.getElementById('goal').value.trim();
        const contactEmail = document.getElementById('contactEmail').value.trim();
        
        // Mindestens eine Checkbox
        const checkboxes = document.querySelectorAll('input[name="timeWasters"]:checked');

        if (!companyName || !industry || !employeeCount || !aiUsage || !goal || !contactEmail) {
            showError('Bitte füllen Sie alle Pflichtfelder aus.');
            return false;
        }

        if (checkboxes.length === 0) {
            showError('Bitte wählen Sie mindestens einen Zeitfresser aus.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            showError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return false;
        }

        return true;
    }

    // Fehler anzeigen
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }

    // Formular absenden
    async function handleSubmit(e) {
        e.preventDefault();

        if (!selectedSlot) {
            showError('Bitte wählen Sie zuerst einen Termin aus.');
            step1.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Disable Button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';

        // Sammle Formulardaten
        const formData = new FormData(bookingForm);
        
        // Sammle Checkboxen
        const timeWasters = Array.from(document.querySelectorAll('input[name="timeWasters"]:checked'))
            .map(cb => cb.value)
            .join(', ');
        
        formData.set('timeWasters', timeWasters);

        // Bereite E-Mail-Daten auf
        const emailData = {
            selectedDate: selectedSlot.formatted,
            companyName: formData.get('companyName'),
            industry: formData.get('industry'),
            employeeCount: formData.get('employeeCount'),
            aiUsage: formData.get('aiUsage'),
            tools: formData.get('tools') || 'Keine Angabe',
            timeWasters: timeWasters,
            goal: formData.get('goal'),
            contactEmail: formData.get('contactEmail'),
            contactPhone: formData.get('contactPhone') || 'Keine Angabe',
            timestamp: new Date().toLocaleString('de-DE')
        };

        try {
            // WICHTIG: Formspree Endpoint muss konfiguriert werden
            if (CONFIG.formspreeEndpoint === 'YOUR_FORMSPREE_ENDPOINT_HERE') {
                console.error('Formspree Endpoint nicht konfiguriert!');
                console.log('Buchungsdaten:', emailData);
                
                // Für Demo: Zeige Erfolg trotzdem
                showSuccess();
                return;
            }

            // Sende Anfrage an Formspree
            const response = await fetch(CONFIG.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: `Workshop-Buchung: ${emailData.companyName}`,
                    message: formatEmailMessage(emailData),
                    replyTo: emailData.contactEmail
                })
            });

            if (response.ok) {
                showSuccess();
            } else {
                throw new Error('Server-Fehler');
            }

        } catch (error) {
            console.error('Fehler beim Senden:', error);
            showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Workshop anfragen';
        }
    }

    // E-Mail-Nachricht formatieren
    function formatEmailMessage(data) {
        return `
NEUE WORKSHOP-BUCHUNG
=====================

TERMIN
------
${data.selectedDate}

UNTERNEHMEN
-----------
Name: ${data.companyName}
Branche: ${data.industry}
Mitarbeiter: ${data.employeeCount}

KI-NUTZUNG
----------
Status: ${data.aiUsage}
Tools: ${data.tools}

ZEITFRESSER
-----------
${data.timeWasters}

ZIEL
----
${data.goal}

KONTAKT
-------
E-Mail: ${data.contactEmail}
Telefon: ${data.contactPhone}

Anfrage gesendet am: ${data.timestamp}

---
Vach Systems Workshop Booking System
        `.trim();
    }

    // Erfolg anzeigen
    function showSuccess() {
        confirmedDateEl.textContent = selectedSlot.formatted;
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        step3.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Initialisierung
    function init() {
        renderCalendar();
        bookingForm.addEventListener('submit', handleSubmit);
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
