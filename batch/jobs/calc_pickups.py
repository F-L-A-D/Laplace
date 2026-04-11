#batch/jobs/calc_pickup.py

from writers.db_writer import save_pickups
from utils.config import DEBUG

def run(collected_at):
    if DEBUG:
        print("[DEBUG] SKIP CALC PICKUPS")
        return
    
    print("[CALC PICKUPS]")
    save_pickups(collected_at)
    print("[SAVED PICKUPS]")

if __name__ == "__main__":
    run()