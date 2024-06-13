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
var psychex = {};
psychex.aesthetics = {
    show : () => {
        console.log(`Aesthetics are set for:`);
        Object.keys(psychex.aesthetics).filter(i => !["show", "_edit", "_show"].includes(i)).forEach(i => {
            console.log(`- ${i}`)}
        );
        console.log(`For more details, run psychex.aesthetics.[element].show(), replacing [element] with the primitive type (eg. pText)`)
    },
    pText : {
        textColor: 'black',
        textSize: 20,
        textStyle: "NORMAL",
        strokeWeight: 0.5,
        fontFamily: "sans-serif",
        textAlign: "CENTER",
        edit : (aes) => {psychex.aesthetics._edit(aes, "pText")},
        show: () => {psychex.aesthetics._show("pText")},
    },
    pRectangle : {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        rectMode: "CENTER",
        edit : (aes) => {psychex.aesthetics._edit(aes, "pRectangle")},
        show: () => {psychex.aesthetics._show("pRectangle")},
    },
    pCircle: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        edit : (aes) => {psychex.aesthetics._edit(aes, "pCircle")},
        show: () => {psychex.aesthetics._show("pCircle")},
    },
    pTriangle: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        edit : (aes) => {psychex.aesthetics._edit(aes, "pTriangle")},
        show: () => {psychex.aesthetics._show("pTriangle")},
    },
    _edit : (aes, obj) => {
        if (typeof(aes) != "object"){throw new Error(`To edit the global psychex.aesthetics, enter an object mapping property to value, e.g.: {backgroundColor: 'blue'}`)}
        // Sanitise inputs, especially re: textStyle and the p5 constants
        Object.keys(aes).forEach(a => {
            // Check if the values of the aesthetics provided match those available in aesthetics.pText, discluding the edit and show funcs
            if (Object.keys(psychex.aesthetics[obj]).filter(i => !i.includes(["edit", "show"]))){
                try {
                    // Update the value
                    psychex.aesthetics[obj][a] = aes[a];
                } catch (error) {
                    console.log(`Provided param ${a} not a default property of ${obj}. To edit this, add it to the object kwargs, or add it manually.`)
                }
            }
        })
    },
    _show: (obj) => {
        console.log(`-- ${obj} default aesthetics --`)
        Object.keys(psychex.aesthetics[obj]).filter(i => !i.includes(["edit", "show"])).forEach(aes => {
            console.log(`- ${aes} : ${psychex.aesthetics[obj][aes]}`)
        })
    }
}

// Keypress events module that stores callbacks for different click events and allows you to register new ones and update existing ones
psychex.keyPressEvents = {
    events: [],
    register: (k, callback) => {
        // Check if an event is written to this key already
        let existingEvents = psychex.keyPressEvents.events.filter(i => (i.k == k));
        if (existingEvents.length == 0){
            // Write new event
            psychex.keyPressEvents.events.push({k: k, callback: callback});
        } else {
            existingEvents[0].callback = callback;
        }
    },
    clear: () => {psychex.keyPressEvents.events = []},
}

// TODO: Currently we need to manually attach a click event listener to the window - this should be done automatically by Psychex surely?

