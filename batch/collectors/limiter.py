import time
import threading

class RateLimiter:
    def __init__(self, min_interval: float):
        self.min_interval = min_interval
        self.last_request_time = 0
        self.lock = threading.Lock()

    def wait(self):
        with self.lock:
            now = time.time()
            elapsed = now - self.last_request_time

            if elapsed < self.min_interval:
                time.sleep(self.min_interval - elapsed)

            self.last_request_time = time.time()