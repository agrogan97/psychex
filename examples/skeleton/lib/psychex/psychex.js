// Check prerequisites
if (_ == undefined){throw new Error("Psychex requires lodash to be loaded.")}
if (p5 == undefined){throw new Error("Psychex requires p5.js to be loaded.")}

// -- REQUIRED PARAMS -- DO NOT EDIT --
p5.disableFriendlyErrors = true;
var clickables = [];
var canvas;
var roundData;
var isFullScreen = false;
var begin;
var blockLoop = false;

function pClickListener(e) {
    // console.log(e)
    clickables.forEach(obj => {
        if (obj.type == "pImage"){
            if (obj.constants.imageMode == "CENTER") {
                // -- Image / Center -- //
                if (_.inRange(e.clientX, (obj.pos.x-obj.width/2), (obj.pos.x+obj.width/2))){
                    if (_.inRange(e.clientY, (obj.pos.y-obj.height/2), (obj.pos.y+obj.height/2))){
                        obj.onClick(obj)
                    }
                }
            } else if (obj.constants.imageMode == "CORNER"){
                // -- Image / Corner -- //
                if (_.inRange(e.clientX, obj.pos.x, obj.pos.x+obj.width)){
                    if (_.inRange(e.clientY, obj.pos.y, obj.pos.y+obj.height)){
                        obj.onClick(obj)
                    }
                }
            }
        } else if (obj.type == "pRectangle") { 
            if (obj.constants.rectMode == "CENTER"){
                // -- Rect / Center -- //
                if (_.inRange(e.clientX, obj.pos.x-obj.dims.x/2, obj.pos.x+obj.dims.x/2)){
                    if (_.inRange(e.clientY, obj.pos.y-obj.dims.y/2, obj.pos.y+obj.dims.y)){
                        obj.onClick(obj)
                    }
                }
            } else if (obj.constants.rectMode == "CORNER") {
                // -- Rect / Corner -- //
                if (_.inRange(e.clientX, obj.pos.x, obj.pos.x+obj.dims.x)){
                    if (_.inRange(e.clientY, obj.pos.y, obj.pos.y+obj.dims.y)){
                        obj.onClick(obj)
                    }
                }
            } 
        } else {
            if (_.inRange(e.clientX, obj.pos.x*0.9, obj.pos.x*1.1)){
                if (_.inRange(e.clientY, obj.pos.y*0.9, obj.pos.y*1.1)){
                    obj.onClick(obj)
                }
            }
        }
    })
}

function pKeyboardInput(){
    // Add rules for a keyboard input
}

