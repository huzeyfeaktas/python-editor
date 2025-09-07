@echo off
echo 🔧 Port sorunları çözülüyor...

echo 📊 Mevcut portları kontrol ediliyor...
netstat -ano | findstr :3006
netstat -ano | findstr :8000

echo 🔄 Eski process'ler kapatılıyor...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul

echo ⏳ 3 saniye bekleniyor...
timeout /t 3 /nobreak >nul

echo ✅ Portlar temizlendi!
pause
