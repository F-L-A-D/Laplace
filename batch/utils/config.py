#batch/utils/config.py

import os

DATE_CHUNK = 30
DEBUG = os.getenv("DEBUG") == "1"

SOURCE_CONFIG = {
    1: {
        "label": "RAKUTEN",
        "min_interval": 0.8,
        "max_hotels": 15
    },
    2: {
        "label": "JALAN",
        "min_interval": 0.8,
        "max_hotels": 10
    }
}