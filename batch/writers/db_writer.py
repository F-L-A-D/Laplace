#batch/writers/db_writer.py

from lib.db import get_connection

def save_prices(hotel_results, collected_at):
    conn = get_connection()
    cursor = conn.cursor()

    price_data = []

    for hotel_id, rows in hotel_results.items():
        for row in rows:
            d = row["date"]
            p = row["price"]

            status = "available" if p is not None else "sold_out"

            price_data.append(
                (hotel_id, 1, d, p, status, collected_at)
            )

    if price_data:
        cursor.executemany("""
        INSERT INTO prices (hotel_id, source_id, date, price, status, collected_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        """, price_data)

    conn.commit()
    conn.close()

def save_reviews(hotel_results, collected_at):
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
                        row["review_count"],
                        collected_at
                    )
                )
                break

    if review_data:
        cursor.executemany("""
        INSERT INTO reviews (hotel_id, source_id, score, review_count, collected_at)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            review_count = VALUES(review_count)
        """, review_data)

    conn.commit()
    conn.close()

def save_features(features, collected_at, source_id=1):
    conn = get_connection()
    cursor = conn.cursor()

    data = []

    for row in features:
        data.append((
            row["hotel_id"],
            source_id,
            row["date"],
            row["price"],

            row["market_median"],
            row["market_median_diff"],
            
            row["price_rank"],
            row["percentile"],
            row["z_score"],

            row["hotel_median"],
            row["hotel_median_diff"],

            row["score"],
            collected_at
        ))

    if data:
        cursor.executemany("""
        INSERT INTO features (
            hotel_id,
            source_id,
            date,
            price,

            market_median,
            market_median_diff,
                           
            price_rank,
            percentile,
            z_score,

            hotel_median,
            hotel_median_diff,

            score,
            collected_at
        )
        VALUES (
            %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s,
            %s,
            %s
        )
        """, data)

    conn.commit()
    conn.close()