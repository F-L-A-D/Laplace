#batch/services/fetch_rakuten.py

from collectors.rakuten import RakutenCollector
from collectors.limiter import RateLimiter

from utils.config import SOURCE_CONFIG, DATE_CHUNK, DEBUG
from utils.parse_args import parse_args
from utils.date import get_target_days, build_dates
from utils.transform import build_hotel_results, merge

from repositories.hotel_repo import get_hotels

from datetime import datetime
import time

def process_batch(collector, hotels, checkin, checkout, should_get_review, source_id):
    result = {}
    config = SOURCE_CONFIG.get(source_id, {})
    max_hotels = config.get("max_hotels", 15)
    total_batches = (len(hotels) + max_hotels - 1) // max_hotels

    for i in range(0, len(hotels), max_hotels):
        batch_idx = (i // max_hotels) + 1
        batch = hotels[i:i + max_hotels]

        print(f"  >>> [{checkin}] Batch {batch_idx}/{total_batches} | fetching {len(batch)} hotels...")

        price_map = collector.fetch_prices(
            batch, checkin, checkout, should_get_review
        )

        if not price_map:
            continue

        hotel_results = build_hotel_results(batch, price_map, checkin)
        merge(result, hotel_results)

    return result


def run_source(source_id):
    start_time = time.time()
    is_monday = datetime.today().weekday() == 0
    config = SOURCE_CONFIG.get(source_id, {})
    min_interval = config.get("min_interval", 0.8)

    limiter = RateLimiter(min_interval)

    if source_id == 1:
        collector = RakutenCollector(limiter)
    elif source_id == 2:
        # collector = JalanCollector(limitter)
        pass

    hotels = get_hotels(source_id)

    if DEBUG:
        hotels = hotels[:1]

    args = parse_args()
    target_hotel_id = int(args["hotel_id"]) if "hotel_id" in args else None

    if target_hotel_id:
        hotels = [h for h in hotels if h["hotel_id"] == target_hotel_id]

    days = get_target_days()
    print(f"[BATCH START] SOURCE_ID={source_id} | DATE COUNT: {days}")

    all_results = {}

    for offset in range(1, days + 1, DATE_CHUNK):
        count = min(DATE_CHUNK, days - offset + 1)
        date_pairs = build_dates(offset, count)

        for checkin, checkout in date_pairs:
            is_first_day = (offset == 1 and checkin == date_pairs[0][0])
            
            if DEBUG:
                should_get_review = True
            else:
                should_get_review = is_monday and is_first_day

            daily_results = process_batch(
                collector,
                hotels,
                checkin,
                checkout,
                should_get_review,
                source_id
            )

            merge(all_results, daily_results)

    print(f"[BATCH END] SOURCE_ID={source_id} | TOTAL TIME: {time.time() - start_time:.2f}s")
    print(f"[BATCH END] SOURCE_ID={source_id} | CLEAN HIT RATE: {collector.hit_rate():.2%}")

    return all_results