function pClickListener(e) {
    // TODO circle click listener
    // Check what global positioning system is being used
    const convertTo = (params.positionMode == "PERCENTAGE" ? "PIXELS" : "IGNORE");
    // If positionMode == "PERCENTAGE", we want to convert mouse click coords from pixels (the default) to percentage
    // If positionMode == "PIXELS", we want it to stay as pixels, so we can use the "IGNORE" setting in _convertCoordinates to do nothing essentially
    const C = Primitive._convertCoordinates(createVector(mouseX, mouseY), convertTo);
    clickables.forEach(obj => {
        if (obj.type == "pImage"){
            if (obj.constants.imageMode == "CENTER") {
                // -- Image / Center -- //
                if (_.inRange(C.x, (obj.pos.x-obj.width/2), (obj.pos.x+obj.width/2))){
                    if (_.inRange(C.y, (obj.pos.y-obj.height/2), (obj.pos.y+obj.height/2))){
                        obj.onClick(obj);
                    }
                }
            } else if (obj.constants.imageMode == "CORNER"){
                // -- Image / Corner -- //
                if (_.inRange(C.x, obj.pos.x, obj.pos.x+obj.width)){
                    if (_.inRange(C.y, obj.pos.y, obj.pos.y+obj.height)){
                        obj.onClick(obj);
                    }
                }
            }
        } else if (obj.type == "pRectangle" || obj.type == "pButton") { 
            
            if (obj.constants.rectMode == "CENTER"){
                // -- Rect / Center -- //
                if (_.inRange(C.x, obj.pos.x-obj.dims.x/2, obj.pos.x+obj.dims.x/2)){
                    if (_.inRange(C.y, obj.pos.y-obj.dims.y/2, obj.pos.y+obj.dims.y/2)){
                        obj.onClick(obj);
                    }
                }
            } else if (obj.constants.rectMode == "CORNER") {
                // -- Rect / Corner -- //
                if (_.inRange(C.x, obj.pos.x, obj.pos.x+obj.dims.x)){
                    if (_.inRange(C.y, obj.pos.y, obj.pos.y+obj.dims.y)){
                        obj.onClick(obj);
                    }
                }
            } 
        } else if (obj.type == "pCircle") { 
            let CPix = obj.constants.positionMode == "PERCENTAGE" ? Primitive.toPixels(C) : C; 
            let posPix = obj.constants.positionMode == "PERCENTAGE" ? Primitive.toPixels(obj.pos) : obj.pos; 
            let radiusPix = (obj.constants.positionMode == "PERCENTAGE" ? obj.radius*(innerWidth/100) : obj.radius)

            const isInCircle = (x, y, cx, cy, r) => {
                let dx = x - cx;
                let dy = y - cy;
                return dx*dx + dy*dy <= r*r
            }

            let inCircle = isInCircle(posPix.x, posPix.y, CPix.x, CPix.y, radiusPix)
            if (inCircle){
                obj.onClick(obj)
            }
        } else if (obj.type == "pTriangle"){
            // Find the lowest and highest x values
            // This could be implemented by taking click position and finding the closest triangle point, then
            // checking if angle between point and click is outside of the angle between the point and the other 2 points
            // but the amount of computation to do here might be really heavy, so needs testing
            throw new Error("FYI, triangle clicking isn't currently supported.")
        
        } else if (obj.type = "pText") {
            // Width uses p5.textWidth(), height taken from textSize (which is height of text in pixels by definition)
            let CPix = obj.constants.positionMode == "PERCENTAGE" ? Primitive.toPixels(C) : C;
            let posPix = obj.constants.positionMode == "PERCENTAGE" ? Primitive.toPixels(obj.pos) : obj.pos; 
            if (_.inRange(CPix.x, posPix.x-textWidth(obj.text)/2, posPix.x+textWidth(obj.text/2))){
                let fsize;
                try {
                    // Try and read textSize from aesthetics list
                    fsize = content.clicks.txt.aesthetics.filter(i => i._func.name == "textSize")[0]._val;
                } catch (error) {
                    // If not found use a default val of 30
                    fsize = 30;
                }
                if (_.inRange(CPix.y, posPix.y-fsize/2, posPix.y+fsize/2)){
                    obj.onClick(obj);
                }
            }

        
        } else {
            if (_.inRange(C.x, obj.pos.x*0.9, obj.pos.x*1.1)){
                if (_.inRange(C.y, obj.pos.y*0.9, obj.pos.y*1.1)){
                    console.log("other")
                    obj.onClick(obj);
                }
            }
        }
    })
}

function pKeyboardInput(){
    // Add rules for a keyboard input
}

