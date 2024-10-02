// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
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

class BustomGrid extends GridWorld {
    constructor(){
        super(50, 40, 40, 70, 11, 11, "CENTER", {rectMode: "CORNER"});

        _.range(3, 8).forEach(i => {
            this.setCellProps([5, i], {backgroundColor: "black"});
            this.setCellProps([i, 5], {backgroundColor: "black"});
            this.getCell([5, i]).isCross = true;
            this.getCell([i, 5]).isCross = true;
        })

        this.generateRounds();

        // Add timer
        this.timer = new Countdown(0, 0, 5).setGraphic("arc", {w: 2, h:4, borderColor: "green", borderWidth: 5, backgroundColor: "rgba(0, 0, 0, 0)"});
        this.addOverlay("timer", [0, 10], this.timer);

        // Add character token
        this.character = new pCircle(0, 0, 1, {backgroundColor: "yellow"});
        this.addOverlay("player", [10, 0], this.character);

        // Create an array to store the player path
        this.path = [];

        // Initialise the player token
        this.initialiseRound();
        // Register movement control
        this.movementControl();

        this.timer.onTimeUp = () => {
            this.displayText = "Timed out! Beginning next round..."
            setTimeout(() => {
                this.initialiseRound();
            }, 2000)
        }

        this.displayText = "";
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
            ],
            2: [
                [[0, 2], [0, 3], [0, 4], [1, 4]],
                [[2, 2], [3, 2], [3, 3], [3, 4]],
                [[5, 1], [5, 2], [6, 2], [6, 2]],
                [[8, 5], [9, 5], [10, 5], [10, 6]],
                [[1, 10], [2, 10], [3, 10], 3, 9],
                [[4, 10], [5, 10], [6, 10], [6, 9]],
                [[8, 10], [9, 10], [9, 9], [9, 8]],
            ]
        };
    }
    
    initialiseRound(){
        // Remove the player token from its last position, if this isn't the first round
        if (this.path.length != 0){
            // this.clearSingleOverlay(_.last(this.path));
        }
        this.displayText = "";

        this.playerStart = [10, 0];
        this.playerEnd = [0, 10];
        this.playerPos = this.playerStart;
        this.updateOverlay("player", {coords: this.playerStart});
        
        // Clear previous path
        this.path.forEach(id => {this.setCellProps(id, {backgroundColor: 'white'})});
        // Empty path to store new one
        this.path = [this.playerStart];

        // Change the limit to be 5 seconds
        // this.timer.endtime = 5;

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

        // Reset timer to 5 seconds for first movement, and then start it
        this.timer.endtime = 5;
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
                // Update current position
                this.playerPos = res.pos;
                // Add new position to path
                this.path.push(this.playerPos);
                // Update character token position
                this.updateOverlay("player", {coords: this.playerPos})
                // this.overlay(res.pos, this.character());
                
            }

            return true;
        }

        const postMovementCallback = () => {
            // Check if this is the endpoint cell
            // Include note in docs about == vs. isEqual()
            // console.log()
            if (_.isEqual(this.playerPos, this.playerEnd)){
                console.log("End point")
                this.timer.pause();
                this.displayText = "Round Complete! Next Round...";
                setTimeout(() => {
                    this.initialiseRound()
                }, 1000);
            } else {
                this.timer.endtime = 1;
                this.timer.reset();
            }
        }

        this.handleMovement("arrows", preMovementCallback, postMovementCallback);
    }

    draw(){
        super.draw();
        pText.draw_(this.displayText, 50, 80, {fontSize: 32});
        
    }

}

class CustomGrid extends GridWorld{
    constructor(){
        super(50, 40, 40, 70, 11, 11, "CENTER");

        _.range(3, 8).forEach(i => {
            this.setCellProps([5, i], {backgroundColor: "black"});
            this.setCellProps([i, 5], {backgroundColor: "black"});

            this.getCell([5, i]).isCross = true;
            this.getCell([i, 5]).isCross = true;
        })

        this.displayText = "";

        // Add timer
        this.timer = new Countdown(0, 0, 5).setGraphic("arc", {w: 2, h:4, borderColor: "green", borderWidth: 5, backgroundColor: "rgba(0, 0, 0, 0)"});
        this.timer.onTimeUp = () => {
            this.displayText = "Time's up! Moving to the next round...";
            this.timer.pause();
            setTimeout(() => {
                this.initialiseRound();
            }, 2000);
        };
        this.addOverlay("timer", [0, 10], this.timer);

        // Add character token
        this.character = new pCircle(0, 0, 1, {backgroundColor: "yellow"});
        this.playerStart = [10, 0];
        this.addOverlay("player", this.playerStart, this.character);

        this.path = [this.playerStart];
        this.playerEnd = [0, 10];

        this.generateRounds();
        this.movementControl();
        this.initialiseRound();

        psychex.keyPressEvents.register("Enter", () => {
            console.log("Enter")
            this.timer.pause();
        })
    }

