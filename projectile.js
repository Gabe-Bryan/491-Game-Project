class Projectile {
    static TYPES = ['bomb', 'pot', 'ironBall', 'arrow', 'trident','fireBall', 'redBeam', 'blueBeam'];
    constructor(type, x, y, nesw, ff) {
        if (!Projectile.TYPES.includes(type))
            throw new Error(`${this.type} is NOT a valid type of projectile`);
        
        let dir;
        
        if (typeof nesw == 'object') {
            dir = normalizeVector(nesw);
            nesw = 0;
        }
        else {
            // nsew : 0 → north  |  1 → east  |  2 → south  |  3 → west
            let x_dir = nesw == 1 || nesw == 3 ? (nesw == 1 ? 1 : -1) : 0;
            let y_dir = nesw == 0 || nesw == 2 ? (nesw == 2 ? 1 : -1) : 0;
            dir = {x: x_dir, y: y_dir};
        }
        
        switch (type) {
            case     'bomb': return new _Bomb_PRX(x, y, dir, ff);
            case     'pot' : return new _Pot_PRX(x, y, dir, ff);
            case 'ironBall': return new _Iron_Ball_PRX(x, y, dir, ff);
            // _Arrow_Type_PRX  types: 0 → arrow | 1 → trident | 2 → fireBall | 3 → redBeam | 4 → blueBeam
            case    'arrow': return new _Arrow_Type_PRX(x, y, nesw, dir, 0);
            case  'trident': return new _Arrow_Type_PRX(x, y, nesw, dir, 1);
            case 'fireBall': return new _Arrow_Type_PRX(x, y, nesw, dir, 2);
            case  'redBeam': return new _Arrow_Type_PRX(x, y, nesw, dir, 3);
            case 'blueBeam': return new _Arrow_Type_PRX(x, y, nesw, dir, 4);

        }
        
    }
}

class _Bomb_PRX {
    static MAX_VEL = 400;
    static DMG = 0;
    static KB = 500;
    // doesnt deal damage directly, spawns a 'Bomb' bomb in its place when movement is done
    constructor(x, y, dir, ff) {
        Object.assign(this, {x, y, dir, ff});
        this.phys2d = {isSolid: true, static: false, velocity: {x: 0, y: 0}};
        this.dim = {x: 13, y: 16}
        this.preVeloc = {x:1, y:1};
        this.attackHits = [];
        // reduce check collisions
        this.collBuffer = 0;
        this.collBuffLeng = 0.1;

        this.bombS = GRAPHICS.getInstance('PRJX_reg_bomb');
        this.shadS = GRAPHICS.getInstance('SET_shadow');

        // shadow const
        this.shadowSize = 1;
        this.shadowWidth = 12
        this.shadowDist = 11;

        // Constants //
        this.gravity = 12;
        this.elasticity = 0.6;
        this.airDrag = 150;
        this.inFriction = 0.8;
        this.bombHeightFactor = 20;

        // State Variables //
        this.state = 0;
        //   State:  0 = falling | 1 = bouncing up
        this.bombSize = 1;
        this.height = 1;
        this.speed = _Bomb_PRX.MAX_VEL;
        this.momentum = 0;
        // the height of current bounce
        this.topHeight = this.height;

        // ⇪ start in tossing UP state ⇪ ⇪ ⇪
        this.startStrong();

        this.updateSizing();
        this.updateCollider();
        this.DEBUG = false;
    }

    startStrong() {
        this.state = 1;
        this.momentum = 3;
        this.topHeight = Infinity;
    }

    updateCollider() {
        this.collider = {
            type: "box", corner: {x: this.bomb_x + 3, y: this.bomb_y + 13},
            width: 10 * this.bombSize * SCALE,
            height: 10 * this.bombSize * SCALE
        };
    }

    updateSizing() {
        this.bombSize = 0.2 * Math.log(this.height + 1) + 1;
        this.shadowSize = 0.2 * Math.log(this.height + 1) + 1;

        this.sizeXoffset = SCALE * Math.abs(1 - this.bombSize * this.dim.x) / 2
        this.sizeYoffset = this.height * this.bombHeightFactor * SCALE;

        this.bomb_x = this.x - this.sizeXoffset;
        this.bomb_y = this.y - this.sizeYoffset;
    }

    processCollision() {
        gameEngine.scene.interact_entities.forEach((entity) =>{
            if (entity != this && entity.collider && entity.collider.type == "box" &&
                entity.tag == "enemy" && !this.attackHits.includes(entity)) {
                if (checkCollision(this, entity)) {
                    let kbDir = normalizeVector(distVect(this, entity));
                    entity.takeDamage(_Bomb_PRX.DMG, scaleVect(kbDir, _Bomb_PRX.KB));
                    this.attackHits.push(entity);
                }
            }
        });
    }

