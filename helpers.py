from time import time
from random import random as rdn
from json import loads
from datetime import datetime
from mpu6050 import mpu6050

sensor = mpu6050(0x68)
sensor.set_accel_range(ACCEL_RANGE_2G)
ac_data = sensor.get_accel_data()


def get_data():
    # return [time(), rdn(), rdn(), rdn()] #for demo purposes
    ac_data = sensor.get_accel_data()
    return [time(), ac_data["x"], ac_data["y"], ac_data["z"]]


def save_file(filename, data):
    tc = datetime.now()
    te = tc.strftime("%H:%M:%S.%f")[:-3]
    v1 = 0.0
    v2 = 0.0
    v3 = 0.0
    with open("/media/usb/" + filename, 'w') as file:
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
