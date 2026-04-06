import subprocess
from db import get_connection
import time

PROJECT = "gen-lang-client-0262945179"
REGION = "asia-northeast1"
JOB_NAME = "laplace-job"

def get_hotel_ids():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT hotel_id
    FROM hotel_sources
    WHERE source_id = 1 AND is_active = TRUE
    """)

    ids = [row["hotel_id"] for row in cursor.fetchall()]
    conn.close()
    return ids

def run():
    hotel_ids = get_hotel_ids()

    print(f"HOTELS: {len(hotel_ids)}")

    for hid in hotel_ids:
        print(f"Dispatch Job: hotel_id={hid}")

        subprocess.Popen([
            "gcloud", "run", "jobs", "execute", JOB_NAME,
            f"--region={REGION}",
            f"--project={PROJECT}",
            f"--args=-m,scripts.run_collectors,{hid}"
        ])
        time.sleep(0.2)


if __name__ == "__main__":
    run()