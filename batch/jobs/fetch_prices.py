#batch/jobs/fetch_prices.py

from services.sources import run_source
from writers.db_writer import save_prices, save_reviews
from utils.config import SOURCE_CONFIG, DEBUG

from datetime import datetime

def run(source_id, collected_at):
    config = SOURCE_CONFIG.get(source_id, {})
    label = config.get("label", f"ID={source_id}")

    print(f"[FETCH PRICES] SOURCE: {label}")
    today = datetime.today()
    is_monday = today.weekday() == 0
    
    data = run_source(source_id)

    if DEBUG:
        print(f"[DEBUG] PRICES SOURCE: {label}")
        print(data)
        return

    save_prices(data, source_id, collected_at)
    print(f"[SAVED PRICES] SOURCE: {label}")

    if is_monday:
        save_reviews(data, source_id, collected_at)
        print(f"[SAVED REVIEWS] SOURCE: {label}")

if __name__ == "__main__":
    source_id = 1
    collected_at = datetime.now().replace(microsecond=0)
    run(source_id, collected_at)