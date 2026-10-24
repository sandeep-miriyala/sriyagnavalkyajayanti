@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sri Yagnavalkya site - keep this window open
echo.
echo  Starting the site... keep this black window OPEN while testing.
echo  To stop: close this window.
echo.

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:8000"
  python -m http.server 8000
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:8000"
  py -m http.server 8000
  goto :eof
)

where node >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:8000"
  npx --yes serve -l 8000 .
  goto :eof
)

echo  Python is not installed. Installing it now (one time only)...
winget install -e --id Python.Python.3.12 --accept-source-agreements --accept-package-agreements
echo.
echo  Done. Close this window and double-click start-site.bat again.
pause