function keyPressed(e){
    // p5.js keyPressed function
    // Iterate over contents of psychex.keyPressEvents and see if one matches the key pressed
    // Run callback if registered
    // console.log(key)
    psychex.keyPressEvents.events.filter(i => (i.k == key)).forEach(i => {i.callback(e)});
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
        if (this.constants.textAlign == LEFT || this.constants.textAlign == "LEFT"){textAlign(LEFT, CENTER)}
        else if (this.constants.textAlign == CENTER || this.constants.textAlign == "CENTER"){textAlign(CENTER, CENTER)}
        else if (this.constants.textAlign == RIGHT || this.constants.textAlign == "RIGHT"){textAlign(RIGHT, CENTER)}

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
        this.aesthetics = [];
        this._handleKwargs()
        // Store initial raw position from user as p5 vector
        // Accessible by this.initPos.x, this.initPos.y for x and y respectively
        if (x == undefined || y == undefined) {
            if (this.constants.positionMode == "PERCENTAGE") {
                x = 50;
                y = 50;
            } else {
                x = canvas.width/2;
                y = canvas.height/2;
            }
        }
        this.pos = createVector(x, y);

        this.isClickable = false;
        this.scaleBy = 1;
        this.rotateBy = 0;

        // Control settings
        // fill, stroke, linewidth
    }

    static toPixels(pos){
        // Check if vector or array - either allowed, but convert to vector internally
        pos = (pos.isPInst? pos : createVector(pos[0], pos[1]));
        return createVector(
            pos.x*(canvas.width/100),
            pos.y*(canvas.height/100)
        )
    }

    static toPercentage(pos){
        // Check if vector or array - either allowed, but convert to vector internally
        pos = (pos.isPInst? pos : createVector(pos[0], pos[1]));
        return createVector(
            100*pos.x/canvas.width,
            100*pos.y/canvas.height,
        )
    }

    _handleKwargs(kwargs){
        // TODO: Would likely benefit from some input sanitisation
        // Handle kwarg inputs and feed them into the relevant methods
        // If an obj is provided then use those inputs - otherwise use this.kwargs
        let _kwargs;
        if (kwargs == undefined || kwargs == {}){
            if (this.kwargs == undefined){
                return
            } else {
                _kwargs = this.kwargs
            }
        } else {
            _kwargs = kwargs;
        }
        // Define the mapping between aesthetic kwargs and p5.js render instructions - and try to keep original p5 keys too
        // TODO fill out this mapping
        // this.aestheticsMapping = {
        //     fill: (c) => {fill(c)},
        //     backgroundColor: (c) => {fill(c)},
        //     stroke: (c) => {stroke(c)},
        //     borderColor: (c) => {stroke(c)},
        //     strokeWeight: (c) => {strokeWeight(c)},
        //     borderWidth: (c) => {strokeWeight(c)},
        //     textSize: (c) => {textSize(c)},
        //     fontSize: (c) => {textSize(c)},
        //     textFont: (c) => {textFont(c)},
        //     textStyle: (c => {textStyle(c)}),
        //     fontFamily: (c) => {textFont(c)},
        //     fontColor: (c) => {fill(c); stroke(c)},
        //     textColor: (c) => {fill(c); stroke(c)},
        //     color: (c) => (fill(c)), // NB: font color, not background color, same as CSS
        //     scale: (c) => (scale(c)),
        //     borderRadius: () => {throw new Error(`You've included the property borderRadius in your styling - unfortunately this isn't yet supported. You could use p5.js geometries to try and build your own shape, or create the shape you need in an illustration software (eg. Paint or equivalent) and load it as a pImage. If you have a creative solution, feel free to submit a PR!`)},
        //     lineSpacing: (c) => {this.lineSpacing = c}, // NB: line spacing is change in font size, not %
        // }

        this.aestheticsMapping = {
            // pText
            textColor: (c) => {fill(c)},
            textSize: (c) => {textSize(c)},
            textStyle: (c) => {textStyle(c)},
            strokeWeight: (c) => {strokeWeight(c)},
            fontFamily: (c) => {textFont(c)},
            lineSpacing: (c) => {this.lineSpacing = c}, // NB: line spacing is change in font size, not %

            // shared
            backgroundColor: (c) => {fill(c)},
            borderColor: (c) => {stroke(c)},
            color: (c) => {stroke(c); fill(c)},
            borderWidth: (c) => {strokeWeight(c)},
            scale : (c) => {scale(c)}
        }

        Object.keys(_kwargs).forEach(kwarg => {
            // Overwrite the methods in constants for this specific object
            // NB: this.constants is initialised from the global params, but set per object and can be overriden

            // Check if overwriting a value from this.constants (e.g. positionMode)
            if (Object.keys(this.constants).includes(kwarg)){
                this.constants[kwarg] = _kwargs[kwarg];
            // Check if kwargs contains a value from this.aestheticsMapping
            } else if (Object.keys(this.aestheticsMapping).includes(kwarg)){
                // Store the function and the supplied values, so they're not rendered prematurely
                // If existing, overwrite
                if (this.aesthetics.map(i => i._func.name).includes(kwarg)){
                    // existing instance of this aesthetic in this.aesthetics -> remove it
                    this.aesthetics = this.aesthetics.filter(i => i._func.name != kwarg)
                }
                // write aesthetic to list
                this.aesthetics.push(
                    {
                        _func: this.aestheticsMapping[kwarg],
                        _val: _kwargs[kwarg]
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
            if (this.aesthetics.map(i => i._func.name).includes(kwarg)){
                // If we already have an aesthetic of this type, remove the previous
                this.aesthetics = this.aesthetics.filter(i => i._func.name != kwarg) 
            } 
            // And add the new aesthetic to the list    
            this.aesthetics.push(newAesObj);
            
        })
    }

    setScale(s){
        this.scaleBy = s;
        return this;
    }

    setRotate(r){
        this.rotateBy = r;
        return this;
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

    getCenter(){
        // return the center of the primitive - basically only useful if set to CORNER mode
        if (this.type == "pImage" || this.type == "pRectangle"){
            // They're both 4 sided shapes, so same method either way
            if (this.constants.rectMode == "CORNER" || this.constants.imageMode == "CORNER"){
                this.centerPoint = createVector(this.pos.x + this.dims.x/4, this.pos.y + this.dims.y/4)
            } else {
                this.centerPoint = this.pos;
            }
        } 
        return this.centerPoint;
    }

    updatePosition(x, y){
        if (this.constants.positionMode == "PERCENTAGE"){
            // If percentage provided, convert to pixels to use under the hood
            this.pos = Primitive.toPixels(createVector(x, y))
        } else {
            this.pos = createVector(x, y);
        }  
    }

    update(update={}){
        if (update == {} || update == undefined){return}
        // A wrapper that processes kwargs and updates position and/or image
        if (typeof(update) != "object"){throw new Error(`Expected param 'update' to be an object. Instead got: ${typeof(update)}.`)}
        // Also accept kwargs
        this._handleKwargs(update);
        Object.keys(update).forEach(arg => {
            if (arg == "pos" || arg == "position"){
                // handle percentage-based position updates
                if (this.constants.positionMode == "PERCENTAGE"){
                    this.pos = Primitive.toPixels(update[arg]);
                } else {
                    this.pos = update[arg];
                }
            } else if (arg == "x"){
                if (this.constants.positionMode == "PERCENTAGE"){
                    this.pos.x = Primitive.toPixels(update[arg]).x;
                } else {
                    this.pos.x = update[arg].x;
                }
            } else if (arg == "y"){
                if (this.constants.positionMode == "PERCENTAGE"){
                    this.pos.y = Primitive.toPixels(update[arg]).y;
                } else {
                    this.pos.y = update[arg].y;
                }
            }
            // ... //
            // -- can be extended by sub-classes for class-specific updates -- //
            // ... //
        })
    }

    convertCoordinates(coords=undefined){
        // Check the positionMode setting and return either coordinates as pixels or percentage
        // Creates this._pos, which stores the pixel value of the position, while pos keeps the user inputted version
        // if inPlace is set then this doesn't set this._pos, and just returns the vector - useful for setting dims
        if (coords == undefined){
            if (this.constants.positionMode == "PERCENTAGE"){
                // If percentage provided, convert to pixels to use under the hood
                this._pos = Primitive.toPixels(createVector(this.pos.x, this.pos.y));
            } else {
                this._pos = createVector(this.x, this.y);
            }
        } else {
            if (this.constants.positionMode == "PERCENTAGE"){
                // If percentage provided, convert to pixels to use under the hood
                return Primitive.toPixels(createVector(coords.x, coords.y));
            } else {
                return createVector(coords.x, coords.y);
            }
        }
    }
    
    static _convertCoordinates(coords, positionMode=undefined){
        // The point of this method is to wrap all the sanitisation into one call to clean up code elsewhere, 
        // it essentially just converts between coordinate systems through a static call, for use by click listeners eg.
        let pm;
        if (params == undefined && positionMode == undefined){
            throw new Error(`Could not find object 'params' - this needs to be set so Psychex knows what positionMode to use.`)
        } else if (params.positionMode == undefined && positionMode == undefined){
            throw new Error(`Could not find 'params.positionMode' - this needs to be set so Psychex knows what positionMode to use.`)
        } else if (positionMode != undefined){
            pm = positionMode;
        } else {
            pm = params.positionMode;
        }

        if (pm == "PERCENTAGE"){
            // If percentage provided, convert to pixels to use under the hood
            return Primitive.toPixels(createVector(coords.x, coords.y));
        } else if (pm == "PIXELS") {
            return Primitive.toPercentage(createVector(coords.x, coords.y))
        } else if (pm == "IGNORE") {
            return createVector(coords.x, coords.y)
        }
    }

    onClick(e){}

    draw(){
        // Run each of the aesthetic functions stored in this.aesthetics
        Object.keys(this.aesthetics).forEach(aes => {
            this.aesthetics[aes]._func(this.aesthetics[aes]._val);
        })
        // this._pos = this.pos;
        this.convertCoordinates();
        return this._pos;
    }
}

class pText extends Primitive {
    constructor(text, x, y, kwargs={}){
        // -- Set default aesthetics -- //
        super(x, y, {...kwargs});
        this.type="pText";
        this.text = text.toString();
        this.scaleBy = 1;
        this.lineSpacing = 0;
        // add default aesthetics to the pText object
        this.defaultAesthetics = psychex.aesthetics.pText;
        this._handleKwargs({...this.defaultAesthetics, ...this.kwargs})
        
    }

    setTextSize(newSize){
        /*
        // Old version before aesthetics were introduced - needs updating to new pattern
        
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

    setScale(s){
        this.scaleBy = s;
        return this;
    }

    update(update={}){
        super.update(update);
        Object.keys(update).forEach(arg => {
            if (arg == "text"){
                this.text = update[arg];
            }
        })
    }

    handleNewLine(t){
        t = t.toString()
        try{
            if (!t.includes("\n")){return [t]}
        } catch {
            console.log(t)
        }
        try{
            return t.split("\n")
        } catch {
            console.log(t)
        }
    }

    static draw_(textContent, x, y, kwargs={}){
        // Static draw method
        textContent = textContent.toString();
        if (typeof(kwargs) != "object"){throw new Error(`Expected kwargs to be type object, instead got ${type(kwargs)}.`)}
        // Create new local primitive object to call aesthetic functions and handle coords
        push();
        const primitiveObject = new Primitive(x, y, {...psychex.aesthetics.pText, ...kwargs});
        let p = primitiveObject.draw()
        translate(p.x, p.y);
        text(textContent, 0, 0);
        pop();
    }

    draw(update={}){
        let p = super.draw()
        this.update(update)
        push();
        translate(p.x, p.y);
        // textSize(this.textSize)
        scale(this.scaleBy);
        // Check if text contains a newline, and handle that
        let nls = this.handleNewLine(this.text);
        nls.forEach((ln, ix) => {
            text(ln, 0, (ix*(textSize() + this.lineSpacing)));
        })
        // text(this.text, 0, 0);
        pop();
    }
}

class pRectangle extends Primitive{
    // TODO: Option to leave y=undefined (or y="auto") which autocalculates and makes it a square rather than make the user do the maths
    constructor(x, y, w, h, kwargs={}){
        super(x, y, kwargs);
        this.type="pRectangle";
        this.dims = createVector(w, h);
        // Add default aesthetics
        this.defaultAesthetics = psychex.aesthetics.pRectangle;
        this._handleKwargs({...this.defaultAesthetics, ...this.kwargs})
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
        let dims = primitiveObject.convertCoordinates(createVector(w, h))
        let p = primitiveObject.draw();
        translate(p.x, p.y);
        rect(0, 0, dims.x, dims.y)
        pop();
    }

    onClick(){}

    draw(){
        let p = super.draw();
        let dims = super.convertCoordinates(this.dims);
        push();
        translate(p.x, p.y)
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
        this.radius = r;
        // Add default aesthetics
        this.defaultAesthetics = psychex.aesthetics.pCircle;
        this._handleKwargs({...this.defaultAesthetics, ...this.kwargs})
    }

    handleRadius(){
        // Convert radius to appropriate positionMode val
        if (this.constants.positionMode == "PERCENTAGE"){return this.radius*(innerWidth/100)}
        else {return this.radius}
    }

    draw(){
        let p = super.draw()
        let r = this.handleRadius();
        push();
        translate(p.x, p.y);
        circle(0, 0, r*2);
        pop();
    }
}

class pTriangle extends Primitive{
    constructor(x1, y1, x2, y2, x3, y3, kwargs={}){
        super(x1, y1, kwargs);
        this.type="pTriangle";

        if (this.constants.positionMode == "PERCENTAGE"){
            this.pos1 = Primitive.toPixels(createVector(x1, y1));
            this.pos2 = Primitive.toPixels(createVector(x2, y2));
            this.pos3 = Primitive.toPixels(createVector(x3, y3));
        } else {
            this.pos1 = createVector(x1, y1);
            this.pos2 = createVector(x2, y2);
            this.pos3 = createVector(x3, y3);
        }

        this.x2Diff = createVector(this.pos2.x - this.pos1.x, this.pos2.y - this.pos1.y)
        this.x3Diff = createVector(this.pos1.x - this.pos3.x, this.pos1.y - this.pos3.y)

        // Add default aesthetics
        this.defaultAesthetics = psychex.aesthetics.Triangle;
        this._handleKwargs({...this.defaultAesthetics, ...this.kwargs})
    }

    static draw_(x1, y1, x2, y2, x3, y3, kwargs={}){
        if (typeof(kwargs) != "object"){throw new Error(`Expected kwargs to be type object, instead got ${type(kwargs)}.`)}
        push();
        const primitiveObject = new Primitive(x1, y1, kwargs);
        let pm;
        if (Object.keys(kwargs).includes("positionMode")){
            pm = kwargs["positionMode"];
        } else {
            pm = (primitiveObject.constants.positionMode == "PERCENTAGE" ? "PERCENTAGE" : "PIXELS")
        }
        let pos1, pos2, pos3;
        if (pm == "PERCENTAGE"){
            pos1 = Primitive.toPixels(createVector(x1, y1));
            pos2 = Primitive.toPixels(createVector(x2, y2));
            pos3 = Primitive.toPixels(createVector(x3, y3));
        } else {
            pos1 = createVector(x1, y1);
            pos2 = createVector(x2, y2);
            pos3 = createVector(x3, y3);
        }

        push();
        translate(0, 0);
        // TODO finish
        triangle(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y, this.pos3.x, this.pos3.y);
        pop();
    }

    draw(){
        let p = super.draw();
        push();
        translate(p.x, p.y);
        triangle(0, 0, this.x2Diff.x, this.x2Diff.y, -this.x3Diff.x, this.x3Diff.y);
        pop();
    }
}

class pImage extends Primitive{
    /*
        Expects a p5 image object reference, from assets.imgs as input
    */
    constructor(x, y, img, kwargs={}){
        super(x, y, kwargs);
        this.type="pImage";
        this.img = img;
        this.width = this.img.width;
        this.height = this.img.height;
        this.scaleBy = 1;
        this.dims = Primitive._convertCoordinates(createVector(this.img.width, this.img.height), "PIXELS");
        // compute and store the centre point for later use if needed
        this.getCenter(); // Sets this.centerPoint
    }

    setScale(s){
        this.scaleBy = s;
        return this;
    }
    
    onClick(){
        // this.setScale(this.scaleBy+0.1);
    }

    update(update={}){
        super.update(update);
        Object.keys(update).forEach(arg => {
            if (arg == "image" || arg == "img"){
                this.img = arg;
            }
        })

    }

    static draw_(x, y, img, kwargs){
        // Static draw method for rect
        if (typeof(kwargs) != "object"){throw new Error(`Expected kwargs to be type object, instead got ${type(kwargs)}.`)}
        push();
        const primitiveObject = new Primitive(x, y, kwargs);
        primitiveObject.draw();
        translate(primitiveObject.pos.x, primitiveObject.pos.y);
        image(img, 0, 0);
        pop();
    }

    draw(update= {}) {
        super.draw();
        this.update(update)
        // let pos = this.pos;
        push();
        translate(this._pos.x, this._pos.y)
        scale(this.scaleBy);
        rotate(this.rotateBy);
        image(this.img, 0, 0)
        pop();
    }
}

class pButton extends Primitive {
    // A button is a pRectangle object with the option to add text or an image to the centre and is automatically clickable
    constructor(x, y, w, h, kwargs={}){
        super(x, y, {});
        this.type = "pButton"
        this.kwargs = kwargs;
        this.initDims = createVector(w, h);
        this.rect = new pRectangle(x, y, w, h, kwargs);
        this.dims = this.rect.dims;
        this.text = undefined;
        this.img = undefined;
        this.toggleClickable();
    }

    addImage(){

    }

    addText(text, kwargs={textAlign: "CENTER"}){
        // Place at x, y with option to override
        const myKwargs = {...kwargs};
        this.text = new pText(text, this.pos.x, this.pos.y, kwargs);
        return this;
    } 

    clickAnimation(){
        // A default click animation that can be overridden
    }

    onClick(){
    }

    draw(){
        let p = super.draw();
        this.rect.draw();
        if (this.text != undefined){
            this.text.draw();
        }
        if (this.img != undefined){
            this.img.draw();
        }
    }
}

class Countdown extends Primitive {
    // TODO needs polishing, refinement, testing etc.
    // eg. func for setting separate params per foreground and background rects in progress bar
    // also we have a pause method but no play method
    constructor(x, y, endtime, kwargs={}){
        super(x, y, kwargs);
        this.endtime = endtime;
        this.initTime = Date.now();
        this.stop = true;
        this.prop = 0;
        this.graphic = undefined;
    }

    setGraphic(graphic, params={}){
        /*
            Set the graphic to be either a circular arc that varies between full 360 deg and 0 deg, or a progress bar.
        */

        if (graphic == "arc"){
            if (params.w == undefined || params.h == undefined){throw new Error("When setting an arc, please provide a width and height via the params. For example: setGraphic('arc', {w: 1, h: 1})")}
            this.graphic = new Primitive(this.x, this.y, {...psychex.aesthetics.pCircle, ...params});
            this.graphic.draw = () => {
                push();
                this.graphic.pos.x = this.pos.x;
                this.graphic.pos.y = this.pos.y;
                let pos = createVector(this.pos.x, this.pos.y);
                let dims = createVector(params.w, params.h);
                if (this.constants.positionMode == "PERCENTAGE"){
                    pos = Primitive.toPixels(createVector(this.pos.x, this.pos.y));
                    dims = Primitive.toPixels(createVector(params.w, params.h));
                } else {
                    pos = createVector(this.pos.x, this.pos.y);
                }
                translate(pos.x, pos.y);
                // Run aesthetics
                Object.keys(this.graphic.aesthetics).forEach(aes => {
                    this.graphic.aesthetics[aes]._func(this.graphic.aesthetics[aes]._val);
                })
                arc(0, 0, dims.x, dims.y, 0, (1-this.prop)*360);
                pop();
            }
            return this;
        } else if (graphic == "bar"){
            if (params.w == undefined || params.h == undefined){throw new Error("When setting an arc, please provide a width and height via the params. For example: setGraphic('arc', {w: 1, h: 1})")}
            this.graphic = new Primitive(this.x, this.y, this.kwargs);
            this.graphic.draw = () => {
                pRectangle.draw_(this.pos.x, this.pos.y, params.w, params.h, {...psychex.aesthetics.pCircle, ...params}) // Background bar, unchanging
                pRectangle.draw_(this.pos.x-params.w/2, this.pos.y-params.h/2, (1-this.prop)*params.w, params.h, {rectMode: "CORNER", ...{...psychex.aesthetics.pCircle, ...params}}) // inner bar
            }
            return this;
        } else if (graphic == "custom"){
            this.graphic = new Primitive(this.x, this.y, this.kwargs);
            // The user can manually overwrite the draw method if they want, either using Psychex primitives or p5.js geometries
            this.graphic.draw = () => {}
        } else {
            throw new Error(`Graphic type ${graphic} not recognised.`)
        }
    }

    reset(){
        this.initTime = Date.now();
        this.stop = false;
    }

    onTimeUp(){
        // Callback for when timer elapses
    }

    pause(){
        this.stop = true;
    }

    draw(){
        if (!this.stop){
            let timeDiff = (Date.now() - this.initTime)/1000; // Difference between start and now in seconds
            this.prop = timeDiff / this.endtime;
            if (this.prop >= 1){
                this.onTimeUp();
                this.prop = 0;
            }
        }
        if (this.graphic == undefined){
            return
        } else {
            super.draw();
            this.graphic.draw();
        }
        // draw obj

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

        // If 'playerId' in URL params, set this.playerId - otherwise generate a string
        let params = Utils.getUrlParams();
        Object.keys(params).includes("playerId") ? (this.playerId = params["playerId"]) : this.registerUUID();
    }

    async saveDataToServer(data, url=`api/save/`){
        const URL = url;
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

    async loadDataFromServer(data, url=`api/load/`){
        const URL = url;
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
    }

    saveToLocalStorage(data, key="data"){
        // Save data to the player's browser
        let ID = key;
        localStorage.setItem(ID, data);
    }

    loadFromLocalStorage(key="data"){
        let ID = key;
        localStorage.getItem(ID);
    }

    registerUUID(){
        /*
            TODO

            Either read a UUID from the URL, or create one and register it in this.data
            Alternatively create a this.metadata object that tracks user id, time loaded, etc.
        */

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.playerId =  _.range(1, 16).map(i => _.sample(characters)).join('');
        
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

    start(){

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

class Fullscreen{
    /* Fullscreen requires a few key components:
        - A clickable element to trigger fullscreen (typically document, or the canvas, but can be attached to canvas and then narrowed down to an onClick)
        - A pre-click screen to tell the user to click and launch fullscreen
        - A listener that takes a callback to run when fullscreen is breached, and stops other functions from running
        - The method that actually requests fullscreen from the browser
    */
    constructor(){
        this.isPreFullScreen = true;
        this.isFullScreen = false;
        this.settings = {
            initialOffsetTime: 1000,
        }
        this.preClickCallback;

    }

    beforeFullscreen(callback = () => {return undefined}){
        // Do some behind-the-scenes handling, and then call the user callback which might define some text or an image to show the user
        this.draw = callback;
        // Create the event listener after a certain amount of time
        // This stops the user from accidentally launching the game immediately without seeing the text if they click too soon, double click on the previous screen, etc.
        // this initial offset can be changed with this.settings.initialOffsetTime
        if (this.fsClickListener != undefined){return}
        setTimeout(() => {
            this.fsClickListener = document.addEventListener("click", () => {
                if (this.isPreFullScreen){
                    Fullscreen.requestFullScreen(document.documentElement);
                    this.isFullScreen = true;
                    // empty draw so nothing happens during the gap
                    // this.draw = undefined
                    setTimeout(() => {
                        // Hold the detection for 0.1 second to avoid race condition
                        this.isPreFullScreen = false;
                        this.draw = this.detect
                    }, 250); // this needs to be at least 250
                    
                    // this.draw = this.detect;
                    
                }
            })
        }, this.settings.initialOffsetTime)
    }

    detect(){
        // console.log("detecting...")
        this.isFullScreen = Fullscreen.detectFullscreen();
        // The pre-fullscreen checks might seem over-zealous, but it mitigates against any race conditions that can lead to immediate exit of the game
        if (!this.isPreFullScreen){
            // console.log(this.isFullScreen)
            if (this.isFullScreen == false){
                console.log("call")
                this.draw = this.onFullscreenExit;
            }
        }
        
    }

    onFullscreenExit(){}

    draw(){
    }

    static detectFullscreen(){
        return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) != undefined;
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

class Utils{

    static getUrlParams(searchParams=[], url=undefined){
        /*
            Search the URL for params
            If a list of params provided use those, if not return a searchable object
            Can be searched with obj.get(param)
        */
        // If a url is provided use that, if not use the current window url
        let myUrl = (url == undefined ? window.location : url);
        let urlObj = new URL(myUrl).searchParams;
        if (searchParams.length == 0){
            return _.cloneDeep(Object.fromEntries(urlObj))
        } else {
            let vals = {}
            searchParams.forEach(p => {
                vals[p] = urlObj.get(p);
            })
            return vals
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
        super(x, y, kwargs);
        this.initDims = createVector(w, h);
        this.dims = createVector(w, h)

        if (!["CORNER", "CENTER"].includes(align)){
            throw new Error(`alignment ${align} not recognised. Must be one of: CORNER, CENTER`)
        } else {
            this.align = align;
        }
        this.nRows = nRows;
        this.nCols = nCols;
        this.kwargs = kwargs;
        this.cells = [];

        this.drawOutline();
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
                
                // newCell.obj = new pRectangle(anchor.x + (c_ix*xOffset), anchor.y + (r_ix*yOffset), xOffset, yOffset, {positionMode:"PIXELS", rectMode: "CORNER", ...this.kwargs});
                newCell.obj = new pRectangle(anchor.x + (c_ix*xOffset), anchor.y + (r_ix*yOffset), xOffset, yOffset, {...this.kwargs});
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

    getCell(id){
        // Return a reference to a cell by a variable input that takes either ID (0 -> nRows*nCols-1) or coords ([0, 0] etc.)
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
        let cell = this.cells.filter(cell => cell.ix == ix)[0].obj;

        return cell;
    }

    setCellProps(id, props={}){
        // Set the properties on a single cell
        // The input, id, can either be the index or coords, and the method will adapt

        let cell = this.getCell(id);
        cell.update(props);
        return cell;
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

    onCellClick(id, callback){
        // Set a click listener for a specific cell by index or coords
        let cell = this.getCell(id);
        cell.toggleClickable();
        cell.onClick = (e) => { 
            callback(e)
        };
        return cell;
    }

    // TODO the methods below:

    overlay(id, newObj){
        // Since we use CORNER mode for the grid rects, we can't have these updating it and shifting its position off
        // newObj.update({"rectMode": "CORNER", "imageMode": "CORNER"})
        // Overlay another primitive onto a grid cell - such as an image, text, a countdown, etc.
        let cell = this.getCell(id);
        let offset = newObj.pos;
        newObj.pos = createVector(offset.x + cell.pos.x, offset.y + cell.pos.y);
        // newObj.pos = createVector(offset.x + cell.pos.x+cell.dims.x/2, offset.y + cell.pos.y+cell.dims.y/2);
        // There may be cases were multiple overlays are used, so either create a new if none exist or add to array if they do
        if (cell.overlays == undefined){
            cell.overlays = [newObj];
        } else {
            cell.overlays.push(newObj);
        }
    }

    clearOverlays(){
        // Remove all current overlays
        this.cells.forEach(i => {i.obj.overlays = []});
    }

    clearSingleOverlay(id){
        // Clear the overlay on a single cell
        this.getCell(id).overlays = [];
    }

    toggleControls(mode, preMovementCallback = () => {}, postMovementCallback = () => {}){
        // Be either keyboard or click-controllable
        // Offer callbacks for what happens before movement, and what happens after movement
        // mode is either 'arrows', 'wasd', 'click'
        if (!["arrows", "wasd", "click"].includes(mode)){throw new Error(`Mode type ${mode} not recognised. Must be one of: arrows, wasd, click.`)};

        // Define a function that calls the first preMovement callback, and if that returns true, call the post movement callback
        // For example, the preMovementcallback might contain rules about wall placements, etc.
        // and the post movement might update some value on a successful move
        const callback = (e) => {
            let c1 = preMovementCallback(e);
            if (c1 == true){postMovementCallback()}
        }

        if (mode == "arrows"){
            // Register keypress listeners for the arrow keys
            const keys = ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"];
            // Register the event listeners
            keys.forEach(k => {psychex.keyPressEvents.register(k, callback)})
        } else if (mode == "wasd"){
            // Register keypress listeners for w, a, s, and d
            const keys = ["w", "a", "s", "d"];
            // Register the event listeners
            keys.forEach(k => {psychex.keyPressEvents.register(k, callback)})
        } else if (mode == "click"){
            // define onclick rule and then run this.toggleClickable()
        }
    }

    checkBounds(pos, k){
        // Utility function to check if a proposed movement would be within bounds
        let keyMapping = {
            'ArrowLeft' : [0, -1],
            'ArrowRight' : [0, 1],
            'ArrowUp' : [-1, 0],
            'ArrowDown' : [1, 0],
            'a' : [0, -1],
            'd' : [0, 1],
            'w' : [-1, 0],
            's' : [1, 0]
        }
        
        let newPos = [this.playerPos[0] + keyMapping[k][0], this.playerPos[1] + keyMapping[k][1]];
        if (newPos[0] < 0 || newPos[0] > this.nCols-1 || newPos[1] < 0 || newPos[1] > this.nRows-1){
            return {allowed: false, pos: pos};
        } else {
            return {allowed: true, pos: newPos}
        };
    }

    onClick(e){
        e.update({backgroundColor: "pink"})
    }

    draw(){
        this.cells.forEach(cell => {cell.obj.draw()})
        this.cells.forEach(cell => {
            if (cell.obj.overlays != undefined){cell.obj.overlays.forEach(i => i.draw())}
        })
    }
}

// psychex.setup = (callback = () => {return undefined}) => {
//     psychex.canvas = createCanvas(windowWidth, windowHeight);
//     pixelDensity(1);
//     frameRate(60);
//     canvas.parent("gameCanvas");
//     callback();

//     // Check if a fullscreen listener is attached - if so, don't register document click listener yet, the fs listener will do this after fs is triggered
// }
 
// psychex.draw = function(callback = () => {return undefined}){
//     callback();
// }

// function setup(){
//     psychex.setup();
// }


// function draw(){
//     clear();
//     psychex.draw();
// }

/*
Main TODO:
    - Add image overlay on rect
    - Add to the aesthetics list
    - Handle keyboard input and assign functionality
    - Add JATOS saving to Game class

Classes to add:
    - Slideshow
    - Stages (integrated within game class now) 
    - UI/HUD

Extra thoughts:
    - Better to build with npm and then use webpack - since it depends on lodash and p5.js
    - An animations class would be great - but not hugely useful within the lab
    - Functionality for multiplayer modes would be super, using socket.js or something, but again we need a lab use case first
*/