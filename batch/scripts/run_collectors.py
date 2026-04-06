#batch/scripts/run_collectors.py

from db import get_connection
from collectors.rakuten import RakutenCollector
from collectors.limiter import RateLimiter
from datetime import datetime, timedelta
import os
import sys
import time

# --- 設定 ---
BATCH_SIZE = 4
DATE_CHUNK = 30
MIN_INTERVAL = 0.8
SAVE_DB = True
DEBUG = os.getenv("DEBUG") == "1"
MAX_HOTELS = 15

if DEBUG:
    SAVE_DB = False


# ------------------------
# 引数受け取り
# ------------------------
def parse_args():
    args = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            k, v = arg.split("=", 1)
            args[k] = v

    return args

# ------------------------
# 日付生成
# ------------------------
def build_dates(start, count):
    today = datetime.today()

    return [
        (
            (today + timedelta(days=start+i)).strftime("%Y-%m-%d"),
            (today + timedelta(days=start+i+1)).strftime("%Y-%m-%d")
        )
        for i in range(count)
    ]


# ------------------------
# 実行範囲
# ------------------------
def get_target_days():
    if DEBUG:
        return 3

    today = datetime.today().weekday()

    if today == 0:
        return 180
    elif today in [1, 3, 5]:
        return 90
    else:
        return 60


# ------------------------
# ホテル取得
# ------------------------
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

    if DEBUG:
        return hotels[:1]
    else:
        return hotels

# ------------------------
# DB保存
# ------------------------
def save_data(hotel_results, collector):
    conn = get_connection()
    cursor = conn.cursor()

    price_data = []
    review_data = []

    for hotel_id, results in hotel_results.items():
        for (d, p, review_avg, review_count) in results:
            status = "available" if p is not None else "sold_out"

            price_data.append(
                (hotel_id, 1, d, p, status)
            )

            if collector.get_review and review_avg is not None:
                review_data.append(
                    (hotel_id, 1, review_avg, review_count)
                )

    if price_data:
        cursor.executemany("""
        INSERT INTO prices (hotel_id, source_id, date, price, status, collected_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """, price_data)

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

# ------------------------
# 楽天
# ------------------------
def run_rakuten():
    start_time = time.time()

    limiter = RateLimiter(MIN_INTERVAL)
    collector = RakutenCollector(limiter)

    hotels = get_hotels(source_id=1)

    args = parse_args()
    target_hotel_id = int(args["hotel_id"]) if "hotel_id" in args else None

    if target_hotel_id:
        hotels = [h for h in hotels if h["hotel_id"] == target_hotel_id]
        print(f"=== TARGET HOTEL: {target_hotel_id} ===")

    days = get_target_days()

    for offset in range(1, days+1, DATE_CHUNK):
        count = min(DATE_CHUNK, days-offset+1)
        date_pairs = build_dates(offset, count)

        print(f"=== DATE {offset}-{offset+count-1} ===")

        for checkin, checkout in date_pairs:

            print(f"--- {checkin} ---")

            for i in range(0, len(hotels), MAX_HOTELS):
                batch = hotels[i:i+MAX_HOTELS]

                print(f"=== HOTEL BATCH {i}-{i+len(batch)} ===")

                price_map = collector.fetch_prices(batch, checkin, checkout)

                if not price_map:
                    continue

                hotel_results = {}

                for h in batch:
                    hotel_id = h["hotel_id"]
                    ext_id = h["external_id"]

                    data = price_map.get(ext_id, {})

                    price = data.get("price")
                    review_avg = data.get("review_avg")
                    review_count = data.get("review_count")

                    if hotel_id not in hotel_results:
                        hotel_results[hotel_id] = []

                    hotel_results[hotel_id].append((checkin, price, review_avg, review_count))

                if SAVE_DB:
                    save_data(hotel_results, collector)

    print("-"*20)
    print(f"TOTAL TIME: {time.time()-start_time:.2f}s")
    print(f"HIT RATE: {collector.hit_rate():.2%}")
    print("-"*20)


if __name__ == "__main__":
    if DEBUG:
        print("---------- DEBUG MODE ----------")
    run_rakuten()