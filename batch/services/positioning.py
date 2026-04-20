# batch/services/positioning.py

import numpy as np

def safe_z(x, mean, std):
    return (x - mean) / std if std != 0 else 0

def squash(x):
    return float(np.tanh(x))

# ---------- Axis1: structural ----------
def calc_structural(row, stats):
    raw = (
        0.5 * np.log(max(row["hotel_base_price"], 1))
        + 0.5 * (row["review_score"] * np.log1p(row["review_count"]))
    )

    z = safe_z(raw, stats["structural_mean"], stats["structural_std"])
    return squash(z)


# ---------- Axis2: market_fit ----------
def calc_market_fit(row):
    z = row.get("z_score", 0)
    return float(-np.sign(z) * np.tanh(abs(z)))


# ---------- Axis3: strategy ----------
def calc_strategy(row, stats):
    pmin = row["price_min"]
    pmax = row["price_max"]

    if not pmin or not pmax or pmin <= 0:
        return 0.0

    spread = np.log(pmax / pmin)
    z_spread = safe_z(spread, stats["spread_mean"], stats["spread_std"])

    spread_score = -abs(z_spread)

    event = row.get("pmax_event", 0)
    event_score = 1.0 if event else 0.0

    raw = 0.7 * spread_score + 0.3 * event_score
    return squash(raw)


# ---------- Axis4: responsiveness ----------
def calc_responsiveness(row, stats):
    d_market = row.get("d_market", 0)
    d_self = row.get("d_price", 0)

    scale = stats["market_volatility"] or 1

    direction = np.sign(d_market) * np.sign(d_self)
    strength = np.tanh(abs(d_market) / scale)

    raw = direction * strength
    return squash(raw)


def calc_position(row, stats):
    return {
        "structural": calc_structural(row, stats),
        "market_fit": calc_market_fit(row),
        "strategy": calc_strategy(row, stats),
        "responsiveness": calc_responsiveness(row, stats),
    }