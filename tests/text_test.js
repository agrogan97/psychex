/*
    Test image drawing by drawing 3 separate images and testing what happens if they're manually resized
    when the window size changes, and resized via their props in js

*/

// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var content = {};
var myGame;

function handleClick(e){ 
    pEventListener(e, 'click') 
}

function preload(){

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    canvas.parent("gameCanvas")
    document.addEventListener("click", (e) => {handleClick(e)});
    myGame = new Game();

    content.headingText = new pText("Tests for rendering text content\nClick to change font", 50, 10, {textSize: 32, fontFamily: 'Monaco', lineSpacing: 10}).toggleClickable();
    fontList = ['Arial', 'Lucida Sans', 'Helvetica', 'Times New Roman', 'Monaco', 'Papyrus'];
    content.headingText.onClick = () => {
        content.headingText.update({fontFamily : _.sample(fontList)})
    }

    content.typedText = new pText("", 50, 40);
    let alphabet =  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'Space', ' ', 'Enter', 'Backspace'];
    let tout;
    alphabet.forEach(letter => {
        psychex.keyPressEvents.register(letter, () => {
            if (tout != undefined) clearInterval(tout);
            if (letter == 'Enter') letter = "\n";
            if (letter == 'Backspace') {
                content.typedText.setText(content.typedText.text.slice(0, content.typedText.text.length-1));
            } else {
                content.typedText.setText(content.typedText.text + letter);
            }
            // Set a new timeout to clear text after some time
            tout = setTimeout(() => {
                content.typedText.setText("");
            }, 1500)
        })
    })

    content.switchingText = new pText('Watch me switch (click on me to stop)', 50, 70, {textSize: 28}).toggleClickable();
    let colours = ['red', 'black', 'green', 'orange', 'pink', 'blue', 'yellow', 'cyan', 'magenta'];
    let fontType = ['bold', 'normal', 'italic', 'bold italic'];
    switchingInterval = setInterval(() => {
        content.switchingText.update({textColor: _.sample(colours), textStyle: _.sample(fontType)});
    }, 1000)
    content.switchingText.onClick = () => {
        clearInterval(switchingInterval);
    };
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();

    onHold();

    content.headingText.draw();
    pText.draw_("Start typing to render temporary text on the screen", 50, 30);
    content.typedText.draw();

    pText.draw_("Some static text of a different colour, size, and font", 50, 60, {textColor: 'blue', textStyle: 'BOLD', textSize: 40, fontFamily: 'papyrus'});
    content.switchingText.draw();
}