@echo off
echo 🐍 Python Web Editor Başlatılıyor...
echo.

echo 📦 Python bağımlılıkları kontrol ediliyor...
pip install -r requirements.txt

echo.
echo 📂 Node.js bağımlılıkları kontrol ediliyor...
npm install

echo.
echo 🚀 Backend başlatılıyor (Port 8000)...
start cmd /k "cd /d %cd% && python backend/app.py"

echo ⏳ Backend'in başlaması bekleniyor...
timeout /t 3

echo.
echo 🌐 Frontend başlatılıyor...
start cmd /k "cd /d %cd% && npm run dev"

echo.
echo ✅ Python Web Editor başlatıldı!
echo 🌐 Tarayıcınızda http://localhost:3000 adresini açın
echo.
pause
