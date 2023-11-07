
const { execSync } = require('node:child_process');
const { usb, getDeviceList } = require('usb');
const { write_usb } = require('./display');

let devices = getDeviceList();
console.log(devices.map(d => d.deviceAddress))

usb.on('attach', (device) => {
    devices.push(device)
    mount()

});

usb.on('detach', (device) => {
    devices.splice(devices.findIndex(d => d.deviceAddress === device.deviceAddress), 1)
    mount()
});

const getDeviceName = () => {
    let rp = execSync("ls -l /dev/disk/by-uuid").toString()
    rp = rp.split("\n").filter(l => l.includes('../../'))
    rp = rp.map(l => l.split("../..")[1]).find(l => l.includes("/sd"))
    return "/dev" + rp
}

const mount = () => {
    pendrive = false
    if (devices.filter(d => d.deviceDescriptor.bDeviceClass == 0).length == 1) {
        console.log("mounting device")
        const dev = getDeviceName()
        execSync("sudo mkdir -p /media/usb")
        execSync("sudo chown -R pi:pi /media/usb")
        execSync(`sudo mount -o remount ${dev} /media/usb -o uid=pi,gid=pi`)
        console.log("... device mounted")
        pendrive = true
    }
    write_usb(pendrive)
}
setTimeout(() => {
    mount()
}, 5000);