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
        this.cutoff = 0.4
        this.slows = 0.5
        this.done = false;

        this.bombSize = 1;
        this.shadowSize = 1;
        this.shadowDist = 12;
        
    }

    update() {
        if (this.done) {
            gameEngine.scene.addInteractable(new Bomb(this.x,this.y));
            this.removeFromWorld = true;
            return;
        }

        // need more
        this.bombSize += 0.01 * gameEngine.clockTick;
        this.y += 5 * gameEngine.clockTick;
        this.shadowSize -= 0.01 * gameEngine.clockTick;
        this.shadowDist += 1.5 * gameEngine.clockTick;


        let dir_ball = normalizeVector(this.dir);
        this.phys2d.velocity = scaleVect(dir_ball, _Bomb_PRX.VEL * gameEngine.clockTick);

        // I want it to bounce
    }

    draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions, I still used nesw var for parity
        let shdow_y = this.y + (this.shadowDist * scale);
        GRAPHICS.getInstance('SET_shadow').drawSprite(0,ctx, this.x, shdow_y, scale * this.shadowSize);
        GRAPHICS.getInstance('PRJX_reg_bomb').drawSprite(this.nesw, ctx, this.x, this.y, scale * this.bombSize);
    }
}

class _Iron_Ball_PRX {
    static VEL = 100;
    static KB_STR = 600;
    static DMG_STR = 0;
    static DMG_CD = 1.1;

    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, nesw, dir});
        this.speed = 100;
        this.phys2d = {static: false, velocity: {x: 0, y: 0}};

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

