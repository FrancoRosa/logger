# logger
> Acceleration data logger with cloud support to store on mega.nz, it uses GPS to precisely timestamp samples


# Requirements
Enable Serial port and I2C interface with `sudo raspi-config`

## GPS configuration
Enable GPS communication
Enable NTP to use the GPS as clock source

```bash
sudo su
apt install gpsd 
apt install ntp
```
Edit configuration files as shown in the videos

Restart and enable services if necessary

```bash
systemctl restart gpsd
systemctl restart ntp
systemctl enable gpsd
```

Check if the time is accurate with this command
```bash
watch -n 1 ntpq -p
```
The response should be similar to this, and the asterisk should point to the first gps source
```bash
     remote                             refid      st t when poll reach   delay   offset   jitter
=================================================================================================
*SHM(0)                            .GPS.            0 l    -    8  377   0.0000 -51.7218   5.6308
 0.debian.pool.ntp.org             .POOL.          16 p    -  256    0   0.0000   0.0000   0.0010
+a.ntp.br                          200.160.7.186    2 u   55   64  377 147.9015  71.1353  39.2378
+a.st1.ntp.br                      .ONBR.           1 u    5   64  377 124.0965  68.8115  42.7891
```

Useful commands
```bash
cgps -s

```

Resources:
PPS enabled us accuracy
https://www.youtube.com/watch?v=7aTZ66ZL6Dk

No pps ms accuracy
https://www.youtube.com/watch?v=NFSogtVp0Xo

## Redis
```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis

```
Install redis for python 
```bash
pip install redis
```