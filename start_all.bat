@echo off
echo 🚀 Python Web Editor başlatılıyor...

echo 🔧 Portlar temizleniyor...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul

echo 💾 Veritabanı oluşturuluyor...
python create_db.py

echo 📦 Backend başlatılıyor...
start /min cmd /c "cd backend && python app.py"

echo ⏳ Backend hazırlanıyor (3 saniye)...
timeout /t 3 /nobreak >nul

echo 🌐 Frontend başlatılıyor...
start cmd /c "npm run dev"

echo ✅ Sistem başlatıldı!
echo 📱 Tarayıcıda http://localhost:3006 adresini açabilirsiniz
pause
