#batch\repositories\price_repo.py

from lib.db import get_connection

def fetch_prices_latest(source_id=1):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT hotel_id, date, price
        FROM prices
        WHERE collected_at = (
            SELECT MAX(collected_at) FROM prices
        ) 
        AND source_id = %s
    """, (source_id,))

    rows = cursor.fetchall()
    conn.close()

    return rows