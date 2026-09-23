import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "edutrack.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Rebuilding courses table in SQLite to make institution_id nullable...")

cursor.execute("PRAGMA foreign_keys=OFF;")

# Check existing records count
count = cursor.execute("SELECT count(*) FROM courses").fetchone()[0]
print(f"Existing courses count: {count}")

# Create new table schema with institution_id nullable
create_sql = """
CREATE TABLE courses_new (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR,
    title VARCHAR(250),
    slug VARCHAR(200),
    category_id INTEGER REFERENCES academy_categories(id) ON DELETE SET NULL,
    group_label VARCHAR(100),
    target_audience TEXT,
    duration_value INTEGER,
    duration_unit VARCHAR(50) DEFAULT 'weeks',
    mode VARCHAR(50) DEFAULT 'online',
    price NUMERIC(10,2) DEFAULT 0.00,
    discount_price NUMERIC(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    is_free BOOLEAN DEFAULT 0,
    batch_size INTEGER,
    description TEXT,
    short_description TEXT,
    full_description TEXT,
    highlights JSON,
    prerequisites TEXT,
    start_date DATETIME,
    certificate_included BOOLEAN DEFAULT 1,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""
cursor.execute(create_sql)

# Copy data from courses to courses_new
cursor.execute("""
INSERT INTO courses_new (id, institution_id, name, title, slug, category_id, group_label, target_audience,
    duration_value, duration_unit, mode, price, discount_price, currency, is_free, batch_size, description,
    short_description, full_description, highlights, prerequisites, start_date, certificate_included,
    image_url, is_featured, status, display_order, created_at, updated_at)
SELECT id, institution_id, name, title, slug, category_id, group_label, target_audience,
    duration_value, duration_unit, mode, price, discount_price, currency, is_free, batch_size, description,
    short_description, full_description, highlights, prerequisites, start_date, certificate_included,
    image_url, is_featured, status, display_order, created_at, updated_at
FROM courses;
""")

cursor.execute("DROP TABLE courses;")
cursor.execute("ALTER TABLE courses_new RENAME TO courses;")
cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_courses_slug ON courses(slug);")
cursor.execute("CREATE INDEX IF NOT EXISTS ix_courses_category_id ON courses(category_id);")

cursor.execute("PRAGMA foreign_keys=ON;")
conn.commit()

new_count = cursor.execute("SELECT count(*) FROM courses").fetchone()[0]
print(f"Courses table rebuilt successfully. Preserved {new_count} records.")
conn.close()
