#batch/writers/db_writer.py

from lib.db import get_connection

def execute_write(sql, data=None, many=False, label=""):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        if many:
            cursor.executemany(sql, data)
        else:
            cursor.execute(sql, data)

        conn.commit()
        print(f"[{label}] rows: {cursor.rowcount}")

    except Exception as e:
        conn.rollback()
        print(f"[{label} ERROR]", e)
        raise

    finally:
        conn.close()

def save_prices(hotel_results, collected_at):
    price_data = []

    for hotel_id, rows in hotel_results.items():
        for row in rows:
            d = row["date"]
            p = row["price"]
            status = "available" if p is not None else "sold_out"

            price_data.append(
                (hotel_id, 1, d, p, status, collected_at)
            )

    if not price_data:
        return

    sql = """
        INSERT INTO prices (
            hotel_id, source_id, date, price, status, collected_at
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    execute_write(sql, price_data, many=True, label="PRICES")

def save_reviews(hotel_results, collected_at):
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

    if not review_data:
        return

    sql = """
        INSERT INTO reviews (
            hotel_id, source_id, score, review_count, collected_at
        )
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            review_count = VALUES(review_count)
    """

    execute_write(sql, review_data, many=True, label="REVIEWS")

def save_features(features, collected_at, source_id=1):
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

    if not data:
        return

    sql = """
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
    """

    execute_write(sql, data, many=True, label="FEATURES")

def save_pickups(collected_at):
    sql = """
        INSERT INTO pickups (
            hotel_id,
            source_id,
            date,
            collected_at,
            price_latest,
            price_prev,
            is_latest_null,
            is_prev_null,
            pickup_7d
        )
        SELECT
            hotel_id,
            source_id,
            date,
            latest_collected_at,
            price_latest,
            price_prev,
            is_latest_null,
            is_prev_null,
            pickup_7d
        FROM pickup_view
        WHERE latest_collected_at = %s
        ON DUPLICATE KEY UPDATE
            price_latest = VALUES(price_latest),
            price_prev   = VALUES(price_prev),
            pickup_7d    = VALUES(pickup_7d)
    """

    execute_write(sql, (collected_at,), label="PICKUPS")