#batch/jobs/build_features.py

from repositories.price_repo import fetch_prices_latest
from utils.transform import group_by_date
from services.build_features import calc_features
from writers.db_writer import save_features
import pandas as pd

from datetime import datetime

def run():
    print("[BUILD FEATURES]")
    collected_at = datetime.now() #本来は上流から渡す
    
    rows = fetch_prices_latest(source_id = 1)
    grouped = group_by_date(rows)
    features = calc_features(grouped)
    df = pd.DataFrame(features)

    save_features(df.to_dict("records"), collected_at, source_id=1)
    print("[SAVED FEATURES]")
    
    return

if __name__ == "__main__":
    run()