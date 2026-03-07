// VACH SYSTEMS - MAIN JAVASCRIPT
// Modern, Clean, Functional

document.addEventListener('DOMContentLoaded', function() {
    
    // === HAMBURGER MENU ===
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (hamburger && mobileMenu && menuOverlay) {
        // Toggle menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close on overlay click
        menuOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on menu link click
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // === CONTACT FORM HANDLING ===
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Get form data
            const formData = {
                name: this.querySelector('[name="name"]').value,
                email: this.querySelector('[name="email"]').value,
                company: this.querySelector('[name="company"]').value,
                message: this.querySelector('[name="message"]').value
            };
            
            // Validate
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Wird vorbereitet...';
            submitBtn.style.opacity = '0.7';
            
            // Create mailto link
            const subject = `Kontaktanfrage von ${formData.name}${formData.company ? ' (' + formData.company + ')' : ''}`;
            const body = `Name: ${formData.name}\nE-Mail: ${formData.email}\nUnternehmen: ${formData.company || 'Nicht angegeben'}\n\nNachricht:\n${formData.message}`;
            
            const mailtoLink = `mailto:contact@vachsystems.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Show success message and open email client
            showNotification('✓ Ihr E-Mail-Client wird geöffnet. Bitte senden Sie die vorausgefüllte E-Mail ab.', 'success');
            
            // Open email client after short delay
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Reset form after opening email client
                setTimeout(() => {
                    this.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.opacity = '1';
                }, 1000);
            }, 500);
        });
    }
    
    // === NOTIFICATION SYSTEM ===
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1.25rem 1.75rem',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            fontSize: '1rem',
            lineHeight: '1.5',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            animation: 'slideInRight 0.4s ease',
            maxWidth: '450px',
            background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1'
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 6 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 6000);
    }
    
    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.querySelector('.nav-minimal');
    if (navbar) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                navbar.style.backdropFilter = 'blur(30px)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // === INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // === LAZY LOADING IMAGES ===
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // === FORM INPUT VALIDATION (LIVE) ===
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#EF4444';
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(120%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(120%);
                opacity: 0;
            }
        }
        
        /* Focus states for accessibility */
        a:focus, button:focus, input:focus, textarea:focus {
            outline: 2px solid #6366F1;
            outline-offset: 2px;
        }
        
        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
    
    // === ACCESSIBILITY: Skip to main content ===
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Zum Hauptinhalt springen';
    skipLink.className = 'skip-link';
    Object.assign(skipLink.style, {
        position: 'absolute',
        left: '-9999px',
        top: '0',
        zIndex: '9999',
        padding: '1rem 1.5rem',
        background: '#000',
        color: 'white',
        textDecoration: 'none',
        fontWeight: '600',
        borderRadius: '0 0 8px 0'
    });
    skipLink.addEventListener('focus', function() {
        this.style.left = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.left = '-9999px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // === CONSOLE BRANDING ===
    console.log(
        '%cVach Systems',
        'font-size: 24px; font-weight: 900; color: #000; background: linear-gradient(135deg, #000 0%, #1F2937 100%); padding: 10px 20px; border-radius: 8px; color: white;'
    );
    console.log(
        '%cIntelligente Softwaresysteme für moderne Unternehmen',
        'font-size: 14px; color: #6B7280; margin-top: 5px;'
    );
    console.log('%c→ contact@vachsystems.de', 'font-size: 12px; color: #6366F1; font-weight: 600;');
    
});
