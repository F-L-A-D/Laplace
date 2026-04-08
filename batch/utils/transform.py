#batch/utils/transform.py

def build_hotel_results(batch, price_map, checkin):
    result = {}

    for h in batch:
        hotel_id = h["hotel_id"]
        ext_id = int(h["external_id"])

        data = price_map.get(ext_id, {})

        result.setdefault(hotel_id, []).append({
            "date": checkin,
            "price": data.get("price"),
            "review_avg": data.get("review_avg"),
            "review_count": data.get("review_count")
        })

    return result

def merge(dest, src):
    for k, v in src.items():
        dest.setdefault(k, []).extend(v)