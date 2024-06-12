// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var content = {};
var myGame;
var fs = new Fullscreen();

function handleClick(e){
    // -- p5.js click listener -- //
    pClickListener(e);
}

function preload(){

}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    frameRate(60)
    canvas.parent("gameCanvas")

    document.getElementById("gameCanvas").addEventListener("click", (e) => {
        handleClick(e);
    })


    myGame = new Game();

    content.testRect = new pRectangle(50, 10, 10, 10, {borderWidth: 4});

    content.myText = new pText("Psychex", 50, 30, {textSize: 32});
    content.redText = new pText("Red Psychex", 50, 35, {textColor: 'red'})
    content.blackText = new pText("Black Psychex", 50, 40, {textColor: 'black', textSize: 14, strokeWeight: 2})
    // Update the default
    // psychex.aesthetics.pText.edit({textColor: "blue", textSize: 34}); // commented out to not confuse things later!
    content.defaultText = new pText("Default", 50, 45)
    content.anotherDefault = new pText("Default 2", 50, 50, {strokeWeight: 0.01})

    content.someRect = new pRectangle(10, 10, 10, 10, {backgroundColor: "green", stroke: "green"});
    content.someRect.toggleClickable();
    content.someRect.onClick = () => {
        content.someRect.update({backgroundColor: "yellow", stroke: "yellow"});
    }

    const lightChanges = {
        green: {
            on: {backgroundColor: "green"},
            off: {backgroundColor: "white"}
        },
        amber: {
            on: {backgroundColor: "orange"},
            off: {backgroundColor: "white"}
        },
        red: {
            on: {backgroundColor: "red"},
            off: {backgroundColor: "white"}
        }
    }

    content.redLight = new pRectangle(10, 10, 5, 10, {backgroundColor: "red", stroke: "red"});
    content.amberLight = new pRectangle(10, 21, 5, 10, {backgroundColor: "white", stroke: "orange"});
    content.greenLight = new pRectangle(10, 32, 5, 10, {backgroundColor: "white", stroke: "green"});
    content.crossing = new pButton(10, 45, 3, 6, {backgroundColor: "white", stroke: "black"})
        .addText("Go", {textSize: 24});
    content.crossing.onClick = () => {
        console.log("Cross");
        // Set the amber light to come on after 1 second
        setTimeout(() => {
            content.amberLight.update(lightChanges.amber.on);
            // turn on the gren light after another second
            setTimeout(() => {
                content.greenLight.update({backgroundColor: "green"});
                // turn off the amber light
                content.amberLight.update({backgroundColor: "white"});
                // turn off the red light
                content.redLight.update({backgroundColor: "white"});

                // Reset all
                setTimeout(() => {
                    // Turn on the amber light, and turn off the green light
                    content.amberLight.update({backgroundColor: "orange"});
                    content.greenLight.update({backgroundColor: "white"});
                    setTimeout(() => {
                        // turn on the red light, and turn off the amber light
                        content.redLight.update({backgroundColor: "red"});
                        content.amberLight.update({backgroundColor: "white"});
                    }, 1000)
                }, 3000)
            }, 1000)
            
        }, 1000)
    }

    setInterval(() => {
        content.someRect.update({fontColor: "green"});
    }, 2000);

    content.parc = new Countdown(75, 25, 5).setGraphic("arc", {w: 5, h:10});
    content.parc.onTimeUp = () => {
        content.parc.graphic.update({backgroundColor: _.sample(["green", "yellow", "pink", "blue"])});
        content.parc.reset();
    }

    // content.parc.reset();

    // Click event listener tests
    content.clicks = {};
    const colours = ["green", "yellow", "red", "blue", "pink", "orange", "grey"]
    content.clicks.rect = new pRectangle(20, 75, 5, 10, {backgroundColor: "white"}).toggleClickable();
    content.clicks.rect.onClick = () => {
        content.clicks.rect.update({backgroundColor: _.sample(colours)});
    }
    content.clicks.circle = new pCircle(30, 75, 5, {backgroundColor: 'white'}).toggleClickable();
    content.clicks.circle.onClick = () => {
        content.clicks.circle.update({backgroundColor: _.sample(colours)});
    }

    content.clicks.txt = new pText("Click me!", 50, 75, {textColor: "black"}).toggleClickable();
    content.clicks.txt.onClick = () => {
        content.clicks.txt.update({backgroundColor: _.sample(colours)})
    }

    fs.beforeFullscreen(() => {
        pText.draw_("The game must be played in fullscreen. Click anywhere to launch.", 50, 50, {textSize: 42});
        return true;
    })

    fs.onFullscreenExit = () => {
        pText.draw_("Fullscreen exit detected.", 50, 50, {textSize: 34})
        return true;
    };
}

function draw() {
    clear();

    // fs.detect();
    let a = fs.draw();
    if (a) {return}

    content.testRect.draw();
    content.myText.draw();
    // content.countdown.draw();
    content.redText.draw();
    content.blackText.draw();
    content.defaultText.draw();
    content.anotherDefault.draw();

    // content.someRect.draw();
    content.redLight.draw();
    content.amberLight.draw();
    content.greenLight.draw();
    content.crossing.draw();

    content.parc.draw();

    Object.keys(content.clicks).forEach(i => content.clicks[i].draw());

    content.clicks.rect.draw();
    content.clicks.circle.draw()
}