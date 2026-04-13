#batch/jobs/calc_pickup.py

from writers.db_writer import save_pickups
from utils.config import DEBUG
from repositories.latest_repo import fetch_collected_latest as fetch_latest

def run(source_id, collected_at=None):
    if DEBUG:
        print("[DEBUG] SKIP CALC PICKUPS")
        return
    
    latest = collected_at if collected_at else fetch_latest(source_id=source_id)
    print("[CALC PICKUPS]")
    save_pickups(source_id=source_id, collected_at=latest)
    print("[SAVED PICKUPS]")

if __name__ == "__main__":
    run(source_id=1)