// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}};
var content = {};
var myGame;

function handleClick(e){
    // -- p5.js click listener -- //
    pEventListener(e);
}

function preload(){

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    frameRate(30)
    canvas.parent("gameCanvas");
    document.getElementById("gameCanvas").addEventListener("click", (e) => {
        handleClick(e);
    })
    myGame = new Game();
    content.myText = new pText("Welcome to Psychex!", 49, 30, {textSize: 48});
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();
    content.myText.draw();
}