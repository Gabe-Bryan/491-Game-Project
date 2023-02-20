class HeartDrop{
    constructor(x, y){
        Object.assign(this, {x,y});
        this.collider = {type: "box", }
    }

    update(){
    }

    draw(){
        GRAPHICS.get("SET_ow_heart").drawSprite(1, ctx, this.x, this.y, SCALE);
    }
}