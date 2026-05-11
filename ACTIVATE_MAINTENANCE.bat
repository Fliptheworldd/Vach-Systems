@echo off
echo Aktiviere Wartungsmodus...
cd /d "%~dp0"

REM Backup der aktuellen index.html
if exist index.html (
    ren index.html index.html.backup
    echo [OK] index.html -> index.html.backup
)

REM Maintenance-Page als neue index.html
copy maintenance.html index.html
echo [OK] Wartungsseite ist jetzt aktiv!
echo.
echo Zum Deaktivieren: DEACTIVATE_MAINTENANCE.bat ausfuehren
pause
