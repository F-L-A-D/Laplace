# batch/services/stats.py

import numpy as np
import pandas as pd

def build_stats(df: pd.DataFrame) -> dict:
    df = df.copy()

    df = df[
        (df["price_min"] > 0) &
        (df["price_max"] > 0)
    ]

    df["review_count"] = df["review_count"].fillna(0)
    df["review_score"] = df["review_score"].fillna(0)

    # ---- structural ----
    df["structural_raw"] = (
            0.8 * (df["hotel_base_price"] / 10000.0) +
            0.4 * df["review_score"] +
            0.1 * np.log1p(df["review_count"])
        )

    # ---- spread ----
    df["spread"] = np.log(df["price_max"] / df["price_min"])

    market_pickup_avg = df["pickup_min_7d"].mean()
    market_pickup_std = df["pickup_min_7d"].std() or 0.05

    return {
        "structural_mean": df["structural_raw"].mean(),
        "structural_std": df["structural_raw"].std() or 1,

        "spread_mean": df["spread"].mean(),
        "spread_std": df["spread"].std() or 1,

        "market_volatility": df["d_market"].std() or 1,

        "market_pickup_avg": float(market_pickup_avg),
        "market_pickup_std": float(market_pickup_std)
    }


def build_stats_by_geo(df: pd.DataFrame):
    return {
        geo: build_stats(sub)
        for geo, sub in df.groupby("geo_cluster")
    }