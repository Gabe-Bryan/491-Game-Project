class Wizard {
    static MAX_HP = 3;
    static SPAWN_RATE = 3;
    static KB_DUR = 0.1;
    static MAX_VEL = 150;

    static RUN_RAD = 300;
    static APPROACH_RAD = 400;
    constructor(sX, sY) {
        const tileCord = typeof sX == 'object'
        this.x = tileCord ? sX.x : sX;
        this.y = tileCord ? sX.y : sY;

        this.DEBUG = false;
        this.state = 0;  // 0:idle,  1:attacking
        this.facing = 1; // 0:north, 1:south,   2:east, 3:west
        this.attackHitCollector = [];

        this.currButton = Math.floor(Math.random() * 4);
        this.elapsedTime = 0;
        this.facingTime = 0;
        this.nextDirChange = 0.1;
        this.bt = 0;
        this.nextAttack = 1.5;
        this.animations = [];
        this.setupAnimations();

        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.tag = "enemy";
        this.updateCollider();

        this.hp = Wizard.MAX_HP;
        this.pain = {hurting : false, timer: 0, cooldown: 0.5} // cooldown in sec
        this.hitstop = {hitting: false, timer: 0, cooldown: 0.1}
        this.attackTime = 0;
        this.attackDur = 0.5;
        this.kbLeft = 0;
    }

    setupAnimations() { 
        this.animations = 
        [
            [GRAPHICS.getInstance('ANIMA_wizard_neutral_north'),
            GRAPHICS.getInstance('ANIMA_wizard_neutral_south'),
            GRAPHICS.getInstance('ANIMA_wizard_neutral_east'),
            GRAPHICS.getInstance('ANIMA_wizard_neutral_west')],

            [GRAPHICS.getInstance('ANIMA_wizard_casting_north'),
            GRAPHICS.getInstance('ANIMA_wizard_casting_south'),
            GRAPHICS.getInstance('ANIMA_wizard_casting_east'),
            GRAPHICS.getInstance('ANIMA_wizard_casting_west')]
        ]

    }

    update() {
        if(this.state != 1) this.elapsedTime += gameEngine.clockTick;
        this.facingTime += gameEngine.clockTick;

        if (this.pain.hurting) { // damage animation stuff
            this.pain.timer -= gameEngine.clockTick;
            if (this.pain.timer <= 0) {
                this.pain.hurting = false;
                this.pain.timer = 0;
            }
        }

        if(this.hitstop.hitting){
            this.hitstop.timer -= gameEngine.clockTick;
            if (this.hitstop.timer <= 0) {
                this.hitstop.hitting = false;
                this.hitstop.timer = 0;
            }
            return;
        }

        if (this.elapsedTime > this.nextAttack) {
            this.state = 1;
            this.elapsedTime = 0;
        }

        // this.currButton --> 0 = north  | 1 = south  |  2 = east  |  3 = west
        if(this.kbLeft > 0){

            this.kbLeft -= gameEngine.clockTick;
            this.phys2d.velocity = {x: this.kbVect.x, y: this.kbVect.y};
            //console.log(this.phys2d.velocity);
            // console.log(this.kbVect);
        }else if(this.state == 1){
            this.processAttack();
            this.velocity = {x: 0, y: 0};
        } else {
            // console.log("hiya");
            if(this.facingTime > this.nextDirChange) {
                this.setCurrButton();
                this.facingTime = 0;
            }
            if (this.currButton === 0)      [this.facing, this.phys2d.velocity.y] = [0, -Wizard.MAX_VEL];
            else if (this.currButton === 1) [this.facing, this.phys2d.velocity.y] = [1, Wizard.MAX_VEL];
            else                            this.phys2d.velocity.y = 0;
            
            if (this.currButton === 2)      [this.facing, this.phys2d.velocity.x] = [2, Wizard.MAX_VEL];
            else if (this.currButton === 3) [this.facing, this.phys2d.velocity.x] = [3, -Wizard.MAX_VEL];
            else                            this.phys2d.velocity.x = 0;

            this.phys2d.velocity = normalizeVector(this.phys2d.velocity);
            this.phys2d.velocity.x *= Wizard.MAX_VEL;
            this.phys2d.velocity.y *= Wizard.MAX_VEL;
        }

        
        this.phys2d.velocity.x *= gameEngine.clockTick;
        this.phys2d.velocity.y *= gameEngine.clockTick;
    };

    processAttack(){
        this.attackTime += gameEngine.clockTick;
        if(this.attackTime > this.attackDur){
            this.state = 0;
            this.elapsedTime = 0;
            this.attackTime = 0;
            gameEngine.scene.addInteractable(
                new Projectile("blueBeam", this.x + this.collider.width/2, this.y + 5, distVect(this, Player.CURR_PLAYER)))
        }
    }


    setCurrButton(){
        let p = Player.CURR_PLAYER;
        let xDist = p.x - this.x;
        let yDist = p.y - this.y;
        let dist = distance(this, p)
        // console.log("dist x: " + xDist + " dist y: " + yDist);
        if(dist < Wizard.RUN_RAD){
            if(Math.abs(xDist) > Math.abs(yDist)){
                this.currButton = xDist > 0 ? 3 : 2;
            }else{
                this.currButton = yDist > 0 ? 0: 1;
            }
        }else if (dist > Wizard.APPROACH_RAD){
            if(Math.abs(xDist) > Math.abs(yDist)){
                this.currButton = xDist > 0 ? 2 : 3;
            }else{
                this.currButton = yDist > 0 ? 1: 0;
            }
        }else{
            this.currButton = 4;
        }
        
    }

    takeDamage(amount, kb, hitStopTime){
        //console.log("That fleshwound only hurt: " + amount);
        this.kbVect = {x: kb.x, y: kb.y};
        this.kbLeft = Wizard.KB_DUR;
        this.hp -= amount;
        if(this.hp <= 0){
            this.removeFromWorld = true;
        }

        this.pain.hurting = true;
        this.pain.timer = this.pain.cooldown;
        this.hitstop.hitting = true;
        this.hitstop.timer = hitStopTime;
    }

    updateCollider(){
        let xOff = 3 * SCALE;
        this.collider = {type: "box", corner: {x: this.x + xOff, y: (this.y + 12 * SCALE)}, width: 14 * SCALE, height: 14 * SCALE};
    }

    draw(ctx, scale) {
        try{
            this.animations[this.state][this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale, this.pain.hurting);
    
        }catch(error){
            console.error(error);
            console.log("state: " + this.state);
            console.log("facing: " + this.facing);
            console.log(this.animations);
        }
        
    }
}
