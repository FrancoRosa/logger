const { exec } = require('child_process');
const { write_wifi } = require('./display');

const getWifi = () => {
    exec('iwgetid', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error checking WiFi connection: ${error.message}`);
            return;
        }

        if (stdout.includes('ESSID:')) {
            console.log('WiFi is connected.');
            wifi = true;
            write_wifi(wifi)

        } else {
            console.log('WiFi is not connected.');
            wifi = false;
            write_wifi(wifi)
        }
    });
}

exports.getWifi = getWifi;