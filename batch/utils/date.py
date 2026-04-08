#batch/utils/date.py

from datetime import datetime, timedelta
from utils.config import DEBUG

def build_dates(start, count):
    today = datetime.today()

    return [
        (
            (today + timedelta(days=start+i)).strftime("%Y-%m-%d"),
            (today + timedelta(days=start+i+1)).strftime("%Y-%m-%d")
        )
        for i in range(count)
    ]

def get_target_days():
    if DEBUG:
        return 3

    today = datetime.today().weekday()

    if today == 0:
        return 180
    elif today in [1, 3, 5]:
        return 120
    else:
        return 90