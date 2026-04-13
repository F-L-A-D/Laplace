#batch/jobs/build_features.py

from repositories.price_repo import fetch_prices_latest
from utils.transform import group_by_date
from utils.config import DEBUG
from services.build_features import calc_features
from writers.db_writer import save_features

import pandas as pd

def run(source_id, collected_at):
    print(f"[BUILD FEATURES] SOURCE_ID={source_id}")
    rows = fetch_prices_latest(source_id=source_id)
    grouped = group_by_date(rows)
    features = calc_features(grouped)
    df = pd.DataFrame(features)

    if DEBUG:
        print(f"[DEBUG] FEATURES SOURCE_ID={source_id}")
        print(df.head(10))
        return
    
    save_features(features=df.to_dict("records"), source_id=source_id, collected_at=collected_at)
    print(f"[SAVED FEATURES] SOURCE_ID={source_id}")
    
    return

if __name__ == "__main__":
    run()