var ds4 = require('ds4');
var hid = require('node-hid');
var dgram = require('dgram');
var cla = require('command-line-args');

// Set the arguments
GLOBAL.arguments = cla([
    { name: 'host', alias: 'h', type: String, defaultValue: "localhost" },
    { name: 'port', alias: 'p', type: Number, defaultValue: 2047 }
]);

//console.log(hid.devices());
var client = dgram.createSocket('udp4');
device = new hid.HID(1356, 1476);

// Helpful logs to determine
console.log("Connecting to host " + GLOBAL.arguments.host + ":" + GLOBAL.arguments.port)
console.log("Opened device 1356, 1476");

/**
 * On each data that comes back from the controller send to
 * the server
 */
device.on('data', function(buf) {
    data = ds4.parseDS4HIDData(buf.slice(0));
    
    var message = new Buffer([
        0, // This is telling the server I am sending a settarget command
        data.leftAnalogY,
        data.leftAnalogX,
        data.rightAnalogX,
        data.rightAnalogY
    ]);

    var toStickData = {
        red: 0,
        green: 0,
        blue: 0,
        flashOn: 0,
        flashOff: 0,
        rumbleRight: 0,
        rumbleLeft: 0
    };

    // Send to the server
    client.send(message, 0, message.length, GLOBAL.arguments.port, GLOBAL.arguments.host);

    // Add vibration when the throttle is closer to max
    if (data.rightAnalogY > 240) {
        toStickData.rumbleLeft = 200;
        toStickData.rumbleRight = 200;
    } else if (data.rightAnalogY > 230) {
        toStickData.rumbleLeft = 150;
        toStickData.rumbleRight = 150;
    } else if (data.rightAnalogY > 200) {
        toStickData.rumbleLeft = 100;
        toStickData.rumbleRight = 100;
    }

    ds4.emit(device, {
        r: toStickData.red,
        g: toStickData.green,
        b: toStickData.blue,
        flashOn: toStickData.flashOn,
        flashOff: toStickData.flashOff,
        rumbleRight: toStickData.rumbleRight,
        rumbleLeft: toStickData.rumbleLeft
    });

    console.log(data.leftAnalogY + "p " + data.leftAnalogX + "r "  + data.rightAnalogX + "y " + data.rightAnalogY + "t")
});