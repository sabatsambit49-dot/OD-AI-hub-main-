"""
SQLite to PostgreSQL Data Transfer Script for OD AI HUB / EduTrack

Usage:
    python backend/scripts/migrate_sqlite_to_postgres.py --postgres-url postgresql://postgres:postgrespassword@localhost:5432/edutrack

Prerequisites:
    1. PostgreSQL server running (e.g. via docker compose up -d)
    2. Target schema initialized via alembic:
       cd backend
       DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/edutrack" alembic upgrade head
"""

import sys
import os
import argparse
import sqlite3
from sqlalchemy import create_engine, text

# Ordered tables respecting foreign key hierarchy
TABLE_ORDER = [
    "states",
    "districts",
    "institution_types",
    "institutions",
    "academy_categories",
    "courses",
    "branches",
    "academic_years",
    "syllabus_entries",
    "events",
    "information_posts",
    "coaching_centers",
    "coaching_courses",
    "course_matrix_colleges",
    "problem_statements",
    "users",
    "session_tokens",
    "enquiries",
    "stats",
    "testimonials",
    "faqs"
]

def migrate(sqlite_path: str, pg_url: str):
    if not os.path.exists(sqlite_path):
        print(f"Error: SQLite file not found at {sqlite_path}")
        sys.exit(1)

    print(f"Source SQLite: {sqlite_path}")
    print(f"Target PostgreSQL: {pg_url}")

    sqlite_conn = sqlite3.connect(sqlite_path)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cur = sqlite_conn.cursor()

    pg_engine = create_engine(pg_url)

    with pg_engine.connect() as pg_conn:
        # Disable foreign key checks / defer constraints during bulk copy
        trans = pg_conn.begin()
        try:
            for table_name in TABLE_ORDER:
                # Check if table exists in SQLite
                check_src = sqlite_cur.execute(
                    "SELECT count(*) FROM sqlite_master WHERE type='table' AND name=?",
                    (table_name,)
                ).fetchone()[0]

                if not check_src:
                    print(f"Skipping {table_name}: not in source SQLite database.")
                    continue

                rows = sqlite_cur.execute(f"SELECT * FROM {table_name}").fetchall()
                if not rows:
                    print(f"Table {table_name}: 0 rows.")
                    continue

                cols = list(rows[0].keys())
                col_names = ", ".join([f'"{c}"' for c in cols])
                placeholders = ", ".join([f":{c}" for c in cols])
                insert_sql = text(f'INSERT INTO "{table_name}" ({col_names}) VALUES ({placeholders}) ON CONFLICT DO NOTHING')

                data_to_insert = [dict(row) for row in rows]
                pg_conn.execute(insert_sql, data_to_insert)
                print(f"Copied {len(data_to_insert)} rows into table: {table_name}")

                # Update PostgreSQL serial sequence if table has 'id' column
                if "id" in cols:
                    try:
                        seq_sql = text(f"""
                            SELECT setval(
                                pg_get_serial_sequence('"{table_name}"', 'id'),
                                COALESCE(max(id), 1)
                            ) FROM "{table_name}";
                        """)
                        pg_conn.execute(seq_sql)
                    except Exception as seq_err:
                        # Non-serial or no sequence
                        pass

            trans.commit()
            print("\nMigration from SQLite to PostgreSQL completed successfully!")
        except Exception as e:
            trans.rollback()
            print(f"\nMigration failed: {e}")
            raise

    sqlite_conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transfer SQLite data to PostgreSQL")
    parser.add_argument(
        "--sqlite-path",
        default=os.path.join(os.path.dirname(__file__), "..", "edutrack.db"),
        help="Path to source SQLite edutrack.db"
    )
    parser.add_argument(
        "--postgres-url",
        default=os.getenv("DATABASE_URL", "postgresql://postgres:postgrespassword@localhost:5432/edutrack"),
        help="Target PostgreSQL connection string URL"
    )
    args = parser.parse_args()
    migrate(os.path.abspath(args.sqlite_path), args.postgres_url)
