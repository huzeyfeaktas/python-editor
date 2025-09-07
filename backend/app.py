from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import json
import uuid
import hashlib
import subprocess
import tempfile
import time
import sys
from datetime import datetime
from pathlib import Path
import shutil
from database import db

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'  # Production'da değiştirin
CORS(app, supports_credentials=True)

# Proje dizinleri
BASE_DIR = Path(__file__).parent.parent
USERS_DIR = BASE_DIR / 'data' / 'users'
FILES_DIR = BASE_DIR / 'data' / 'files'
TEMP_DIR = BASE_DIR / 'data' / 'temp'

# Dizinleri oluştur
USERS_DIR.mkdir(parents=True, exist_ok=True)
FILES_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)

USERS_FILE = USERS_DIR / 'users.json'

# SQLite kullanıldığı için bu fonksiyonlar artık gerekli değil
# load_users ve save_users DatabaseManager'da

def hash_password(password):
    """Şifreyi hashle"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_user_files_dir(user_id):
    """Kullanıcının dosya dizinini al"""
    user_dir = FILES_DIR / user_id
    user_dir.mkdir(exist_ok=True)
    return user_dir

# SQLite kullanıldığı için dosya index'i artık gerekli değil
# Tüm dosya işlemleri DatabaseManager'da

def create_sample_files(user_id):
    """Yeni kullanıcı için örnek dosyalar oluştur (artık kullanılmıyor)"""
    # Örnek dosyalar artık otomatik oluşturulmayacak
    return
    sample_files = [
        {
            'id': str(uuid.uuid4()),
            'name': 'merhaba.py',
            'type': 'file',
            'path': 'merhaba.py',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'numpy_ornegi.py',
            'type': 'file',
            'path': 'numpy_ornegi.py',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'grafik_ornegi.py',
            'type': 'file',
            'path': 'grafik_ornegi.py',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'opencv_ornegi.py',
            'type': 'file',
            'path': 'opencv_ornegi.py',
            'created_at': datetime.now().isoformat()
        }
    ]
    
    user_files_dir = get_user_files_dir(user_id)
    
    # Örnek dosya içerikleri
    sample_contents = {
        'merhaba.py': '''# Python Web Editor'e Hoş Geldiniz!
print("Merhaba Dünya!")
print("Bu editörde birçok Python kütüphanesi önceden yüklenmiş!")

# Temel Python
name = input("Adınız nedir? ")
print(f"Merhaba {name}!")

# Liste ve döngüler
sayilar = [1, 2, 3, 4, 5]
for sayi in sayilar:
    print(f"Sayı: {sayi}, Karesi: {sayi**2}")
''',
        'numpy_ornegi.py': '''# NumPy ile Bilimsel Hesaplama
import numpy as np

print("NumPy versiyonu:", np.__version__)

# Dizi oluşturma
arr = np.array([1, 2, 3, 4, 5])
print("Dizi:", arr)
print("Dizinin karesi:", arr ** 2)

# Rastgele sayılar
random_arr = np.random.random(10)
print("Rastgele sayılar:", random_arr)

# İstatistiksel işlemler
print("Ortalama:", np.mean(random_arr))
print("Standart sapma:", np.std(random_arr))

# Matris işlemleri
matrix = np.array([[1, 2], [3, 4]])
print("Matris:\\n", matrix)
print("Matris determinantı:", np.linalg.det(matrix))
''',
        'grafik_ornegi.py': '''# Matplotlib ile Grafik Çizimi
import matplotlib.pyplot as plt
import numpy as np

# Sinüs ve kosinüs grafiği
x = np.linspace(0, 2 * np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y1, label='sin(x)', color='blue')
plt.plot(x, y2, label='cos(x)', color='red')
plt.title('Sinüs ve Kosinüs Fonksiyonları')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.show()

# Bar grafiği
categories = ['A', 'B', 'C', 'D']
values = [23, 45, 56, 78]

plt.figure(figsize=(8, 6))
plt.bar(categories, values, color=['red', 'green', 'blue', 'orange'])
plt.title('Örnek Bar Grafiği')
plt.ylabel('Değerler')
plt.show()

print("Grafikler oluşturuldu!")
''',
        'opencv_ornegi.py': '''# OpenCV ile Görüntü İşleme
import cv2
import numpy as np
import matplotlib.pyplot as plt

print("OpenCV versiyonu:", cv2.__version__)

# Görüntü oluşturma
# Boş bir görüntü oluştur (siyah)
img = np.zeros((300, 400, 3), dtype=np.uint8)

# Renkli şekiller çiz
cv2.rectangle(img, (50, 50), (150, 150), (0, 255, 0), -1)  # Yeşil kare
cv2.circle(img, (300, 100), 50, (255, 0, 0), -1)  # Mavi daire
cv2.line(img, (0, 200), (400, 200), (0, 0, 255), 3)  # Kırmızı çizgi

# Metin ekle
cv2.putText(img, 'OpenCV Test', (50, 250), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

# Matplotlib ile görüntüyü göster
plt.figure(figsize=(10, 6))
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.title('OpenCV ile Oluşturulan Görüntü')
plt.axis('off')
plt.show()

# Histogram oluşturma
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
hist = cv2.calcHist([gray], [0], None, [256], [0, 256])

plt.figure(figsize=(8, 5))
plt.plot(hist)
plt.title('Görüntü Histogramı')
plt.xlabel('Piksel Değeri')
plt.ylabel('Piksel Sayısı')
plt.show()

# Blur efekti
blurred = cv2.GaussianBlur(img, (15, 15), 0)

plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.title('Orijinal')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(cv2.cvtColor(blurred, cv2.COLOR_BGR2RGB))
plt.title('Bulanık')
plt.axis('off')
plt.show()

print("OpenCV görüntü işleme örnekleri tamamlandı!")
'''
    }
    
    # Dosyaları oluştur
    for file_info in sample_files:
        file_path = user_files_dir / file_info['path']
        content = sample_contents.get(file_info['name'], '# Yeni Python dosyası\nprint("Merhaba!")')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    # Index dosyasını kaydet
    save_user_files_index(user_id, {'files': sample_files})

# Güvenli kod çalıştırma
ALLOWED_IMPORTS = {
    'numpy', 'pandas', 'matplotlib', 'seaborn', 'plotly', 
    'flask', 'requests', 'beautifulsoup4', 'bs4',
    'discord', 'telebot', 'python-telegram-bot',
    'pillow', 'PIL', 'cv2', 'opencv', 'opencv-python',
    'sqlite3', 'json', 'datetime', 'os', 'sys', 'math',
    'random', 'time', 'collections', 're', 'itertools',
    'turtle', 'tkinter', 'pygame', 'pgzero', 'skimage',
    'scipy', 'scikit-learn', 'sklearn'
}

def execute_python_code(code, timeout=30):
    """Python kodunu güvenli şekilde çalıştır"""
    try:
        # Geçici dosya oluştur
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as temp_file:
            # Matplotlib ve OpenCV display ayarları
            setup_code = '''
import os
import sys
import warnings
warnings.filterwarnings('ignore')

# Matplotlib interactive backend
try:
    import matplotlib
    matplotlib.use('TkAgg')  # GUI backend for multiple windows
    import matplotlib.pyplot as plt
    plt.ion()  # Interactive mode on
    
    # Her plt.show() çağrısını override et
    _original_show = plt.show
    def custom_show(*args, **kwargs):
        try:
            # Non-blocking gösterim
            _original_show(block=False)
            import time
            import threading
            
            # Aktif figürleri topla
            figs = [plt.figure(i) for i in plt.get_fignums()]
            
            for fig in figs:
                if hasattr(fig, 'canvas') and hasattr(fig.canvas, 'manager'):
                    try:
                        window = fig.canvas.manager.window
                        if window:
                            # Pencereyi sabitle ve focus yap
                            window.wm_attributes('-topmost', 1)
                            time.sleep(0.1)
                            window.wm_attributes('-topmost', 0)
                            window.focus_force()
                            window.lift()
                            
                            print(f"[📊 Grafik penceresi açıldı ve sabitlendi - Figure {fig.number}]")
                            print("[📊 Grafik penceresini kapatmak için X butonuna tıklayın]")
                            
                            # Event loop'u başlat (non-blocking)
                            def run_event_loop():
                                try:
                                    while window.winfo_exists():
                                        window.update()
                                        time.sleep(0.01)
                                except:
                                    pass
                            
                            thread = threading.Thread(target=run_event_loop, daemon=True)
                            thread.start()
                            
                    except Exception as e:
                        print(f"[⚠️ Pencere ayarları hatası: {e}]")
                        
        except Exception as e:
            print(f"[⚠️ Show override error: {e}]")
            _original_show(*args, **kwargs)
    plt.show = custom_show
except Exception as e:
    print(f"Matplotlib setup error: {e}")
    pass

# OpenCV display ayarları
try:
    import cv2
    
    # Her cv2.imshow çağrısı için ayrı pencere
    _original_imshow = cv2.imshow
    _window_count = 0
    def custom_imshow(winname, mat):
        global _window_count
        _window_count += 1
        unique_name = f"{winname}_{_window_count}"
        cv2.namedWindow(unique_name, cv2.WINDOW_NORMAL)
        result = _original_imshow(unique_name, mat)
        print(f"[OpenCV penceresi açıldı: {unique_name}]")
        return result
    cv2.imshow = custom_imshow
    
    # waitKey override - pencereyi kalıcı aç
    _original_waitKey = cv2.waitKey
    def custom_waitKey(delay=0):
        # Pencereyi sürekli açık tut
        print("[📷 OpenCV penceresi açıldı - Kapatmak için pencerenin X butonuna tıklayın]")
        print("[📷 Veya herhangi bir tuşa basarak devam edin]")
        
        # Gerçek waitKey davranışı - kullanıcı müdahalesini bekle
        if delay == 0:
            # Süresiz bekle - kullanıcı tuşa basana kadar
            return _original_waitKey(0)
        else:
            # Belirtilen süre kadar bekle
            return _original_waitKey(max(delay, 1000))  # Minimum 1 saniye
    cv2.waitKey = custom_waitKey
except:
    pass

# Turtle ekranını açık tutma
try:
    import turtle
    
    # Turtle ekranını override et
    _original_done = turtle.done
    def custom_done():
        try:
            screen = turtle.Screen()
            window = screen.getcanvas().winfo_toplevel()
            
            # Pencereyi sabitle
            window.wm_attributes('-topmost', 1)
            window.wm_attributes('-topmost', 0)
            window.focus_force()
            window.lift()
            
            print("[🐢 Turtle ekranı açıldı ve sabitlendi]")
            print("[🐢 Kapatmak için ekrana tıklayın veya X butonunu kullanın]")
            
            # Kapatma butonunu aktif et
            def on_close():
                try:
                    screen.bye()
                except:
                    pass
            
            window.protocol("WM_DELETE_WINDOW", on_close)
            
            # Tıklama ile kapatma
            screen.exitonclick()
            
        except Exception as e:
            print(f"[🐢 Turtle setup error: {e}]")
            _original_done()
            
    turtle.done = custom_done
    
    # Otomatik turtle.done() ekleme
    import sys
    original_exit = sys.exit
    def custom_exit(*args, **kwargs):
        try:
            # Eğer turtle screen açıksa, bekle
            screen = turtle.Screen()
            print("[🐢 Program bitince Turtle ekranı açık kalacak]")
            screen.exitonclick()
        except:
            pass
        original_exit(*args, **kwargs)
    sys.exit = custom_exit
    
    # Turtle'ın otomatik kapatılmasını engelle
    def keep_turtle_open():
        screen = turtle.Screen()
        screen.mainloop()  # Sürekli açık tut
    
    # Turtle kodunun sonuna otomatik ekleme
    original_tracer = turtle.tracer
    def custom_tracer(*args, **kwargs):
        result = original_tracer(*args, **kwargs)
        # Çizim bittiğinde ekranı açık tut
        return result
    turtle.tracer = custom_tracer
except:
    pass

# Pygame Zero ekran açma
try:
    import pgzrun
    
    # pgzrun.go() override'ı
    _original_go = pgzrun.go
    def custom_go(*args, **kwargs):
        print("[🎮 Pygame Zero oyunu başlatılıyor...]")
        print("[🎮 Oyun penceresini kapatmak için X butonuna tıklayın]")
        
        # Pencere ayarları
        try:
            import pygame
            pygame.display.set_caption("Pygame Zero Oyun")
            
            # Normal go() fonksiyonunu çalıştır
            result = _original_go(*args, **kwargs)
            
            print("[🎮 Pygame Zero oyunu başarıyla açıldı]")
            return result
        except Exception as e:
            print(f"[🎮 Pygame Zero setup error: {e}]")
            return _original_go(*args, **kwargs)
    
    pgzrun.go = custom_go
except:
    pass

# Plotly tarayıcı açma
try:
    import plotly.graph_objects as go
    import plotly.offline as pyo
    
    # plotly.show() override'ı
    _original_show_plotly = go.Figure.show
    def custom_show_plotly(self, *args, **kwargs):
        print("[📊 Plotly grafiği tarayıcıda açılıyor...]")
        print("[📊 İnteraktif grafiği tarayıcıda görüntüleyebilirsiniz]")
        
        try:
            # Tarayıcıda aç
            import webbrowser
            import tempfile
            import os
            
            # HTML dosyası oluştur
            html_content = pyo.plot(self, output_type='div', include_plotlyjs=True)
            
            # Temp dizininde statik dosya oluştur
            temp_dir = tempfile.gettempdir()
            temp_filename = f"plotly_graph_{int(time.time())}.html"
            temp_path = os.path.join(temp_dir, temp_filename)
            
            html_template = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Plotly Grafik</title>
</head>
<body>
    <h1>Python Editör - Plotly Grafik</h1>
    {html_content}
</body>
</html>"""
            
            with open(temp_path, 'w', encoding='utf-8') as f:
                f.write(html_template)
            
            # Tarayıcıda aç
            webbrowser.open('file://' + os.path.abspath(temp_path))
            print(f"[📊 Plotly grafiği açıldı: {temp_path}]")
            
        except Exception as e:
            print(f"[❌ Plotly hatası: {e}]")
            import traceback
            traceback.print_exc()
            # Fallback - normal show
            return _original_show_plotly(self, *args, **kwargs)
    
    go.Figure.show = custom_show_plotly
