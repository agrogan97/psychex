// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var content = {};
var myGame;

function handleClick(e){
    // -- p5.js click listener -- //
    pClickListener(e)
}

function preload(){

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    frameRate(60)
    canvas.parent("gameCanvas");
    document.getElementById("gameCanvas").addEventListener("click", (e) => {
        handleClick(e);
    })
    myGame = new Game();
    content.myText = new pText("Psychex", 50, 50, {fontSize: 32});

    content.grid = new CustomGrid();
}

function draw(){
    clear();
    content.grid.draw();
}

class CustomGrid extends GridWorld{
    constructor(){
        super(50, 40, 40, 70, 11, 11, "CENTER", {rectMode: "CORNER"});

        _.range(3, 8).forEach(i => {
            this.setCellProps([5, i], {backgroundColor: "black"});
            this.setCellProps([i, 5], {backgroundColor: "black"});
            this.getCell([5, i]).isCross = true;
            this.getCell([i, 5]).isCross = true;
        })

        this.generateRounds();

        this.timer = new Countdown(0, 0, 5).setGraphic("arc", {w: 2, h:4, borderColor: "green", borderWidth: 5, backgroundColor: "white"});
        this.overlay([0, 10], this.timer);

        // Create an array to store the player path
        this.path = [];

        // Initialise the player token
        this.initialiseRound();
        // Register movement control
        this.movementControl();

        // this.timer.reset();
        this.timer.onTimeUp = () => {
            this.clearSingleOverlay(this.playerPos);
            this.initialiseRound();
            this.timer.pause();
        }
    }

    displayRound(layout){
        // Place blue (i.e. variable) obstacles on the grid
        layout.forEach(i => {
            this.setCellProps(i, {backgroundColor: "#0606cd"})
        })
    }

    generateRounds(){
        // Each maze contains 7 tetronimo obstacles, each of which is 4 blocks in an 'L' shape
        this.mazes = {
            1: [
                [[0, 0], [0, 1], [0, 2], [1, 0]],
                [[4, 0], [5, 0], [5, 1], [5, 2]],
                [[2, 3], [2, 4], [3, 4], [4, 4]],
                [[7, 4], [8, 4], [8, 5], [8, 6]],
                [[7, 7], [8, 7], [9, 7], [9, 8]],
                [[1, 9], [2, 9], [3, 9], [3, 10]],
                [[5, 9], [6, 9], [7, 9], [7, 10]]
            ]
        };
    }
    

    initialiseRound(){
        this.playerStart = [10, 0];
        this.playerEnd = [0, 10];
        this.playerPos = this.playerStart;
        this.overlay(this.playerStart, new pCircle(0, 0, 1, {backgroundColor: "yellow"}));
        // Clear previous path
        this.path.forEach(id => {this.setCellProps(id, {backgroundColor: 'white'})});

        // Change the limit to be 5 seconds
        this.timer.endtime = 5;

        // Set all as not obstacles
        this.cells.forEach(cell => {
            cell.obj.isObstacle = false;
        })

        // Randomly select a maze:
        let mazeId = _.sample(Object.keys(this.mazes))
        // Display the round
        this.displayRound(_.flatten(this.mazes[mazeId]));

        // Set all obstacle cells as isObstacle = true
        _.flatten(this.mazes[1]).forEach(coord => {
            this.getCell(coord).isObstacle = true;
        })

        // Start timer
        this.timer.reset();
    }

    movementControl(){
        // Set a mapping of the keyboard click to its effect on position

        const preMovementCallback = () => {
            let res = this.checkBounds(this.playerPos, key);
            // Check if this is an obstacle
            let isObstacle = this.getCell(res.pos).isObstacle || this.getCell(res.pos).isCross;
            if (res.allowed && !isObstacle){
                // Update cell backgroundColor to be green 
                this.setCellProps(this.playerPos, {backgroundColor: '#5f9c56'});
                // Remove previous cell overlay:
                this.clearSingleOverlay(this.playerPos);
                // Add previous position to the path, so we can store the data and clear it more easily later on
                this.path.push(this.playerPos);
                // Update current position
                this.playerPos = res.pos;
                // Draw overlay in new position
                this.overlay(res.pos, new pCircle(0, 0, 1, {backgroundColor: "yellow"}));
            }

            return true;
        }

        const postMovementCallback = () => {
            this.timer.endtime = 5;
            this.timer.reset();
        }

        this.toggleControls("arrows", preMovementCallback, postMovementCallback);
    }
}