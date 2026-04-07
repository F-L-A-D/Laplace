#batch/collectors/rakuten.py

from collectors.base import DataCollector
import requests
import os
from datetime import datetime
from dotenv import load_dotenv
import random
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
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        }

    def build_params(self, checkin, checkout, hotels):
        hotel_nos = ",".join(str(h["external_id"]) for h in hotels)

        return {
            "format": "json",
            "checkinDate": checkin,
            "checkoutDate": checkout,
            "hotelNo": hotel_nos,
            "adultNum": 2,
            "roomNum": 1,
            "sort": "+roomCharge",
            "applicationId": os.getenv("RAKUTEN_APP_ID"),
            "accessKey": os.getenv("RAKUTEN_ACCESS_KEY")
        }

    def fetch_prices(self, hotels, checkin, checkout, get_review=False):
        self.limiter.wait()
        self.current_get_review = get_review

        params = self.build_params(checkin, checkout, hotels)

        for _ in range(2):
            try:
                res = self.session.get(self.BASE_URL, params=params, headers=self.headers, timeout=10)

                if res.status_code == 200:
                    data = res.json()
                    with self.lock:
                        self.success += 1
                    return self._parse_response(data)
                
                elif res.status_code == 403:
                    print(f"403 Rate Limit Hit. Checkin: {checkin}")
                    with self.lock:
                        self.limit_hit += 1
                    return {}

                elif res.status_code == 429:
                    print("429 Rate Limit Hit. Sleep...")
                    with self.lock:
                        self.limit_hit += 1
                    time.sleep(2 + random.random())

                else:
                    return {}

            except requests.exceptions.RequestException:
                time.sleep(1)

        return {}

    def _parse_response(self, data):
        result = {}
        hotels = data.get("hotels", [])

        for h in hotels:
            hotel_block = h.get("hotel", [])
            if len(hotel_block) < 2:
                continue

            basic = hotel_block[0].get("hotelBasicInfo", {})
            rooms = hotel_block[1].get("roomInfo") or []
            hotel_no = basic.get("hotelNo")

            if not hotel_no:
                continue

            prices = []

            for r in rooms:
                charge = r.get("dailyCharge")
                if charge and "total" in charge:
                    prices.append(charge["total"])
            
            price = min(prices) if prices else None

            if self.current_get_review:
                review_avg = basic.get("reviewAverage")
                review_count = basic.get("reviewCount")
            else:
                review_avg = None
                review_count = None

            result[hotel_no] = {
                "price": price,
                "review_avg": review_avg,
                "review_count": review_count
            }

        return result


    def hit_rate(self):
        total = self.success + self.limit_hit
        return self.limit_hit / total if total > 0 else 0