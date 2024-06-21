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