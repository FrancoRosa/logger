from redis import Redis
from time import time, sleep
from datetime import datetime, timedelta
from json import loads
from threading import Thread
from helpers import *

rd = Redis(host='localhost', port=6379, db=0)
sub = rd.pubsub()


current_time = datetime.now()
desired_time = current_time
samples = 1
freq = 1
target = int(desired_time.timestamp())
data = []
per = 1
filename = 'test.txt'
waiting = False


def wait_fn():
    global data, waiting, filename
    while True:
        if waiting == True:
            if time() > target:
                print(desired_time)
                print(datetime.now())
                rd.publish("message", "recording")
                sample = 0
                while True:
                    print("loop data", len(data))
                    data[sample] = get_data()
                    sample = sample+1
                    if sample >= samples:
                        rd.publish("message", "storing")
                        save_file(filename=filename, data=data)
                        rd.publish("message", "saved")
                        break
                    sleep(per)
                print("set waiting to false")
                waiting = False

            sleep(0.001)
        else:
            print(".")
            sleep(1)


def listener():
    global desired_time, target, samples, freq, per, data, filename, waiting
    sub.subscribe('message')
    for message in sub.listen():
        if message is not None and isinstance(message, dict):
            ipc = loads(message.get('data'))

            if ipc["waiting"] == True:
                print("... configuring")
                current_time = datetime.now()
                tomorrow_time = current_time + timedelta(days=1)
                desired_time = current_time.replace(
                    hour=ipc["start_hour"], minute=ipc["start_min"],
                    second=0, microsecond=0
                )

                if int(desired_time.timestamp()) < int(current_time.timestamp()):
                    desired_time = tomorrow_time.replace(
                        hour=ipc["start_hour"], minute=ipc["start_min"],
                        second=0, microsecond=0
                    )
                samples = 60*ipc["mins"]*ipc["freq"]
                freq = ipc["freq"]
                per = 1/freq
                filename = get_filename(current_time)
                target = int(desired_time.timestamp())
                data = [[int(time()), 0, 0, 0]]*samples
                print("config data", len(data))
                print("waiting....")
                waiting = True
            else:
                print("disabled....")
                waiting = False


Thread(target=wait_fn).start()
listener()
