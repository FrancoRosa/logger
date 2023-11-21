const { update_oled, getTime, write_text, dim, toogle_hour, toogle_min, toogle_frec, toogle_duration, write_anim, clear_disp, write_id, toogle_id } = require("./display");
const { getFiles, uploadFiles } = require("./mega");
const { getWifi } = require("./wifi");

clear_disp()
update_oled()
getFiles()
write_id(device_id)
getTime()
write_text(statuses[mode], 1, 1, 54);

let ai = 0;
const animation = (mode) => {
    let c = "";
    switch (mode) {

        case "recording":
            c = "#";
            break;
        case "waiting":
            c = "_";
            break;

        default:
            c = "";
            break;
    }
    let animations = [
        `${c}      `,
        ` ${c}     `,
        `  ${c}    `,
        `   ${c}   `,
        `    ${c}  `,
        `     ${c} `,
        `      ${c}`,
        `     ${c} `,
        `    ${c}  `,
        `   ${c}   `,
        `  ${c}    `,
        ` ${c}     `,
    ];
    ai++;
    if (ai >= animations.length) {
        ai = 0;
    }
    write_anim(animations[ai]);
};

setInterval(() => {
    dim_count++;
    getTime();
    if (dim_count > 10) dim_count = 11;
    dim(dim_count >= 10);
}, 1000);

setInterval(() => {
    toogle = !toogle;

    animation(statuses[mode]);
    if (statuses[mode] == "id_conf") {
        toogle_id()
    }
    if (statuses[mode] == "hour_conf") {
        toogle_hour()
    }
    if (statuses[mode] == "min_conf") {
        toogle_min()
    }
    if (statuses[mode] == "freq_conf") {
        toogle_frec();
    }
    if (statuses[mode] == "time_conf") {
        toogle_duration();
    }
}, 250);

setInterval(() => {
    getWifi()
    if(statuses[mode] === "disabled"){
        if (wifi) {

            uploadFiles()
        }else {
            getFiles()
        }
    }
    }
, 10000);