    update() {
        // did it escape the surly bonds of earth?
        if (this.x < -1 * 1.1 * this.dim.x * SCALE || this.x > 965 ||
            this.y < -1 * 1.1 * this.dim.y * SCALE || this.y > 772) {
            this.removeFromWorld = true;
            console.log('bomb removed');
        }

        if (this.colliding) {
            if (Math.abs(this.preVeloc.x) < 0.1) this.dir.x *= -1;
            if (Math.abs(this.preVeloc.y) < 0.1) this.dir.y *= -1;
        }

        // bonking ppl who get in my way
        if (this.collBuffer <= 0) {
            this.processCollision();
            this.collBuff = this.collBuffLeng;
        } else this.collBuff -+ gameEngine.clockTick;

        // END STATE //
        if (this.topHeight < 0.01 && this.momentum <= 0) {
            this.bombSize = 1;
            this.dir = {x: 0, y:0}
            gameEngine.scene.addInteractable(new Bomb(this.bomb_x, this.bomb_y, this.ff));
            this.removeFromWorld = true;
            return;
        }

        // Bounce Peek
        if (this.state == 1 && this.momentum < 0.01) {
            this.momentum = 0;
            this.state = 0;
            this.topHeight = this.height;
        }

        // Bounce Ground
        if (this.state == 0 && this.height <= 0) {
            this.speed *= this.inFriction;
            this.state = 1;
            this.momentum *= this.elasticity;
        }

        // Falling
        if (this.state == 0) {
            this.momentum += this.gravity * gameEngine.clockTick
            this.height -= this.momentum * gameEngine.clockTick;
        }

        // Bounce up
        if (this.state == 1) {
            this.momentum -= this.gravity * gameEngine.clockTick
            this.height += this.momentum * gameEngine.clockTick;
        }

        this.updateSizing ();

        // air drag
        this.speed = this.speed > 0 ? this.speed - this.airDrag * gameEngine.clockTick : 0;
        this.phys2d.velocity = scaleVect(normalizeVector(this.dir), this.speed * gameEngine.clockTick);
        this.preVeloc = this.phys2d.velocity;
    }

    draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions, I still used nesw var for parity
        let shade_X = this.x - scale * ((Math.abs(1 - this.shadowSize * this.shadowWidth) / 2) + 1);
        let shade_y = this.y + this.shadowDist * scale;

        this.shadS.drawSprite(0,ctx, shade_X, shade_y, scale * this.shadowSize);
        this.bombS.drawSprite(0, ctx, this.bomb_x, this.bomb_y, scale * this.bombSize);
        if(this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}

class _Pot_PRX {
    static MAX_VEL = 500; // 500
    static DMG = 1;
    static KB = 300;
    // doesnt deal damage directly, spawns a 'Bomb' bomb in its place when movement is done
    constructor(x, y, dir, ff) {
        Object.assign(this, {x, y, dir, ff});
        this.phys2d = {isSolid: true, static: false, velocity: {x: 0, y: 0}};
        this.dim = {x: 12, y: 13}
        this.attackHits = [];
        this.broken = false;
        this.colCD_LEN = 0.2; 
        this.colCD = 0; 

        this.potS = GRAPHICS.getInstance('SET_pot');
        this.shadS = GRAPHICS.getInstance('SET_shadow');

        //  Shadows  //
        this.shadowSize = 1;
        this.shadowWidth = 12
        this.shadowDist = 11;

        // Constants //
        this.gravity = 6;
        this.airDrag = 200;
        this.potHeightFactor = 20;

        // State Variables //
        this.potSize = 1;
        this.height = 1;
        this.speed = _Pot_PRX.MAX_VEL;
        this.momentum = -2;

        this.updateSizing();
        this.updateCollider();
        this.DEBUG = false;
    }

    updateCollider() {
        this.collider = {
            type: "box", corner: {x: this.pot_x + 8, y: this.pot_y + 7},
            width: 12 * this.potSize * SCALE,
            height: 13 * this.potSize * SCALE
        };
    }

    updateSizing() {
        this.potSize = 0.2 * Math.log(this.height + 1) + 1;
        this.shadowSize = 0.2 * Math.log(this.height + 1) + 1;

        this.sizeXoffset = SCALE * Math.abs(1 - this.potSize * this.dim.x) / 2
        this.sizeYoffset = this.height * this.potHeightFactor * SCALE;

        this.pot_x = this.x - this.sizeXoffset;
        this.pot_y = this.y - this.sizeYoffset;
    }

