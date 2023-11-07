from time import time
from random import random as rdn
from json import loads
from datetime import datetime


def get_data():
    return [time(), rdn(), rdn(), rdn()]


def save_file(filename, data):
    tc = datetime.now()
    te = tc.strftime("%H:%M:%S.%f")[:-3]
    v1 = 0.0
    v2 = 0.0
    v3 = 0.0
    with open("records/" + filename, 'w') as file:
        for value in data:
            tc = datetime.utcfromtimestamp(value[0])
            te = tc.strftime("%H:%M:%S.%f")[:-3]
            v1 = round(value[1], 4)
            v2 = round(value[2], 4)
            v3 = round(value[3], 4)
            file.write(f"{te}, {v1}, {v2}, {v3}\n")


def get_filename(current):
    return current.strftime("%Y%m%d_%H%M%S.csv")


def is_json(text):
    try:
        loads(text)
        return True
    except:
        return False
