const { exec } = require('child_process');
const { write_wifi } = require('./display');

const getWifi = () => {
    exec('iwgetid', (error, stdout, stderr) => {
        if (error) {
            wifi = false;
            return;
        }

        if (stdout.includes('ESSID:')) {
            wifi = true;

        } else {
            wifi = false;
        }
        write_wifi(wifi)
    });
}

exports.getWifi = getWifi;