#batch/scripts/generate_report.py

from db import get_connection
from datetime import datetime, timedelta
import jpholiday


# ------------------------
# エリア表示名
# ------------------------
AREA_MAP = {
    "naha": "那覇",
    "hokubu": "北部",
    "chubu": "中部"
}


def get_area_label(area):
    return AREA_MAP.get(area, area)


# ------------------------
# データ取得
# ------------------------
def fetch_prices():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        p.hotel_id,
        p.date,
        p.price,
        p.collected_at,
        h.area
    FROM prices p
    JOIN hotels h ON p.hotel_id = h.id
    """)

    data = cursor.fetchall()
    conn.close()

    return data


# ------------------------
# 最新・先週分離
# ------------------------
def split_data(data):
    latest = {}
    lastweek = {}

    now = datetime.now()
    week_ago = now - timedelta(days=7)

    for row in data:
        key = (row["hotel_id"], row["date"])
        collected = row["collected_at"]

        if key not in latest or collected > latest[key]["collected_at"]:
            latest[key] = row

        if collected <= week_ago:
            if key not in lastweek or collected > lastweek[key]["collected_at"]:
                lastweek[key] = row

    return list(latest.values()), list(lastweek.values())


# ------------------------
# 分類
# ------------------------
def classify(date_value):
    today = datetime.today().date()
    d = date_value

    delta = (d - today).days
    lead = "0-30" if delta <= 30 else "31-60"

    is_holiday = jpholiday.is_holiday(d)
    is_holiday_eve = jpholiday.is_holiday(d + timedelta(days=1))

    weekday = d.weekday()

    is_weekend = (
        weekday == 4 or
        weekday == 5 or
        is_holiday or
        is_holiday_eve
    )

    day_type = "weekend" if is_weekend else "weekday"

    return lead, day_type


# ------------------------
# 集計
# ------------------------
def aggregate(data):
    result = {}

    for row in data:
        area = row["area"]
        price = row["price"]

        lead, day_type = classify(row["date"])
        key = (area, lead, day_type)

        if key not in result:
            result[key] = {
                "prices": [],
                "total": 0,
                "soldout": 0
            }

        result[key]["total"] += 1

        if price is None:
            result[key]["soldout"] += 1
        else:
            result[key]["prices"].append(price)

    summary = {}

    for key, val in result.items():
        prices = val["prices"]

        if not prices:
            continue

        avg = int(sum(prices) / len(prices))
        min_price = min(prices)
        soldout_rate = int(val["soldout"] / val["total"] * 100)

        summary[key] = {
            "avg": avg,
            "min": min_price,
            "soldout_rate": soldout_rate
        }

    return summary


# ------------------------
# 差分
# ------------------------
def merge(latest, lastweek):
    result = {}

    for key, val in latest.items():
        prev = lastweek.get(key)

        diff = None
        if prev and val["avg"] and prev["avg"]:
            diff = val["avg"] - prev["avg"]

        result[key] = {**val, "diff": diff}

    return result


# ------------------------
# インサイト
# ------------------------
def generate_insight(area, data):
    comments = []

    w = data.get((area, "0-30", "weekend"))
    d = data.get((area, "0-30", "weekday"))

    if w and d:
        gap = w["avg"] - d["avg"]
        comments.append(f"週末は平日比 +{gap:,}円")

    if w and w["soldout_rate"] > 30:
        comments.append("在庫逼迫")

    return " / ".join(comments)


# ------------------------
# ホテル一覧
# ------------------------
def get_hotels():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT area, name
    FROM hotels
    """)

    rows = cursor.fetchall()
    conn.close()

    result = {}

    for r in rows:
        result.setdefault(r["area"], []).append(r["name"])

    return result


# ------------------------
# ヘッダー
# ------------------------
def format_header(hotels):
    lines = ["【対象ホテル】"]

    for area, names in hotels.items():
        label = get_area_label(area)

        display = "、".join(names[:3])
        if len(names) > 3:
            display += " 他"

        lines.append(f"    {label}:{display}")

    return "\n".join(lines)


# ------------------------
# 本文生成
# ------------------------
def format_text(summary, hotels):
    lines = []

    lines.append(format_header(hotels))
    lines.append("")

    areas = sorted(set(k[0] for k in summary.keys()))

    for area in areas:
        label_area = get_area_label(area)

        lines.append(f"【沖縄ホテル価格（{label_area}）】")

        # 0-30だけ出す（MVP）
        w = summary.get((area, "0-30", "weekend"))
        d = summary.get((area, "0-30", "weekday"))

        if w:
            lines.append(f"    週末：{w['avg']:,}円 (売り止め{w['soldout_rate']}%)")

        if d:
            lines.append(f"    平日：{d['avg']:,}円 (売り止め{d['soldout_rate']}%)")

        insight = generate_insight(area, summary)
        if insight:
            lines.append(f"    → {insight}")

        lines.append("")

    return "\n".join(lines)


# ------------------------
# メイン
# ------------------------
def main():
    data = fetch_prices()
    latest, lastweek = split_data(data)

    latest_summary = aggregate(latest)
    lastweek_summary = aggregate(lastweek)

    merged = merge(latest_summary, lastweek_summary)

    hotels = get_hotels()

    text = format_text(merged, hotels)

    with open("report.txt", "w", encoding="utf-8") as f:
        f.write(text)

    print("report.txt 出力完了")


if __name__ == "__main__":
    main()