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