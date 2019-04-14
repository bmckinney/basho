var tessel = require('tessel');
var jsonfile = require( 'jsonfile' );
var rando = require('random-number-in-range');
var fs = require('fs');
var path = require( 'path' );
var thermalprinter = require('tessel-thermalprinter');

var button;
var bounce;
var pressed = false;
var printer;
// var config = jsonfile.readFileSync( path.join( __dirname, 'poems.json' ) );

// usb storage
var mountPoint = '/mnt/sda1';
var config = jsonfile.readFileSync( path.join( mountPoint, 'poems.json' ) );

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
                        p = randomPoem();
                        print(p);
                    }
                }
            });
        }, 100);
    }
}

function randomPoem() {
    var poemCount = config.poems.length;
    var randomPoem = rando(1, poemCount);
    return config.poems[randomPoem-1];
}

function print(poem) {

    printer = thermalprinter.use(tessel.port.A);

    printer.on('ready', function(){

        printer
            .printLine('Poem')
            .printLine('^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^')
            .lineFeed(1)
            .printLine(poem.lines[0])
            .printLine(poem.lines[1])
            .printLine(poem.lines[2])
            .lineFeed(1)
            .printLine(poem.author)
            .printLine('~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^')
            .lineFeed(3)
            .print(function(){
                // console.info('printer finished!');
                // process.exit();
            });

    });

}