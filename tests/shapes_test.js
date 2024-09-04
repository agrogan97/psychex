/*
    Test shape drawing by rendering out shapes of varying aesthetics.

    - 3 rectangles of increasing size and varying colour
    - 3 squares on the next level of increasing size and varying colour and border width
    - 3 circles on the next level 
    - selection of triangles and shapes built from raw lines

*/// -- PARAMS --
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
    content.myText = new pText("Psychex", 50, 50, {textSize: 32});

    content.rects = [
        new pRectangle(15, 10, 6, 10, {}), // default rectangle
        new pRectangle(30, 10, 6, 10, {backgroundColor: 'black', borderColor: 'white'}), // inverse default
        new pRectangle(45, 10, 3, 5, {backgroundColor: 'blue', borderColor: 'blue'}), // blue background, blue border
        new pRectangle(60, 10, 6, 10, {backgroundColor: 'yellow', borderColor: 'red'}), // yellow background, red border
        new pRectangle(75, 10, 10, 4, {backgroundColor: 'rgba(100, 100, 100, 0.5)', borderColor: 'black', borderWidth: 5}), // rgba code set background, thick border
        new pRectangle(90, 10, 6, 10, {backgroundColor: 'white', borderColor: 'green', borderWidth: 0.5}),
    ];

    content.rectLabels = [
        new pText("Default", 15, 17.5),
        new pText("Black border\nblack background", 30, 17.5),
        new pText("Blue border\nblue background", 45, 17.5),
        new pText("Red border\nyellow background", 60, 17.5),
        new pText("Black border\nrgba(100, 100, 100, 0.5) background\n5px border", 75, 17.5),
        new pText("Green border\nwhite background\n0.5px border", 90, 17.5),
    ]

    content.circs = [
        new pCircle(15, 40, 3), // default
        new pCircle(30, 40, 4, {backgroundColor: 'pink', borderColor: 'white'}), // pink background, white border 
        new pCircle(45, 40, 1, {backgroundColor: 'green', borderColor: 'rgba(15, 252, 3, 0.5)', borderWidth: 3}), // green background, green border, 3px border
        new pCircle(60, 40, 2.5, {backgroundColor: 'rgba(206, 255, 204, 1)', borderWidth: 0.5}), // light green background, thin border
        new pCircle(75, 40, 2.5, {backgroundColor: 'rgba(206, 255, 204, 1)', borderWidth: 15}), // Light green background, thick border
        new pCircle(90, 40, 3, {backgroundColor: 'rgba(255, 0, 13, 1)', borderWidth: 0}), // series of concentric circles of different colours
        new pCircle(90, 40, 2.5, {backgroundColor: 'rgba(50, 0, 13, 1.0)', borderWidth: 0}),
        new pCircle(90, 40, 2, {backgroundColor: 'rgba(100, 255, 35, 0.6)', borderWidth: 0}),
        new pCircle(90, 40, 1.5, {backgroundColor: 'rgba(255, 0, 13, 0.4)', borderWidth: 0}),
        new pCircle(90, 40, 1, {backgroundColor: 'rgba(255, 0, 13, 0.2)', borderWidth: 0}),
        new pCircle(90, 40, 0.5, {backgroundColor: 'rgba(255, 0, 13, 0.1)', borderWidth: 0}),
    ]

    content.circLabels = [
        new pText("Default", 15, 55),
        new pText("Green background\n green border\n3px border width", 30, 55),
        new pText("Green background\ngreen border\nsmall circle", 45, 55),
        new pText("Green background\n thin black border", 60, 55),
        new pText("Green background\n thick black border", 75, 55),
        new pText("Concentric circles\nvarying colours", 90, 55),
    ]

    content.triangles = [
        new pTriangle(12.5, 75, 17.5, 75, 15, 80),
        new pTriangle(27.5, 80, 27.5, 70, 32.5, 80, {backgroundColor: 'orange', borderWidth: 2, borderColor: 'grey'}),
        new pTriangle(42, 72.5, 48, 81, 46, 77.5, {backgroundColor: 'blue', borderWidth: 0.5, borderColor: 'pink'})
    ]

    content.lines = [
        new pLine(55, 75, 65, 75, {strokeWeight: 4, stroke: 'black'}),
        new pLine(70, 72.5, 72.5, 75, {strokeWeight: 4, stroke: 'red'}),
        new pLine(72.5, 75, 75, 72.5, {strokeWeight: 4, stroke: 'green'}),
        new pLine(75, 72.5, 77.5, 75, {strokeWeight: 4, stroke: 'pink'}),
        new pLine(77.5, 75, 80, 72.5, {strokeWeight: 4, stroke: 'blue'}),
        new pLine(85, 70, 95, 80, {strokeWeight: 4}),
        new pLine(90, 65, 90, 85, {strokeWeight: 4}),
        new pLine(85, 85, 95, 75, {strokeWeight: 4}),
        new pLine(85, 77.5, 95, 77.5, {strokeWeight: 4}),
    ]

    content.triangleLabels = [
        new pText("Default triangle", 15, 90),
        new pText("Right-angle triangle\norange background", 30, 90),
        new pText("Isoceles triangle\nblue background", 45, 90),
        new pText("Black horizontal\nline", 60, 90),
        new pText("Zig-zag\nmulti-colour segments", 75, 90),
        new pText("Randomly placed\nintersecting lines", 90, 90)
    ]

}

function draw(){
    clear();
    content.rects.forEach(rect => rect.draw());
    content.rectLabels.forEach(lbl => lbl.draw());

    content.circs.forEach(circle => circle.draw());
    content.circLabels.forEach(label => label.draw());

    content.triangles.forEach(triangle => triangle.draw());
    content.lines.forEach(line => line.draw());

    content.triangleLabels.forEach(label => label.draw());
}

