#batch/jobs/main.py

from jobs.fetch_prices import run as run_fetch
from jobs.build_features import run as run_features
from jobs.calc_pickups import run as run_pickups
from utils.config import DEBUG

from datetime import datetime

def main():
    collected_at = datetime.now().replace(microsecond=0)
    run_mode = "DEBUG" if DEBUG else "MAIN"
    print(f"[{run_mode} MODE] COLLECTED_AT = {collected_at}")

    source_ids = [1]
    
    for source_id in source_ids:
        run_fetch(source_id=source_id, collected_at=collected_at)
        run_features(source_id=source_id, collected_at=collected_at)
        run_pickups(source_id=source_id, collected_at=collected_at)

if __name__ == "__main__":
    main()