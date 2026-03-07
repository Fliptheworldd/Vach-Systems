# 🚀 GitHub Pages Deployment Guide

## Step-by-Step GitHub Pages Deployment

### 1. Prepare Repository

```bash
# Navigate to project folder
cd vach-systems

# Initialize Git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Vach Systems website"
```

### 2. Create GitHub Repository

1. Go to [github.com](https://github.com) and login
2. Click **"New Repository"** (+ icon, top right)
3. Repository name: `vachsystems` (or any name)
4. Description: "Professional B2B website for Vach Systems"
5. **Public** (required for free GitHub Pages)
6. **Do NOT** initialize with README (we already have one)
7. Click **"Create repository"**

### 3. Push to GitHub

```bash
# Add remote origin (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/vachsystems.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to repository page on GitHub
2. Click **Settings** (top right)
3. Scroll down to **"Pages"** (left sidebar)
4. Under **"Source"**:
   - Branch: `main`
   - Folder: `/root`
5. Click **"Save"**
6. Wait 1-2 minutes for deployment

### 5. Access Your Website

Your site will be live at:
```
https://YOUR-USERNAME.github.io/vachsystems/
```

**Example:**
- Username: `patrickvach`
- URL: `https://patrickvach.github.io/vachsystems/`

---

## 🌐 Custom Domain Setup

### Option 1: Using Your Own Domain (e.g., vachsystems.de)

#### A. Add CNAME File
Create `CNAME` file in repository root:
```
vachsystems.de
```

#### B. Configure DNS
In your domain registrar (e.g., Ionos, Namecheap):

**For apex domain (vachsystems.de):**
```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: YOUR-USERNAME.github.io
```

#### C. Enable in GitHub
1. Settings → Pages
2. Custom domain: `vachsystems.de`
3. ✅ Enforce HTTPS (wait for certificate)

**Note:** DNS propagation takes 24-48 hours

---

## 🔄 Update Workflow

### Making Changes

```bash
# Edit files locally
# ...

# Commit changes
git add .
git commit -m "Update: description of changes"

# Push to GitHub
git push

# GitHub Pages auto-deploys in 1-2 minutes
```

---

## ✅ Pre-Deployment Checklist

- [x] All images optimized
- [x] Favicon added (`favicon.svg`)
- [x] Meta tags in all pages
- [x] Mobile responsive tested
- [x] Contact form configured (Formspree)
- [x] Legal pages complete (Impressum, Datenschutz)
- [x] Navigation links working
- [x] Email address correct (`contact@vachsystems.de`)
- [x] LinkedIn link updated
- [x] No hardcoded localhost URLs
- [x] `.gitignore` created

---

## 🐛 Troubleshooting

### Site not loading?
- Check repository is **Public**
- Verify Pages is enabled in Settings
- Wait 2-5 minutes after first deploy
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### CSS/Images not loading?
- Check file paths are relative (not absolute)
- Verify files are committed to repository
- Check browser console for 404 errors

### Custom domain not working?
- Verify DNS records correct
- Wait 24-48h for propagation
- Check `dig vachsystems.de` in terminal
- Disable/re-enable HTTPS in GitHub settings

### Form not sending emails?
- Configure Formspree endpoint in `js/script.js`
- Check Formspree dashboard for submissions
- Verify email address in Formspree settings

---

## 📊 Performance Tips

### Optimize Images
```bash
# Use WebP format for smaller files
# Or use Unsplash CDN URLs with optimization params:
https://images.unsplash.com/photo-ID?w=1200&q=80&fm=webp
```

### Enable Caching
Add `.nojekyll` file to repository root:
```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll for faster deploys"
git push
```

### Monitor Performance
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

---

## 🔐 Security Best Practices

- ✅ **HTTPS enabled** (automatic with GitHub Pages)
- ✅ **No API keys in code** (use environment variables)
- ✅ **DSGVO-compliant** (Privacy policy in place)
- ✅ **No tracking scripts** (unless explicitly added)
- ⚠️ **Private address in Impressum** (legally required in Germany)

---

## 📧 Need Help?

**Technical Issues:**
- GitHub Pages Docs: https://docs.github.com/pages
- GitHub Community: https://github.community/

**Project Questions:**
- Email: contact@vachsystems.de

---

**Happy Deploying! 🎉**
