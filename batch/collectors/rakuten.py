from collectors.base import DataCollector
import requests
import os
from dotenv import load_dotenv
import time
import threading

load_dotenv()

class RakutenCollector(DataCollector):
    BASE_URL = "https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426"

    def __init__(self, limiter):
        self.session = requests.Session()
        self.limiter = limiter

        self.success = 0
        self.limit_hit = 0
        self.lock = threading.Lock()
        self.headers = {"User-Agent": "Mozilla/5.0"}
        

    def build_params(self, checkin, checkout, hotel_no):
        return {
            "format": "json",
            "checkinDate": checkin,
            "checkoutDate": checkout,
            "hotelNo": hotel_no,
            "adultNum": 2,
            "roomNum": 1,
            "sort": "standard",
            "applicationId": os.getenv("RAKUTEN_APP_ID"),
            "accessKey": os.getenv("RAKUTEN_ACCESS_KEY")
        }

    def fetch_price(self, hotel, checkin, checkout):
        print("=== START FETCH ===")
        self.limiter.wait()

        params = self.build_params(checkin, checkout, hotel["external_id"])

        for _ in range(2):
            try:
                print("=== BEFORE REQUEST ===", params)
                res = self.session.get(self.BASE_URL, params=params, headers=self.headers, timeout=10)
                print("=== AFTER REQUEST ===", res.status_code)

                if res.status_code == 200:
                    data = res.json()
                    with self.lock:
                        self.success += 1
                    return self._extract_price(data)

                elif res.status_code == 429:
                    with self.lock:
                        self.limit_hit += 1
                    time.sleep(0.2)

                else:
                    return None

            except requests.exceptions.RequestException:
                time.sleep(1)

        return None

    def _extract_price(self, data):
        try:
            hotels = data.get("hotels")
            if not hotels:
                return None

            rooms = hotels[0]["hotel"][1]["roomInfo"]

            prices = [
                r["dailyCharge"]["total"]
                for r in rooms
                if "dailyCharge" in r
            ]

            return min(prices) if prices else None

        except Exception:
            return None

    def hit_rate(self):
        total = self.success + self.limit_hit
        return self.limit_hit / total if total > 0 else 0