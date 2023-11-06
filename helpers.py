from time import time
from random import random as rdn


def get_data():
    return [int((time)), rdn(), rdn(), rdn()]


def save_file(filename, data):
    with open(filename, 'w') as file:
        for value in data:
            file.write(
                f"{value[0]}, {value[1]}, {value[2]}, {value[3]}\n")


def get_filename(current):
    return current.strftime("%Y%m%d_%H:%M:%S.csv")
