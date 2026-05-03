import sqlite3

def upgrade():
    conn = sqlite3.connect('instance/library_prod.db')
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE issued_books ADD COLUMN fine_status VARCHAR(20) DEFAULT 'None'")
        conn.commit()
        print("Column added successfully.")
    except sqlite3.OperationalError as e:
        print("Error:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    upgrade()
