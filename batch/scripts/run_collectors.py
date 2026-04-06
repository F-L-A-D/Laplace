from db import get_connection
from collectors.rakuten import RakutenCollector
from collectors.limiter import RateLimiter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
import os
import sys
import time

# --- 設定 ---
BATCH_SIZE = 3
MAX_WORKERS = 3
DATE_CHUNK = 30
MIN_INTERVAL = 0.5
SAVE_DB = True
DEBUG = os.getenv("DEBUG") == "1"

if DEBUG:
    SAVE_DB = False

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
def save_prices(hotel_id, source_id, results):
    conn = get_connection()
    cursor = conn.cursor()

    data = []
    for checkin, price in results:
        status = "available" if price else "sold_out"
        data.append((hotel_id, source_id, checkin, price, status))

    cursor.executemany("""
    INSERT INTO prices (hotel_id, source_id, date, price, status, collected_at)
    VALUES (%s, %s, %s, %s, %s, NOW())
    """, data)

    conn.commit()
    conn.close()

# ------------------------
# ホテル処理
# ------------------------
def process_hotel(hotel, collector, date_pairs):
    hotel_id = hotel["hotel_id"]

    print(f"=== START hotel_id={hotel_id} ===")

    results = []
    for checkin, checkout in date_pairs:
        price = collector.fetch_price(hotel, checkin, checkout)
        results.append((checkin, price))

    if SAVE_DB:
        save_prices(hotel_id, 1, results)

    print(f"=== DONE hotel_id={hotel_id} ===")


# ------------------------
# 楽天
# ------------------------
def run_rakuten():
    start_time = time.time()

    limiter = RateLimiter(MIN_INTERVAL)
    collector = RakutenCollector(limiter)

    hotels = get_hotels(source_id=1)

    if len(sys.argv) > 1:
        target_hotel_id = int(sys.argv[1])
        hotels = [h for h in hotels if h["hotel_id"] == target_hotel_id]
        print(f"=== TARGET HOTEL: {target_hotel_id} ===")
    
    days = get_target_days()

    for offset in range(1, days+1, DATE_CHUNK):
        count = min(DATE_CHUNK, days-offset+1)
        date_pairs = build_dates(offset, count)

        print(f"=== DATE {offset}-{offset+count-1} ===")

        for i in range(0, len(hotels), BATCH_SIZE):
            batch = hotels[i:i+BATCH_SIZE]

            print(f"=== BATCH {i}-{i+len(batch)} ===")

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = [
                    executor.submit(process_hotel, hotel, collector, date_pairs)
                    for hotel in batch
                ]

                for f in futures:
                    f.result()

    print("-"*20)
    print(f"TOTAL TIME: {time.time()-start_time:.2f}s")
    print(f"HIT RATE: {collector.hit_rate():.2%}")
    print("-"*20)


if __name__ == "__main__":
    run_rakuten()