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
    try:
        ac_data = sensor.get_accel_data()
    except:
        ac_data = {"x": 0, "y": 0, "z": 0}
        pass
    return [time(), ac_data["x"], ac_data["y"], ac_data["z"]]


def save_file(filename, data):
    t =0.0
    tc = datetime.now()
    te = tc.strftime("%H:%M:%S.%f")[:-3]
    v1 = 0.0
    v2 = 0.0
    v3 = 0.0
    with open("csv/"+ filename, 'w') as file:
        start =  data[0][0]
        for value in data:
            t = round(value[0]-start,3)
            tc = datetime.fromtimestamp(value[0])
            te = tc.strftime("%H:%M:%S.%f")[:-3]
            v1 = round(value[1], 4)
            v2 = round(value[2], 4)
            v3 = round(value[3], 4)
            file.write(f"{t};{te}; {v1}; {v2}; {v3}\n")



def get_filename(current, id):
    filename  = current.strftime("%Y%m%d_%H%M%S.csv")
    filename  = filename.replace(".csv","_%d.csv"%id)
    return filename


def is_json(text):
    try:
        loads(text)
        return True
    except:
        return False


