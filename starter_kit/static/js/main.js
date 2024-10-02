// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}};
var content = {};
var myGame;

function handleClick(e){
    // -- p5.js click listener -- //
    pEventListener(e, 'click');
}

function preload(){

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    frameRate()
    canvas.parent("gameCanvas");
    document.getElementById("gameCanvas").addEventListener("click", (e) => {
        handleClick(e);
    })
    myGame = new Game();
        
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();

}