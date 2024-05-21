// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {
    verbose: false, 
    positionMode: "PERCENTAGE", 
    textAlign: "CENTER", 
    imageMode: "CENTER", 
    rectMode: "CENTER", 
    angleMode: "DEGREES"};
var content = {};
// ------------

function handleClick(e){
    // -- p5.js click listener -- //
    pClickListener(e)
}

function preload(){
    assets.imgs['card'] = loadImage('static/imgs/card_15p.png');
    assets.imgs['wheel'] = loadImage('static/imgs/wheel.png');
}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight*0.6);
    pixelDensity(1);
    console.log(windowWidth, windowHeight)
    frameRate(60)
    canvas.parent("gameCanvas")
    
    // Game content
    // content.card1 = new Card(50, 50, 7, 7, {});
    content.deck = new Deck(75, 15, _.shuffle(_.range(0, 8)), {imageMode: "CORNER"}).setScale(1);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function draw(){
    clear();
    background("grey")

    // content.card1.draw();
    content.deck.draw();
}