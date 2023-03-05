class HeartDrop {
    constructor(x, y){
        Object.assign(this, {x, y});
        this.collider = {type: "box", corner: {x: this.x+4, y: this.y+4}, width: 8 * SCALE, height: 8 * SCALE}
        this.DEBUG = false;
    }

    update() {
        if(checkCollision(this, Player.CURR_PLAYER)) {
            Player.CURR_PLAYER.heal(1);
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        GRAPHICS.get('SET_ow_heart').drawSprite(1, ctx, this.x+4, this.y+4, SCALE)
    }
}

class Triforce {
    constructor(x, y) {
        Object.assign(this, {x,y});
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 79 * (SCALE - 1), height: 79 * (SCALE - 1)};
        this.DEBUG = false;
    }

    update() {
        if(checkCollision(this, Player.CURR_PLAYER)) {
            gameEngine.victory = true;
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        GRAPHICS.get('SET_end_game').drawSprite(0, ctx, this.x, this.y, SCALE - 1)
    }
}

class DeathCloud {
    constructor(x, y) {
        Object.assign(this, {x, y});
        this.spawn = null;
        this.cloudDone = false;
        this.cloudAnimation = GRAPHICS.getInstance('ANIMA_enemy_death_cloud').setLooping(false);
        if(Math.random() < 0.334)    
        gameEngine.scene.addInteractable(new HeartDrop(this.x+7.5*SCALE, this.y+7*SCALE));
        if(Math.random() < 0.112)
        gameEngine.scene.addInteractable(new KeyDrop(this.x+7.5*SCALE, this.y+7*SCALE));

    }

    update() {
        if (this.cloudDone && this.spawn === null) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        this.cloudDone = this.cloudAnimation.animate(gameEngine.clockTick, ctx, this.x, this.y, 3);
    }
}


class KeyDrop {
    constructor(x, y){
        Object.assign(this, {x, y});
        this.collider = {type: "box", corner: {x: this.x+4, y: this.y+4}, width: 8 * SCALE, height: 8 * SCALE}
        this.DEBUG = false;
    }

    update() {
        if(checkCollision(this, Player.CURR_PLAYER)) {
            Player.CURR_PLAYER.getKey();
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
       // GRAPHICS.get('SET_ow_heart').drawSprite(1, ctx, this.x+4, this.y+4, SCALE)
    }
}
