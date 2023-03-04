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
    static VEL = 10;
    // doesnt deal damage directly, spawns a 'Bomb' bomb in its place when movement is done
    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, nesw, dir});
        this.phys2d = {isSolid: true, static: false, velocity: {x: 0, y: 0}};
        this.done = false;
        this.bombDim = {width: 13, hight: 16};
        this.shadowDim = {width: 12, hight: 6};

        this.bombSize = 1;
        this.bombHeightFactor = 30;
        this.shadowSize = 0.8;
        this.shadowDist = 11;

        this.gravity = 1.5;
        this.entropy = 0.8;
        this.maxHeight = 1;
        this.maxTempo = 0.2;

        this.state = 0;
        this.height = this.maxHeight;
        this.tempo = 0;

        this.updateCollider();
        this.DEBUG = true;
    }
    //parab(x, factor) return 2 * factor * x - (x*x)

    updateCollider() {
        let bomb_x = this.x - SCALE * Math.abs(1 - this.bombSize * this.bombDim.width) / 2
        let bomb_y = this.y - this.height * this.bombHeightFactor * SCALE;

        this.collider = {type: "box", corner: {x: bomb_x, y: bomb_y}, width: 13 * SCALE, height: 24 * SCALE};
    }

    update() {
        if (this.done) {
            gameEngine.scene.addInteractable(new Bomb(this.x,this.y));
            this.removeFromWorld = true;
            return;
        }

        if (this.state == 1 && this.tempo < 0.01) {
            console.log("LOW " + this.tempo);
            this.tempo = 0;
            this.state = 0;
        }

        if (this.tempo > 2) {
            console.log("HIGH" + this.tempo);
        }

        if (this.state == 0 && this.height <= 0) {
            this.state = 1;
        }

        // if (this.state == 1 && this.height > this.maxHeight) {
        //     this.tempo = 0.2;
        //     this.state = 0;
        // }



        //////////////////////
        if (this.state == 0) {
            this.tempo += this.gravity * gameEngine.clockTick
            this.height -= this.tempo * gameEngine.clockTick;
        }

        if (this.state == 1) {
            this.tempo -= this.gravity * gameEngine.clockTick
            this.height += this.tempo * gameEngine.clockTick;
        }

        this.bombSize = 0.5 * Math.log(this.height + 1) + 1;
        this.shadowSize = 0.9 * 1 * Math.log(this.height + 1) + 1;

        // console.log("tempo = " + this.tempo);

        let dir_ball = normalizeVector(this.dir);
        this.phys2d.velocity = scaleVect(dir_ball, _Bomb_PRX.VEL * gameEngine.clockTick);
    }

    draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions, I still used nesw var for parity
        let shade_X = this.x - scale * ((Math.abs(1 - this.shadowSize * this.shadowDim.width) / 2) + 1);
        let shade_y = this.y + this.shadowDist * scale;
        
        let bomb_x = this.x - scale * Math.abs(1 - this.bombSize * this.bombDim.width) / 2
        let bomb_y = this.y - this.height * this.bombHeightFactor * scale;

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

class _Iron_Ball_PRX {
    static VEL = 100;
    static KB_STR = 600;
    static DMG_STR = 0;
    static DMG_CD = 1.1;

    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, nesw, dir});
        this.speed = 100;
        this.phys2d = {isSolid: false, static: false, velocity: {x: 0, y: 0}};
        this.dim = {x: 12, y: 12}

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
        if (this.x < -1 * 1.1 * this.dim.x * SCALE ||
            this.x > 965 ||
            this.y < -1 * 1.1 * this.dim.y * SCALE ||
            this.y > 772) {

            this.removeFromWorld = true;
        }
        console.log("ALIVE")

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

