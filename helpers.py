from time import time, sleep
from random import random as rdn
from json import loads
from datetime import datetime
from mpu6050 import mpu6050

sensor = mpu6050(0x68)
sensor.set_accel_range(sensor.ACCEL_RANGE_2G)
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
            tc = datetime.fromtimestamp(value[0])
            te = tc.strftime("%H:%M:%S.%f")[:-3]
            v1 = round(value[1], 4)
            v2 = round(value[2], 4)
            v3 = round(value[3], 4)
            file.write(f"{te}; {v1}; {v2}; {v3}\n")


def save_file_test(filename, data):
    tc = datetime.now()
    te = tc.strftime("%H:%M:%S.%f")[:-3]
    v1 = 0.0
    v2 = 0.0
    v3 = 0.0
    with open("/home/pi/logger/" + filename, 'w') as file:
        for value in data:
            tc = datetime.fromtimestamp(value[0])
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


def get_sample_data(samples, per):
    print("...recording")

    result = [[0.0, 0.0, 0.0, 0.0]]*samples
    sample = 0
    while True:
        result[sample] = get_data()
        sample = sample+1
        if (sample >= samples):
            break
        sleep(per)

    save_file_test("test.csv", result)
    print("...done")


get_sample_data(100, 0.01)
