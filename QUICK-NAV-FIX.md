# 🔧 Navigation Fix für alle Unterseiten

Das Hamburger-Menü muss die richtige Struktur haben:

```html
<nav class="nav-minimal">
    <div class="nav-container">
        <a href="index.html" class="logo-minimal">
            <div class="logo-mark"></div>
            <span>Vach Systems</span>
        </a>
        <div class="nav-links">
            <a href="leistungen.html">Leistungen</a>
            <a href="loesungen.html">Lösungen</a>
            <a href="ueber-uns.html">Über uns</a>
            <a href="kontakt.html" class="nav-cta">Gespräch starten</a>
        </div>
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</nav>
```

**WICHTIG:** Hamburger muss AUSSERHALB von `.nav-links` sein, aber INNERHALB von `.nav-container`!

Die korrekte Struktur ist bereits in `index.html` - kopiere von dort!
