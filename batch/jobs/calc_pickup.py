#batch/jobs/calc_pickup.py

from writers.db_writer import save_pickup
from utils.config import DEBUG

def run(collected_at):
    if DEBUG:
        print("[DEBUG] SKIP CALC PICKUP")
        return
    
    print("[CALC PICKUP]")
    save_pickup(collected_at)
    print("[SAVED PICKUP]")

if __name__ == "__main__":
    run()