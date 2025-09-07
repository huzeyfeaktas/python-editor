import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Code, 
  File, 
  Folder,
  Plus, 
  Clock,
  Play,
  BookOpen,
  Package,
  FolderPlus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Layout/Header'
import NewProjectModal from '@/components/NewProjectModal'
import Button from '@/components/ui/Button'
import api from '@/utils/api'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalProjects: 0,
    lastActivity: null
  })

  const handleOpenInEditor = (example: any) => {
    // Örnek dili belirle
    const getLanguageAndExtension = (title: string) => {
      const lowerTitle = title.toLowerCase()
      if (lowerTitle.includes('html')) return { language: 'html', extension: '.html' }
      if (lowerTitle.includes('css')) return { language: 'css', extension: '.css' }
      if (lowerTitle.includes('javascript')) return { language: 'javascript', extension: '.js' }
      return { language: 'python', extension: '.py' }
    }
    
    const { language, extension } = getLanguageAndExtension(example.title)
    
    // Örnek kodu localStorage'a kaydet
    const exampleFile = {
      id: `example_${Date.now()}`,
      name: `${example.title.toLowerCase().replace(/\s+/g, '_')}${extension}`,
      content: example.code,
      type: 'file',
      language: language
    }
    localStorage.setItem('exampleFile', JSON.stringify(exampleFile))
    // Editöre yönlendir
    navigate('/editor')
  }

  const loadStats = async () => {
    try {
      const response = await api.get('/files')
      if (response.data.success) {
        const files = response.data.data.files || []
        const projects = files.filter((file: any) => file.type === 'project')
        const totalFiles = files.filter((file: any) => file.type === 'file').length
        
        setStats({
          totalFiles,
          totalProjects: projects.length,
          lastActivity: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Stats yüklenirken hata:', error)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const libraries = [
    // Advanced AI & Deep Learning 🧠
    { name: 'TensorFlow', description: 'Deep learning framework', icon: '🧠' },
    { name: 'PyTorch', description: 'Neural networks', icon: '🔥' },
    { name: 'Keras', description: 'High-level neural networks', icon: '⚡' },
    { name: 'TorchVision', description: 'Computer vision models', icon: '👁️' },
    
    // Data Science & Analytics 📊
    { name: 'NumPy', description: 'Numerical computing', icon: '🔢' },
    { name: 'Pandas', description: 'Data analysis', icon: '🐼' },
    { name: 'SciPy', description: 'Scientific computing', icon: '🧪' },
    { name: 'Scikit-learn', description: 'Machine learning', icon: '🤖' },
    { name: 'Scikit-image', description: 'Image processing', icon: '🖼️' },
    { name: 'Statsmodels', description: 'Statistical modeling', icon: '📈' },
    { name: 'NetworkX', description: 'Graph analysis', icon: '🕸️' },
    { name: 'SymPy', description: 'Symbolic mathematics', icon: '∑' },
    
    // Data Visualization 📈
    { name: 'Matplotlib', description: 'Data visualization', icon: '📊' },
    { name: 'Seaborn', description: 'Statistical plots', icon: '📈' },
    { name: 'Plotly', description: 'Interactive plots', icon: '📊' },
    { name: 'Bokeh', description: 'Web-ready plots', icon: '🌐' },
    
    // Web Development 🌐
    { name: 'Flask', description: 'Web framework', icon: '🌐' },
    { name: 'Requests', description: 'HTTP library', icon: '📡' },
    { name: 'BeautifulSoup', description: 'Web scraping', icon: '🕷️' },
    
    // Game Development 🎮
    { name: 'Pygame', description: 'Game development', icon: '🎮' },
    { name: 'Pygame Zero', description: 'Simple game dev', icon: '🕹️' },
    
    // Bot Development 🤖
    { name: 'Discord.py', description: 'Discord bots', icon: '🤖' },
    
    // Image & Computer Vision 👁️
    { name: 'OpenCV', description: 'Computer vision', icon: '👁️' },
    { name: 'Pillow', description: 'Image processing', icon: '🖼️' },
    
    // File Processing 📁
    { name: 'OpenPyXL', description: 'Excel files', icon: '📋' },
    { name: 'SQLAlchemy', description: 'Database ORM', icon: '🗄️' },
    
    // Built-in Libraries 🐍
    { name: 'Turtle', description: 'Graphics programming', icon: '🐢' },
    { name: 'SQLite3', description: 'Database', icon: '💾' },
  ]

  const quickStart = [
    {
      title: 'TensorFlow Neural Network',
      description: 'Derin öğrenme ile sinir ağı oluşturun',
      code: `import tensorflow as tf
import numpy as np

print("TensorFlow versiyonu:", tf.__version__)

# Basit bir sinir ağı oluştur
model = tf.keras.Sequential([
    tf.keras.layers.Dense(10, activation='relu', input_shape=(8,)),
    tf.keras.layers.Dense(5, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Model derle
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Model özeti
print("\\nModel Özeti:")
model.summary()

# Rastgele veri oluştur
X_train = np.random.random((1000, 8))
y_train = np.random.randint(2, size=(1000, 1))

print(f"\\nEğitim verisi şekli: {X_train.shape}")
print(f"Hedef veri şekli: {y_train.shape}")

# Modeli kısa bir eğitim ile test et
print("\\n🔄 Model eğitimi başlıyor...")
history = model.fit(X_train, y_train, 
                   epochs=3, 
                   batch_size=32, 
                   verbose=1,
                   validation_split=0.2)

print("\\n✅ Model eğitimi tamamlandı!")
print(f"Final loss: {history.history['loss'][-1]:.4f}")
print(f"Final accuracy: {history.history['accuracy'][-1]:.4f}")

# Tahmin yap
sample_prediction = model.predict(X_train[:5])
print(f"\\n🎯 İlk 5 örnek için tahminler:")
for i, pred in enumerate(sample_prediction):
    print(f"Örnek {i+1}: {pred[0]:.4f}")

print("\\n🧠 TensorFlow başarıyla çalıştı!")`
    },
    {
      title: 'PyTorch Tensor İşlemleri',
      description: 'PyTorch ile tensor manipülasyonu',
      code: `import torch
import torch.nn as nn

print("PyTorch versiyonu:", torch.__version__)

# Tensor oluştur
x = torch.randn(3, 4)
y = torch.randn(4, 2)

print("Tensor x:")
print(x)
print("\\nTensor y:")
print(y)

# Matrix çarpımı
z = torch.mm(x, y)
print("\\nMatrix çarpımı (x @ y):")
print(z)

# Basit bir sinir ağı katmanı
linear = nn.Linear(4, 1)
output = linear(x)

print(f"\\nSinir ağı çıktısı şekli: {output.shape}")
print("Çıktı:")
print(output)

# GPU kontrolü
if torch.cuda.is_available():
    print("\\n🚀 CUDA GPU mevcut!")
    x_gpu = x.cuda()
    print("Tensor GPU'ya taşındı")
else:
    print("\\n💻 CPU üzerinde çalışıyor")`
    },
    {
      title: 'Veri Analizi',
      description: 'Pandas ve NumPy ile veri analizi yapın',
      code: `import pandas as pd
import numpy as np

# Örnek veri oluştur
data = {
    'isim': ['Ali', 'Ayşe', 'Mehmet', 'Fatma'],
    'yas': [25, 30, 35, 28],
    'maas': [5000, 6000, 7000, 5500]
}

df = pd.DataFrame(data)
print("Veri seti:")
print(df)
print(f"\\nOrtalama yaş: {df['yas'].mean()}")
print(f"Ortalama maaş: {df['maas'].mean()}")`
    },
    {
      title: 'Web Uygulaması',
      description: 'Flask ile basit web uygulaması',
      code: `from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Merhaba Dünya!</h1><p>Flask çalışıyor!</p>'

@app.route('/user/<name>')
def user(name):
    return f'<h2>Merhaba {name}!</h2>'

print("Flask uygulaması hazır!")
print("Tarayıcıda http://localhost:5000 adresini ziyaret edin")

if __name__ == '__main__':
    app.run(debug=True)`
    },
    {
      title: 'Grafik Çizimi',
      description: 'Matplotlib ile güzel grafikler',
      code: `import matplotlib.pyplot as plt
import numpy as np

# Veri oluştur
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Grafik çiz
plt.figure(figsize=(10, 6))
plt.plot(x, y1, label='sin(x)', color='blue', linewidth=2)
plt.plot(x, y2, label='cos(x)', color='red', linewidth=2)

plt.title('Trigonometrik Fonksiyonlar', fontsize=16)
plt.xlabel('x değeri', fontsize=12)
plt.ylabel('y değeri', fontsize=12)
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Grafik oluşturuldu!")`
    },
    {
      title: 'Görüntü İşleme',
      description: 'OpenCV ile görüntü işleme',
      code: `import cv2
import numpy as np

# Boş görüntü oluştur (siyah)
img = np.zeros((400, 600, 3), dtype=np.uint8)

# Renkli şekiller çiz
cv2.rectangle(img, (50, 50), (200, 150), (0, 255, 0), -1)  # Yeşil kare
cv2.circle(img, (400, 200), 80, (255, 0, 0), -1)  # Mavi daire
cv2.line(img, (0, 300), (600, 300), (0, 0, 255), 5)  # Kırmızı çizgi

# Metin ekle
cv2.putText(img, 'OpenCV Test', (200, 350), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

print("OpenCV görüntü oluşturuldu!")
print(f"Görüntü boyutu: {img.shape}")
print("Şekiller ve metin eklendi")`
    },
    {
      title: 'Discord Bot',
      description: 'Discord.py ile bot geliştirme',
      code: `import discord
from discord.ext import commands

# Bot oluştur
bot = commands.Bot(command_prefix='!', intents=discord.Intents.default())

@bot.event
async def on_ready():
    print(f'{bot.user} olarak giriş yapıldı!')

@bot.command()
async def merhaba(ctx):
    await ctx.send('Merhaba! Ben bir Python botu!')

@bot.command()
async def toplam(ctx, sayi1: int, sayi2: int):
    sonuc = sayi1 + sayi2
    await ctx.send(f'{sayi1} + {sayi2} = {sonuc}')

print("Discord bot kodu hazır!")
print("Bot token'ınızı ekleyip çalıştırabilirsiniz")
# bot.run('YOUR_BOT_TOKEN')`
    },
    {
      title: 'Oyun Geliştirme',
      description: 'Pygame ile basit oyun',
      code: `import pygame
import sys

# Pygame başlat
pygame.init()

# Ekran ayarları
ekran = pygame.display.set_mode((800, 600))
pygame.display.set_caption('Python Oyun')

# Renkler
SIYAH = (0, 0, 0)
KIRMIZI = (255, 0, 0)
MAVI = (0, 0, 255)

# Oyuncu pozisyonu
oyuncu_x = 400
oyuncu_y = 300

print("Pygame oyunu başlatılıyor...")
print("Oklar ile hareket edin, ESC ile çıkın")

# Oyun döngüsü
clock = pygame.time.Clock()
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
    
    # Klavye girişi
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        oyuncu_x -= 5
    if keys[pygame.K_RIGHT]:
        oyuncu_x += 5
    if keys[pygame.K_UP]:
        oyuncu_y -= 5
    if keys[pygame.K_DOWN]:
        oyuncu_y += 5
    
    # Ekranı temizle
    ekran.fill(SIYAH)
    
    # Oyuncuyu çiz
    pygame.draw.circle(ekran, KIRMIZI, (oyuncu_x, oyuncu_y), 20)
    
    # Ekranı güncelle
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()`
    },
    {
      title: 'Web Scraping',
      description: 'BeautifulSoup ile veri çekme',
      code: `import requests
from bs4 import BeautifulSoup

# Web sitesinden veri çek
url = "https://httpbin.org/html"
response = requests.get(url)

if response.status_code == 200:
    # HTML içeriğini parse et
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Başlıkları bul
    basliklar = soup.find_all('h1')
    print("Bulunan başlıklar:")
    for baslik in basliklar:
        print(f"- {baslik.get_text()}")
    
    # Paragrafları bul
    paragraflar = soup.find_all('p')
    print(f"\\nToplam {len(paragraflar)} paragraf bulundu")
    
    print("\\nWeb scraping başarılı!")
else:
    print(f"Hata: {response.status_code}")

# Örnek veri işleme
data = {
    'site': 'httpbin.org',
    'durum': 'başarılı',
    'veri_sayisi': len(paragraflar) if 'paragraflar' in locals() else 0
}
print(f"\\nSonuç: {data}")`
    },
    {
      title: 'Excel İşleme',
      description: 'OpenPyXL ile Excel dosyaları',
      code: `import openpyxl
from openpyxl.styles import Font, PatternFill

# Yeni Excel dosyası oluştur
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Python Verileri"

# Başlıkları ekle
basliklar = ['Ad', 'Soyad', 'Yaş', 'Şehir', 'Maaş']
for col, baslik in enumerate(basliklar, 1):
    hucre = ws.cell(row=1, column=col, value=baslik)
    hucre.font = Font(bold=True, color="FFFFFF")
    hucre.fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")

# Örnek verileri ekle
veriler = [
    ['Ali', 'Yılmaz', 28, 'İstanbul', 7500],
    ['Ayşe', 'Kara', 32, 'Ankara', 8200],
    ['Mehmet', 'Demir', 25, 'İzmir', 6800],
    ['Fatma', 'Şahin', 29, 'Bursa', 7100]
]

for row, veri in enumerate(veriler, 2):
    for col, deger in enumerate(veri, 1):
        ws.cell(row=row, column=col, value=deger)

# Dosyayı kaydet
wb.save('python_verileri.xlsx')

print("Excel dosyası oluşturuldu: python_verileri.xlsx")
print(f"Toplam {len(veriler)} kayıt eklendi")
print("Dosya formatlama ile kaydedildi")`
    },
    {
      title: 'Turtle Grafikleri',
      description: 'Turtle ile çizim yapın',
      code: `import turtle
import math

# Ekran ayarları
screen = turtle.Screen()
screen.bgcolor("black")
screen.title("Turtle Grafik Çizimi")
screen.setup(width=800, height=600)

# Kaplumbağa oluştur
artist = turtle.Turtle()
artist.speed(0)
artist.color("cyan")

# Renkli sarmal çizimi
colors = ["red", "blue", "green", "yellow", "purple", "orange"]

for i in range(200):
    artist.color(colors[i % 6])
    artist.circle(100 - i/2)
    artist.right(91)

print("🐢 Turtle grafik çizimi tamamlandı!")
print("🐢 Pencereyi kapatmak için üzerine tıklayın")

# Pencereyi açık tut
turtle.done()`
    },
    {
      title: 'Pygame Zero Oyun',
      description: 'Pygame Zero ile basit oyun',
      code: `import pgzrun
import random

# Ekran boyutu
WIDTH = 800
HEIGHT = 600

# Oyuncu
player = Actor('alien')  # pgzero built-in sprite
player.x = WIDTH // 2
player.y = HEIGHT - 50

# Düşmanlar listesi
enemies = []

# Skor
score = 0

def update():
    global score
    
    # Oyuncu kontrolü (ok tuşları)
    if keyboard.left and player.x > 20:
        player.x -= 5
    if keyboard.right and player.x < WIDTH - 20:
        player.x += 5
    if keyboard.up and player.y > 20:
        player.y -= 5
    if keyboard.down and player.y < HEIGHT - 20:
        player.y += 5
    
    # Rastgele düşman oluştur
    if random.randint(0, 60) == 0:
        enemy = Actor('alien')
        enemy.x = random.randint(20, WIDTH - 20)
        enemy.y = 0
        enemies.append(enemy)
    
    # Düşmanları hareket ettir
    for enemy in enemies[:]:
        enemy.y += 3
        if enemy.y > HEIGHT:
            enemies.remove(enemy)
            score += 1

def draw():
    screen.fill('darkblue')
    
    # Oyuncuyu çiz
    player.draw()
    
    # Düşmanları çiz
    for enemy in enemies:
        enemy.draw()
    
    # Skoru göster
    screen.draw.text(f'Skor: {score}', (10, 10), color='white', fontsize=30)
    screen.draw.text('Ok tuşları ile hareket edin!', (10, HEIGHT - 30), color='yellow')

print("🎮 Pygame Zero oyunu başlatılıyor...")
print("🎮 Ok tuşları ile oyuncuyu hareket ettirin!")

# Oyunu başlat
pgzrun.go()`
    },
    {
      title: 'İnteraktif Plotly',
      description: 'Plotly ile interaktif grafikler',
      code: `import plotly.graph_objects as go
import plotly.express as px
import numpy as np
import pandas as pd

# 1. 3D Scatter Plot
np.random.seed(42)
x = np.random.randn(100)
y = np.random.randn(100)
z = np.random.randn(100)
colors = np.random.randn(100)

fig1 = go.Figure(data=go.Scatter3d(
    x=x, y=y, z=z,
    mode='markers',
    marker=dict(
        size=8,
        color=colors,
        colorscale='Viridis',
        showscale=True
    )
))

fig1.update_layout(
    title='3D Scatter Plot',
    scene=dict(
        xaxis_title='X Axis',
        yaxis_title='Y Axis',
        zaxis_title='Z Axis'
    )
)

# Tarayıcıda aç
fig1.show()

# 2. Animasyonlu Line Chart
dates = pd.date_range('2023-01-01', periods=50)
data = pd.DataFrame({
    'date': dates,
    'value1': np.cumsum(np.random.randn(50)),
    'value2': np.cumsum(np.random.randn(50))
})

fig2 = px.line(data, x='date', y=['value1', 'value2'], 
               title='Animasyonlu Zaman Serisi')
fig2.show()

# 3. Interaktif Heatmap
z_data = np.random.randn(20, 20)

fig3 = go.Figure(data=go.Heatmap(
    z=z_data,
    colorscale='RdYlBu',
    hoverongaps=False
))

fig3.update_layout(title='İnteraktif Heatmap')
fig3.show()

print("📊 Plotly grafikleri tarayıcıda açıldı!")
print("📊 Zoom, pan ve hover özelliklerini deneyin!")`
    },
    {
      title: 'Bokeh Dashboard',
      description: 'Bokeh ile web dashboard',
      code: `from bokeh.plotting import figure, show
from bokeh.layouts import column, row
from bokeh.models import Slider, Select
from bokeh.io import curdoc
import numpy as np

# Veri oluştur
x = np.linspace(0, 4*np.pi, 100)
y = np.sin(x)

# Ana grafik
p1 = figure(title="Sinüs Fonksiyonu", width=400, height=300)
line = p1.line(x, y, line_width=2, color='blue')

# Scatter plot
p2 = figure(title="Rastgele Veriler", width=400, height=300)
n = 100
x_scatter = np.random.random(n) * 100
y_scatter = np.random.random(n) * 100
colors = np.random.choice(['red', 'green', 'blue', 'orange'], n)
p2.scatter(x_scatter, y_scatter, color=colors, alpha=0.6, size=10)

# Bar chart
p3 = figure(x_range=['A', 'B', 'C', 'D', 'E'], title="Bar Chart", 
           width=400, height=300)
categories = ['A', 'B', 'C', 'D', 'E']
values = [3, 7, 2, 5, 8]
p3.vbar(x=categories, top=values, width=0.8, color='green')

# Pie chart benzeri (Donut)
from bokeh.models import ColumnDataSource
from bokeh.transform import cumsum
import pandas as pd

data = pd.DataFrame({
    'categories': ['Python', 'JavaScript', 'Java', 'C++', 'Go'],
    'values': [25, 35, 15, 15, 10]
})

data['angle'] = data['values']/data['values'].sum() * 2*np.pi
data['color'] = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']

p4 = figure(title="Programlama Dilleri", width=400, height=300,
           toolbar_location=None, tools="hover", tooltips="@categories: @values%")

p4.wedge(x=0, y=1, radius=0.4, start_angle=cumsum('angle', include_zero=True), 
         end_angle=cumsum('angle'), line_color="white", fill_color='color', 
         source=data)

# Layout oluştur
layout = column(
    row(p1, p2),
    row(p3, p4)
)

print("📊 Bokeh dashboard hazırlanıyor...")
print("📊 Tarayıcıda interaktif dashboard açılacak!")

# Tarayıcıda göster
show(layout)`
    },
    {
      title: 'HTML Web Sayfası',
      description: 'Modern HTML5 sayfası oluşturun',
      code: `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merhaba Dünya</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            padding: 50px 20px;
        }
        h1 {
            font-size: 3em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .card {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
        }
        button {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 25px;
            cursor: pointer;
            transition: transform 0.3s;
        }
        button:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Merhaba Dünya!</h1>
        <div class="card">
            <h2>HTML5 ile Modern Web</h2>
            <p>Bu sayfa HTML, CSS ve JavaScript teknolojileri kullanılarak oluşturulmuştur.</p>
            <button onclick="alert('Merhaba! 👋')">Tıkla</button>
        </div>
    </div>
</body>
</html>`
    },
    {
      title: 'CSS Stillendirme',
      description: 'Modern CSS ile güzel tasarım',
      code: `/* Modern CSS Örneği */
:root {
    --primary-color: #3498db;
    --secondary-color: #e74c3c;
    --background: #f8f9fa;
    --text-color: #2c3e50;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--background);
    color: var(--text-color);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.card {
    background: white;
    border-radius: 10px;
    padding: 30px;
    margin: 20px 0;
    box-shadow: var(--shadow);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn {
    display: inline-block;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.text-center {
    text-align: center;
}

.gradient-text {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.5em;
    font-weight: bold;
}`
    },
    {
      title: 'JavaScript İnteraktif',
      description: 'Modern JavaScript ile dinamik web',
      code: `// Modern JavaScript Örneği
console.log("🚀 JavaScript çalışıyor!");

// Basit HTML oluştur
document.body.innerHTML = '<div id="container"></div>';
const container = document.getElementById('container');

// CSS stil ekle
container.style.cssText = 'max-width: 600px; margin: 50px auto; padding: 20px; font-family: Arial; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; color: white; text-align: center;';

// HTML içerik oluştur
container.innerHTML = \`
    <h1>⚡ JavaScript Demo</h1>
    <div id="counter" style="font-size: 2em; margin: 20px 0;">Sayaç: 0</div>
    <button id="increment" style="background: #e74c3c; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px;">Artır</button>
    <button id="decrement" style="background: #3498db; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px;">Azalt</button>
    <button id="random" style="background: #27ae60; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px;">Rastgele</button>
    <div id="output" style="margin-top: 30px; font-size: 1.2em;"></div>
\`;

// Değişkenler
let counter = 0;

// DOM Elementleri
const counterDisplay = document.getElementById('counter');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const randomBtn = document.getElementById('random');
const output = document.getElementById('output');

// Fonksiyonlar
function updateCounter() {
    counterDisplay.textContent = 'Sayaç: ' + counter;
    output.innerHTML = '<p>📊 Son işlem: ' + new Date().toLocaleTimeString() + '</p><p>🎯 Sayaç değeri: ' + counter + '</p><p>🔢 Çift mi? ' + (counter % 2 === 0 ? 'Evet ✅' : 'Hayır ❌') + '</p>';
}

// Event Listeners
incrementBtn.addEventListener('click', function() {
    counter++;
    updateCounter();
    console.log('Sayaç artırıldı: ' + counter);
});

decrementBtn.addEventListener('click', function() {
    counter--;
    updateCounter();
    console.log('Sayaç azaltıldı: ' + counter);
});

randomBtn.addEventListener('click', function() {
    counter = Math.floor(Math.random() * 100);
    updateCounter();
    console.log('Rastgele sayı: ' + counter);
});

// İlk güncelleme
updateCounter();

// Array ve Object örnekleri
const renkler = ['🔴', '🟢', '🔵', '🟡', '🟣'];
const kisi = {
    ad: 'Ali',
    yas: 25,
    selamla: function() {
        return 'Merhaba, ben ' + this.ad + '!';
    }
};

console.log('Renkler:', renkler);
console.log('Kişi:', kisi.selamla());

// Modern JavaScript özellikleri
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

console.log('Orijinal:', numbers);
console.log('İki katı:', doubled);
console.log('Çift sayılar:', evens);`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hoş geldiniz, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Python projelerinize hemen başlayın. Tüm kütüphaneler önceden yüklenmiş!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FolderPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Yeni Proje Klasörü
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proje klasörü oluşturun
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowNewProjectModal(true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Klasör Oluştur
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Projelerim
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.totalProjects} proje
                </p>
              </div>
            </div>
            <Link to="/projects">
              <Button variant="outline" className="w-full">
                Projeleri Görüntüle
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Örnekler
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hazır kod örnekleri
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowExamples(true)}
            >
              Örnekleri Gör
            </Button>
          </div>
        </motion.div>

        {/* Available Libraries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="h-6 w-6 mr-2" />
            Yüklü Kütüphaneler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {libraries.map((lib) => (
              <motion.div
                key={lib.name}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl mb-2">{lib.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {lib.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {lib.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Start Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Play className="h-6 w-6 mr-2" />
            Hızlı Başlangıç
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickStart.map((example, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {example.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {example.description}
                </p>
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-xs font-mono overflow-x-auto mb-4">
                  <code className="text-gray-800 dark:text-gray-200">
                    {example.code}
                  </code>
                </pre>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleOpenInEditor(example)}
                >
                  Editörde Aç
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={(project) => {
          console.log('Proje oluşturuldu:', project)
          setShowNewProjectModal(false)
          // Stats'ı yenile
          loadStats()
          // Tüm eski state'leri temizle
          localStorage.removeItem('openFileId')
          localStorage.removeItem('exampleFile')
          // Editöre yönlendir - proje klasörünü açmak için
          localStorage.setItem('openProjectId', project.project.id)
          localStorage.setItem('newProjectCreated', 'true')
          navigate('/editor')
        }}
      />

      {/* Examples Modal */}
      {showExamples && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Kod Örnekleri
              </h2>
              <button
                onClick={() => setShowExamples(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickStart.map((example, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {example.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {example.description}
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-xs font-mono overflow-x-auto mb-4 max-h-48">
                    <code className="text-gray-800 dark:text-gray-200">
                      {example.code}
                    </code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setShowExamples(false)
                      handleOpenInEditor(example)
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Editörde Aç
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setShowExamples(false)}
              >
                Kapat
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
