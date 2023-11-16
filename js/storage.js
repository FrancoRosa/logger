
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
    let rp = execSync("ls -l /dev/disk/by-uuid")
    rp = rp.toString().split("\n").filter(l => l.includes('../../'))
    rp = rp.map(l => l.split("../..")[1]).find(l => l.includes("/sd"))
    console.log(rp)
    if (rp) {
        return "/dev" + rp
    } else {
        return false
    }
}

const mount = () => {
    setTimeout(() => {
        pendrive = false
        if (devices.filter(d => d.deviceDescriptor.bDeviceClass == 0).length == 1) {
            console.log("mounting device")
            const dev = getDeviceName()
            if (dev) {
                execSync("sudo mkdir -p /media/usb")
                execSync("sudo chown -R pi:pi /media/usb")
                try {
                    execSync(`sudo mount --no-mtab ${dev} /media/usb -o uid=pi,gid=pi`)
                } catch (error) {
                    console.log("... already mounted")
                }
                console.log("... device mounted")
                pendrive = true
            }
        }
        write_usb(pendrive)
    }, 2000);

}
mount()


