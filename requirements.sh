# install node
# https://github.com/nodesource/distributions
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs -y

# install i2c dependencies
sudo apt-get install -y i2c-tools libi2c-dev

# install oled library
# https://github.com/normen/rpi-oled
sudo npm install -g rpi-oled coffee-script

# install GPS dependecies
sudo apt install -y gpsd 
sudo apt install -y ntp

# install readis
sudo apt install -y redis

# enable redis service
sudo systemctl enable redis
sudo apt install -y python3-pip
sudo apt install -y python3-redis
sudo apt-get install -y libudev-dev
# activate i2c
sudo raspi-config nonint do_i2c 0

# add this line using "sudo su"
echo 'gpio=13,19,26=pu' >> /boot/config.txt

echo "use raspi-config to enable the serial hardware"
echo "Ready, you need to restart to make effect"