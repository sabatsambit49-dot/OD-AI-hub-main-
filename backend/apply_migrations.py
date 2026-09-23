import sys
import os
import sqlite3

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from app.database.base import Base
from app.database.session import engine, settings
import app.models  # load all models

print(f"Connecting to database: {settings.DATABASE_URL}")

# 1. Create all newly defined tables if they don't exist
Base.metadata.create_all(bind=engine)
print("Base.metadata.create_all completed.")

# 2. Add missing columns to courses table if on SQLite
if settings.DATABASE_URL.startswith("sqlite"):
    db_file = settings.DATABASE_URL.replace("sqlite:///", "")
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    existing_cols = [r[1] for r in cursor.execute("PRAGMA table_info(courses)").fetchall()]
    print(f"Existing columns in courses: {existing_cols}")

    columns_to_add = [
        ("title", "VARCHAR(250)"),
        ("slug", "VARCHAR(200)"),
        ("category_id", "INTEGER REFERENCES academy_categories(id) ON DELETE SET NULL"),
        ("group_label", "VARCHAR(100)"),
        ("target_audience", "TEXT"),
        ("duration_value", "INTEGER"),
        ("duration_unit", "VARCHAR(50) DEFAULT 'weeks'"),
        ("mode", "VARCHAR(50) DEFAULT 'online'"),
        ("price", "NUMERIC(10,2) DEFAULT 0.00"),
        ("discount_price", "NUMERIC(10,2)"),
        ("currency", "VARCHAR(10) DEFAULT 'INR'"),
        ("is_free", "BOOLEAN DEFAULT 0"),
        ("batch_size", "INTEGER"),
        ("short_description", "TEXT"),
        ("full_description", "TEXT"),
        ("highlights", "JSON DEFAULT '[]'"),
        ("prerequisites", "TEXT"),
        ("start_date", "DATETIME"),
        ("certificate_included", "BOOLEAN DEFAULT 1"),
        ("image_url", "VARCHAR(500)"),
        ("is_featured", "BOOLEAN DEFAULT 0"),
        ("status", "VARCHAR(50) DEFAULT 'draft'"),
        ("display_order", "INTEGER DEFAULT 0"),
        ("updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP")
    ]

    for col_name, col_type in columns_to_add:
        if col_name not in existing_cols:
            try:
                sql = f"ALTER TABLE courses ADD COLUMN {col_name} {col_type}"
                cursor.execute(sql)
                print(f"Added column {col_name} to courses.")
            except Exception as e:
                print(f"Column {col_name} error: {e}")

    # Create index on slug if not existing
    try:
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_courses_slug ON courses(slug);")
    except Exception as e:
        print(f"Index creation note: {e}")

    # Set title = name for existing records if null
    cursor.execute("UPDATE courses SET title = name WHERE title IS NULL AND name IS NOT NULL;")
    cursor.execute("UPDATE courses SET name = title WHERE name IS NULL AND title IS NOT NULL;")

    conn.commit()
    conn.close()
    print("Courses table migration verified successfully.")