except:
    pass

# Bokeh tarayıcı açma
try:
    from bokeh.plotting import show as bokeh_show
    from bokeh.io import output_file
    
    # bokeh.show() override'ı
    _original_show_bokeh = bokeh_show
    def custom_show_bokeh(obj, *args, **kwargs):
        print("[📊 Bokeh dashboard tarayıcıda açılıyor...]")
        print("[📊 İnteraktif dashboard'u tarayıcıda görüntüleyebilirsiniz]")
        
        try:
            import tempfile
            import webbrowser
            import os
            
            # Geçici HTML dosyası
            with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
                temp_path = f.name
            
            # HTML çıktısı ayarla
            output_file(temp_path, title="Python Editör - Bokeh Dashboard")
            
            # Normal show fonksiyonunu çalıştır
            result = _original_show_bokeh(obj, *args, **kwargs)
            
            # Tarayıcıda aç
            webbrowser.open('file://' + os.path.abspath(temp_path))
            print(f"[📊 Bokeh dashboard açıldı: {temp_path}]")
            
            return result
            
        except Exception as e:
            print(f"[📊 Bokeh browser error: {e}]")
            # Fallback - normal show
            return _original_show_bokeh(obj, *args, **kwargs)
    
    # Global import'u değiştir
    import sys
    if 'bokeh.plotting' in sys.modules:
        sys.modules['bokeh.plotting'].show = custom_show_bokeh
