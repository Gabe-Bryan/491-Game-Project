class Projectile {
    static validTypes = ['bomb', 'ironBall', 'arrow'];

    constructor(type, x, y, nesw) {

        if (!Projectile.validTypes.includes(type)) {
            throw new Error(`${this.type} is NOT a valid type of projectile`);
        }

        // nsew : 0 → north  |  1 → east  |  2 → south  |  3 → west
        const x_dir = nesw == 1 || nesw == 3 ? (nesw == 1 ? 1 : -1) : 0;
        const y_dir = nesw == 0 || nesw == 2 ? (nesw == 2 ? 1 : -1) : 0;
        const dir = {x: x_dir, y: y_dir};
        
        switch (type) {
            case     'bomb': return new _Bomb_PRX(x, y, nesw, dir);
            case 'ironBall': return new _Iron_Ball_PRX(x, y, nesw, dir);
            case    'arrow': return new _Arrow_PRX(x, y, nesw, dir);;

        }
        
    }
}

class _Bomb_PRX {
    static VEL = 0;
    // doesnt deal damage directly, spawns a 'Bomb' bomb in its place when movement is done
    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, nesw, dir});
        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.done = false;
        this.bombDim = {width: 13, hight: 16};
        this.shadowDim = {width: 12, hight: 6}

        this.tempo = 0.1;
        this.gravity = 1.5;
        this.height = 2;
        
        this.bombSize = 1;

        this.shadowSize = 0.8;
        this.shadowDist = 16;
        
    }
    //parab(x, factor) return 2 * factor * x - (x*x)

    update() {
        if (this.done) {
            gameEngine.scene.addInteractable(new Bomb(this.x,this.y));
            this.removeFromWorld = true;
            return;
        }

        if (this.height <= 3 && this.height > 0) {
            let tick = 0.2 * gameEngine.clockTick;
            this.height -= tick;
            this.bombSize = 1 * Math.log(this.height + 1) + 1;
        }


        let dir_ball = normalizeVector(this.dir);
        this.phys2d.velocity = scaleVect(dir_ball, _Bomb_PRX.VEL * gameEngine.clockTick);
    }

    draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions, I still used nesw var for parity
        let shade_X = this.x - scale * ((Math.abs(1 - this.shadowSize * this.shadowDim.width) / 2) + 1);
        let shade_y = this.y + this.shadowDist * scale;
        
        let bomb_x = this.x - scale * Math.abs(1 - this.bombSize * this.bombDim.width) / 2
        let bomb_y = this.y - this.height * this.bombDim.hight * scale;
        // let bomb_y = this.y;


        // let bomb_x = this.x - ((this.bombSize - 1) / 2 )  * scale;
        // let bomb_y = this.y - this.height * scale * 10;
        // console.log(((this.bombSize - 1) / 2 ) * scale)

        GRAPHICS.getInstance('SET_shadow').drawSprite(0,ctx, shade_X, shade_y, scale * this.shadowSize);
        GRAPHICS.getInstance('PRJX_reg_bomb').drawSprite(this.nesw, ctx, bomb_x, bomb_y, scale * this.bombSize);
    }
}

function parab_flight(x, factor) {
    return 2 * factor * x - (x*x);
}
function sqr(x) {
    return x*x;
}

// class _Bomb_PRX {
//     static VEL = 0;
//     // doesnt deal damage directly, spawns a 'Bomb' bomb in its place when movement is done
//     constructor(x, y, nesw, dir) {
//         Object.assign(this, {x, y, nesw, dir});

//         this.phys2d = {static: false, velocity: {x: 0, y: 0}};
//         this.cutoff = 0.4
//         this.slows = 0.5
//         this.done = false;

//         this.tempo = 0.1;
//         this.g = 1.5

//         this.bombSize = 1.5;
//         this.shadowSize = 0.80;
//         this.shadowDist = 35;

//         this.mode = 0;
//         this.top = 1.5
        
//     }

//     update() {
//         if (this.done) {
//             gameEngine.scene.addInteractable(new Bomb(this.x,this.y));
//             this.removeFromWorld = true;
//             return;
//         }

//         let tick = gameEngine.clockTick;
//         this.tempo = this.tempo * (1 + this.g * tick);

//         if (this.bombSize <= 1) {
//             this.tempo *= -1;
//             this.g *= -1;

//         }

//         if (this.bombSize > this.top) {
//             this.tempo *= -1;
//             this.g *= -1;
//             this.top *= 1;
//         }

//         if (this.mode == 0) {
//             this.bombSize += -0.3 * tick * this.tempo;;
//             this.y += 150 * tick * this.tempo;;
//             this.shadowSize += 0.09 * tick * this.tempo;;
//             this.shadowDist += -13 * tick * this.tempo;
//         }

//         let dir_ball = normalizeVector(this.dir);
//         this.phys2d.velocity = scaleVect(dir_ball, _Bomb_PRX.VEL * gameEngine.clockTick);

//         // I want it to bounce
//     }

//     draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions, I still used nesw var for parity
//         let shade_y = this.y + (this.shadowDist * scale);

//         let bomb_off_scl = 25; let shade_off_scl = 10;
//         let bomb_offset = (bomb_off_scl/this.bombSize) - bomb_off_scl;
//         let shade_offset = (shade_off_scl/this.shadowSize) - shade_off_scl;

//         GRAPHICS.getInstance('SET_shadow').drawSprite(0,ctx, this.x + shade_offset, shade_y, scale * this.shadowSize);
//         GRAPHICS.getInstance('PRJX_reg_bomb').drawSprite(this.nesw, ctx, this.x + bomb_offset, this.y, scale * this.bombSize);
//     }
// }

class _Iron_Ball_PRX {
    static VEL = 100;
    static KB_STR = 600;
    static DMG_STR = 0;
    static DMG_CD = 1.1;

    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, nesw, dir});
        this.speed = 100;
        this.phys2d = {isSolid: false, static: false, velocity: {x: 0, y: 0}};

        this.updateCollider();
        this.DEBUG = true;
        this.attackCD = 0;
    }

    checkAttack() {
        let player = Player.CURR_PLAYER;
        if (this.attackCD <= 0) {
            let hit = checkCollision(this, player);
            if (hit) {
                let p_Dir = normalizeVector(distVect(this, Player.CURR_PLAYER));
                player.takeDamage(_Iron_Ball_PRX.DMG_STR, scaleVect(p_Dir, _Iron_Ball_PRX.KB_STR))
                this.attackCD = _Iron_Ball_PRX.DMG_CD;
            }
        } else {
            this.attackCD -= gameEngine.clockTick;
        }
    }

    updateCollider() {
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 12 * SCALE, height: 12 * SCALE};
    }

    update() {
        if (Player.CURR_PLAYER.alive) {
            let dir_ball = normalizeVector(this.dir);
            this.phys2d.velocity = scaleVect(dir_ball, _Iron_Ball_PRX.VEL * gameEngine.clockTick);
            this.checkAttack();
        }

    }

    draw(ctx, scale) { // iron ball has same sprite for N,E,S,W directions, I still used nesw var for parity
        GRAPHICS.getInstance('PRJX_iron_ball').drawSprite(this.nesw, ctx, this.x, this.y, scale);
        if(this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}

class _Arrow_PRX {
    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, nesw, dir});
        this.speed = 100;
        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
    }

    update() {


    }

    draw(ctx, scale) {
        // nsew : 0 → north  |  1 → east  |  2 → south  |  3 → west
        GRAPHICS.getInstance('PRJX_arrow').drawSprite(this.nesw, ctx, this.x, this.y, scale);
                                           
    }
}

