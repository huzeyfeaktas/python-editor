import sqlite3
import os

# Data klasörünü oluştur
os.makedirs('data', exist_ok=True)

# Veritabanı bağlantısı
conn = sqlite3.connect('data/database.db')
cursor = conn.cursor()

# Users tablosu
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Projects tablosu
cursor.execute('''
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'python',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
''')

# Files tablosu
cursor.execute('''
    CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        path TEXT NOT NULL,
        content TEXT DEFAULT '',
        parent_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (parent_id) REFERENCES files(id)
    )
''')

# Indexler
cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)')

conn.commit()
conn.close()

print("✅ Veritabanı tabloları oluşturuldu!")
