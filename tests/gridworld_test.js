// -- PARAMS --
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

    content.gridworld = new GridWorld(50, 50, 80, 80, 10, 10, "CENTER");
    // Check colour change on click using the index access method
    const colors = ["red", "green", "yellow", "blue", "white", "black"];
    content.gridworld.onCellClick(0, (e) => {
        e.update({backgroundColor: _.sample(colors)});
    })
    content.gridworld.onCellClick([0, 1], (e) => {
        e.update({backgroundColor: _.sample(colors)});
    })
    // Manually update cell colour
    content.gridworld.updateCell([5, 5], {backgroundColor: 'black'});
    // Create a moveable player token
    let playerPos = 0
    content.character = new pCircle(0, 0, 1, {backgroundColor: 'yellow'});
    content.gridworld.addOverlay("char", playerPos, content.character);
    const preMovement = () => {
        let canMove = content.gridworld.checkBounds(playerPos, key);
        if (canMove.allowed){
            playerPos = canMove.pos;
            content.gridworld.updateOverlay("char", {coords : playerPos});
        }
    }
    content.gridworld.handleMovement("arrows", preMovement);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();
    content.gridworld.draw();
}

