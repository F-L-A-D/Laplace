#batch/jobs/fetch_prices.py

from services.fetch_source import run_source
from writers.db_writer import save_prices, save_reviews
from utils.config import SOURCE_CONFIG, DEBUG

from datetime import datetime

def run(source_id, collected_at):
    config = SOURCE_CONFIG.get(source_id, {})
    label = config.get("label", f"ID={source_id}")

    print(f"[FETCH PRICES] SOURCE: {label}")
    is_monday = datetime.today().weekday() == 0
    
    data = run_source(source_id)

    if DEBUG:
        print(f"[DEBUG] PRICES SOURCE: {label}")
        print(data[:10])
        return

    save_prices(hotel_results=data, source_id=source_id, collected_at=collected_at)
    print(f"[SAVED PRICES] SOURCE: {label}")

    if is_monday:
        save_reviews(hotel_results=data, source_id=source_id, collected_at=collected_at)
        print(f"[SAVED REVIEWS] SOURCE: {label}")

if __name__ == "__main__":
    run()