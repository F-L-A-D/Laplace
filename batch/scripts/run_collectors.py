from db import get_connection
from collectors.rakuten import RakutenCollector
from datetime import datetime, timedelta
import time

# ------------------------
# 日付生成
# ------------------------
def build_dates(days):
    today = datetime.today()

    return [
        (
            (today + timedelta(days=i)).strftime("%Y-%m-%d"),
            (today + timedelta(days=i+1)).strftime("%Y-%m-%d")
        )
        for i in range(1, days + 1)
    ]


# ------------------------
# 実行範囲
# ------------------------
def get_target_days():
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

    return hotels

# ------------------------
# DB保存
# ------------------------
def save_prices(hotel_id, source_id, results):
    conn = get_connection()
    cursor = conn.cursor()

    for checkin, price in results:
        status = "available" if price else "sold_out"

        cursor.execute("""
        INSERT INTO prices (hotel_id, source_id, date, price, status, collected_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """, (hotel_id, source_id, checkin, price, status))

    conn.commit()
    conn.close()

# ------------------------
# 楽天メイン処理
# ------------------------
def run_rakuten():
    SAVE_DB = True

    collector = RakutenCollector()
    QPS = 3
    interval = 1.0 / QPS

    hotels = get_hotels(source_id=1)
    days = get_target_days()
    date_pairs = build_dates(days)
    last_request_time = time.time()

    print(f"Hotels: {len(hotels)} | Days: {days} | Requests: {len(date_pairs)}")

    for hotel in hotels:
        hotel_id = hotel["hotel_id"]

        print(f"\n === START hotel_id={hotel_id} ===")
        results = []

        for checkin, checkout in date_pairs:
            now = time.time()
            elapsed = now - last_request_time
            if elapsed < interval:
                time.sleep(interval - elapsed)

            last_request_time = time.time()
            price = collector.fetch_price(hotel, checkin, checkout)
            results.append((checkin, price))
            print(f"Checkin: {checkin} | Price: {price}")
        
        if SAVE_DB:
            save_prices(hotel_id, 1, results)

        print(f"=== DONE hotel_id={hotel_id} ===")


if __name__ == "__main__":
    run_rakuten()