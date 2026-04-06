#tools/import_csv.py

import csv
from batch.db import get_connection


def import_hotels(csv_path):
    conn = get_connection()
    cursor = conn.cursor()

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            cursor.execute("""
            INSERT INTO hotels (id, name)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name)
            """, (
                row["id"],
                row["name"]
            ))

    conn.commit()
    conn.close()


def import_hotel_sources(csv_path):
    conn = get_connection()
    cursor = conn.cursor()

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            cursor.execute("""
            INSERT INTO hotel_sources (hotel_id, source_id, base_url, external_id, is_active)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                base_url = VALUES(base_url),
                external_id = VALUES(external_id),
                is_active = VALUES(is_active)
            """, (
                row["hotel_id"],
                row["source_id"],
                row.get("base_url") or None,
                row.get("external_id") or None,
                int(row.get("is_active", 1))
            ))

    conn.commit()
    conn.close()


if __name__ == "__main__":
    import_hotels("data/hotels.csv")
    import_hotel_sources("data/hotel_sources.csv")
    print("== CSV import done ===")