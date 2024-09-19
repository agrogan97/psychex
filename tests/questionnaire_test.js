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
var bg = 255;

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

    // Dom elements aren't drawn in the draw loop - since they're not removed and re-rendered

    content.dom.divA = new Div(10, 10, 'divA')

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
    
    content.dom.styledText = new p(50, 60, "Some styled text", "styledText", {color: 'blue'})

    content.dom.divL = new Div(70, 30, "divL", {"background-color" : 'black', "width" : "150px", "height" : "300px", "display" : "flex"});
    content.dom.divR = new Div(80, 30, "divR", {"background-color" : 'blue', "width" : "100px", "height" : "200px"});

    content.dom.divLp = new p(0.5, 0, "Hello<br><br>Goodbye", "divLp", {"color" : "white", "padding" : "5px"});
    content.dom.divLp.appendTo(content.dom.divL);

    content.dom.slider = new Slider(20, 50, "slidy", {"width" : "200px", "height" : "50px", "background-color" : "deeppink"});
    content.dom.slider.setRange(0, 100).setDefault(0);
    content.dom.slider.onChange(() => {
        bg = (255 - 2*content.dom.slider.getValue());
    })

    content.dom.anchor = new A(20, 70, `https://agrogan97.github.io/psychex/`, "To Psychex", `pLink`);
    content.dom.check = new Checkbox(20, 75, "cbox", "Click me!", {});
    content.dom.check.onChange(() => {
        if (content.dom.check.isChecked()){
            console.log("Checked")
        }
        
    })

    content.dom.newEl = new Element(50, 10, "h2", "My Custom Heading", "h2el", {})
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();
    background(bg)
}

