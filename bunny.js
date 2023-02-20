class Bunny {
    static MAX_HP = 1;
    static KB_DUR = 0.1;
    constructor(x, y) {
        Object.assign(this, {x, y});

        this.DEBUG = true;
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
        this.kbLeft = 0;
    }

    setupAnimations() { // this.currButton --> 0 = north  | 1 = south  |  2 = east  |  3 = west
        this.animations = [
            GRAPHICS.get('ANIMA_bunny_north').clone(),
            GRAPHICS.get('ANIMA_bunny_south').clone(),
            GRAPHICS.get('ANIMA_bunny_east').clone(),
            GRAPHICS.get('ANIMA_bunny_west').clone(),
        ]

    }

    updateState() {
        if (this.phys2d.velocity.x != 0 || this.phys2d.velocity.y != 0) this.state = 1;
        else this.state = 0;
    }

    bunnyTime() {
        gameEngine.addEntity(new Bunny(130 + Math.random()*600), 130 + Math.random()*500);
    }

    update() {
        this.elapsedTime += gameEngine.clockTick;

        if (this.elapsedTime > this.nextChange) {
            this.nextChange += 0.2 + Math.random() * 1.82;
            this.currButton = Math.floor(Math.random() * 4);
        }

        if (gameEngine.keys["b"]) {
            this.bt++;
            if (this.bt > 50) {
                this.bt = 0;
                gameEngine.scene.addInteractable(new Bunny(200 + (Math.random()*560), 200 + (Math.random()*368)));
            }           
        }


        if (this.x > 950) this.currButton = 3;
        if (this.x < 10) this.currButton = 2;
        if (this.y < 10) this.currButton = 1;
        if (this.y > 760) this.currButton = 0;
        // this.currButton --> 0 = north  | 1 = south  |  2 = east  |  3 = west
        
        if (this.currButton === 0)      [this.facing, this.state, this.phys2d.velocity.y] = [0, 1, -Player.MAX_VEL];
        else if (this.currButton === 1) [this.facing, this.state, this.phys2d.velocity.y] = [1, 1, Player.MAX_VEL];
        else                            this.phys2d.velocity.y = 0;
        
        if (this.currButton === 2)      [this.facing, this.state, this.phys2d.velocity.x] = [2, 1, Player.MAX_VEL];
        else if (this.currButton === 3) [this.facing, this.state, this.phys2d.velocity.x] = [3, 1, -Player.MAX_VEL];
        else                            this.phys2d.velocity.x = 0;

        if(this.kbLeft <= 0) {
            this.phys2d.velocity = normalizeVector(this.phys2d.velocity);
            this.phys2d.velocity.x *= Player.MAX_VEL * gameEngine.clockTick;
            this.phys2d.velocity.y *= Player.MAX_VEL * gameEngine.clockTick;
        }else{
            this.phys2d.velocity = {x: this.kbVect.x, y: this.kbVect.y};
            //console.log(this.phys2d.velocity);
            console.log(this.kbVect);
            this.phys2d.velocity.x *= gameEngine.clockTick;
            this.phys2d.velocity.y *= gameEngine.clockTick;

            this.kbLeft -= gameEngine.clockTick;
        }

        if(this.state != 2) this.updateState();
    };


    takeDamage(amount, kb){
        //console.log("Ow my leg. That hurt exactly this much: " + amount);
        this.kbVect = {x: kb.x, y: kb.y};
        this.kbLeft = Bunny.KB_DUR;
        this.hp -= amount;
        if(this.hp <= 0){
            this.removeFromWorld = true;
            gameEngine.scene.addInteractable(new Bunny(100 + (Math.random()*560), 300 + (Math.random()*368)));
            gameEngine.scene.addInteractable(new Bunny(300 + (Math.random()*560), 100 + (Math.random()*368)));
        }
    }

    updateCollider(){
        let xOff = 3 * SCALE;
        this.collider = {type: "box", corner: {x: this.x + xOff, y: (this.y + 12 * SCALE)}, width: 14 * SCALE, height: 14 * SCALE};
    }

    draw(ctx, scale) {
        this.animations[this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale);
    }
}
