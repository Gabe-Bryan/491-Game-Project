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
    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, dir});

        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.cutoff = 0.4
        this.slows = 0.5
        
    }

    update() {
        // else {
        //     gameEngine.scene.addInteractable(new Bomb(this.x,this.y));
        //     this.removeFromWorld = true;
        // }
    }

    draw(ctx, scale) { // bomb has same sprite for N,E,S,W directions
        GRAPHICS.getInstance('PRJX_reg_bomb').drawSprite(0, ctx, this.x, this.y, scale);                    
    }
}

class _Iron_Ball_PRX {
    constructor(x, y, nesw, dir) {
        Object.assign(this, {x, y, dir});
        this.speed = 100;
        this.phys2d = {static: false, velocity: {x: 0, y: 0}};

        
    }

    update() {


    }

    draw(ctx, scale) { // iron ball has same sprite for N,E,S,W directions
        GRAPHICS.getInstance('PRJX_iron_ball').drawSprite(0, ctx, this.x, this.y, scale);
                                           
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


/*
if (this.vector.x > this.cutoff || this.vector.y > this.cutoff ) {
    // slow down
    let dcel = (1 - (this.slows * gameEngine.clockTick))
    this.vector = {
        x: this.vector.x * dcel,
        y: this.vector.y * dcel
    };
    this.phys2d.velocity = this.vector;
}
*/