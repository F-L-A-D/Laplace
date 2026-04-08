#batch/collectors/base.py

class DataCollector:
    def fetch_price(self, hotel, checkin, checkout):
        raise NotImplementedError