except:
    pass

'''
            temp_file.write(setup_code + code)
            temp_file_path = temp_file.name

        # Kodu çalıştır - Windows'ta encoding sorunlarını çöz
        start_time = time.time()
        
        # Windows için özel encoding ayarı ve TensorFlow ayarları
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        env['TF_CPP_MIN_LOG_LEVEL'] = '2'  # TensorFlow log seviyesini azalt (0=tümü, 1=info, 2=warning, 3=error)
        env['TF_ENABLE_ONEDNN_OPTS'] = '0'  # oneDNN optimizasyonlarını kapat
        env['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'  # Pygame mesajını gizle
        env['SDL_VIDEODRIVER'] = 'dummy'  # SDL video driver'ını dummy yap
        
        result = subprocess.run(
            [sys.executable, temp_file_path],
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding='utf-8',
            errors='replace',  # Encoding hatalarını atla
            env=env
        )
        execution_time = time.time() - start_time

        # Geçici dosyayı sil
        os.unlink(temp_file_path)

        # Çıktıyı temizle
        output = result.stdout.strip() if result.stdout else ''
        error = result.stderr.strip() if result.stderr else ''
        
        # Uyarıları, TensorFlow ve Pygame bilgi mesajlarını filtrele
        if error:
            error_lines = error.split('\n')
            filtered_errors = []
            for line in error_lines:
                # TensorFlow bilgi mesajlarını filtrele
                if any(skip in line for skip in [
                    'oneDNN custom operations are on',
                    'This TensorFlow binary is optimized',
                    'To enable the following instructions',
                    'tensorflow/core/platform/cpu_feature_guard',
                    'tensorflow/core/util/port.cc',
                    'I tensorflow/',
                    'W tensorflow/'
                ]):
                    continue
                # Diğer uyarıları filtrele
                if not any(skip in line.lower() for skip in ['warning', 'deprecated', 'futurewarning']):
                    filtered_errors.append(line)
            error = '\n'.join(filtered_errors).strip()
        
        # Output'tan Pygame mesajlarını filtrele
        if output:
            output_lines = output.split('\n')
            filtered_output = []
            for line in output_lines:
                # Pygame mesajlarını filtrele
                if any(skip in line for skip in [
                    'pygame',
                    'SDL',
                    'Hello from the pygame community',
                    'https://www.pygame.org'
                ]):
                    continue
                filtered_output.append(line)
            output = '\n'.join(filtered_output).strip()

        success = result.returncode == 0
        response_data = {
            'success': success,
            'output': output,
            'error': error if error else None,
            'execution_time': execution_time
        }
        
        return response_data

    except subprocess.TimeoutExpired:
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        return {
            'success': False,
            'output': '',
            'error': f'Kod çalıştırma süresi {timeout} saniyeyi aştı',
            'execution_time': timeout
        }
    except Exception as e:
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        return {
            'success': False,
            'output': '',
            'error': str(e),
            'execution_time': 0
        }

# API Routes

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({
            'success': False,
            'message': 'Tüm alanları doldurun'
        }), 400

    # Kullanıcı zaten var mı kontrol et
    if db.check_username_exists(username):
        return jsonify({
            'success': False,
            'message': 'Bu kullanıcı adı zaten alınmış'
        }), 400

    if db.check_email_exists(email):
        return jsonify({
            'success': False,
            'message': 'Bu e-posta adresi zaten kayıtlı'
        }), 400

    # Yeni kullanıcı oluştur
    user_id = str(uuid.uuid4())
    user_data = {
        'id': user_id,
        'username': username,
        'email': email,
        'password': hash_password(password),
        'created_at': datetime.now().isoformat()
    }

    try:
        db.create_user(user_data)
        get_user_files_dir(user_id)  # Kullanıcı dizini oluştur

        # Oturum başlat
        session['user_id'] = user_id

        return jsonify({
            'success': True,
            'data': {
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email,
                    'created_at': user_data['created_at']
                }
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Kullanıcı oluşturulamadı'
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({
            'success': False,
            'message': 'Kullanıcı adı ve şifre gerekli'
        }), 400

    # Kullanıcıyı bul
    user = db.get_user_by_username(username)
    
    if not user or user['password_hash'] != hash_password(password):
        return jsonify({
            'success': False,
            'message': 'Geçersiz kullanıcı adı veya şifre'
        }), 401

    # Oturum başlat
    session['user_id'] = user['id']

    return jsonify({
        'success': True,
        'data': {
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'created_at': user['created_at']
            }
        }
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True})

@app.route('/api/auth/account', methods=['DELETE'])
def delete_account():
    """Kullanıcı hesabını ve tüm verilerini sil"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401
    
    try:
        # Kullanıcının tüm dosyalarını sil
        user_files = db.get_user_files(user_id)
        for file_data in user_files:
            db.delete_file(file_data['id'])
        
        # Kullanıcıyı sil
        db.delete_user(user_id)
        
        # Oturumu temizle
        session.clear()
        
        return jsonify({
            'success': True, 
            'message': 'Hesabınız ve tüm verileriniz başarıyla silindi'
        })
        
    except Exception as e:
        print(f"❌ Account deletion error: {e}")
        return jsonify({
            'success': False, 
            'message': 'Hesap silinirken bir hata oluştu'
        }), 500

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            'success': False,
            'message': 'Oturum açılmamış'
        }), 401

    user = db.get_user_by_id(user_id)
    
    if not user:
        return jsonify({
            'success': False,
            'message': 'Kullanıcı bulunamadı'
        }), 404

    return jsonify({
        'success': True,
        'data': {
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'created_at': user['created_at']
            }
        }
    })

@app.route('/api/files', methods=['GET'])
def get_files():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    try:
        # Query parameter'dan proje ID'sini al
        project_id = request.args.get('project_id')
        
        if project_id:
            # Belirli bir proje için dosyalar + proje kendisi
            # Debug: Getting files for project
            
            # Önce proje sahibi mi kontrol et
            project_info = db.get_file_by_id(project_id)
            if not project_info or project_info['user_id'] != user_id:
                print(f"❌ Backend: Project {project_id} not found or unauthorized")
                return jsonify({'success': False, 'message': 'Proje bulunamadı'}), 404
            
            # Sadece bu projeye ait dosyaları al
            project_files = db.get_project_files(project_id)
            
            # Ana proje klasörü + proje içindeki dosyalar (duplicate kontrol)
            all_files = [project_info]
            
            # project_files'ta zaten proje klasörü varsa ekleme
            for pf in project_files:
                if pf['id'] != project_id:  # Proje kendisi değilse ekle
                    all_files.append(pf)
            
            # Debug: Returning files
            # Debug: Files being returned
            
            return jsonify({
                'success': True,
                'data': {'files': all_files}
            })
        else:
            # Tüm dosyalar (projelerim sayfası için)
            # Debug: Getting all user files
            files = db.get_user_files(user_id)
            return jsonify({
                'success': True,
                'data': {'files': files}
            })
    except Exception as e:
        print(f"❌ Backend error: {e}")
        return jsonify({
            'success': False,
            'message': 'Dosyalar yüklenemedi'
        }), 500

@app.route('/api/files', methods=['POST'])
def create_file():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    data = request.get_json()
    name = data.get('name')
    file_type = data.get('type', 'file')
    content = data.get('content', '')
    parent_id = data.get('parent_id')
    language = data.get('language', 'python')

    if not name:
        return jsonify({'success': False, 'message': 'Dosya adı gerekli'}), 400

    # Yeni dosya bilgisi
    file_id = str(uuid.uuid4())
    
    # Path oluştur (recursive parent path building)
    def build_full_path(parent_id: str, filename: str) -> str:
        if not parent_id:
            return filename
        
        parent = db.get_file_by_id(parent_id)
        if not parent:
            return filename
            
        if parent['parent_id']:
            # Recursive path building
            return f"{parent['path']}/{filename}"
        else:
            # Direct child of root or project
            return f"{parent['name']}/{filename}"
    
    if parent_id:
        file_path = build_full_path(parent_id, name)
    else:
        file_path = name
    
    # project_id'yi düzgün hesapla
    project_id = None
    if parent_id:
        parent = db.get_file_by_id(parent_id)
        if parent:
            if parent['type'] == 'project':
                project_id = parent['id']
            elif parent['project_id']:
                project_id = parent['project_id']
    
    file_data = {
        'id': file_id,
        'user_id': user_id,
        'project_id': project_id,
        'name': name,
        'type': file_type,
        'path': file_path,
        'content': content,
        'parent_id': parent_id,
        'language': language,
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }

    try:
        # SQLite'a kaydet
        db.create_file(file_data)
        
        # Dosyayı diskde oluştur
        user_files_dir = get_user_files_dir(user_id)
        disk_file_path = user_files_dir / file_path
        
        if file_type == 'file':
            disk_file_path.parent.mkdir(parents=True, exist_ok=True)
            with open(disk_file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        else:  # folder or project
            disk_file_path.mkdir(parents=True, exist_ok=True)

        return jsonify({
            'success': True,
            'data': {'file': file_data}
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Dosya oluşturulamadı'
        }), 500

@app.route('/api/projects', methods=['POST'])
def create_project():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    data = request.get_json()
    project_name = data.get('name')
    project_type = data.get('type', 'python')

    if not project_name:
        return jsonify({'success': False, 'message': 'Proje adı gerekli'}), 400

    try:
        # Proje ID'si
        project_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        # Ana proje klasörü verisi
        project_data = {
            'id': project_id,
            'user_id': user_id,
            'name': project_name,
            'type': project_type,
            'created_at': now,
            'updated_at': now
        }
        
        project_file_data = {
            'id': project_id,
            'user_id': user_id,
            'project_id': project_id,
            'name': project_name,
            'type': 'project',
            'path': project_name,
            'content': '',
            'parent_id': None,
            'created_at': now,
            'updated_at': now
        }
        
        # SQLite'a kaydet
        db.create_project(project_data)
        db.create_file(project_file_data)
        
        # SADECE main.py oluştur - başka hiçbir dosya oluşturma
        main_file_id = str(uuid.uuid4())
        main_content = f'# {project_name} Projesi\nprint("Merhaba {project_name}!")\n'
        
        main_file_data = {
            'id': main_file_id,
            'user_id': user_id,
            'project_id': project_id,
            'name': 'main.py',
            'type': 'file',
            'path': f"{project_name}/main.py",
            'content': main_content,
            'parent_id': project_id,
            'created_at': now,
            'updated_at': now
        }
        
        print(f"✅ Creating ONLY main.py for project {project_name}")
        db.create_file(main_file_data)
        
        # Disk'te oluştur
        user_files_dir = get_user_files_dir(user_id)
        project_dir = user_files_dir / project_name
        project_dir.mkdir(exist_ok=True)
        
        main_file_path = project_dir / 'main.py'
        with open(main_file_path, 'w', encoding='utf-8') as f:
            f.write(main_content)
        
        return jsonify({
            'success': True,
            'data': {
                'project': project_file_data,
                'main_file': main_file_data
            },
            'message': f'Proje "{project_name}" oluşturuldu'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Proje oluşturulamadı'
        }), 500

@app.route('/api/files/<file_id>/download', methods=['GET'])
def download_file(file_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    file_info = db.get_file_by_id(file_id)

    if not file_info or file_info['user_id'] != user_id:
        return jsonify({'success': False, 'message': 'Dosya bulunamadı'}), 404

    if file_info['type'] == 'folder' or file_info['type'] == 'project':
        return jsonify({'success': False, 'message': 'Klasörler indirilemez'}), 400

    # Dosya içeriği
    user_files_dir = get_user_files_dir(user_id)
    file_path = user_files_dir / file_info['path']
    
    if not file_path.exists():
        return jsonify({'success': False, 'message': 'Dosya bulunamadı'}), 404

    try:
        from flask import send_file
        return send_file(
            file_path,
            as_attachment=True,
            download_name=file_info['name']
        )
    except Exception as e:
        return jsonify({'success': False, 'message': 'Dosya indirilemedi'}), 500

@app.route('/api/files/<file_id>', methods=['GET'])
def get_file_content(file_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    file_info = db.get_file_by_id(file_id)

    if not file_info or file_info['user_id'] != user_id:
        return jsonify({'success': False, 'message': 'Dosya bulunamadı'}), 404

    if file_info['type'] == 'folder' or file_info['type'] == 'project':
        return jsonify({'success': False, 'message': 'Klasörün içeriği okunamaz'}), 400

    # Önce SQLite'dan kontrol et
    if file_info['content']:
        content = file_info['content']
    else:
        # Disk'ten oku
        user_files_dir = get_user_files_dir(user_id)
        file_path = user_files_dir / file_info['path']
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            content = ''

    return jsonify({
        'success': True,
        'data': {'content': content}
    })

@app.route('/api/files/<file_id>', methods=['PUT'])
def update_file_content(file_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    data = request.get_json()
    content = data.get('content', '')

    file_info = db.get_file_by_id(file_id)

    if not file_info or file_info['user_id'] != user_id:
        return jsonify({'success': False, 'message': 'Dosya bulunamadı'}), 404

    try:
        # SQLite'da güncelle
        db.update_file_content(file_id, content)
        
        # Disk'te güncelle
        user_files_dir = get_user_files_dir(user_id)
        file_path = user_files_dir / file_info['path']
        
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Dosya güncellenemedi'}), 500

@app.route('/api/files/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    file_info = db.get_file_by_id(file_id)

    if not file_info or file_info['user_id'] != user_id:
        return jsonify({'success': False, 'message': 'Dosya bulunamadı'}), 404

    try:
        # Disk'ten sil
        user_files_dir = get_user_files_dir(user_id)
        file_path = user_files_dir / file_info['path']
        
        if file_path.exists():
            if file_info['type'] == 'folder' or file_info['type'] == 'project':
                shutil.rmtree(file_path)
            else:
                file_path.unlink()

        # Proje siliniyorsa projects tablosundan da sil
        if file_info['type'] == 'project':
            db.delete_project(file_id)
        else:
            # Normal dosya/klasör silme (recursive)
            db.delete_file(file_id)

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Dosya silinemedi'}), 500

@app.route('/api/files/<file_id>/rename', methods=['PUT'])
def rename_file(file_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    data = request.get_json()
    new_name = data.get('name')

    if not new_name:
        return jsonify({'success': False, 'message': 'Yeni dosya adı gerekli'}), 400

    file_info = db.get_file_by_id(file_id)

    if not file_info or file_info['user_id'] != user_id:
        return jsonify({'success': False, 'message': 'Dosya bulunamadı'}), 404

    try:
        # Disk'te yeniden adlandır
        user_files_dir = get_user_files_dir(user_id)
        old_path = user_files_dir / file_info['path']
        
        # Yeni path oluştur
        if file_info['parent_id']:
            parent = db.get_file_by_id(file_info['parent_id'])
            if parent:
                new_path_str = f"{parent['path']}/{new_name}"
            else:
                new_path_str = new_name
        else:
            new_path_str = new_name
            
        new_path = user_files_dir / new_path_str
        
        if old_path.exists():
            old_path.rename(new_path)

        # SQLite'da güncelle
        db.rename_file(file_id, new_name)

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Dosya yeniden adlandırılamadı'}), 500

def execute_html_code(html_code):
    """HTML kodunu tarayıcıda çalıştır"""
    try:
        import webbrowser
        import tempfile
        import os
        
        # HTML dosyası oluştur
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as temp_file:
            temp_file.write(html_code)
            temp_file_path = temp_file.name

        # Tarayıcıda aç
        webbrowser.open('file://' + os.path.abspath(temp_file_path))
        
        return {
            'success': True,
            'output': f'HTML sayfası tarayıcıda açıldı: {os.path.basename(temp_file_path)}',
            'error': None,
            'execution_time': 0.1
        }
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e),
            'execution_time': 0
        }

def execute_css_code(css_code):
    """CSS kodunu örnek HTML ile birlikte göster"""
    try:
        import webbrowser
        import tempfile
        import os
        
        # CSS'i HTML'e entegre et
        html_content = f"""<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Önizleme</title>
    <style>
{css_code}
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS Önizleme</h1>
        <p class="text">Bu bir örnek metin paragrafıdır.</p>
        <button class="btn">Örnek Buton</button>
        <div class="box">Örnek Kutu</div>
        <ul class="list">
            <li>Liste Öğesi 1</li>
            <li>Liste Öğesi 2</li>
            <li>Liste Öğesi 3</li>
        </ul>
    </div>
</body>
</html>"""
        
        # HTML dosyası oluştur
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as temp_file:
            temp_file.write(html_content)
            temp_file_path = temp_file.name

        # Tarayıcıda aç
        webbrowser.open('file://' + os.path.abspath(temp_file_path))
        
        return {
            'success': True,
            'output': f'CSS önizlemesi tarayıcıda açıldı: {os.path.basename(temp_file_path)}',
            'error': None,
            'execution_time': 0.1
        }
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e),
            'execution_time': 0
        }

def execute_javascript_code(js_code):
    """JavaScript kodunu HTML'e entegre ederek çalıştır"""
    try:
        import webbrowser
        import tempfile
        import os
        
        # JavaScript'i HTML'e entegre et
        html_content = f"""<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Çalıştırma</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        #output {{ border: 1px solid #ccc; padding: 10px; margin-top: 20px; min-height: 100px; }}
        button {{ padding: 10px 20px; margin: 5px; cursor: pointer; }}
    </style>
</head>
<body>
    <h1>JavaScript Çalıştırma</h1>
    <button onclick="runCode()">Kodu Çalıştır</button>
    <button onclick="clearOutput()">Temizle</button>
    <div id="output"></div>
    
    <script>
        // Console.log override
        const originalLog = console.log;
        console.log = function(...args) {{
            const output = document.getElementById('output');
            output.innerHTML += args.join(' ') + '<br>';
            originalLog.apply(console, args);
        }};
        
        function clearOutput() {{
            document.getElementById('output').innerHTML = '';
        }}
        
        function runCode() {{
            try {{
                clearOutput();
                {js_code}
            }} catch (error) {{
                console.log('Hata: ' + error.message);
            }}
        }}
        
        // Sayfa yüklendiğinde kodu otomatik çalıştır
        window.onload = function() {{
            runCode();
        }};
    </script>
</body>
</html>"""
        
        # HTML dosyası oluştur
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as temp_file:
            temp_file.write(html_content)
            temp_file_path = temp_file.name

        # Tarayıcıda aç
        webbrowser.open('file://' + os.path.abspath(temp_file_path))
        
        return {
            'success': True,
            'output': f'JavaScript kodu tarayıcıda çalıştırılıyor: {os.path.basename(temp_file_path)}',
            'error': None,
            'execution_time': 0.1
        }
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e),
            'execution_time': 0
        }

@app.route('/api/execute', methods=['POST'])
def execute_code():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Oturum açılmamış'}), 401

    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'python')
    
    # Debug: Execute request

    if not code.strip():
        return jsonify({'success': False, 'message': 'Kod boş olamaz'}), 400

    # Dile göre kodu çalıştır
    if language == 'python':
        result = execute_python_code(code)
    elif language == 'html':
        result = execute_html_code(code)
    elif language == 'css':
        result = execute_css_code(code)
    elif language == 'javascript':
        result = execute_javascript_code(code)
    else:
        result = {
            'success': False,
            'output': '',
            'error': f'Desteklenmeyen dil: {language}',
            'execution_time': 0
        }

    return jsonify({
        'success': True,
        'data': result
    })

if __name__ == '__main__':
    print("🐍 Python Web Editor Backend başlatılıyor...")
    print("📁 Proje dizini:", BASE_DIR)
    print("👥 Kullanıcı verileri:", USERS_DIR)
    print("📂 Dosya verileri:", FILES_DIR)
    print("🌐 Server: http://localhost:8000")
    
    # Debug mode'u kapatarak gereksiz reload'ları önle
    app.run(debug=False, host='0.0.0.0', port=8000, use_reloader=False)
