# OG-Image Generator für Vach Systems
# Erstellt ein 1200x630px JPG aus dem Logo

Add-Type -AssemblyName System.Drawing

# Laden des Logos
$logoPath = "logo-original.png"
$outputPath = "og-image.jpg"

try {
    # Logo laden
    $logo = [System.Drawing.Image]::FromFile((Resolve-Path $logoPath))
    
    # Neue Bitmap erstellen (1200x630)
    $bitmap = New-Object System.Drawing.Bitmap(1200, 630)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Hochwertige Einstellungen
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Schwarzer Hintergrund mit Gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, 1200, 630)
    $brush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
    $graphics.FillRectangle($brush1, $rect)
    
    # Logo skalieren und zentrieren (links)
    $logoMaxWidth = 400
    $logoMaxHeight = 400
    
    $scaleWidth = $logoMaxWidth / $logo.Width
    $scaleHeight = $logoMaxHeight / $logo.Height
    $scale = [Math]::Min($scaleWidth, $scaleHeight)
    
    $logoWidth = [int]($logo.Width * $scale)
    $logoHeight = [int]($logo.Height * $scale)
    
    $logoX = 150
    $logoY = [int]((630 - $logoHeight) / 2)
    
    # Logo zeichnen
    $graphics.DrawImage($logo, $logoX, $logoY, $logoWidth, $logoHeight)
    
    # Text hinzufügen (rechts vom Logo)
    $textX = $logoX + $logoWidth + 60
    
    # Vach Systems (Haupttext)
    $font1 = New-Object System.Drawing.Font("Arial", 64, [System.Drawing.FontStyle]::Bold)
    $brush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.DrawString("Vach Systems", $font1, $brush2, $textX, 190)
    
    # Untertitel
    $font2 = New-Object System.Drawing.Font("Arial", 28)
    $brush3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 153, 153, 153))
    $graphics.DrawString("KI-Systeme für Prozessautomatisierung", $font2, $brush3, $textX, 280)
    
    # Beschreibung
    $font3 = New-Object System.Drawing.Font("Arial", 22)
    $brush4 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 102, 102, 102))
    $graphics.DrawString("Software, die Geschäftsprozesse automatisiert", $font3, $brush4, $textX, 330)
    
    # Als JPG speichern
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 95)
    
    $bitmap.Save((Resolve-Path .).Path + "\$outputPath", $encoder, $encoderParams)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $logo.Dispose()
    
    Write-Host "✅ OG-Image erfolgreich erstellt: $outputPath (1200x630px)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nächste Schritte:" -ForegroundColor Cyan
    Write-Host "  git add og-image.jpg"
    Write-Host "  git commit -m 'Add: OG-Image für WhatsApp/Social Preview'"
    Write-Host "  git push"
    
} catch {
    Write-Host "❌ Fehler: $_" -ForegroundColor Red
}
