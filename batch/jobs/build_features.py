#batch/jobs/build_features.py

from repositories.price_repo import fetch_prices_latest
from utils.transform import group_by_date
from utils.config import SOURCE_CONFIG, DEBUG
from services.features import calc_features
from writers.db_writer import save_features, save_normalized_stats

import pandas as pd

def run(source_id, collected_at):
    config = SOURCE_CONFIG.get(source_id, {})
    label = config.get("label", f"ID={source_id}")

    print(f"[BUILD FEATURES] SOURCE: {label}")
    rows = fetch_prices_latest(source_id=source_id)
    grouped = group_by_date(rows)
    features, market_stats = calc_features(grouped)
    
    df_f = pd.DataFrame(features)
    df_s = pd.DataFrame(market_stats)

    if DEBUG:
        print("[DEBUG] MARKET STATS")
        print(df_s.head())
        print("[DEBUG] FEATURES")
        print(df_f.head())
        return
    
    save_normalized_stats(stats=df_s.to_dict("records"), source_id=source_id, collected_at=collected_at)
    save_features(features=df_f.to_dict("records"), source_id=source_id, collected_at=collected_at)
    
    print(f"[SUCCESS] SOURCE: {label}")

if __name__ == "__main__":
    run()