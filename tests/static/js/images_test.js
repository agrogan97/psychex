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
var tests = {testsA: undefined, testsB: undefined, testsC: undefined};

function handleClick(e){ 
    pEventListener(e, 'click') 
}

function preload(){

    assets.imgs['test1'] = loadImage('static/imgs/img1.png');
    assets.imgs['test2'] = loadImage('static/imgs/img2.jpg');
    assets.imgs['test3'] = loadImage('static/imgs/img3.png');

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    canvas.parent("gameCanvas")
    document.addEventListener("click", (e) => {handleClick(e)});
    myGame = new Game();

    content.imgA = new pImage(15, 30, assets.imgs.test1);
    content.imgB = new pImage(45, 30, assets.imgs.test2);
    content.imgC = new pImage(80, 30, assets.imgs.test3);
    
    // And test resizing images manually, and resizing with changes in window size

    tests.testsA = new testImage(15, 70, content.imgA);
    tests.testsB = new testImage(45, 70, content.imgB);
    tests.testsC = new testImage(80, 70, content.imgC);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    content.imgA.onResize();
    content.imgB.onResize();
    content.imgC.onResize();
}

function draw(){
    clear();

    content.imgA.draw();
    content.imgB.draw();
    content.imgC.draw();

    Object.keys(tests).forEach(t => tests[t].draw());
}

class testImage extends Primitive{
    // Define some buttons that edit the images in different ways to check they work
    constructor(x, y, target){
        super(x, y, {});

        this.target = target;

        this.tintButton = new pButton(this.pos.x, this.pos.y, 10, 7.5).addText("Apply tint");
        this.tintButton.onClick = (e) => {
            this.target.update({tint: [255, 255*0.5]})
        }

        this.resizeButton = new pButton(this.pos.x, this.pos.y+10, 10, 7.5).addText("Resize img");
        this.resizeButton.onClick = () => {

        }

        this.scaleButton = new pButton(this.pos.x, this.pos.y+10, 10, 7.5).addText("Scale img");
        this.scaleButton.onClick = () => {
            this.target.setScale(0.3);
        }
    }

    draw(){
        this.tintButton.draw();
        // this.resizeButton.draw();
        this.scaleButton.draw();
    }
}