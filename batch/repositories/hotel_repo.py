#batch/repositories/hotel_repo.py

from lib.db import get_connection

def get_hotels(source_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT hotel_id, external_id
    FROM hotel_sources
    WHERE source_id = %s AND is_active = TRUE
    """, (source_id,))

    hotels = cursor.fetchall()
    conn.close()
    return hotels
