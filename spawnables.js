class Bomb {
    static NORM_KB = 2500;
    static NORM_DMG = 3;
    static WIDTH = 13;
    static HEIGHT = 16;

    constructor(_x, _y, _friendFire = false, _type = null) {

        if (typeof _x == 'object'){
            this.x = _x.x;
            this.y = _x.y;
            this.friendFire = _y;
            this.type = _friendFire;
        }
        else {
            this.x = _x;
            this.y = _y;
            this.friendFire = _friendFire;
            this.type = _type;
        }

        this.kickBack = Bomb.NORM_KB;
        this.damage = Bomb.NORM_DMG;
        this.alreadyGotBlown = false;
        this.state = 1 // 0: stable, 1: burning, 2 blowing

        this.phys2d  = {static: true};
        this.bomb_collider = {type: "box", corner: {x: this.x + -1 * SCALE, y: this.y +  3 * SCALE}, width: 14 * SCALE, height: 14 * SCALE};
        this.blow_collider = {type: "box", corner: {x: this.x - 20 * SCALE, y: this.y - 18 * SCALE}, width: 52 * SCALE, height: 52 * SCALE};
        this.collider = this.bomb_collider;
        this.attackHits = [];

        this.setupAnimations();

        
        if (this.type == 'chest') this.anima[1].skipToFrame(7);
        
        this.DEBUG = false;
    }

    setupAnimations() {
        this.anima = [
            GRAPHICS.getInstance('ANIMA_normal_bombs_stable').setLooping(false),
            GRAPHICS.getInstance('ANIMA_normal_bombs_burn').setLooping(false).setAnimaSpeed(200),
            GRAPHICS.getInstance('ANIMA_normal_bombs_blow').setLooping(false)
        ];
    }

    processBlown() {
        this.alreadyGotBlown = true;

        if (Player.CURR_PLAYER.alive) {
            let pdir = normalizeVector(distVect(this, Player.CURR_PLAYER));
            let player = Player.CURR_PLAYER;
            if (checkCollision(this, player)) {
                player.takeDamage(this.damage, scaleVect(pdir, Bomb.NORM_KB))
            }
        }
        
        if (this.friendFire) {
            gameEngine.scene.interact_entities.forEach((entity) =>{
                    if (entity != this && entity.collider && entity.collider.type == "box" &&
                        entity.tag == "enemy" && !this.attackHits.includes(entity))
                    {
                        if (checkCollision(this, entity)){
                        console.log("FASBI")

                            let kbDir = normalizeVector(distVect(this, entity));
                            entity.takeDamage(this.damage, scaleVect(kbDir, Bomb.NORM_KB));
                            this.attackHits.push(entity);
                        }
                    }
                });       
        }
    }

    update() {
        if (this.state == 1 && this.anima[1].isDone()) {
            this.state = 2;
            this.collider = this.blow_collider
        }
        else if(this.state == 2 && !this.alreadyGotBlown) {
            this.processBlown();
        }
        else if (this.anima[2].isDone()) {
            this.removeFromWorld = true;
        }
        
    }

    draw(ctx, scale) {

        // GRAPHICS.getInstance('SET_shadow').drawSprite(0,ctx, shade_X, shade_y, scale * this.shadowSize);
        GRAPHICS.getInstance('SET_shadow').drawSprite(0, ctx, this.x-2, this.y + 11 * scale, scale);
        this.anima[this.state].animate(gameEngine.clockTick, ctx, this.x, this.y, scale);
        if(this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}


class HeartDrop {
    static WIDTH = 13;
    static HEIGHT = 16;

    constructor(_x, _y) {
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;
        this.collider = {type: "box", corner: {x: this.x+4, y: this.y+4}, width: 8 * SCALE, height: 8 * SCALE}
        this.DEBUG = false;
    }

    update() {
        if (checkCollision(this, Player.CURR_PLAYER)) {
            Player.CURR_PLAYER.heal(1);
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        GRAPHICS.get('SET_ow_heart').drawSprite(1, ctx, this.x+4, this.y+4, SCALE);
    }
}

class Triforce {
    constructor(_x, _y) {
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;
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
    constructor(_x, _y = true, _spawnStuff = true) {
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;
        this.spawnStuff = ob ? _y : _spawnStuff
        this.spawn = null;
        this.cloudDone = false;
        this.cloudAnimation = GRAPHICS.getInstance('ANIMA_enemy_death_cloud').setLooping(false);
        if(Math.random() < 0.334)    
            gameEngine.scene.addInteractable(new HeartDrop(this.x+7.5*SCALE, this.y+7*SCALE));
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

class BadGas {
    static WIDTH = 26
    static HEIGHT = 23
    constructor(_x, _y) {
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;

        this.cloudDone = false;
        this.cloudAnimation = GRAPHICS.getInstance('ANIMA_enemy_death_gas').setLooping(false);
        this.updateCollider();
        this.phys2d  = {static: true};
        this.cd = 0; this.cdLen = 0.66
        this.hit = false; this.kicBack = 1;
        this.damage = 1;
        this.DEBUG = false;
    }

    update() {
        if (this.cloudDone) {
            this.removeFromWorld = true;
        } 
        else if (this.cd <= 0) {
            if (Player.CURR_PLAYER.alive) {
                let pdir = normalizeVector(distVect(this, Player.CURR_PLAYER));
                let player = Player.CURR_PLAYER;
                    if (checkCollision(this, player)) {
                        this.cd = this.cdLen
                        player.takeDamage(this.damage, scaleVect(pdir, this.kicBack))
                }
            }
        } else this.cd -+ gameEngine.clockTick;
    }

    updateCollider() {
        this.collider = {type: "box", corner: {x: this.x+15, y: this.y+8}, width: 16 * SCALE * 2, height: 16 * SCALE * 2} ;
    }

    draw(ctx, scale) {
        this.cloudDone = this.cloudAnimation.animate(gameEngine.clockTick, ctx, this.x, this.y, scale * 1.6);
        if (this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}

class KeyDrop {
    constructor(_x, _y){
        let ob = typeof _x == 'object'
        this.x = ob ? _x.x : _x;
        this.y = ob ? _x.y : _y;

        this.collider = {type: "box", corner: {x: this.x+4, y: this.y+4}, width: 8 * SCALE, height: 15 * SCALE}
        this.DEBUG = false;
    }

    update() {
        if(checkCollision(this, Player.CURR_PLAYER)) {
            Player.CURR_PLAYER.getKey();
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
       GRAPHICS.get('SET_ow_key').drawSprite(0, ctx, this.x+4, this.y+4, SCALE)
    }
}
