# batch/services/signals.py

import pandas as pd

def add_d_price(df: pd.DataFrame):
    df = df.sort_values(["hotel_id", "date", "collected_at"])

    df["prev_price_min"] = df.groupby(
        ["hotel_id", "date"]
    )["price_min"].shift(1)

    df["d_price"] = (
        (df["price_min"] - df["prev_price_min"]) /
        df["prev_price_min"]
    )

    df["d_price"] = df["d_price"].fillna(0)

    return df


def add_d_market(df: pd.DataFrame):
    df = df.sort_values(["date", "lead_time", "collected_at"])

    df["prev_market"] = df.groupby(
        ["date", "lead_time"]
    )["market_median"].shift(1)

    df["d_market"] = (
        (df["market_median"] - df["prev_market"]) /
        df["prev_market"]
    )

    df["d_market"] = df["d_market"].fillna(0)

    return df


def add_pmax_event(df: pd.DataFrame):
    df = df.sort_values(["hotel_id", "date", "lead_time", "collected_at"])

    df["prev_pmax"] = df.groupby(
        ["hotel_id", "date", "lead_time"]
    )["price_max"].shift(1)

    df["prev_room"] = df.groupby(
        ["hotel_id", "date", "lead_time"]
    )["room_max_class"].shift(1)

    df["prev_plan"] = df.groupby(
        ["hotel_id", "date", "lead_time"]
    )["plan_max_id"].shift(1)

    cond_price = df["price_max"] < df["prev_pmax"]
    cond_room = df["room_max_class"] != df["prev_room"]
    cond_plan = df["plan_max_id"] != df["prev_plan"]

    df["pmax_event"] = (
        cond_price & (cond_room | cond_plan)
    ).astype(int)

    df["pmax_event"] = df["pmax_event"].fillna(0)

    return df