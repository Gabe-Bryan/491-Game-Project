class Knight {
    static MAX_HP = 10;
    static KB_DUR = 0.05;
    static STRIKE_DIST = 100;
    static DAMAGE_CD = 2; //Damage cooldown
    static CHARGE_DUR = 5;

    static MAX_VEL = 150;
    static SPRINT_VEL = 300;

    constructor(x, y) {
        Object.assign(this, {x, y});

        this.DEBUG = true;
        this.target = undefined;
        this.state = 0;  // 0:idle,  1:walking, 2: taking damage
        this.facing = 1; // 0:north, 1:south,   2:east, 3:west
        this.attackHitCollector = [];

        this.currButton = 1;
        this.elapsedTime = 0;
        this.nextChange = 1;
        this.hp = Knight.MAX_HP;
        this.kbLeft = 0;

        this.animations = [];
        this.setupAnimations();

        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.tag = "enemy";
        this.strikeDist = Knight.STRIKE_DIST * SCALE;
        this.chargeTLeft = 0;
        this.updateCollider();
    }

    setupAnimations() {
        this.animations = Array(1);
        this.animations[0] = [
            GRAPHICS.getAnimation('ANIMA_blue_enemy_north'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_south'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_east'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_west')
        ]
        this.animations[1] = [
            GRAPHICS.getAnimation('ANIMA_blue_enemy_north'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_south'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_east'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_west')
        ]
        this.animations[2] = [
            GRAPHICS.getAnimation('ANIMA_blue_enemy_north'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_south'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_east'),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_west')
        ]
    }


    updateState() {
        if (this.phys2d.velocity.x != 0 || this.phys2d.velocity.y != 0) this.state = 1;
        else this.state = 0;
    }

    update() {
        let prevFacing = this.facing;
        this.sidesAffected = undefined;

        if(this.kbLeft <= 0) {
            if(this.target)         this.charge();
            else                    this.pace();
        }else{
            this.phys2d.velocity = {x: this.kbVect.x, y: this.kbVect.y};
            //console.log(this.phys2d.velocity);
            console.log(this.kbVect);
            this.phys2d.velocity.x *= gameEngine.clockTick;
            this.phys2d.velocity.y *= gameEngine.clockTick;

            this.kbLeft -= gameEngine.clockTick;
        }

        
    };

    pace(){
        this.elapsedTime += gameEngine.clockTick;

        if (this.elapsedTime > this.nextChange) {
            this.elapsedTime = 0;
            this.nextChange = Math.random() * 1.65;
            this.currButton = Math.floor(Math.random() * 4);
        }

        if (this.x > 960) this.currButton = 3;
        if (this.x < 10) this.currButton = 2;
        if (this.y < 10) this.currButton = 0;
        if (this.y > 770) this.currButton = 1;
        // this.currButton --> 0 = w  | 1 = s  |  2 = d  |  3 = a
        
        if (this.currButton === 0)      [this.facing, this.state, this.phys2d.velocity.y] = [0, 1, -Player.MAX_VEL];
        else if (this.currButton === 1) [this.facing, this.state, this.phys2d.velocity.y] = [1, 1, Player.MAX_VEL];
        else                            this.phys2d.velocity.y = 0;
        
        if (this.currButton === 2)      [this.facing, this.state, this.phys2d.velocity.x] = [2, 1, Player.MAX_VEL];
        else if (this.currButton === 3) [this.facing, this.state, this.phys2d.velocity.x] = [3, 1, -Player.MAX_VEL];
        else                            this.phys2d.velocity.x = 0;

        this.phys2d.velocity = normalizeVector(this.phys2d.velocity);
        this.phys2d.velocity.x *= Knight.MAX_VEL * gameEngine.clockTick;
        this.phys2d.velocity.y *= Knight.MAX_VEL * gameEngine.clockTick;
    }

    charge(){
        this.chargeTLeft -= gameEngine.clockTick;
        if(this.chargeTLeft > 0 && !this.colliding){
            let targDir = scaleVect(normalizeVector(distVect(this, this.target)), 0.2);
            let facing = scaleVect(getDirVect(this.facing), 0.8);
            this.phys2d.velocity = scaleVect(addVect(targDir, facing), Knight.SPRINT_VEL);
        }else{
            target = undefined;
        }
    }

    takeDamage(amount, kb){
        //console.log("That fleshwound only hurt: " + amount);
        this.kbVect = {x: kb.x, y: kb.y};
        this.kbLeft = Knight.KB_DUR;
        this.hp -= amount;
        if(this.hp < 0){
            this.removeFromWorld = true;
        }

        this.target = undefined;
    }

    updateCollider(){
        let xOff = this.facing == 3 ? 12 * SCALE : 3 * SCALE;
        this.collider = {type: "box", corner: {x: this.x + xOff, y: (this.y + 12 * SCALE)}, width: 14 * SCALE, height: 14 * SCALE};
    }

    draw(ctx, scale) {
        this.animations[this.state][this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale);
    }
}