class Psychex{
    // Check for local parameter `params`
    // if no local version check for global variable `params`
    constructor(params = undefined){
        // Set defaults and override with params
        this.constants = {
            positionMode : "PIXELS", // PIXELS or PERCENTAGE
            imageMode: CENTER,
            rectMode: CENTER,
            textAlign: CENTER,
            angleMode: DEGREES,
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

    updateConstants(){
        Object.keys(this.constants).forEach(k => {
            if (k == "positionMode") {this.setPositionMode(this.constants[k])}
            else if (k == "imageMode") {this.setImageMode(this.constants[k])}
            else if (k == "rectMode") {this.setRectMode(this.constants[k])}
            else if (k == "angleMode") {this.setAngleMode(this.constants[k])}
            else if (k == "textAlign") {this.setTextAlign(this.constants[k])}
        })
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

class Primitive extends Psychex{
    // Primitive class with common methods. 
    // Can be extended by more complex and specific geometry and renderable classes: text, images, etc.
    // Handles:
    //      - % vs pixel-based positioning
    //      - Make rendered item clickable
    constructor(x, y, kwargs={}){
        // Call super class constructor to give access to shared constants
        super();
        // Handle kwarg overwrites
        this.kwargs = kwargs;
        this._handleKwargs()
        // Store initial raw position from user as p5 vector
        // Accessible by this.initPos.x, this.initPos.y for x and y respectively
        if (x == undefined || y == undefined) {
            if (this.constants.positionMode == "PERCENTAGE") {
                x = 50;
                y = 50;
            } else {
                x = window.innerWidth/2;
                y = window.innerHeight/2;
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

        this.isClickable = false;

        // Control settings
        // fill, stroke, linewidth
    }

    static toPixels(pos){
        return createVector(
            pos.x*(window.innerWidth/100),
            pos.y*(window.innerHeight/100)
        )
    }

    static toPercentage(pos){
        return createVector(
            100*pos.x/window.innerWidth,
            100*pos.y/window.innerHeight
        )
    }

    _handleKwargs(){
        // TODO: Would likely benefit from some input sanitisation
        // Handle kwarg inputs and feed them into the relevant methods
        if (this.kwargs == undefined) {return}
        // Define the mapping between aesthetic kwargs and p5.js render instructions - and try to keep original p5 keys too
        // TODO fill out this mapping
        this.aestheticsMapping = {
            fill: (c) => {fill(c)},
            backgroundColor: (c) => {fill(c)},
            stroke: (c) => {stroke(c)},
            borderColor: (c) => {stroke(c)},
            strokeWeight: (c) => {strokeWeight(c)},
            borderWidth: (c) => {strokeWeight(c)},
            textSize: (c) => {textSize(c)},
            fontSize: (c) => {textSize(c)},
            textFont: (c) => {textFont(c)},
            fontFamily: (c) => {textFont(c)},
            color: (c) => (fill(c)), // NB: font color, not background color, same as CSS
        }
        this.aesthetics = [];
        Object.keys(this.kwargs).forEach(kwarg => {
            // Overwrite the methods in constants for this specific object
            // NB: this.constants is initialised from the global params, but set per object and can be overriden

            // Handle kwargs in this.constants
            if (Object.keys(this.constants).includes(kwarg)){
                this.constants[kwarg] = this.kwargs[kwarg];
            // Handle aesthetics kwarg by translating to p5.js rendering funcs
            } else if (Object.keys(this.aestheticsMapping).includes(kwarg)){
                // Store the function and the supplied values, so they're not rendered prematurely
                this.aesthetics.push(
                    {
                        _func: this.aestheticsMapping[kwarg],
                        _val: this.kwargs[kwarg]
                    }
                )
            }
        })

        // Update settings with Psychex method
        this.updateConstants();
    }

    updateAesthetics(aes){
        // input aes is a dict of aesthetics instruction
        if (typeof(aes) != "object"){throw new Error(`aesthetics must be an object, not: ${typeof(aes)}.`)}
        // Update the values stored in this.aesthetics upon user request
        Object.keys(aes).forEach(kwarg => {
            // Check if the names aesthetic is in the accepted list
            if (!Object.keys(this.aestheticsMapping).includes(kwarg)){return}
            // Define new aesthetics object
            let newAesObj = {
                _func: this.aestheticsMapping[kwarg],
                _val: aes[kwarg]
            }
            // Check if updating or creating new value to prevent duplicates
            if (Object.keys(this.aesthetics).includes(aes)){
                this.aesthetics[aes] = newAesObj;
            } else {
                this.aesthetics.push(newAesObj);
            }
        })
    }

    toggleClickable(){
        // Adds/removes if this object is in the list of clickables to check on global click
        // Store in global reference to all renderables
        if (clickables != undefined){
            if (clickables.includes(this)){
                clickables = clickables.filter(c => c != this);
                this.isClickable = false;
            } else {
                clickables.push(this)
                this.isClickable = true;
            }
        } else {
            throw new Error("Could not find instantiation of global 'clickables'. This must exist to store references to screen objects.")
        }

        return this;
    }

    updatePosition(x, y){
        if (this.constants.positionMode == "PERCENTAGE"){
            // If percentage provided, convert to pixels to use under the hood
            this.pos = Primitive.toPixels(createVector(x, y))
        } else {
            this.pos = createVector(x, y);
        }  
    }

    onClick(e){}

    draw(){
        // Run each of the aesthetic functions stored in this.aesthetics
        Object.keys(this.aesthetics).forEach(aes => {
            this.aesthetics[aes]._func(this.aesthetics[aes]._val);
        })
    }
}

class pText extends Primitive {
    constructor(text, x, y, kwargs={}){
        super(x, y, kwargs);
        this.type="pText";
        this.text = text;
        this.textSize = 32;
    }

    setTextSize(newSize){
        /*
        Takes sizing as either a font (eg. 32, 36, 42, etc.) or a screen size (sm, md, lg, xl, 2xl, 3xl, 4xl) and will offer scaling based on that 

        // TODO: An optional feature would be to look in this.constants for a screen size setting and use that as default, then make scaling relative.
        */

        let textSizeType = undefined;
        typeof(newSize) == "string" ? textSizeType = "screenType" : textSizeType = "fontSize"
        if (textSizeType == "fontSize"){
            this.textSize = Math.floor(newSize) // Ensure only integer font types are used
        } else if (textSizeType == "screenType"){
            this.screenSize = newSize;
            switch (newSize) {
                case "sm":
                    // Small font
                    this.textSize = 16;
                    break;
                case "md":
                    // Medium font
                    this.textSize = 22;
                    break;
                case "lg":
                    // Large font
                    this.textSize = 28;
                    break;
                case "xl":
                    // XL font
                    this.textSize = 32;
                    break;
                case "2xl":
                    // 2XL font
                    this.textSize = 36;
                    break;
                case "3xl":
                    // 3XL font
                    this.textSize = 42;
                    break;
                case "4xl":
                    // 4XL font
                    this.textSize = 54;
                    break;
                default:
                    print(`Fontsize ${newSize} not recognised. Setting to default size 16. Please specify an integer font size or use one of the following sizes: sm, md, lg, xl, 2xl, 3xl, 4xl.`)
                    this.textSize = 16;
                    this.screenSize = "default";
            }
        }
        // this.textSize = newSize;
        return this;
    }

    static draw_(textContent, x, y, kwargs={}){
        // Static draw method
        if (typeof(kwargs) != "object"){throw new Error(`Expected kwargs to be type object, instead got ${type(kwargs)}.`)}
        // Create new local primitive object to call aesthetic functions and handle coords
        push();
        const primitiveObject = new Primitive(x, y, kwargs);
        primitiveObject.draw()
        translate(primitiveObject.pos.x, primitiveObject.pos.y);
        text(textContent, 0, 0);
        pop();
    }

    draw(){
        super.draw()
        let pos = this.pos
        push();
        translate(pos.x, pos.y);
        textSize(this.textSize)
        text(this.text, 0, 0);
        pop();
    }
}

class pRectangle extends Primitive{
    // TODO: Option to leave y=undefined (or y="auto") which autocalculates and makes it a square rather than make the user do the maths
    constructor(x, y, w, h, kwargs={}){
        super(x, y, kwargs);
        this.type="pRectangle";
        if (this.constants.positionMode == "PERCENTAGE"){
            this.dims = Primitive.toPixels(createVector(w, h));
        } else if (this.constants.positionMode == "PIXELS") {
            this.dims = createVector(w, h);
        }
    }

    withImage(imgObj, kwargs){
        // Overlay an image on the rectangle - common in gridworlds, etc.
        // TODO add with image option too
        this.img = new pImage(this.pos.x, this.pos.y, imgObj, kwargs);
    }

    static draw_(x, y, w, h, kwargs){
        // Static draw method for rect
        if (typeof(kwargs) != "object"){throw new Error(`Expected kwargs to be type object, instead got ${type(kwargs)}.`)}
        push();
        const primitiveObject = new Primitive(x, y, kwargs);
        // Convert width and height to pixels (or not) from kwargs
        let dims;
        if (primitiveObject.constants.positionMode == "PERCENTAGE"){
            dims = Primitive.toPixels(createVector(w, h));
        } else {
            dims = createVector(w, h);
        }
        primitiveObject.draw();
        translate(primitiveObject.pos.x, primitiveObject.pos.y);
        rect(0, 0, dims.x, dims.y)
        pop();
    }

    draw(){
        super.draw();
        let pos = this.pos;
        let dims = this.dims;
        push();
        translate(pos.x, pos.y)
        rect(0, 0, dims.x, dims.y);
        if (this.img != undefined){this.img.draw()};
        pop();
    }
}

class pCircle extends Primitive{
    // pCircle % radius scaling is based on width
    constructor(x, y, r, kwargs={}){
        super(x, y, kwargs);
        this.type="pCircle";
        if (this.constants.positionMode == "PERCENTAGE"){this.radius = r*(window.innerWidth/100)}
        else {this.radius = r};
    }

    draw(){
        super.draw()
        let pos = this.pos;
        let r = this.radius;
        fill('black')
        push();
        translate(pos.x, pos.y);
        circle(0, 0, r*2);
        pop();
    }
}

class pImage extends Primitive{
    /*
        Expects a p5 image object reference, from assets.imgs as input
    */
    constructor(x, y, imgObj, kwargs={}){
        super(x, y, kwargs);
        this.type="pImage";
        this.imgObj = imgObj;
        this.width = this.imgObj.width;
        this.height = this.imgObj.height;
        this.scaleBy = 1;
    }

    setScale(s){
        this.scaleBy = s;
        return this;
    }
    
    onClick(){
        this.setScale(this.scaleBy+0.1);
    }

    draw() {
        super.draw();
        let pos = this.pos;
        push();
        translate(pos.x, pos.y)
        scale(this.scaleBy)
        image(this.imgObj, 0, 0)
        pop();
    }
}

class NArmBandit extends Primitive{
    constructor(x, y, nArms=2, probabilities="random"){
        super();
        this.nArms = nArms;
        // Sanitise probability input
        if (this._checkProbabilities(probabilities)) {this.probabilities = probabilities};
        this.convertKeyToProbabilities();
    }

    _checkProbabilities(p){
        if (typeof(p) == "string"){
            if (!["random"].includes(p)){
                throw new Error(`Probability type ${p} not recognised: must be one of: random`)
            } else {
                return true
            }
        } else if (typeof(p) == "object"){
            if (p.length != this.nArms){
                throw new Error(`Warning: Provided ${p.length} probabilities for ${this.nArms} arms. Make sure the number of probabilities provided matches the number of arms.`);
            } else {
                return true
            }
        } else {
            throw new Error(`Must provide either a probability type (eg. 'random') or an array of values matching the number of arms (eg. if nArms=2, [0.5, 0.5])`);
        }
    }

    convertKeyToProbabilities(){
        // If user provides this.probabilities as a string code - eg. "random", convert to a list of probabilities
        if (typeof(this.probabilities) == "string"){
            this.probabilities = _.range(0, this.nArms).map(i => _.random(0, 1, true));
            if (this.constants.verbose){console.log(`Bandit arm values set to: ${this.probabilities}`)}
        }
    }

    setNArms(n){
        this.nArms = n;
        return this;
    }

    getNArms(n){
        return this.nArms;
    }

    setProbabilities(p){
        if (this._checkProbabilities(p)) {this.probabilities = p};
        return this;
    }

    getProbabilities(){
        return this.probabilities;
    }

    pullArm(index){
        /*
            Pull the arm related to the given index in this.probabilities.
            NB: These are ordered in the order provided by the user in this.probabilities - and may differ from the order rendered in if this.shuffle is set.
            Returns true if reward is issued, false if not.
        */

        // Generate a random number
        const drawnVal = _.random(0, 1, true);
        return (drawnVal <= this.probabilities[index]) ? true : false;
    }

    update(probabilities, nArms){
        /*
            Update the number of arms or probabilities used manually by providing new values for both quantities respectively.
        */
        this.nArms = nArms;
        if (this._checkProbabilities(probabilities)) {this.probabilities = probabilities};
        this.convertKeyToProbabilities();
    }

    draw(){

    }
}

class Game {
    constructor(){
        this.data = [];
        // Add dedicated screens that can be rendered as needed - e.g. fullscreen warnings, intersitials, etc.
        this.screens = {};
    }

    async saveData(data){
        const URL = `api/save/`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })

        return response;
    }

    addScreen(name, callback){
        /*
        // Adds a screen that can be rendered when needed
        // Expects a name and a callback, which will be a function with draw instructions
        // Eg.

            const intersitial = () => {
                // Using primitive static methods rather than creating variables, since we don't need them to be dynamic
                pImage.draw_(`Intersitial screen with user instructions`, 50, 50, {...kwargs})
            }

            var game = new Game();
            game.addScreen("myIntersitial", intersitial);

            // Inside global draw method
            draw() {
                clear();
                // ... //
                if (game.data.roundIndex = 10){
                    game.displayScreen("myIntersitial", {...kwargs})
                }

            }
        */
    }

    displayScreen(name, kwargs={}){
        return this.screens[name](kwargs)
    }

    nextRound(){

    }

    end(){

    }

    restart(){

    }

    skip(){

    }

    addHud(kwargs={}){
        // Add a hud (heads up display) to the screen
        // Offers raw functionality to include round counter, title, score, skip, restart, etc. elements, and can be extended to include custom components
    }
}

class Utils{

    static detectFullscreen(){
        return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement);
    }
    
    static requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    
        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

}

class GridWorld extends Primitive {
    // Gridworld class
    // Note, this class requires positionMode to be set in class params, not as a global param like primitives
    // Click Listener: In a composite object, clicks are defined for the individual primitives.
    // Thus, creating onClick() will still work, but the toggleClickable() method used is an overridden version that assigns
    // all composite primitves as individual clickables using the composite onClick() method.
    constructor(x, y, w, h, nRows, nCols, align="CORNER", kwargs={}){
        super(x, y, {});
        // Convert width and height to pixels from percentage if req'd
        if (this.constants.positionMode == "PERCENTAGE"){
            this.initDims = createVector(w, h);
            this.dims = Primitive.toPixels(this.initDims);
        }

        if (!["CORNER", "CENTER"].includes(align)){
            throw new Error(`alignment ${align} not recognised. Must be one of: CORNER, CENTER`)
        } else {
            this.align = align;
        }
        this.nRows = nRows;
        this.nCols = nCols;
        this.kwargs = kwargs;
        this.cells = [];
    }

    getWidth(){
        return this.initDims.x;
    }

    getHeight(){
        return this.initDims.y
    }

    setWidth(w){
        if (this.constants.positionMode == "PERCENTAGE"){
            let tmp = Primitive.toPixels(createVector(w, 0))
            this.dims.x = tmp.x;
        } else {
            this.dims.x = w;
        }
        // Update original
        this.initDims.x = w;
    }

    setWidth(h){
        if (this.constants.positionMode == "PERCENTAGE"){
            let tmp = Primitive.toPixels(createVector(0, h));
            this.dims.y = tmp.y;
        } else {
            this.dims.y = y
        }
        // Update original
        this.initDims.y = h;
    }

    drawOutline(){
        // Draw the outline shape of the grid, considering the positionMode set
        // The grid is not actually individual lines, but a series of pRectangle objects attached to each other
        // This makes them individually clickable
        const xOffset = this.dims.x/this.nCols;
        const yOffset = this.dims.y/this.nRows;

        _.range(this.nRows).forEach((row, r_ix) => {
            _.range(this.nCols).forEach((col, c_ix) => {
                let newCell = {ix: c_ix + (this.nCols*r_ix), coords: [c_ix, r_ix]};
                let anchor;
                if (this.align == "CORNER"){
                    // Align from top-left corner
                    anchor = this.pos;
                } else if (this.align == "CENTER"){
                    // Create anchor point at top LHS corner and draw from there
                    anchor = createVector(this.pos.x - (this.dims.x/2), this.pos.y - (this.dims.y/2));
                }
                
                newCell.obj = new pRectangle(anchor.x + (c_ix*xOffset), anchor.y + (r_ix*yOffset), xOffset, yOffset, {positionMode:"PIXELS", rectMode: "CORNER", ...this.kwargs});
                // Copy the coords and ix to the object itself - allows for more options with filtering and helps with click listeners
                newCell.obj.ix = newCell.ix;
                newCell.obj.coords = newCell.coords;
                this.cells.push(newCell);
            })
        })

        return this;
    }

    setSchema(schema){
        // TODO (but not rn): add an object that defines a play schema, overlaying images and click rules at certain indices/coords
    }

    setCellProps(id, props={}){
        // Set the properties on a single cell
        // The input, id, can either be the index or coords, and the method will adapt
        let ix;

        if (typeof(id) == "number"){
            if (id >= this.nRows*this.nCols){throw new Error(`Index ${id} out of bounds. Max index is ${this.nRows*this.nCols - 1}. Indexing starts at 0 inclusive.`)}
            ix = id;
        } else if (id.isPInst){
            // Convert vector to index
            ix = this.coordsToIndex([id.x, id.y]);
        } else if (typeof(id) == "object"){
            // Convert array to index
            ix = this.coordsToIndex([id[0], id[1]]);
        }

        // Get cell ref
        let cell = this.cells.filter(cell => cell.ix == ix)[0].obj
        cell.updateAesthetics(props)
    }

    indexToCoords(ix){
        // Convert index to grid coordinates
        return [(ix % this.nRows), Math.floor(ix/this.nRows)]
    }

    coordsToIndex(coords){
        // Convert coords to grid index
        if (coords.isPInst){
            coords = [coords.x, coords.y]
        } else if (typeof(coords) != "object"){
            throw new Error(`Got input type ${coords}, expected either a p5.Vector or an array of coords (eg. [1, 2])`)
        }

        return ((coords[0])*this.nRows + coords[1]);
    }

    toggleClickable(){
        // Extend parent class to make each composite item clickable
        this.cells.forEach(cell => {
            // Make primitive clickable
            cell.obj.toggleClickable();
            // Set primitive onClick
            cell.obj.onClick = (cell) => {this.onClick(cell)}
        })
    }

    onClick(e){
        e.updateAesthetics({backgroundColor: "pink"})
    }

    draw(){
        push();
        this.cells.forEach(cell => {
            cell.obj.draw();
        })
        pop();
    }
}
 
/*
Main TODO:
    - Add image overlay on rect
    - Add to the aesthetics list
    - Add click listener to pText
    - Handle keyboard input and assign functionality
    - Tidying and testing the fullscreen checker; move it to a Utils class instead?

Classes to add:
    - Slideshow
    - Stages 
    - UI/HUD
    - Progress bar/timer

Extra thoughts:
    - Better to build with npm and then use webpack - since it depends on lodash and p5.js
    - An animations class would be great - but not hugely useful within the lab
    - Functionality for multiplayer modes would be super, using socket.js or something, but again we need a lab use case first
*/