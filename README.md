# Vach Systems Website

Professionelle B2B-Website für KI/Software-Dienstleistungen.

## 🚀 Features

- ✅ **Premium Design** – Apple/Stripe-inspired minimalism
- ✅ **10 Complete Pages** – Home, Services, Solutions, Tech, Projects, About, Philosophy, Contact, Imprint, Privacy
- ✅ **Fully Responsive** – Mobile-optimized with touch targets
- ✅ **GitHub Pages Ready** – Deploy in 5 minutes
- ✅ **SEO Optimized** – Meta tags, semantic HTML
- ✅ **Performance First** – Pure HTML/CSS/JS, no frameworks
- ✅ **DSGVO-Compliant** – Privacy policy, legal pages

## 📦 Tech Stack

- **HTML5** – Semantic markup
- **CSS3** – Custom properties, flexbox, grid
- **Vanilla JS** – Contact form handling
- **Inter Font** – Google Fonts
- **Unsplash** – High-quality stock photography
- **SVG Favicon** – Scalable logo

## 📁 Project Structure

```
vach-systems/
├── index.html              # Homepage
├── leistungen.html         # Services
├── loesungen.html          # Solutions
├── technologie.html        # Technology
├── projekte.html           # Projects
├── ueber-uns.html          # About Us
├── philosophie.html        # Philosophy
├── kontakt.html            # Contact
├── impressum.html          # Legal Imprint
├── datenschutz.html        # Privacy Policy
├── favicon.svg             # Logo favicon
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── script.js           # Contact form logic
├── assets/
│   └── patrick-vach.jpg    # Team photo
└── .gitignore              # Git ignore rules
```

## 🌐 Quick Deploy to GitHub Pages

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Vach Systems website"
   git remote add origin https://github.com/YOUR-USERNAME/vachsystems.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch → `main` → `/root`
   - Save

3. **Access Your Site**
   - `https://YOUR-USERNAME.github.io/vachsystems/`

4. **Custom Domain (Optional)**
   - Add `CNAME` file with your domain
   - Configure DNS in domain registrar

## 🔧 Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/vachsystems.git
   cd vachsystems
   ```

2. **Start Local Server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # OR Node.js
   npx http-server
   ```

3. **Open Browser**
   - Navigate to `http://localhost:8000`

## 📱 Mobile Optimization

- ✅ Viewport meta tags
- ✅ Touch-optimized buttons (48px min height)
- ✅ Responsive typography (rem units)
- ✅ Mobile-first media queries
- ✅ Optimized images for mobile
- ✅ No horizontal scroll

## ✉️ Contact Form Setup

The contact form is **mock-only** by default. To make it functional:

### Option 1: Formspree (Recommended)
1. Sign up at [formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update `js/script.js`:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR-FORM-ID';
   ```

### Option 2: Custom Backend
- Implement your own email API
- Update form handler in `js/script.js`

## 🎨 Design System

```css
/* Colors */
--black: #000000
--white: #FFFFFF
--gray-50 to --gray-900: Neutral palette
--accent: #0066FF (minimal use)

/* Typography */
Font: Inter (300-900 weights)
Headings: 800-900 weight, 2rem-4rem size
Body: 400-600 weight, 1rem-1.5rem size

/* Layout */
Max-width: 1400px containers
Padding: 10rem vertical sections
Grid: Flexbox + CSS Grid
```

## 📊 Performance

- **No JavaScript frameworks** – Pure vanilla JS
- **No build process** – Instant deploy
- **Optimized images** – Unsplash CDN
- **Minimal CSS** – ~900 lines, well-organized
- **Fast load times** – <100ms initial render

## 🔒 Legal & Privacy

- ✅ Impressum (Legal Imprint) – Required in Germany
- ✅ Datenschutz (Privacy Policy) – DSGVO-compliant
- ✅ Cookie notice (if needed, add manually)

## 🚧 Maintenance

### Update Content
- Edit HTML files directly
- No build required
- Push to GitHub → Auto-deploy

### Add Pages
1. Create new `.html` file
2. Copy structure from existing page
3. Update navigation in all pages
4. Add to sitemap (optional)

## 📧 Contact

**Patrick Vach**  
**E-Mail:** contact@vachsystems.de  
**Location:** Berlin, Germany  
**Website:** vachsystems.de

---

## 📄 License

© 2026 Vach Systems. All rights reserved.

---

**Made with ❤️ in Berlin**
