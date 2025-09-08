# 🐍 Python Web Editor

Modern, önceden yüklenmiş kütüphaneler ile Python kodlama deneyimi sunan web tabanlı editör.

## ✨ Özellikler

### 🎯 Kullanıcı Deneyimi
- **Modern React + TypeScript** frontend
- **VS Code benzeri editör** (Monaco Editor)
- **Dark/Light tema** desteği
- **Responsive tasarım** (mobil uyumlu)
- **Real-time kod çalıştırma**
<img width="1902" height="910" alt="Ekran görüntüsü 2025-09-08 125413" src="https://github.com/user-attachments/assets/a7edb000-e9d6-4ef2-9101-d25f94bb01ea" />
<img width="1919" height="909" alt="Ekran görüntüsü 2025-09-08 125548" src="https://github.com/user-attachments/assets/2d734dcd-9857-448d-ab21-86b62c4e2b8c" />

### 📦 Önceden Yüklenmiş Kütüphaneler
- **Data Science:** NumPy, Pandas, Matplotlib, Seaborn, Plotly
- **Web Development:** Flask, Requests, BeautifulSoup4
- **Bot Development:** Discord.py, Python-Telegram-Bot
- **Game Development:** Pygame, Pygame Zero
- **Image Processing:** Pillow, OpenCV
- **Graphics:** Turtle (built-in)
- **Built-in Python:** json, datetime, os, sys, math, random, etc.
<img width="1151" height="841" alt="Ekran görüntüsü 2025-09-08 125444" src="https://github.com/user-attachments/assets/fd800b81-694b-4ede-bdaf-df6cacf64b7c" />

### 🔐 Kullanıcı Yönetimi
- Kullanıcı kayıt/giriş sistemi
- Kişisel dosya yönetimi
- Oturum yönetimi
- Dosya tabanlı veri depolama
<img width="522" height="583" alt="Ekran görüntüsü 2025-09-08 125351" src="https://github.com/user-attachments/assets/184a9a75-5ca8-4d5e-9e6b-2645b543927e" />
<img width="1919" height="905" alt="Ekran görüntüsü 2025-09-08 125521" src="https://github.com/user-attachments/assets/3b21bc66-bc50-49fb-8cc2-5fcd0719e6ea" />
<img width="1567" height="833" alt="Ekran görüntüsü 2025-09-08 130021" src="https://github.com/user-attachments/assets/34af12d8-395a-45ae-85bb-b9907863be91" />
<img width="1158" height="187" alt="Ekran görüntüsü 2025-09-08 125428" src="https://github.com/user-attachments/assets/cce38065-18d4-4fbd-96d0-b255d32f939e" />

### 📝 Editör Özellikleri
- Syntax highlighting
- Auto-completion
- Code snippets
- File tree navigation
- Multiple tabs
- Keyboard shortcuts
- Real-time output
- Error handling

## 🚀 Kurulum

### 1. Repository'yi klonlayın
```bash
git clone <repository-url>
cd python-web-editor
```

### 2. Python bağımlılıklarını yükleyin
```bash
pip install -r requirements.txt
```

### 3. Node.js bağımlılıklarını yükleyin
```bash
npm install
```

### 4. Backend'i başlatın
```bash
npm run backend
```

### 5. Frontend'i başlatın (yeni terminal)
```bash
npm run dev
```

### 6. Tarayıcıda açın
http://localhost:3000

## 📁 Proje Yapısı

```
python-web-editor/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Pages
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── backend/               # Flask backend
│   └── app.py            # Ana backend dosyası
├── data/                 # Veri depolama (otomatik oluşur)
│   ├── users/           # Kullanıcı verileri
│   ├── files/           # Kullanıcı dosyaları
│   └── temp/            # Geçici dosyalar
├── package.json         # Frontend dependencies
└── requirements.txt     # Backend dependencies
```

## 🛠️ Teknoloji Stack'i

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Monaco Editor** - VS Code editor
- **Framer Motion** - Smooth animations
- **Vite** - Fast build tool

### Backend
- **Flask** - Python web framework
- **JSON** - File-based database
- **Subprocess** - Safe code execution

## ⌨️ Klavye Kısayolları

| Kısayol | Açıklama |
|---------|----------|
| `Ctrl+S` | Dosyayı kaydet |
| `Ctrl+Enter` | Kodu çalıştır |
| `Ctrl+Shift+P` | Komut paleti |
| `Ctrl+P` | Dosya ara |

## 🔒 Güvenlik

- **Kullanıcı şifreleri** SHA-256 ile hashlenir
- **Kod çalıştırma** subprocess ile izole edilir
- **Timeout** mekanizması ile sonsuz döngüler engellenir
- **CORS** yapılandırması ile güvenli API erişimi

## 🎮 Örnek Projeler
<img width="1181" height="877" alt="Ekran görüntüsü 2025-09-08 125506" src="https://github.com/user-attachments/assets/9fc018b1-1318-45c4-9a93-bbcec5b31436" />

### 1. Veri Analizi
```python
import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv('data.csv')
data.plot(kind='bar')
plt.show()
```

### 2. Discord Botu
```python
import discord

client = discord.Client()

@client.event
async def on_message(message):
    if message.content == '!hello':
        await message.channel.send('Merhaba!')

client.run('TOKEN')
```

### 3. Web Uygulaması
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Merhaba Dünya!'

app.run(debug=True)
```

## 🐛 Sorun Giderme

### Backend başlamıyor
- Python 3.8+ yüklü olduğundan emin olun
- `pip install -r requirements.txt` komutunu çalıştırın

### Frontend başlamıyor
- Node.js 16+ yüklü olduğundan emin olun
- `npm install` komutunu çalıştırın

### Kod çalışmıyor
- Kodunuzda syntax hatası olup olmadığını kontrol edin
- İzin verilen kütüphaneleri kullandığınızdan emin olun

## 📝 Geliştirme

### Yeni kütüphane ekleme
1. `requirements.txt` dosyasına ekleyin
2. `backend/app.py` içindeki `ALLOWED_IMPORTS` listesine ekleyin
3. Backend'i yeniden başlatın

### UI değişiklikleri
- `src/` dizinindeki React componentlerini düzenleyin
- Tailwind CSS kullanarak stillendirin
- TypeScript type safety'sini koruyun

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- **Monaco Editor** - VS Code editor engine
- **React** - UI library
- **Flask** - Python web framework
- **Tailwind CSS** - CSS framework
