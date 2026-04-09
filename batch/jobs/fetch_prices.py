#batch/jobs/fetch.py

from services.fetch_rakuten import run_rakuten
from writers.db_writer import save_prices, save_reviews
from utils.config import DEBUG

from datetime import datetime

def run(collected_at):
    print("[FETCH PRICES]")
    is_monday = datetime.today().weekday() == 0
    
    data = run_rakuten()

    if DEBUG:
        print("[DEBUG DATA] PRICES")
        print(data)
        return

    save_prices(data, collected_at)
    print("[SAVED PRICES]")

    if is_monday:
        save_reviews(data, collected_at)
        print("[SAVED REVIEWS]")

if __name__ == "__main__":
    run()