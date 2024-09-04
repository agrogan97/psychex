/*
    Test click interactions. Each object can be clicked on to increase the count number in the text.
    Clicking on the label text resets the counter to 0.
*/

// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var content = {};
var myGame;
var counters = {rectA: 0, circA: 0, imgA: 0}

function handleClick(e){ 
    pEventListener(e, 'click');
}

function mouseDragged(e){
    pEventListener(e, 'drag');
}

function preload(){
    assets.imgs['test3'] = loadImage('static/imgs/img3.png');
}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    canvas.parent("gameCanvas")
    document.addEventListener("click", (e) => {handleClick(e)});
    myGame = new Game();

    content.rectA = new pRectangle(20, 15, 10, 10, {backgroundColor: 'blue'}).toggleClickable();
    content.circA = new pCircle(50, 15, 5, {backgroundColor: 'orange'}).toggleClickable();
    content.imgA = new pImage(80, 30, assets.imgs.test3).setScale(0.75).toggleClickable();

    content.rectA.onClick = () => {
        counters.rectA += 1;
        content.rectLabel.setText(`Clicked ${counters.rectA} times`);
    }

    content.circA.onClick = () => {
        counters.circA += 1;
        content.circLabel.setText(`Clicked ${counters.circA} times`);
    }

    content.imgA.onClick = () => {
        counters.imgA += 1;
        content.imgLabel.setText(`Clicked ${counters.imgA} times`);
    }

    content.rectLabel = new pText("Clicked 0 times", 20, 40).toggleClickable();
    content.circLabel = new pText("Clicked 0 times", 50, 40).toggleClickable();
    content.imgLabel = new pText("Clicked 0 times", 80, 65).toggleClickable();
    content.rectLabel.onClick = () => {
        counters.rectA = 0;
        content.rectLabel.setText(`Clicked ${counters.rectA} times`);
    }
    content.circLabel.onClick = () => {
        counters.circA = 0;
        content.circLabel.setText(`Clicked ${counters.circA} times`);
    }
    content.imgLabel.onClick = () => {
        counters.imgA = 0;
        content.imgLabel.setText(`Clicked ${counters.imgA} times`);
    }

    content.instructions = new pText("Click on each image to increase count number. Click on the count text to reset it.\nThe green circle can be dragged if the mouse is clicked and held inside it.", 50, 80);

    content.dragCircle = new pCircle(40, 60, 5, {backgroundColor : 'green'}).toggleDraggable();
    content.dragCircle.onDrag = (e) => {
        e.pos = Primitive.toPercentage(createVector(mouseX, mouseY));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();

    content.rectA.draw();
    content.circA.draw();
    content.imgA.draw();

    content.rectLabel.draw();
    content.circLabel.draw();
    content.imgLabel.draw();

    content.dragCircle.draw();

    content.instructions.draw();
}