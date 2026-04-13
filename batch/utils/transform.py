#batch/utils/transform.py

from collections import defaultdict

def build_hotel_results(batch, price_map, checkin):
    result = {}

    for h in batch:
        hotel_id = h["hotel_id"]
        ext_id = int(h["external_id"])

        data = price_map.get(ext_id, {})

        result.setdefault(hotel_id, []).append({
            "date": checkin,
            # 安値情報
            "price_min": data.get("min_price"),
            "room_min_class": data.get("min_room_class"),
            "room_min_name": data.get("min_room_name"),
            "plan_min_id": data.get("min_plan_id"),
            "plan_min_name": data.get("min_plan_name"),
            # 高値情報
            "price_max": data.get("max_price"),
            "room_max_class": data.get("max_room_class"),
            "room_max_name": data.get("max_room_name"),
            "plan_max_id": data.get("max_plan_id"),
            "plan_max_name": data.get("max_plan_name"),
            # 共通情報
            "review_avg": data.get("review_avg"),
            "review_count": data.get("review_count")
        })

    return result

def merge(dest, src):
    for k, v in src.items():
        dest.setdefault(k, []).extend(v)

def group_by_date(rows):
    grouped = defaultdict(list)

    for r in rows:
        grouped[r["date"]].append(r)

    return grouped