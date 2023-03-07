class Pot {
    constructor(_x, _y){
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;

        this.updateCollider();
        this.DEBUG = true;
        this.tag = "environment";
        this.phys2d= {static: true}
    }

    takeDamage(){
        this.removeFromWorld = true;
        gameEngine.scene.addInteractable(new DeathCloud(this.x-2.5 * SCALE, this.y - 2 * SCALE, false));
        if(Math.random() < 0.5)    gameEngine.scene.addInteractable(new HeartDrop(this.x+7.5*SCALE, this.y+7*SCALE));
    }

    update(){

    }

    draw(ctx){
        GRAPHICS.getInstance('SET_pot').drawSprite(0, ctx, this.x, this.y, SCALE);
    }

    updateCollider(){
        this.collider = {type: "box", corner: {x: this.x + 2.5 * SCALE, y: this.y + 2 * SCALE}, width: 12*SCALE, height: 13*SCALE};
    }


}