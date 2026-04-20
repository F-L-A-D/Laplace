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
        0.5 * np.log(df["hotel_base_price"].clip(lower=1))
        + 0.5 * (df["review_score"] * np.log1p(df["review_count"]))
    )

    # ---- spread ----
    df["spread"] = np.log(df["price_max"] / df["price_min"])

    return {
        "structural_mean": df["structural_raw"].mean(),
        "structural_std": df["structural_raw"].std() or 1,

        "spread_mean": df["spread"].mean(),
        "spread_std": df["spread"].std() or 1,

        "market_volatility": df["d_market"].std() or 1,
    }


def build_stats_by_geo(df: pd.DataFrame):
    return {
        geo: build_stats(sub)
        for geo, sub in df.groupby("geo_cluster")
    }