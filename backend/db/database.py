import sqlite3
import os

# Sets up database.db in the exact same directory as this file
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table to handle the raw data + survival checklists + empty AI spots
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sos_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            name TEXT NOT NULL,
            message TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            needs_food BOOLEAN,
            needs_water BOOLEAN,
            needs_clothes BOOLEAN,
            needs_medicine BOOLEAN,
            needs_powerbank BOOLEAN,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ai_priority_score INTEGER,
            isro_flood_risk TEXT,
            ai_triage_summary TEXT
        )
    ''')

    # B-Tree Composite Index to make deduplication O(log n) lookups during mass uploads
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_device_time 
        ON sos_messages (device_id, timestamp)
    ''')

    conn.commit()
    conn.close()
    print(f"✅ SQLite Schema initialized at: {DB_PATH}")

if __name__ == "__main__":
    init_db()