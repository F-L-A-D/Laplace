#batch/utils/config.py

import os

DATE_CHUNK = 30
DEBUG = os.getenv("DEBUG") == "1"

SOURCE_CONFIG = {
    1: { #楽天
        "min_interval": 0.8,
        "max_hotels": 15
    }
}