    processCollision() {
        gameEngine.scene.interact_entities.forEach((entity) =>{
            if (entity != this && entity.collider && entity.collider.type == "box" &&
                entity.tag == "enemy" && !this.attackHits.includes(entity)) {
                if (checkCollision(this, entity)) {
                    let kbDir = normalizeVector(distVect(this, entity));
                    entity.takeDamage(_Pot_PRX.DMG, scaleVect(kbDir, _Pot_PRX.KB));
                    this.attackHits.push(entity); // perhaps not needed
                    this.broken = true;
                }
            }
        });

    }

    update() {
        // did it escape the surly bonds of earth?
        if (this.x < -1 * 1.1 * this.dim.x * SCALE || this.x > 965 ||
            this.y < -1 * 1.1 * this.dim.y * SCALE || this.y > 772) {
            this.removeFromWorld = true;
            console.log('pot removed');
        }

        if (!this.broken) this.processCollision();

        if (this.height < 0.01 || this.colliding || this.broken) {
            gameEngine.scene.addInteractable(new DeathCloud(this.pot_x-15, this.pot_y-6, true));
            this.removeFromWorld = true;
            return;
        }

        this.momentum += this.gravity * gameEngine.clockTick
        this.height -= this.momentum * gameEngine.clockTick;

        this.potSize = 0.2 * Math.log(this.height + 1) + 1;
        this.shadowSize = 0.2 * Math.log(this.height + 1) + 1;

        this.updateSizing();

        // air drag
        this.speed = this.speed > 0 ? this.speed - this.airDrag * gameEngine.clockTick : 0;
        this.phys2d.velocity = scaleVect(normalizeVector(this.dir), this.speed * gameEngine.clockTick);
        this.preVeloc = this.phys2d.velocity;
    }

    draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions, I still used nesw var for parity
        let shade_X = this.x + 8 - scale * ((Math.abs(1 - this.shadowSize * this.shadowWidth) / 2) + 1);
        let shade_y = this.y + this.shadowDist * scale;

        this.shadS.drawSprite(0,ctx, shade_X, shade_y, scale * this.shadowSize);
        this.potS.drawSprite(0, ctx, this.pot_x, this.pot_y, scale * this.potSize);
        if(this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}

class _Iron_Ball_PRX {
    static VEL = 300;
    static KB_STR = 600;
    static DMG_STR = 0;
    static DMG_CD = 1.1;

    constructor(x, y, dir) {
        Object.assign(this, {x, y, dir});
        this.speed = 100;
        this.phys2d = {isSolid: true, static: false, velocity: {x: 0, y: 0}};
        this.dim = {x: 12, y: 12}
        this.preVeloc = {x:1, y:1};

        this.updateCollider();
        this.DEBUG = true;
        this.hitCD = 0;
    }

    checkAttack() {
        let player = Player.CURR_PLAYER;
        if (this.hitCD <= 0) {
            let hit = checkCollision(this, player);
            if (hit) {
                let p_Dir = normalizeVector(distVect(this, Player.CURR_PLAYER));
                player.takeDamage(_Iron_Ball_PRX.DMG_STR, scaleVect(p_Dir, _Iron_Ball_PRX.KB_STR))
                this.hitCD = _Iron_Ball_PRX.DMG_CD;
                
                this.dir = normalizeVector ( {
                    x: Math.random()/3 + -this.dir.x * Math.random(),
                    y: Math.random()/3 + -this.dir.y * Math.random()
                })

            }
        } else {
            this.hitCD -= gameEngine.clockTick;
        }
    }

    updateCollider() {
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 12 * SCALE, height: 12 * SCALE};
    }

    update() {
        // did it escape the surly bonds of earth?
        if (this.x < -1 * 1.1 * this.dim.x * SCALE || this.x > 965 ||
            this.y < -1 * 1.1 * this.dim.y * SCALE || this.y > 772) {
            this.removeFromWorld = true;
            console.log('Iron Ball removed');
        }

        if (this.preVeloc.x == 0) this.dir.x *= -1;
        if (this.preVeloc.y == 0) this.dir.y *= -1;

        if (Player.CURR_PLAYER.alive) this.checkAttack();

        let dir_ball = normalizeVector(this.dir);
        this.phys2d.velocity = scaleVect(dir_ball, _Iron_Ball_PRX.VEL * gameEngine.clockTick);
        this.preVeloc = this.phys2d.velocity;
    }

