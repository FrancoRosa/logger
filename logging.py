from time import time, sleep
from datetime import datetime

current_time = datetime.now()
desired_time = current_time.replace(
    hour=11, minute=5, 
    second=30, microsecond=0
)
target = int(desired_time.timestamp())

while True:
    if time()> target:
        print(desired_time)
        print(datetime.now())
        break
    sleep(0.001)    
