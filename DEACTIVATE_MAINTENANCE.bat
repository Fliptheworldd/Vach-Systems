@echo off
echo Deaktiviere Wartungsmodus...
cd /d "%~dp0"

REM Lösche die aktuelle index.html (maintenance)
if exist index.html (
    del index.html
    echo [OK] Wartungsseite entfernt
)

REM Stelle Original-index.html wieder her
if exist index.html.backup (
    ren index.html.backup index.html
    echo [OK] Original-Website wiederhergestellt!
) else (
    echo [FEHLER] Kein Backup gefunden!
)

echo.
pause
