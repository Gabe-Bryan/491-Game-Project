class HeartDrop {
    constructor(x, y){
        Object.assign(this, {x,y});
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 12 * SCALE, height: 12 * SCALE}
        this.DEBUG = true
    }

    update() {
    }

    draw(ctx) {
        GRAPHICS.get('SET_ow_heart').drawSprite(1, ctx, this.x, this.y, SCALE)
    }
}

class Triforce {
    constructor(x, y){
        Object.assign(this, {x,y});
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 12 * SCALE, height: 12 * SCALE};
        this.DEBUG = true;
    }

    update() {
        if(checkCollision(this, Player.CURR_PLAYER)) {
            gameEngine.victory = true;
        }
    }

    draw(ctx) {
        GRAPHICS.get('SET_end_game').drawSprite(0, ctx, this.x, this.y, SCALE - 1)
    }
}

class DeathCloud {
    constructor(x, y, type) {
        Object.assign(this, {x, y, type});
        this.spawn = null;
        this.cloudDone = false;
        this.cloudAnimation = GRAPHICS.get('ANIMA_enemy_death_cloud').clone().setLooping(false);
        // type is not used rn, added for possible future use
    }

    update() {
        if (this.cloudDone && this.spawn === null) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        if (this.spawn !== null) this.spawn.animate(gameEngine.clockTick, ctx, this.x, this.y, 3);
        this.cloudDone = this.cloudAnimation.animate(gameEngine.clockTick, ctx, this.x, this.y, 3);
    }

    spawn() {
        // fix to
        // this.spawn = GRAPHICS.get('hearts or something')
    }
}
