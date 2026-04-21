
from lib.db import get_connection

def fetch_base_rows(source_id):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
        p.*, 
        f.market_median, f.z_score, f.hotel_base_price,
        r.score as review_score, r.review_count,
        pk.pickup_min_7d

        FROM prices p
        
        LEFT JOIN features f
            ON p.hotel_id = f.hotel_id
            AND p.source_id = f.source_id
            AND p.date = f.date
            AND p.collected_at = f.collected_at
        
        LEFT JOIN (
            SELECT hotel_id, score, review_count
            FROM reviews r1
            WHERE collected_at = (
                SELECT MAX(collected_at)
                FROM reviews r2
                WHERE r2.hotel_id = r1.hotel_id
            )
        ) r ON p.hotel_id = r.hotel_id

        LEFT JOIN pickups pk 
            ON p.hotel_id = pk.hotel_id 
            AND p.source_id = pk.source_id 
            AND p.date = pk.date 
            AND p.collected_at = pk.collected_at

        WHERE p.source_id = %s
            AND p.price_min IS NOT NULL
            AND p.price_max IS NOT NULL
            AND p.lead_time >= 0
            AND f.lead_time >= 0
    """

    cursor.execute(query, (source_id,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows