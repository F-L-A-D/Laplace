#batch/utils/parse_args.py

import sys

def parse_args():
    args = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            k, v = arg.split("=", 1)
            args[k] = v

    return args