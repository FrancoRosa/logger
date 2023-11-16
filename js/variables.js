const fs = require('fs');
const settings = require("../settings.json")

global.device_id = settings.device_id
global.frequencies = settings.frequencies;
global.statuses = settings.statuses;

global.freq = settings.freq;
global.mode = settings.mode;
global.mins = settings.mins;
global.start_hour = settings.start_hour;
global.start_min = settings.start_min;
global.dim_count = settings.dim_count;

global.toogle = false
global.pendrive = false
global.wifi = false

const saveSettings = () => {
    const content = {
        device_id,
        frequencies,
        statuses,
        freq,
        mode,
        mins,
        start_hour,
        start_min,
        dim_count
    }
    fs.writeFile("settings.json", JSON.stringify(content, null, 2), (err) => {
        if (err) {
            console.error(`Error writing to the file: ${err}`);
        } else {
            console.log("settings saved");
        }
    })
}

exports.saveSettings = saveSettings