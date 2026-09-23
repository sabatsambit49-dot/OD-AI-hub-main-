import sqlite3

try:
    conn = sqlite3.connect('edutrack.db')
    cursor = conn.cursor()
    cursor.execute('ALTER TABLE academic_years ADD COLUMN college_name VARCHAR')
    conn.commit()
    print("Migration successful: added college_name to academic_years")
except Exception as e:
    print(f"Migration failed or already applied: {e}")
finally:
    conn.close()
