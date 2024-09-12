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

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    canvas.parent("gameCanvas")
    document.addEventListener("click", (e) => {handleClick(e)});
    myGame = new Game();

    content.dom = {}
    

    // content.dom.inp = new Input(10, 100, "", 'myInput');
    // content.dom.inp.draw();

    content.dom.divA = new Div(10, 10);

    // content.dom.p = new p(0, 0, "Hello this is a psychex HTML element. It supports <b>rich text</b>!", "welcome");
    // Dom elements aren't drawn in the draw loop - since they're not removed and re-rendered!
    // content.dom.p.draw();
    // content.dom.p.appendTo(content.dom.divA);

    content.dom.inputA = new Input(0, 5, "", "inputA");
    content.dom.inputA.appendTo(content.dom.divA);

    content.dom.submitBtnA = new Button(11, 5, "Submit", "submitBtnA");
    content.dom.submitBtnA.appendTo(content.dom.divA);

    content.dom.resultText = new p(0, 10, "", "resultText");
    content.dom.resultText.appendTo(content.dom.divA);
    content.dom.resultText.setSize(5, AUTO);

    content.dom.submitBtnA.onClick(() => {
        content.dom.resultText.setText(content.dom.inputA.getValue());
        content.dom.inputA.clear();
    })

    content.dom.inputA.onInput(() => {
        content.dom.resultText.setText(content.dom.inputA.getValue());
    })

    content.dom.form = new Form(35, 35, "myForm");
    content.dom.form.addField('field1', "text", "This is my new field", "placeholder text");
    content.dom.form.addField('field2', 'text','new field 2', 'another field')
    content.dom.form.addField('field3', 'text', 'yet another', 'field 3!');

    // content.dom.divA.toggleDraggable();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();
}

