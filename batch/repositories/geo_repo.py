from lib.db import get_connection

def fetch_geo_clusters(precision=1):
    conn = get_connection()
    cursor = conn.cursor()

    query = f"""
    SELECT
        id AS hotel_id,
        lat,
        lng,
        CONCAT(
            ROUND(lat, {precision}),
            '_',
            ROUND(lng, {precision})
        ) AS geo_cluster
    FROM hotels
    WHERE lat IS NOT NULL 
    AND lng IS NOT NULL
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows