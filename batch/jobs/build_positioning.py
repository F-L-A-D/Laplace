# batch/jobs/build_positioning.py

import pandas as pd

from repositories.latest_repo import fetch_collected_latest
from repositories.positioning_repo import fetch_base_rows
from repositories.geo_repo import fetch_geo_clusters

from services.signals import add_d_price, add_d_market, add_pmax_event
from services.stats import build_stats_by_geo
from services.positioning import calc_position

from writers.db_writer import save_positioning

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

        results.append({
            "hotel_id": row["hotel_id"],
            "source_id": source_id,
            "date": row["date"],
            "collected_at": collected_at,
            "geo_cluster": row["geo_cluster"],
            **pos
        })
    
    save_positioning(source_id, collected_at, results)

if __name__ == "__main__":
    source_id = 1
    collected_at = fetch_collected_latest(source_id)
    run(source_id, collected_at)