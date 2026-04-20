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
    market_stats = []

    for rows in grouped.values():
        for r in rows:
            if r["price"] is None: continue
            hotel_price_history.setdefault(r["hotel_id"], []).append((float(r["price"])))

    hotel_base_map = {
            hid: np.percentile(prices, 25)
            for hid, prices in hotel_price_history.items() if prices
        }
    
    daily_medians = {}
    for date, rows in grouped.items():
        prices = [float(r["price"]) for r in rows if r["price"] is not None]
        if prices:
            daily_medians[date] = np.median(prices)

    area_base_median = np.percentile(list(daily_medians.values()), 25) if daily_medians else 1

    for date, rows in grouped.items():
        df = pd.DataFrame(rows)
        df = df[df["price"].notnull()].copy()
        if df.empty: continue
        df["price"] = df["price"].astype(float)

        # 市場指標の計算
        current_market_median = daily_medians[date]
        market_index = current_market_median / area_base_median
        
        # 基本統計
        df["market_median"] = current_market_median
        df["market_index"] = market_index 
        df["market_median_diff"] = (df["price"] - current_market_median) / current_market_median

        df["price_rank"] = df["price"].rank(method="average")
        df["percentile"] = df["price_rank"] / len(df)

        # Z-Score & Penalty
        log_prices = np.log(df["price"])
        log_mean, log_std = log_prices.mean(), log_prices.std()
        df["z_score"] = (log_prices - log_mean) / log_std if log_std != 0 else 0
        df["z_penalty"] = df["z_score"].clip(lower=0)

        # 市場連動型の期待価格比較
        df["hotel_base"] = df["hotel_id"].map(hotel_base_map)
        df["expected_price"] = df["hotel_base"] * market_index
        df["hotel_median_diff"] = (df["price"] - df["expected_price"]) / df["expected_price"]

        # 重みとスコア
        std_m = df["market_median_diff"].std()
        std_h = df["hotel_median_diff"].std()
        std_z = df["z_score"].std()
        weights = calc_weights(std_h, std_m, std_z)

        df["score"] = (
            - weights["w_m"] * df["market_median_diff"]
            - weights["w_h"] * df["hotel_median_diff"]
            - weights["w_z"] * df["z_penalty"]
        )

        market_stats.append({
            "date": date,
            "market_median": float(df["price"].median()),
            "market_index": float(market_index),
            "area_base_median": float(area_base_median),
            "market_log_mean": float(log_mean),
            "market_log_std": float(log_std),
            "std_m": float(std_m),
            "std_h": float(std_h),
            "std_z": float(std_z),
        })

        for _, row in df.iterrows():
            results.append({
                "hotel_id": row["hotel_id"],
                "date": date,
                "price": row["price"],

                "weights": {
                    "w_m": float(weights["w_m"]),
                    "w_h": float(weights["w_h"]),
                    "w_z": float(weights["w_z"])
                },

                "market_median": float(row["market_median"]),
                "market_index": float(row["market_index"]),
                "market_median_diff": float(row["market_median_diff"]),

                "price_rank": float(row["price_rank"]),
                "percentile": float(row["percentile"]),
                "z_score": float(row["z_score"]),
                
                "hotel_base_price": float(row["hotel_base"]),
                "expected_diff": float(row["hotel_median_diff"]),

                "score": float(row["score"]),
            })

    return results, market_stats