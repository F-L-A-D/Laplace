from collectors.base import DataCollector
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv()

class RakutenCollector(DataCollector):
    BASE_URL = "https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426"

    def build_rakuten_params(self, checkin, checkout, hotel_no):
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
        hotel_no = hotel["external_id"]
        params = self.build_rakuten_params(checkin, checkout, hotel_no)

        for _ in range(3):
            try:
                res = requests.get(self.BASE_URL, params=params, timeout=10)

                if res.status_code == 200:
                    data = res.json()
                    return self._extract_price(data)

                elif res.status_code == 429:
                    print("Rate limit hit. sleep...")
                    time.sleep(2)

                else:
                    print(f"ERROR: {res.status_code}")
                    return None

            except requests.exceptions.RequestException as e:
                print(f"Connection error: {e}")
                time.sleep(2)

        return None


    def _extract_price(self, data):
        try:
            rooms = data["hotels"][0]["hotel"][1]["roomInfo"]

            prices = [
                r["dailyCharge"]["total"]
                for r in rooms
                if "dailyCharge" in r
            ]

            return min(prices) if prices else None

        except Exception:
            return None