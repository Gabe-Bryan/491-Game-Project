class Bunny {
    static MAX_HP = 3;
    static SPAWN_RATE = 3;
    static KB_DUR = 0.1;
    static MAX_VEL = 100
    constructor(_start_pos) {
        this.x = _start_pos.x;
        this.y = _start_pos.y;

        this.DEBUG = false;
        this.state = 0;  // 0:idle,  1:walking, 2:attacking
        this.facing = 1; // 0:north, 1:south,   2:east, 3:west
        this.attackHitCollector = [];

        this.currButton = Math.floor(Math.random() * 4);
        this.elapsedTime = 0;
        this.bt = 0;
        this.nextChange = 1;
        this.animations = [];
        this.setupAnimations();

        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.tag = "enemy";
        this.updateCollider();

        this.hp = Bunny.MAX_HP;
        this.pain = {hurting : false, timer: 0, cooldown: 0.5} // cooldown in sec
        this.kbLeft = 0;
    }

    setupAnimations() { // this.currButton --> 0 = north  | 1 = south  |  2 = east  |  3 = west
        this.animations = [
            GRAPHICS.getInstance('ANIMA_bunny_north'),
            GRAPHICS.getInstance('ANIMA_bunny_south'),
            GRAPHICS.getInstance('ANIMA_bunny_east'),
            GRAPHICS.getInstance('ANIMA_bunny_west')
        ]

    }

    updateState() {
        if (this.phys2d.velocity.x != 0 || this.phys2d.velocity.y != 0) this.state = 1;
        else this.state = 0;
    }

    bunnyTime(amount) {
        for (let i = 0; i < amount; i++)
        gameEngine.scene.addInteractable(new Bunny(64 + (Math.random()*700), 64 + (Math.random()*600)));
    }

    update() {
        this.elapsedTime += gameEngine.clockTick;

        if (this.pain.hurting) { // damage animation stuff
            this.pain.timer -= gameEngine.clockTick;
            if (this.pain.timer <= 0) {
                this.pain.hurting = false;
                this.pain.timer = 0;
            }
        }

        if (this.elapsedTime > this.nextChange) {
            this.nextChange += 0.2 + Math.random() * 1.82;
            this.currButton = Math.floor(Math.random() * 4);
        }

        if (gameEngine.keys["b"]) {
            this.bt++;
            if (this.bt > 50) {
                this.bt = 0;
                this.bunnyTime(1)
            }           
        }


        if (this.x > 950) this.currButton = 3;
        if (this.x < 10) this.currButton = 2;
        if (this.y < 10) this.currButton = 1;
        if (this.y > 760) this.currButton = 0;
        // this.currButton --> 0 = north  | 1 = south  |  2 = east  |  3 = west
        
        if (this.currButton === 0)      [this.facing, this.state, this.phys2d.velocity.y] = [0, 1, -Bunny.MAX_VEL];
        else if (this.currButton === 1) [this.facing, this.state, this.phys2d.velocity.y] = [1, 1, Bunny.MAX_VEL];
        else                            this.phys2d.velocity.y = 0;
        
        if (this.currButton === 2)      [this.facing, this.state, this.phys2d.velocity.x] = [2, 1, Bunny.MAX_VEL];
        else if (this.currButton === 3) [this.facing, this.state, this.phys2d.velocity.x] = [3, 1, -Bunny.MAX_VEL];
        else                            this.phys2d.velocity.x = 0;

        if (this.kbLeft <= 0) {
            this.phys2d.velocity = normalizeVector(this.phys2d.velocity);
            this.phys2d.velocity.x *= Bunny.MAX_VEL * gameEngine.clockTick;
            this.phys2d.velocity.y *= Bunny.MAX_VEL * gameEngine.clockTick;
        } else {
            this.phys2d.velocity = {x: this.kbVect.x, y: this.kbVect.y};
            //console.log(this.phys2d.velocity);
            // console.log(this.kbVect);
            this.phys2d.velocity.x *= gameEngine.clockTick;
            this.phys2d.velocity.y *= gameEngine.clockTick;

            this.kbLeft -= gameEngine.clockTick;
        }

        if (this.state != 2) this.updateState();
    };


    takeDamage(amount, kb){
        //console.log("Ow my leg. That hurt exactly this much: " + amount);
        this.kbVect = {x: kb.x, y: kb.y};
        this.kbLeft = Bunny.KB_DUR;
        this.hp -= amount;
        if (this.hp <= 0){
            this.removeFromWorld = true;
            this.bunnyTime(Bunny.SPAWN_RATE)
        }

        this.pain.hurting = true;
        this.pain.timer = this.pain.cooldown;
    }

    updateCollider(){
        let xOff = 3 * SCALE;
        this.collider = {type: "box", corner: {x: this.x + xOff, y: (this.y + 12 * SCALE)}, width: 14 * SCALE, height: 14 * SCALE};
    }

    draw(ctx, scale) {
        this.animations[this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale, this.pain.hurting);
    }
}
