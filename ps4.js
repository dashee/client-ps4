var ds4 = require('ds4');
var hid = require('node-hid');
var through = require('through');

console.log(hid.devices());
device = new hid.HID(1356, 1476);

device.on('data', function(buf) {
    data = ds4.parseDS4HIDData(buf.slice(0));

    if (data.cross) {
        ds4.emit(device, {
            r: 0,
            g: 0,
            b: 255
        })
    }

    if (data.circle) {
        ds4.emit(device, {
            r: 255,
            g: 0,
            b: 0
        })
    }

    if (data.triangle) {
        ds4.emit(device, {
            r: 0,
            g: 255,
            b: 0
        })
    }

    if (data.square) {
        ds4.emit(device, {
            r: 255,
            g: 100,
            b: 153
        })
    }

    console.log(ds4.parseDS4HIDData(buf));
});