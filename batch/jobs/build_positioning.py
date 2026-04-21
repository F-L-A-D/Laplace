# batch/jobs/build_positioning.py

import pandas as pd

from repositories.latest_repo import fetch_collected_latest
from repositories.positioning_repo import fetch_base_rows
from repositories.geo_repo import fetch_geo_clusters

from services.signals import add_d_price, add_d_market, add_pmax_event
from services.stats import build_stats_by_geo
from services.positioning import calc_position
from services.clustering import apply_strategic_cluster

from writers.db_writer import save_positioning, save_strategic_logs

from utils.config import DEBUG

from datetime import datetime

def run(source_id, collected_at):
    rows = fetch_base_rows(source_id)
    df = pd.DataFrame(rows)
    target_collected_at = pd.to_datetime(collected_at)

    df["date"] = pd.to_datetime(df["date"])
    df["review_score"] = df["review_score"].astype(float)
    df["review_count"] = df["review_count"].astype(float)

    # --- geo ---
    geo_map = {
        r["hotel_id"]: r["geo_cluster"]
        for r in fetch_geo_clusters()
    }
    df["geo_cluster"] = df["hotel_id"].map(geo_map)

    # --- signals ---
    df = add_d_price(df)
    df = add_d_market(df)
    df = add_pmax_event(df)

    # --- stats ---
    stats_map = build_stats_by_geo(df)

    df = df[df["collected_at"] == target_collected_at]
    df = df[df["lead_time"] >= 0]

    # --- positioning ---
    results = []

    for _, row in df.iterrows():
        stats = stats_map.get(row["geo_cluster"])
        pos = calc_position(row, stats)

        for key in ["structural", "market_fit", "strategy", "responsiveness"]:
            if pd.isna(pos[key]):
                pos[key] = None

        results.append({
            "hotel_id": row["hotel_id"],
            "source_id": source_id,
            "date": row["date"],
            "collected_at": collected_at,
            "geo_cluster": row["geo_cluster"],
            **pos
        })
    
    if DEBUG:
        print(f"[DEBUG] POSITIONING (0 or NaN Check)")
        df_result = pd.DataFrame(results)
        
        df_check = df_result[
            (df_result["responsiveness"] == 0) | 
            (df_result["responsiveness"].isna())
        ]
        
        print(df_check[["hotel_id", "date", "geo_cluster", "responsiveness"]].head(20))
        
        print(f"[0 | NAN ROWS]: {len(df_check)}")
        print(f"[NAN COUNT]: {df_check['responsiveness'].isna().sum()}")
        print(f"[ZERO COUNT]: {(df_check['responsiveness'] == 0).sum()}")
        return
    
    save_positioning(source_id, collected_at, results)


    df_results = pd.DataFrame(results)
    df_results[['structural', 'market_fit', 'responsiveness', 'strategy']] = \
        df_results[['structural', 'market_fit', 'responsiveness', 'strategy']].fillna(0)
    
    df_clustered = apply_strategic_cluster(df_results)

    cluster_logs = []
    for _, row in df_clustered.iterrows():
        cluster_logs.append({
            "hotel_id": int(row["hotel_id"]),
            "cluster_id": int(row["cluster_id"]),
            "structural": row["structural"],
            "market_fit": row["market_fit"],
            "responsiveness": row["responsiveness"],
            "strategy": row["strategy"],
            "collected_at": collected_at
        })
    
    save_strategic_logs(cluster_logs)

if __name__ == "__main__":
    source_id = 1
    collected_at = fetch_collected_latest(source_id)
    run(source_id, collected_at)