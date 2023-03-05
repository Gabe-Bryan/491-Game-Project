class Door{
    constructor(x, y, locked = false){
        Object.assign(this, {x, y});
        this.updateCollider();
        this.phys2d = {static: true};
        this.DEBUG = true;
        this.tag = 'env_interact';
        this.state = locked ? 2 : 0;
    }

    updateCollider(){
        this.collider = {type: 'box', corner: {x: this.x, y: this.y}, height: 16 * SCALE, width: 32 * SCALE};
    }

    update(){

    }

    interact(hasKey = false){
        if(this.state == 2 && hasKey){
            this.state = 0;
            return true;
        }else if(this.state != 2){
            this.state = 1;
            this.phys2d = {static: true, isSolid: false};
        }
    }

    draw(ctx){
        GRAPHICS.getInstance('SET_door').drawSprite(this.state, ctx, this.x, this.y, SCALE);
    }
}