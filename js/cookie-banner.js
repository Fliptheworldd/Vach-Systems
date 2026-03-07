// Cookie Banner for GDPR Compliance
(function() {
    // Check if user already made a choice
    if (localStorage.getItem('cookieConsent')) {
        return;
    }

    // Create banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
                <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;">
                    Diese Website nutzt Google Analytics, um die Nutzung zu analysieren. 
                    <a href="datenschutz.html" style="color: white; text-decoration: underline;">Mehr erfahren</a>
                </p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button id="cookie-accept" style="padding: 0.75rem 1.5rem; background: white; color: black; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem;">
                    Akzeptieren
                </button>
                <button id="cookie-decline" style="padding: 0.75rem 1.5rem; background: transparent; color: white; border: 2px solid white; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem;">
                    Ablehnen
                </button>
            </div>
        </div>
    `;

    // Style banner
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
        color: white;
        padding: 1.5rem 2rem;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Handle accept
    document.getElementById('cookie-accept').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        
        // Enable GA4
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        banner.remove();
    });

    // Handle decline
    document.getElementById('cookie-decline').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        banner.remove();
    });
})();
