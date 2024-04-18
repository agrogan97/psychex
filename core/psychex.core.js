class Psychex{
    // Check for local parameter `params`
    // if no local version heck for global variable `params`
    constructor(params = undefined){
        // Set defaults and override with params
        this.constants = {
            positionMode : "PIXELS", // PIXELS or PERCENTAGE
            imageMode: CENTER,
            rectMode: CENTER,
            textAlign: CENTER,
            angleMode: CENTER,
            verbose: true
        }
        // Local copy of either class or global parameters
        let paramsLocalInst = {}
        // Check if passed params object to instantiation
        if (params != undefined){
            paramsLocalInst = params
        // If not, check for global params
        } else if (window.params != undefined){
            paramsLocalInst = window.params
        }
        
        if (paramsLocalInst.verbose != undefined) {this.constants.verbose = paramsLocalInst.verbose}

        // Iterate through params and filter allowed, calling respective setters

        Object.keys(paramsLocalInst).forEach(k => {
            if (k == "positionMode") {this.setPositionMode(paramsLocalInst[k])}
            else if (k == "imageMode") {this.setImageMode(paramsLocalInst[k])}
            else if (k == "rectMode") {this.setRectMode(paramsLocalInst[k])}
            else if (k == "angleMode") {this.setAngleMode(paramsLocalInst[k])}
            else if (k == "textAlign") {this.setTextAlign(paramsLocalInst[k])}
        })

        if (this.constants.verbose) {console.log(this.constants)}

        // After this, propagate params to children as this.constants
    }

    getConstants(){
        return this.constants;
    }

    getPositionMode() {
        return getConstants().positionMode;
    }

    setPositionMode(newPositionMode){
        if (!["PIXELS", "PERCENTAGE"].includes(newPositionMode)){throw new Error(`Position mode value: ${newPositionMode} not recognised. Must be one of PIXELS or PERCENTAGE.`)}
        else {this.constants.positionMode = newPositionMode}
        if (this.constants.verbose) console.log("positionMode:", this.constants.positionMode)
    }

    setImageMode(newImageMode){
        if (![CENTER, CORNER, CORNERS, "CENTER", "CORNER", "CORNERS"].includes(newImageMode)){throw new Error(`Image mode value: ${newImageMode} not recognised. Must be one of CENTER, CORNER, or CORNERS.`)};
        this.constants.imageMode = newImageMode;
        if (this.constants.imageMode == CENTER || this.constants.imageMode == "CENTER"){imageMode(CENTER);}
        else if (this.constants.imageMode == CORNER || this.constants.imageMode == "CORNER"){imageMode(CORNER)}
        else if (this.constants.imageMode == CORNERS || this.constants.imageMode == "CORNERS"){imageMode(CORNERS)}

        if (this.constants.verbose) console.log("imageMode:", this.constants.imageMode)
    }

    setRectMode(newRectMode){
        if (![CENTER, CORNER, CORNERS, RADIUS, "CENTER", "CORNER", "CORNERS", "RADIUS"].includes(newRectMode)){throw new Error(`Rect mode value: ${newRectMode} not recognised. Must be one of CENTER, CORNER, CORNERS, or RADIUS.`)};
        this.constants.rectMode = newRectMode;
        if (this.constants.rectMode == CENTER || this.constants.rectMode == "CENTER"){rectMode(CENTER)}
        else if (this.constants.rectMode == CORNER || this.constants.rectMode == "CORNER"){rectMode(CORNER)}
        else if (this.constants.rectMode == CORNERS || this.constants.rectMode == "CORNERS"){rectMode(CORNERS)}
        else if (this.constants.rectMode == RADIUS || this.constants.rectMode == "RADIUS"){rectMode(RADIUS)}

        if (this.constants.verbose) console.log("rectMode:", this.constants.rectMode)
    }
    
    setTextAlign(newHorizAlign){
        // Check inputs on vertical text alignment
        if (![LEFT, CENTER, RIGHT, "LEFT", "CENTER", "RIGHT"].includes(newHorizAlign)){throw new Error(`Vertical text align: ${newHorizAlign} not recognised. Must be one of LEFT, CENTER, RIGHT.`)};
        this.constants.textAlign = newHorizAlign;
        if (this.constants.textAlign == LEFT || this.constants.textAlign == "LEFT"){textAlign(LEFT)}
        else if (this.constants.textAlign == CENTER || this.constants.textAlign == "CENTER"){textAlign(CENTER)}
        else if (this.constants.textAlign == RIGHT || this.constants.textAlign == "RIGHT"){textAlign(RIGHT)}

        if (this.constants.verbose) console.log("textAlign:", this.constants.textAlign)
    }

    setAngleMode(newAngleMode){
        if (![DEGREES, RADIANS, "DEGREES", "RADIANS"].includes(newAngleMode)){throw new Error(`Angle mode: ${newAngleMode} not recognised. Must be one of DEGREES or RADIANS.`)};
        this.constants.angleMode = newAngleMode;
        if (this.constants.angleMode == DEGREES || this.constants.angleMode == "DEGREES"){angleMode(DEGREES)}
        else if (this.constants.angleMode == RADIANS || this.constants.angleMode == "RADIANS"){angleMode(RADIANS)}
    
        if (this.constants.verbose) console.log("angleMode:", this.constants.angleMode)
    }

    getImageMode(){
        return this.getConstants().imageMode;
    }

    getRectMode(){
        return this.getConstants().rectMode;
    }

    getTextAlign(){
        return this.getConstants().textAlign;
    }

    getAngleMode(){
        return this.getConstants().angleMode;
    }
}

