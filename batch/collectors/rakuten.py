#batch/collectors/rakuten.py

from collectors.base import DataCollector
import requests
import os
from dotenv import load_dotenv
import random
import time
import threading

load_dotenv()

class RakutenCollector(DataCollector):
    BASE_URL = "https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426"

    SORT_MAP = {
        "max": "-roomCharge",
        "min": "+roomCharge"
    }

    def __init__(self, limiter):
        self.session = requests.Session()
        self.limiter = limiter

        self.total_calls = 0
        self.clean_hits = 0

        self.lock = threading.Lock()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        }

    def build_params(self, checkin, checkout, hotels, sort):
        hotel_nos = ",".join(str(h["external_id"]) for h in hotels)

        return {
            "format": "json",
            "checkinDate": checkin,
            "checkoutDate": checkout,
            "hotelNo": hotel_nos,
            "adultNum": 2,
            "roomNum": 1,
            "sort": sort,
            "applicationId": os.getenv("RAKUTEN_APP_ID"),
            "accessKey": os.getenv("RAKUTEN_ACCESS_KEY")
        }

    def fetch_prices(self, hotels, checkin, checkout, fetch_review=False):     
        all_results = {}

        for sort_label, sort_val in self.SORT_MAP.items():
            self.limiter.wait()
            params = self.build_params(checkin, checkout, hotels, sort=sort_val)

            for attempt in range(2):
                with self.lock: self.total_calls += 1
                try:
                    res = self.session.get(self.BASE_URL, params=params, headers=self.headers, timeout=10)

                    if res.status_code == 200:
                        data = res.json()
                        with self.lock:
                            if attempt == 0:
                                self.clean_hits += 1

                        partial_data = self._parse_response(data, sort_label, fetch_review)
                        
                        for hotel_no, info in partial_data.items():
                            if hotel_no not in all_results:
                                all_results[hotel_no] = info
                            else:
                                all_results[hotel_no].update(info)
                        break

                    elif res.status_code == 429:
                        time.sleep(2 + random.random())
                        continue
                        
                    elif res.status_code == 403:
                        print("[FATAL] RAKUTEN API | 403 Forbidden. Source might be blocked.")
                        return all_results

                    else:
                        break

                except requests.exceptions.RequestException:
                    time.sleep(1)
        
        return all_results

    def _parse_response(self, data, sort_label, fetch_review=False):
        result = {}
        hotels = data.get("hotels", [])

        for h in hotels:
            hotel_block = h.get("hotel", [])
            if len(hotel_block) < 2:
                continue

            basic = hotel_block[0].get("hotelBasicInfo", {})
            rooms = hotel_block[1].get("roomInfo") or []
            hotel_no = basic.get("hotelNo")

            if not hotel_no or not rooms:
                continue

            target_info = {
                "room_name": None,
                "room_class": None,
                "plan_name": None,
                "plan_id": None,
                "price": None
            }

            for item in rooms:
                if "roomBasicInfo" in item:
                    b_info = item["roomBasicInfo"]
                    if target_info["room_name"] is None:
                        target_info["room_name"] = b_info.get("roomName")
                        target_info["room_class"] = b_info.get("roomClass")
                        target_info["plan_name"] = b_info.get("planName")
                        target_info["plan_id"] = b_info.get("planId")
                
                if "dailyCharge" in item:
                    if target_info["price"] is None:
                        target_info["price"] = item["dailyCharge"].get("total")

                if all(v is not None for v in target_info.values()):
                    break

            result[hotel_no] = {
                f"{sort_label}_price": target_info["price"],
                f"{sort_label}_room_name": target_info["room_name"],
                f"{sort_label}_room_class": target_info["room_class"],
                f"{sort_label}_plan_name": target_info["plan_name"],
                f"{sort_label}_plan_id": target_info["plan_id"],
            }

            if fetch_review:
                result[hotel_no]["review_avg"] = basic.get("reviewAverage")
                result[hotel_no]["review_count"] = basic.get("reviewCount")

        return result


    def hit_rate(self):
        if self.total_calls == 0: return 0
        return self.clean_hits / self.total_calls