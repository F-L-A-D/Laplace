#batch/writers/db_writer.py

from lib.db import get_connection

def save_prices(hotel_results):
    conn = get_connection()
    cursor = conn.cursor()

    price_data = []

    for hotel_id, rows in hotel_results.items():
        for row in rows:
            d = row["date"]
            p = row["price"]

            status = "available" if p is not None else "sold_out"

            price_data.append(
                (hotel_id, 1, d, p, status)
            )

    if price_data:
        cursor.executemany("""
        INSERT INTO prices (hotel_id, source_id, date, price, status, collected_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """, price_data)

    conn.commit()
    conn.close()

def save_reviews(hotel_results):
    conn = get_connection()
    cursor = conn.cursor()

    review_data = []

    for hotel_id, rows in hotel_results.items():
        for row in rows:
            if row["review_avg"] is not None:
                review_data.append(
                    (
                        hotel_id,
                        1,
                        row["review_avg"],
                        row["review_count"]
                    )
                )
                break

    if review_data:
        cursor.executemany("""
        INSERT INTO reviews (hotel_id, source_id, score, review_count)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            review_count = VALUES(review_count),
            collected_at = NOW()
        """, review_data)

    conn.commit()
    conn.close()