    draw(ctx, scale) { // iron ball has same sprite for N,E,S,W directions, I still used nesw var for parity
        GRAPHICS.getInstance('PRJX_iron_ball').drawSprite(0, ctx, this.x, this.y, scale);
        if(this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}

class _Arrow_Type_PRX {
    //         type          trident       redBeam 
    //       values    arrow    ↓    fireB    ↓   blueBeam
    static     VEL = [  100,   100,   100,   100,   100];
    static  KB_STR = [  400,   400,   500,   600,   800];
    static DMG_STR = [    1,     1,     2,     2,     3];
    static  DMG_CD = [  1.1,   1.1,   1.5,   1.1,   1.1];
    static  SEEKER = [false, false,  true,  true, false]
    static  SEEKCD = 2

    static DIMS = [
        {x: 15, y:  5}, // arrow
        {x: 13, y:  5}, // trident
        {x: 16, y:  7}, // fire ball
        {x:  8, y: 16}, // red beam
        {x:  8, y: 16}  // blue beam
    ];

    constructor(x, y, nesw, dir, type) {
        Object.assign(this, {x, y, nesw, dir, type});
        this.speed = 200;
        this.phys2d = {isSolid: false, static: false, velocity: {x: 0, y: 0}};
        
        // getting the dimensions, depends on direction
        if (nesw == 1 || nesw == 3) this.dim = _Arrow_Type_PRX.DIMS[this.type];
        else this.dim = {x:_Arrow_Type_PRX.DIMS[this.type].y, y: _Arrow_Type_PRX.DIMS[this.type].x};

        this.setupAnimations();
        this.updateCollider();
        this.DEBUG = false;
        this.hitCD = 0;
        this.targetCD = 0;
    }

    setupAnimations() {
        this.anima = [
            GRAPHICS.getInstance('PRJX_arrow'),
            GRAPHICS.getInstance('PRJX_trident'),
            GRAPHICS.getInstance('PRJX_fire_ball'),
            GRAPHICS.getInstance('PRJX_red_magic_beam'),
            GRAPHICS.getInstance('PRJX_blue_magic_beam'),
        ]
    }

    checkImpact() {
        let player = Player.CURR_PLAYER;
        if (this.hitCD <= 0) {
            let hit = checkCollision(this, player);
            if (hit) {
                let p_Dir = normalizeVector(distVect(this, Player.CURR_PLAYER));
                player.takeDamage(_Arrow_Type_PRX.DMG_STR[this.type], scaleVect(p_Dir, _Arrow_Type_PRX.KB_STR[this.type]))
                this.hitCD = _Arrow_Type_PRX.DMG_CD[this.type];
                this.targetCD = _Arrow_Type_PRX.SEEKCD;
            }
        } else {
            this.hitCD -= gameEngine.clockTick; //{x: Player.CURR_PLAYER.x, y: Player.CURR_PLAYER.y -10}
        }
    }

    updateCollider() {
        this.collider = {type: "box", corner: {x: this.x, y: this.y},width: this.dim.x * SCALE,height: this.dim.y * SCALE};
    }

    updateDirection() {
        if (Math.abs(this.dir.x) > Math.abs(this.dir.y))
            this.nesw = this.dir.x > 0 ? 1 : 3;
        else
            this.nesw = this.dir.y > 0 ? 2 : 0;
        // nsew : 0 → north  |  1 → east  |  2 → south  |  3 → west
        if (this.nesw == 1 || this.nesw == 3) this.dim = _Arrow_Type_PRX.DIMS[this.type];
        else this.dim = {x:_Arrow_Type_PRX.DIMS[this.type].y, y: _Arrow_Type_PRX.DIMS[this.type].x};
    }

    update() {
        // did it escape the surly bonds of earth?
        if (this.x < -1 * 1.1 * this.dim.x * SCALE || this.x > 965 ||
            this.y < -1 * 1.1 * this.dim.y * SCALE || this.y > 772) {
            this.removeFromWorld = true;
            console.log(`Arrow type ${this.type} was removed`);
        }

        if (Player.CURR_PLAYER.alive) {
            this.checkImpact();
            if (this.targetCD <= 0 && _Arrow_Type_PRX.SEEKER[this.type]) 
                this.dir = normalizeVector(distVect(this, {x: Player.CURR_PLAYER.x, y: Player.CURR_PLAYER.y + 20}));
            else this.targetCD -= gameEngine.clockTick;
        } 
        this.phys2d.velocity = scaleVect(this.dir, _Arrow_Type_PRX.VEL[this.type] * gameEngine.clockTick);
        this.updateDirection();
    }
    // nsew : 0 → north  |  1 → east  |  2 → south  |  3 → west
    draw(ctx, scale) { 
        this.anima[this.type].drawSprite(this.nesw, ctx, this.x, this.y, scale)
        if(this.DEBUG) drawBoxCollider(ctx, this.collider, true);
    }
}

