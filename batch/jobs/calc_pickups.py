#batch/jobs/calc_pickup.py

from writers.db_writer import save_pickups
from utils.config import SOURCE_CONFIG, DEBUG
from repositories.latest_repo import fetch_collected_latest

def run(source_id, collected_at):
    config = SOURCE_CONFIG.get(source_id, {})
    label = config.get("label", f"ID={source_id}")

    if DEBUG:
        print("[DEBUG] SKIP CALC PICKUPS")
        return
    
    print(f"[CALC PICKUPS] SOURCE: {label}")
    save_pickups(source_id, collected_at)
    print(f"[SAVED PICKUPS] SOURCE: {label}")

if __name__ == "__main__":
    source_id = 1
    collected_at = fetch_collected_latest(source_id)
    run(source_id, collected_at)