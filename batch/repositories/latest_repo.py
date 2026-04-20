#batch\repositories\latest_repo.py

from lib.db import get_connection

def fetch_collected_latest(source_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT MAX(collected_at) AS latest FROM prices
            WHERE source_id=%s
    """, (source_id,))

    rows = cursor.fetchall()
    conn.close()

    return rows[0]["latest"]

if __name__ == "__main__":
    fetch_collected_latest(source_id=1)