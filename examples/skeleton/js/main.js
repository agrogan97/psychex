// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var content = {};
var myGame;

function handleClick(e){
    // -- p5.js click listener -- //
    pClickListener(e)
}

function preload(){

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    frameRate(60)
    canvas.parent("gameCanvas")
    myGame = new Game();
    content.myText = new pText("Psychex", 50, 50, {fontSize: 32});
}

function draw(){
    clear();
    content.myText.draw();
}