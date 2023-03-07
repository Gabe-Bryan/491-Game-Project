class Bomb {
    static NORM_KB = 2500;
    static NORM_DMG = 3;

    constructor(x, y, friendFire = false, type = null) {
        Object.assign(this, {x, y, friendFire, type}); // more types coming soon ...                                                                                                                     as far as you know Wahahahahahaaaaa!
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
            console.log(this.attackHits)
            
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
    constructor(x, y) {
        Object.assign(this, {x, y});
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
    constructor(x, y, spawnStuff = true) {
        Object.assign(this, {x, y, spawnStuff});
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

class BuringGasCloud {
    constructor(x, y) {
        Object.assign(this, {x, y});
        this.cloudDone = false;
        this.cloudAnimation = GRAPHICS.getInstance('ANIMA_enemy_death_gas').setLooping(false);
        this.collider = {type: "box", corner: {x: this.x + 15, y: this.y + 12}, width: 16 * SCALE, height: 16 * SCALE};
        this.phys2d  = {static: true};
        this.cd = 0; this.cdLen = 0.66
        this.hit = false; this.kicBack = 1;
        this.damage = 1;

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
    updateCollider(){
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 12 * SCALE, height: 12 * SCALE};
    }

    draw(ctx) {
        this.cloudDone = this.cloudAnimation.animate(gameEngine.clockTick, ctx, this.x, this.y, 3);
    }
}

class KeyDrop {
    constructor(x, y){
        Object.assign(this, {x, y});
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
