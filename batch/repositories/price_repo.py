#batch\repositories\price_repo.py

from lib.db import get_connection

def fetch_prices_latest(source_id=1):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.hotel_id, p.date, p.price
        FROM prices p
        JOIN (
            SELECT hotel_id, date, source_id, MAX(collected_at) AS max_ca
            FROM prices
            GROUP BY hotel_id, date, source_id
        ) latest
        ON p.hotel_id = latest.hotel_id
        AND p.date = latest.date
        AND p.source_id = latest.source_id
        AND p.collected_at = latest.max_ca
        WHERE p.source_id = %s
    """, (source_id,))

    rows = cursor.fetchall()
    conn.close()

    return rows