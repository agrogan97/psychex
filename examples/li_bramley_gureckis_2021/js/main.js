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
var myGame;
// ------------

function handleClick(e){
    // -- p5.js click listener -- //
    pClickListener(e)
}

function preload(){
    assets.imgs['card'] = loadImage('static/imgs/card_15p.png');
    assets.imgs['card_blue'] = loadImage('static/imgs/card_blue_15p.png')
    assets.imgs['wheel'] = loadImage('static/imgs/wheel_200p.png');
}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight*0.5);
    pixelDensity(1);
    console.log(windowWidth, windowHeight)
    frameRate(60)
    canvas.parent("gameCanvas")
    myGame = new MyGame();

    document.getElementById("gameCanvas").addEventListener("click", (e) => {
        handleClick(e)
    })
    
    // Game content
    // content.card1 = new Card(50, 50, 7, 7, {});
    content.deck = new Deck(75, 15, myGame.gameSettings.deck, {imageMode: "CORNER", color: "black"}).setScale(1);
    content.wheel = new Wheel(20, 55, assets.imgs.wheel);
    content.instructions = new pText(`Draw a card!`, 50, 30, {fontSize: 32});
    content.drawCardBtn = new pButton(50, 50, 7.5, 12.5, {backgroundColor: "white", borderWidth: 4}).addText("Draw", {color: "black", textSize: 32});
    // content.spinWheelBtn = new pButton(55, 50, 7.5, 12.5, {backgroundColor: "white", borderWidth: 4}).addText("Spin", {color: "black", textSize: 32})
    //     .toggleClickable();
    content.drawCounter = new pText(`Drawn ${myGame.roundIndex}/5 cards`, 50, 75, {fontSize: 32})

    content.drawCardBtn.onClick = () => {
        myGame.start();
    }

    // content.spinWheelBtn.onClick = () => {
    //     myGame.handleSpin()
    // }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight*0.6);
  }

function draw(){
    clear();
    background("white")

    content.deck.draw();
    content.wheel.draw();
    content.instructions.draw();
    content.drawCardBtn.draw();
    // content.spinWheelBtn.draw();
    // content.drawCounter.draw();
    pText.draw_(`Drawn ${myGame.roundIndex}/5 cards`, 50, 75, {fontSize: 32})
    }