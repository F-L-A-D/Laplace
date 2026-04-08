#batch/jobs/main.py

from jobs.fetch import run as run_fetch
from utils.config import DEBUG

def main():    
    if DEBUG:
        print("[DEBUG MODE]")
    else:
        print("[MAIN EXECUTED]")
    run_fetch()

if __name__ == "__main__":
    main()