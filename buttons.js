var gpio = require("onoff").Gpio;
var redis = require('redis');
var publisher = redis.createClient(); //creates a new client
var subscriber = redis.createClient(); //creates a new client


const { write_text, update_oled } = require("./display");
const { saveSettings } = require("./variables");

publisher.connect();
subscriber.connect();

var up_b = new gpio(13, "in", "falling", { debounceTimeout: 30 });
var down_b = new gpio(19, "in", "falling", { debounceTimeout: 30 });
var mode_b = new gpio(26, "in", "falling", { debounceTimeout: 30 });


subscriber.subscribe('message', (res) => {
    console.log(res)
    switch (res) {
        case "recording":
            console.log("...recording")
            break;
        case "storing":
            console.log("...storing")
            break;
        case "completed":
            console.log("...completed")
            break;
        default:
            break;
    }
})

up_b.watch((err, value) => {
    dim_count = 0;
    while (up_b.readSync() == 0) { }
    switch (statuses[mode]) {
        case "hour_conf":
            start_hour++;
            if (start_hour > 23) { start_hour = 0 }
            break;
        case "min_conf":
            start_min++;
            if (start_min > 59) { start_min = 0 }
            break;
        case "time_conf":
            mins++;
            if (mins > 30) { mins = 1 }
            break;
        case "freq_conf":
            freq++;
            if (freq > frequencies.length - 1) { freq = 0 }
            break;
        default:
            break;
    }
    console.log("up");
});

down_b.watch((err, value) => {
    dim_count = 0;
    while (down_b.readSync() == 0) { }
    switch (statuses[mode]) {
        case "hour_conf":
            start_hour--;
            if (start_hour < 0) { start_hour = 23 }
            break;
        case "min_conf":
            start_min--;
            if (start_min < 0) { start_min = 59 }
            break;
        case "time_conf":
            mins--;
            if (mins < 1) { mins = 30 }
            break;
        case "freq_conf":
            freq--;
            if (freq < 0) { freq = frequencies.length - 1 }
            break;
        default:
            break;
    }
    console.log("down");
});

mode_b.watch((err, value) => {
    mode++;
    dim_count = 0;

    if (mode >= statuses.length - 1) {
        mode = 0;
    }
    if (statuses[mode] === "disabled") {
        saveSettings()
        update_oled()
    }
    switch (statuses[mode]) {
        case "waiting":
            publisher.publish('message', JSON.stringify({ waiting: true, start_hour, start_min, freq: frequencies[freq], mins }));
            break;
        default:
            publisher.publish('message', JSON.stringify({ waiting: false }));
            break;
    }
    write_text(statuses[mode], 1, 1, 54);
    while (mode_b.readSync() == 0) { }
    console.log("mode");

});
