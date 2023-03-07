class Pot {
    constructor(_x, _y){
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;

        this.updateCollider();
        this.sprite = GRAPHICS.getInstance('SET_pot');
        this.tag = "env_interact";
        this.phys2d= {static: true}
        this.DEBUG = true;

    }

    updateCollider(){
        this.collider = {type: "box", corner: {x: this.x + 2.5 * SCALE, y: this.y + 2 * SCALE}, width: 12*SCALE, height: 13*SCALE};
    }

    takeDamage() {
        this.removeFromWorld = true;
        gameEngine.scene.addInteractable(new DeathCloud(this.x-2.5 * SCALE, this.y - 2 * SCALE, false));
        if(Math.random() < 0.5)    gameEngine.scene.addInteractable(new HeartDrop(this.x+7.5*SCALE, this.y+7*SCALE));
    }

    interact() {
        console.log("INTER ACTTTTT")
        Player.CURR_PLAYER.pickUpObj(1);
        this.removeFromWorld = true;
    }
    update() {

    }

    draw(ctx) {
        this.sprite.drawSprite(0, ctx, this.x, this.y, SCALE);
    }

}

class BombFlower {
    constructor(_x, _y){
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;

        this.updateCollider();
        this.DEBUG = true;
        this.tag = "env_interact";
        this.phys2d= {static: true}
    }

    updateCollider(){
        this.collider = {type: "box", corner: {x: this.x + 2.5 * SCALE, y: this.y + 2 * SCALE}, width: 12*SCALE, height: 13*SCALE};
    }

    takeDamage() {
        this.removeFromWorld = true;
        gameEngine.scene.addInteractable(new DeathCloud(this.x-2.5 * SCALE, this.y - 2 * SCALE, false));
        if(Math.random() < 0.5)    gameEngine.scene.addInteractable(new HeartDrop(this.x+7.5*SCALE, this.y+7*SCALE));
    }

    interact() {
        console.log("INTER ACTTTTT")
        Player.CURR_PLAYER.pickUpObj(1);
        this.removeFromWorld = true;
    }
    update() {

    }

    draw(ctx) {
        GRAPHICS.getInstance('SET_pot').drawSprite(0, ctx, this.x, this.y, SCALE);
    }
}