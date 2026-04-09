#batch/serivices/build_features.py

import numpy as np
import pandas as pd

def calc_weights(std_m, std_h, std_z):
    weights = {}
    std_m = std_m if std_m != 0 else 1
    std_h = std_h if std_h != 0 else 1
    std_z = std_z if std_z != 0 else 1

    w_m = 1 / std_m
    w_h = 1 / std_h
    w_z = 1 / std_z

    total = w_m + w_h + w_z
    w_m /= total
    w_h /= total
    w_z /= total

    w_m = max(w_m, 0.5)
    w_h = min(w_h, 0.3)
    
    total2 = w_m + w_h + w_z
    w_m /= total2
    w_h /= total2
    w_z /= total2

    weights["w_m"] = w_m
    weights["w_h"] = w_h
    weights["w_z"] = w_z

    return weights


def calc_features(grouped):

    results = []
    hotel_price_history = {}

    for rows in grouped.values():
        for r in rows:
            if r["price"] is None:
                continue

            hotel_id = r["hotel_id"]
            price = float(r["price"])

            hotel_price_history.setdefault(hotel_id, []).append(price)

    hotel_median_map = {
        hid: np.median(prices)
        for hid, prices in hotel_price_history.items()
        if prices
    }

    for date, rows in grouped.items():

        df = pd.DataFrame(rows)
        df = df[df["price"].notnull()].copy()

        if df.empty:
            continue

        df["price"] = df["price"].astype(float)

        log_prices = np.log(df["price"])
        log_mean = log_prices.mean()
        log_std = log_prices.std()

        df["market_median"] = df["price"].median()
        df["market_median_diff"] = (df["price"] - df["market_median"]) / df["market_median"]

        df["price_rank"] = df["price"].rank(method="average")
        df["percentile"] = df["price_rank"] / len(df)

        
        df["z_score"] = (
            (np.log(df["price"]) - log_mean) / log_std
            if log_std != 0 else 0
        )
        df["z_penalty"] = df["z_score"].clip(lower=0)

        df["hotel_median"] = df["hotel_id"].map(hotel_median_map)
        df["hotel_median_diff"] = np.where(
            df["hotel_median"] > 0,
            (df["price"] - df["hotel_median"]) / df["hotel_median"],
            0
        )

        std_m = df["market_median_diff"].std()
        std_h = df["hotel_median_diff"].std()
        std_z = df["z_score"].std()

        weights = calc_weights(std_h, std_m, std_z)

        df["score"] = (
            - weights["w_m"] * df["market_median_diff"]
            - weights["w_h"] * df["hotel_median_diff"]
            - weights["w_z"] * df["z_penalty"]
        )

        for _, row in df.iterrows():
            results.append({
                "hotel_id": row["hotel_id"],
                "date": date,
                "price": row["price"],

                "market_median": float(row["market_median"]),
                "market_median_diff": float(row["market_median_diff"]),

                "price_rank": float(row["price_rank"]),
                "percentile": float(row["percentile"]),
                "z_score": float(row["z_score"]),

                "hotel_median": float(row["hotel_median"]),
                "hotel_median_diff": float(row["hotel_median_diff"]),

                "score": float(row["score"]),
            })

    return results