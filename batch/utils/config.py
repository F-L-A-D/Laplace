#batch/utils/config.py

import os

DATE_CHUNK = 30
MIN_INTERVAL = 0.8
DEBUG = os.getenv("DEBUG") == "1"
MAX_HOTELS = 15