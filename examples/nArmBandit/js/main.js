// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
// var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var gameContent = {};
var myGame;

function handleClick(e){ 
    pEventListener(e, 'click') 
}

function preload(){
    assets.imgs.slotMachine = loadImage("https://raw.githubusercontent.com/agrogan97/psychex/dev/docs/build/html/_static/slotMachine.png")
}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    canvas.parent("gameCanvas")
    document.addEventListener("click", (e) => {handleClick(e)});
    myGame = new Game();

    gameContent.title = new pText("My Bandit Task", 50, 10, {textSize : 48, textStyle : "bold"})

    gameContent.myBanditTask = new BanditTask(0, 0, 2, [0.5, 0.5]);

    const btnStyles = {
        "background-color" : '#ed1c24',
        "border" : "#b4b4b4",
        "color" : "white",
        "padding" : "15px",
        "font-size" : "20px",
        "width" : "175px",
        "box-shadow": "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
        "cursor" : "pointer"
    }

    gameContent.restart = new Button(37.5, 25, "Restart", "restartBtn", btnStyles);
    gameContent.endGame = new Button(55, 25, "End Game", "endBtn", btnStyles);

    gameContent.restart.onClick(() => {
        gameContent.myBanditTask.score = 0;
        gameContent.myBanditTask.resultText.setText("Score: 0");
    })
    
    gameContent.endGame.onClick(() => {
        window.location.href = `https://agrogan97.github.io/psychex/`
    })
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();

    gameContent.title.draw();
    gameContent.myBanditTask.draw();
}

class BanditTask extends NArmBandit {
    constructor(x, y, nArms, probs){
        super(x, y, nArms, probs);

        // Define an array to store slot machine referencesq
        this.slotMachines = [];
        this.score = 0;

        for (let i=0; i<this.nArms; i++){
            this.slotMachines.push(
                // Create a new image object and store it in the slot machines object
                new pImage(25 + i*50, 50, assets.imgs.slotMachine)
            );
            this.slotMachines[i].id = `arm${i+1}`;
        }

        // Create an object to store arm pull results
        this.pullResults = {"arm1" : [], "arm2" : []}

        this.slotMachines.forEach((sm, ix) => {
            sm.toggleClickable();
            sm.onClick = (e) => {
                // Pull the arm and get the result
                let result = this.pullArm(ix)
                console.log(`${e.id} pulled ${result}`)
                this.pullResults[e.id].push(result);

                if (e.id == "arm1"){
                    result ? this.textA.setText("Score +1") : this.textA.setText("No Score")
                } else if (e.id == "arm2"){
                    result ? this.textB.setText("Score +1") : this.textB.setText("No Score")
                }

                if (result) {
                    this.score += 1;
                }
                this.resultText.setText(`Score: ${this.score}`)

                setTimeout(() => {
                    e.id == "arm1" ? this.textA.setText("") : this.textB.setText("");
                }, 1500)
            }
        })

        this.textA = new pText("", 25, 62, {textSize: 32});
        this.textB = new pText("", 75, 62, {textSize: 32});
        this.resultText = new pText("Score: 0", 50, 70, {textSize: 32});
    }

    draw(){
        super.draw();

        this.slotMachines.forEach(sm => {
            sm.draw();
        })

        this.textA.draw();
        this.textB.draw();
        this.resultText.draw();
    }
}