    displayRound(layout){
        // Place blue (i.e. variable) obstacles on the grid
        layout.forEach(i => {
            this.setCellProps(i, {backgroundColor: "#0606cd"})
            this.getCell(i).isObstacle = true;
        })
    }

    clearRound(mazeId){
        // if (mazeId == undefined){return}
        let layout = _.flatten(this.mazes[mazeId])
        console.log(layout)
        layout.forEach(i => {
            this.setCellProps(i, {backgroundColor: "white"});
            this.getCell(i).isObstacle = false;
        })
    }

    generateRounds(){
        // Each maze contains 7 tetronimo obstacles, each of which is 4 blocks in an 'L' shape
        this.mazes = {
            // These are the coordinates of all the obstacles, not including the central cross
            1: [
                [[0, 0], [0, 1], [0, 2], [1, 0]],
                [[4, 0], [5, 0], [5, 1], [5, 2]],
                [[2, 3], [2, 4], [3, 4], [4, 4]],
                [[7, 4], [8, 4], [8, 5], [8, 6]],
                [[7, 7], [8, 7], [9, 7], [9, 8]],
                [[1, 9], [2, 9], [3, 9], [3, 10]],
                [[5, 9], [6, 9], [7, 9], [7, 10]]
            ],
            2: [
                [[0, 2], [0, 3], [0, 4], [1, 4]],
                [[2, 2], [3, 2], [3, 3], [3, 4]],
                [[5, 1], [5, 2], [6, 2], [7, 2]],
                [[8, 5], [9, 5], [10, 5], [10, 6]],
                [[1, 10], [2, 10], [3, 10], [3, 9]],
                [[4, 10], [5, 10], [6, 10], [6, 9]],
                [[8, 10], [9, 10], [9, 9], [9, 8]],
            ],
            3: [
                [[1, 2], [0, 2], [0, 3], [0, 4]],
                [[3, 1], [3, 2], [3, 3], [4, 3]],
                [[5, 0], [6, 0], [7, 0], [7, 1]],
                [[0, 6], [1, 6], [2, 6], [2, 5]],
                [[1, 10], [1, 9], [1, 8], [2, 8]],
                [[6, 10], [7, 10], [7, 9], [7, 8]],
                [[7, 7], [8, 7], [9, 7], [9, 6]],
            ]
        }
    }

    initialiseRound(){
        this.displayText = "Use your arrow keys to move the player token";
        this.playerPos = this.playerStart;
        this.updateOverlay("player", {coords: this.playerPos});

        // Clear previous path
        this.path.forEach(id => {this.setCellProps(id, {backgroundColor: 'white'})});

        this.clearRound(this.mazeId);

        // Randomly select a maze:
        this.mazeId = _.sample(Object.keys(this.mazes))
        // Display the round
        this.displayRound(_.flatten(this.mazes[this.mazeId]));

        // Reset timer to 5 seconds for first movement, and then start it
        this.timer.endtime = 5;
        this.timer.reset();
    }

    movementControl(){
        // Define a function we can use as a callback to see if the player is allowed to move
        const preMovement = () => {
            // Use the gridworld `checkBounds` method that detects grid boundaries and computes new position based on input type
            // It takes the current player position, and the keyword 'key', which is the most recently pressed key,
            // and returns {allowed: true/false, pos: coords}
            let canMove = this.checkBounds(this.playerPos, key);
            let isBlocked = (this.getCell(canMove.pos).isCross || this.getCell(canMove.pos).isObstacle);
            if (canMove.allowed && !isBlocked){
                // If the move is allowed, canMove.allowed == true, and canMove.pos is the new position
                // Update cell backgroundColor to be green 
                this.setCellProps(this.playerPos, {backgroundColor: '#5f9c56'}); // a green hex code
                // Update the player position
                this.playerPos = canMove.pos;
                // Draw the overlay at the new position, using updateOverlay()
                this.updateOverlay("player", {coords: canMove.pos});
                // Update the path
                this.path.push(this.playerPos);
                return true;
            }
        }

        const postMovement = () => {
            if (_.isEqual(this.playerPos, this.playerEnd)){
                // If this is the endpoint
                this.timer.pause();
                this.displayText = "Round Complete! Beginning next round...";
                setTimeout(() => {
                    this.initialiseRound();
                }, 2000)
            } else {
                this.timer.endtime = 1;
                this.timer.reset();
            }
        }

        // Pass this function into handleMovement, the parent function
        this.handleMovement("arrows", preMovement, postMovement);
    }

    draw(){
        // Parent draws (grid, overlays)
        super.draw();

        // Our display text
        pText.draw_(this.displayText, 50, 80, {fontSize: 32});
    }
}