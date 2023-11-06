const font = require("oled-font-5x7");
const oled_disp = require("rpi-oled");
const { format } = require("./helpers");

const oled_opts = {
    width: 128,
    height: 64,
};

const oled = new oled_disp(oled_opts);

const clear_disp = () => {
    oled.fillRect(1, 1, 128, 64, 0);
}

const write_text = (text, size = 1, x = 1, y = 1) => {
    oled.setCursor(x, y);
    oled.writeString(font, size, text, 1, false);
};

const getTime = () => {
    const time = new Date().toLocaleTimeString("SV");
    write_text(time, 2, 27, 1, false);
};

const write_start = (text) => {
    write_text(text, 2, 27, 17); //start
    write_text("Start", 1, 93, 23);
};

const write_duration = (text) => {
    write_text(text, 2, 1, 36); //min
    write_text("Min", 1, 30, 41);
};

const write_frec = (text) => {
    write_text(text, 2, 70, 36); //hz
    write_text("Hz", 1, 110, 41);
};

const update_oled = () => {
    write_start(`${format(global.start_hour, 2)}:${format(global.start_min, 2)}`);
    write_duration(`${format(global.mins, 2)}`);
    write_frec(format(global.frequencies[global.freq], 3));
}





const toogle_frec = () => {
    toogle ? write_frec(`${format(global.frequencies[global.freq], 3)}`) : write_frec("___");
};
const toogle_duration = () => {
    toogle ? write_duration(`${format(global.mins, 2)}`) : write_duration("__");
};
const toogle_hour = () => {
    toogle ? write_start(`${format(global.start_hour, 2)}:${format(global.start_min, 2)}`) : write_start(`__:${format(global.start_min, 2)}`);
};
const toogle_min = () => {
    toogle ? write_start(`${format(global.start_hour, 2)}:${format(global.start_min, 2)}`) : write_start(`${format(global.start_hour, 2)}:__`);
};

const write_anim = (text) => {
    oled.setCursor(100, 54);
    oled.writeString(font, 1, text, 1, false);
}

const dim = (condition) => {
    oled.dimDisplay(condition)
}

exports.write_text = write_text
exports.update_oled = update_oled
exports.getTime = getTime

exports.toogle_frec = toogle_frec
exports.toogle_duration = toogle_duration
exports.toogle_hour = toogle_hour
exports.toogle_min = toogle_min

exports.write_anim = write_anim
exports.clear_disp = clear_disp
exports.dim = dim



// update_oled()