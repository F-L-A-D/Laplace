#batch/jobs/build_features.py

from repositories.price_repo import fetch_prices_latest
from utils.transform import group_by_date
from utils.config import DEBUG
from services.build_features import calc_features
from writers.db_writer import save_features

import pandas as pd
from datetime import datetime

def run(collected_at):
    print("[BUILD FEATURES]")
    rows = fetch_prices_latest(source_id=1)
    grouped = group_by_date(rows)
    features = calc_features(grouped)
    df = pd.DataFrame(features)

    if DEBUG:
        print("[DEBUG] FEATURES")
        print(df.head(10))
        return
    
    save_features(df.to_dict("records"), collected_at, source_id=1)
    print("[SAVED FEATURES]")
    
    return

if __name__ == "__main__":
    run()