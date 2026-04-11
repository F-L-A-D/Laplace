#batch/jobs/main.py

from jobs.fetch_prices import run as run_fetch
from jobs.build_features import run as run_features
from jobs.calc_pickup import run as run_pickup
from utils.config import DEBUG

from datetime import datetime

def main():
    collected_at = datetime.now()
    run_mode = "DEBUG" if DEBUG else "MAIN"
    
    print(f"[{run_mode} MODE]")
    run_fetch(collected_at)
    run_features(collected_at)
    run_pickup(collected_at)

if __name__ == "__main__":
    main()