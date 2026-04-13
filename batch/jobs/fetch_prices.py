#batch/jobs/fetch_prices.py

from services.fetch_source import run_source
from writers.db_writer import save_prices, save_reviews
from utils.config import DEBUG

from datetime import datetime

def run(source_id, collected_at):
    print(f"[FETCH PRICES] SOURCE_ID={source_id}")
    is_monday = datetime.today().weekday() == 0
    
    data = run_source(source_id)

    if DEBUG:
        print(f"[DEBUG] PRICES SOURCE_ID={source_id}")
        print(data[:10])
        return

    save_prices(hotel_results=data, source_id=source_id, collected_at=collected_at)
    print(f"[SAVED PRICES] SOURCE_ID={source_id}")

    if is_monday:
        save_reviews(hotel_results=data, source_id=source_id, collected_at=collected_at)
        print(f"[SAVED REVIEWS] SOURCE_ID={source_id}")

if __name__ == "__main__":
    run()