class Grid extends Primitive {
    constructor(x, y){
        super(x, y)
    }
}

class pImage extends Primitive {
    constructor(x, y, src){
        super(x, y);
    }
}

class Primitive extends Psychex{
    // Primitive class with common methods. 
    // Can be extended by more complex and specific geometry and renderable classes: text, images, etc.
    // Handles:
    //      - % vs pixel-based positioning
    constructor(x, y){
        // Call super class constructor to give access to shared constants
        super()
        // Store initial raw position from user as p5 vector
        // Accessible by this.initPos.x, this.initPos.y for x and y respectively
        if (x == undefined || y == undefined) {
            if (this.constants.positionMode == "PERCENTAGE") {
                x = 50;
                y = 50;
            } else {
                x = width/2;
                y = height/2;
            }
        }
        this.initPos = createVector(x, y)
        // If PERCENTAGE mode, convert to pixels under the hood
        if (this.constants.positionMode == "PERCENTAGE"){
            // If percentage provided, convert to pixels to use under the hood
            this.pos = Primitive.toPixels(this.initPos)
        } else {
            this.pos = this.initPos;
        }
    }

    static toPixels(pos){
        return createVector(
            pos.x*(width/100),
            pos.y*(height/100)
        )
    }

    static toPercentage(pos){
        return createVector(
            100*pos.x/width,
            100*pos.y/height
        )
    }
}

class pRectangle extends Primitive{
    constructor(x, y, w, h){
        super(x, y);
        this.dims = Primitive.toPixels(createVector(w, h));
        this.color = color('black')
    }

    draw(){
        let pos = this.pos;
        let dims = this.dims;
        fill(this.color)
        push();
        translate(pos.x, pos.y)
        rect(0, 0, dims.x, dims.y);
        pop();
    }
}

class pCircle extends Primitive{
    // pCircle % radius scaling is based on width
    constructor(x, y, r){
        super(x, y);
        if (this.constants.positionMode == "PERCENTAGE"){this.radius = r*(width/100)}
        else {this.radius = r};
    }

    draw(){
        let pos = this.pos;
        let r = this.radius;
        fill('black')
        push();
        translate(pos.x, pos.y);
        circle(0, 0, r*2);
        pop();
    }
}

class SlideShow extends Primitive {
    constructor(x, y){
        super(x, y);
    }
}

class pText extends Primitive {
    constructor(text, x, y){
        super(x, y)
        this.text = text;
        this.textSize = 32;
    }

    setTextSize(newSize){
        this.textSize = newSize;
    }

    draw(){
        let pos = this.pos
        push();
        translate(pos.x, pos.y);
        text(this.text, 0, 0);
        pop();
    }
}