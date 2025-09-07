#!/bin/bash

echo "🐍 Python Web Editor Başlatılıyor..."
echo

echo "📦 Python bağımlılıkları kontrol ediliyor..."
pip install -r requirements.txt

echo
echo "📂 Node.js bağımlılıkları kontrol ediliyor..."
npm install

echo
echo "🚀 Backend başlatılıyor..."
python backend/app.py &
BACKEND_PID=$!

echo "⏳ Backend'in başlaması bekleniyor..."
sleep 3

echo
echo "🌐 Frontend başlatılıyor..."
npm run dev &
FRONTEND_PID=$!

echo
echo "✅ Python Web Editor başlatıldı!"
echo "🌐 Tarayıcınızda http://localhost:3000 adresini açın"
echo
echo "🛑 Çıkmak için Ctrl+C tuşlarına basın"

# Trap SIGINT to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for processes
wait
