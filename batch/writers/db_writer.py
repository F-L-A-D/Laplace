#batch/writers/db_writer.py

from lib.db import get_connection
import json

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

def save_prices(hotel_results, source_id, collected_at):
    price_data = []

    for hotel_id, rows in hotel_results.items():
        for row in rows:
            d = row["date"]
            p_min = row["price_min"]
            status = "available" if p_min is not None else "sold_out"

            price_data.append((
                hotel_id, 
                source_id,
                d, 
                p_min, 
                row["price_max"],
                row["room_min_class"],
                row["room_max_class"],
                row["room_min_name"],
                row["room_max_name"],
                row["plan_min_id"],
                row["plan_max_id"],
                row["plan_min_name"],
                row["plan_max_name"],
                status, 
                collected_at
            ))

    if not price_data:
        return

    sql = """
        INSERT INTO prices (
            hotel_id, source_id, date, 
            price_min, price_max, 
            room_min_class, room_max_class, room_min_name, room_max_name,
            plan_min_id, plan_max_id, plan_min_name, plan_max_name,
            status, collected_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    execute_write(sql, price_data, many=True, label="PRICES")

def save_features(features, source_id, collected_at):
    data = []

    for row in features:
        data.append((
            row["hotel_id"],
            source_id,
            row.get("cluster_id"),
            row["date"],
            row["price"],
            
            row["market_index"],
            row["market_median"],
            row["market_median_diff"],
            
            row["price_rank"],
            row["percentile"],
            row["z_score"],

            row["hotel_base_price"],
            row["expected_diff"],

            row["score"],
            json.dumps(row["weights"]),
            collected_at
        ))

    if not data:
        return

    sql = """
        INSERT INTO features (
            hotel_id, source_id, cluster_id, date, price,
            market_median, market_index, market_median_diff,
            price_rank, percentile, z_score,
            hotel_base_price, expected_diff,
            score, weights, collected_at
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s,
            %s, %s, %s,
            %s, %s,
            %s, %s, %s
        )
    """

    execute_write(sql, data, many=True, label="FEATURES")


def save_normalized_stats(stats, source_id, collected_at):
    data = []

    for row in stats:
        data.append((
            source_id,
            row["date"],
            row["market_median"],
            row["market_index"],
            row["area_base_median"],
            row["market_log_mean"],
            row["market_log_std"],
            row["std_m"],
            row["std_h"],
            row["std_z"],
            collected_at
        ))

    if not data:
        return

    sql = """
        INSERT INTO normalized_prices (
            source_id,
            date,
            market_median,
            market_index,
            area_base_median,
            market_log_mean,
            market_log_std,
            std_m,
            std_h,
            std_z,
            collected_at
        )
        VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        ON DUPLICATE KEY UPDATE
            market_median = VALUES(market_median),
            market_index = VALUES(market_index),
            area_base_median = VALUES(area_base_median),
            market_log_mean = VALUES(market_log_mean),
            market_log_std = VALUES(market_log_std),
            std_m = VALUES(std_m),
            std_h = VALUES(std_h),
            std_z = VALUES(std_z),
            collected_at = VALUES(collected_at)
    """

    execute_write(sql, data, many=True, label="NORMALIZED_PRICES")

def save_reviews(hotel_results, source_id, collected_at):
    review_data = []

    for hotel_id, rows in hotel_results.items():
        for row in rows:
            if row["review_avg"] is not None:
                review_data.append(
                    (
                        hotel_id,
                        source_id,
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


def save_pickups(source_id, collected_at):
    
    sql = """
        INSERT INTO pickups (
            hotel_id,
            source_id,
            date,
            collected_at,
            price_min_latest,
            price_min_prev,
            is_min_latest_null,
            is_min_prev_null,
            pickup_min_7d,
            price_max_latest,
            price_max_prev,
            is_max_latest_null,
            is_max_prev_null,
            pickup_max_7d
        )
        SELECT
            hotel_id,
            %s,
            date,
            latest_collected_at,
            price_min_latest,
            price_min_prev,
            is_min_latest_null,
            is_min_prev_null,
            pickup_min_7d,
            price_max_latest,
            price_max_prev,
            is_max_latest_null,
            is_max_prev_null,
            pickup_max_7d
        FROM pickup_view
        WHERE latest_collected_at = %s
        ON DUPLICATE KEY UPDATE
            price_min_latest   = VALUES(price_min_latest),
            price_min_prev     = VALUES(price_min_prev),
            pickup_min_7d      = VALUES(pickup_min_7d),
            price_max_latest   = VALUES(price_max_latest),
            price_max_prev     = VALUES(price_max_prev),
            pickup_max_7d      = VALUES(pickup_max_7d)
    """

    execute_write(sql, (source_id, collected_at,), label="PICKUPS")

def save_positioning(source_id, collected_at, rows):
    if not rows:
        return

    query = """
    INSERT INTO positioning (
        hotel_id,
        source_id,
        date,
        collected_at,
        geo_cluster,
        structural,
        market_fit,
        strategy,
        responsiveness
    )
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    ON DUPLICATE KEY UPDATE
        structural = VALUES(structural),
        market_fit = VALUES(market_fit),
        strategy = VALUES(strategy),
        responsiveness = VALUES(responsiveness)
    """

    data = [
        (
            r["hotel_id"],
            source_id,
            r["date"],
            collected_at,
            r.get("geo_cluster"),
            r["structural"],
            r["market_fit"],
            r["strategy"],
            r["responsiveness"],
        )
        for r in rows
    ]

    execute_write(query, data, many=True, label="POSITIONING")

def save_strategic_logs(logs):
    if not logs:
        return

    sql = """
        REPLACE INTO hotel_strategic_logs (
            hotel_id, 
            cluster_id, 
            structural, 
            responsiveness,
            market_fit,  
            strategy, 
            collected_at
        ) VALUES (
            %(hotel_id)s, 
            %(cluster_id)s, 
            %(structural)s, 
            %(responsiveness)s,
            %(market_fit)s,     
            %(strategy)s, 
            %(collected_at)s
        )
    """

    execute_write(sql=sql, data=logs, many=True, label="STRATEGIC")