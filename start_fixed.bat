@echo off
echo 🔧 Python Web Editor - Port Düzeltmesi
echo.

echo 📦 Backend port 5001'e taşınıyor...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.

echo 🚀 Backend başlatılıyor (port 5001)...
start cmd /k "cd /d %cd% && python backend/app.py"

timeout /t 3

echo 🌐 Frontend başlatılıyor...
start cmd /k "cd /d %cd% && npm run dev"

echo.
echo ✅ Editör başlatıldı!
echo 🌐 Tarayıcıda http://localhost:3000 açın
pause
