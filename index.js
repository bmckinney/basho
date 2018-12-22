var tessel = require('tessel');
var jsonfile = require( 'jsonfile' );
var rando = require('random-number-in-range')
var path = require( 'path' );
var thermalprinter = require('tessel-thermalprinter');

var button;
var bounce;
var pressed = false;
var printer;
var config = jsonfile.readFileSync( path.join( __dirname, 'poems.json' ) );

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
                    console.log('off');
                    pressed = false;
                    // down (on)
                } else if (value === 1) {
                    // console.log('on');
                    // only fire press once
                    if (!pressed) {
                        pressed = true;
                        console.log('pressed.');
                        print(randomPoem());
                    }
                }
            });
        }, 100);
    }
}

function randomPoem() {
    var poemCount = config.poems.length;
    console.log('poems', poemCount);
    var randomPoem = rando(1, poemCount);
    console.log('random', randomPoem);
    console.log('random poem', config.poems[randomPoem-1]);
    return config.poems[randomPoem-1];
}

function print(poem) {

    printer = thermalprinter.use(tessel.port.A);
    printer.reset();

    printer.on('ready', function(){

        console.info('printer ready!');

        printer
            .printLine(' ')
            .printLine('^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^')
            .lineFeed(1)
            .printLine(poem.lines[0])
            .printLine(poem.lines[1])
            .printLine(poem.lines[2])
            .lineFeed(1)
            .printLine('~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^')
            .lineFeed(3)
            .print(function(){
                console.info('printer finished!');
                // process.exit();
            });

    });

}
