var tessel = require('tessel');
var jsonfile = require( 'jsonfile' );
var rando = require('random-number-in-range');
var fs = require('fs');
var path = require( 'path' );

const Printer = require('./printer.js');
const printer = new Printer({ heatingTime: 120, heatingInterval: 3 });

var button;
var bounce;
var pressed = false;
var config = jsonfile.readFileSync( path.join( __dirname, 'waits.json' ) );

// usb storage
// var mountPoint = '/mnt/sda1';
//var config = jsonfile.readFileSync( path.join( mountPoint, 'poems.json' ) );

if ('undefined' !== typeof tessel.port) {
    button = tessel.port.B.pin[7];
    // monitor button pin
    if ('undefined' !== typeof button) {
        bounce = setInterval(function () {
            // asynchromouns button reading
            // digital signal (on or off)
            button.read(function (err, value) {
                // up (off)
                if (value === 0) {
                    pressed = false;
                    // down (on)
                } else if (value === 1) {
                    // only fire press once
                    if (!pressed) {
                        pressed = true;
                        p = randomItem();
                        print(p);
                    }
                }
            });
        }, 100);
    }
}


function randomItem() {
    var itemCount = config.items.length;
    var randomItem = rando(1, itemCount);
    return config.items[randomItem-1];
}

function print(item, title) {

    printer
        .init(tessel.port['A'])
        .then(() => {
            if ('undefined' !== typeof title) {
                return printer.writeLine(title);
            }
        })
        .then(() => {
            return printer
                .writeLine('^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^');
        })
        .then(() => {
                for (var i = 0; i < item.lines.length; i++) {
                    console.log(item.lines[i]);
                    printer.writeLine(item.lines[i]);
                }
        })
        .then(() => {
            if ('undefined' !== typeof item.title) {
                printer.lineFeed(1);
                printer.writeLine(item.title);
            }
        })
        .then(() => {
            return printer
                .writeLine('^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^');
        })
        .then(() => {
            return printer.lineFeed(3);
        })
        .then(() => {
            return printer.print();
        })
        .then(printer => {
            console.log('printing done');
        })
        .catch(error => {
            console.error(error);
        });

}