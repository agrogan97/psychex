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

function testConversions(){
    // Method to test primitive instantiations and conversions from pixels to percentages and vice versa
}