class Knight {
    static MAX_HP = 5;
    static KB_DUR = 0.13;
    static KB_STR = 500;
    static STRIKE_DIST = 100;
    static DAMAGE_CD = 2; //Damage cooldown
    static CHARGE_DUR = 1;
    static CHARGE_CD = 0.3;

    static MAX_VEL = 125;
    static SPRINT_VEL = 310;

    constructor(x, y) {
        Object.assign(this, {x, y});

        this.DEBUG = false;
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
        this.dmgCD = 0;
        this.chargeCD = 0;
        this.updateCollider();
    }

    setupAnimations() {
        this.animations = Array(1);
        this.animations[0] = [
            GRAPHICS.getAnimation('ANIMA_blue_enemy_north').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_south').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_east').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_west').clone()
        ]
        this.animations[1] = [
            GRAPHICS.getAnimation('ANIMA_blue_enemy_north').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_south').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_east').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_west').clone()
        ]
        this.animations[2] = [
            GRAPHICS.getAnimation('ANIMA_blue_enemy_north').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_south').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_east').clone(),
            GRAPHICS.getAnimation('ANIMA_blue_enemy_west').clone()
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
            if (Player.CURR_PLAYER.alive && this.target)         this.charge();
            else                    this.pace();
        } else{
            this.phys2d.velocity = {x: this.kbVect.x, y: this.kbVect.y};
            //console.log(this.phys2d.velocity);
            console.log(this.kbVect);
            this.phys2d.velocity.x *= gameEngine.clockTick;
            this.phys2d.velocity.y *= gameEngine.clockTick;

            this.kbLeft -= gameEngine.clockTick;
            if(this.kbLeft <= 0) this.facePlayer();
        }

        if(Player.CURR_PLAYER.alive) this.checkSwordCol();
    };

    pace() {
        this.elapsedTime += gameEngine.clockTick;

        if (this.elapsedTime > this.nextChange || this.colliding) {
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

        //Check if player is in vision
        if(this.chargeCD <= 0 && Player.CURR_PLAYER && boxBoxCol(this.getPlayerDetCol(), Player.CURR_PLAYER.collider)){
            this.target = Player.CURR_PLAYER;
            this.chargeTLeft = Knight.CHARGE_DUR;
        }else{
            this.chargeCD -= gameEngine.clockTick;
        }
    }

    charge(){
        //console.log("Charging");
        this.chargeTLeft -= gameEngine.clockTick;
        if(this.chargeTLeft > 0 && !this.colliding){
            let targDir = scaleVect(normalizeVector(distVect(this, this.target)), 0.25);
            let facing = scaleVect(getDirVect(this.facing), 0.75);
            let chargeDir = addVect(targDir, facing);
            this.phys2d.velocity.x =  chargeDir.x * Knight.SPRINT_VEL * gameEngine.clockTick;
            this.phys2d.velocity.y = chargeDir.y * Knight.SPRINT_VEL * gameEngine.clockTick;
        }else{
            this.target = undefined;
            this.chargeCD = Knight.CHARGE_CD;
        }
    }

    checkSwordCol(){
        if(boxBoxCol(Player.CURR_PLAYER.collider, this.getSwordCol()) && this.dmgCD <= 0) {
            let targDir = normalizeVector(distVect(this.collider.corner, Player.CURR_PLAYER.collider.corner));
            let kb = scaleVect(targDir, Knight.KB_STR * SCALE);
            this.dealDamage(Player.CURR_PLAYER, kb);
            this.dmgCD = Knight.DAMAGE_CD;
            console.log("Hit player");
        } else{
            this.dmgCD -= gameEngine.clockTick;
        }
    }

    getSwordCol(){
        let col = this.collider;

        let w = this.facing == 0 || this.facing == 1 ? col.width : col.width/2;
        let h = this.facing == 2 || this.facing == 3 ? col.height : col.height/2;
        let xOff = 0;
        let yOff = 0;
        if(this.facing == 3)        xOff = -w; 
        else if(this.facing == 2)   xOff = col.width;
        if(this.facing == 0)        yOff = -h;
        else if(this.facing == 1)   yOff = col.height;

        return {type: "box", corner: {x: col.corner.x + xOff, y: col.corner.y + yOff}, width: w, height: h};
    }

    getPlayerDetCol(){
        let col = this.collider;

        let w = this.facing == 3 || this.facing == 2 ? col.width * 10 : col.width;
        let h = this.facing == 1 || this.facing == 0 ? col.height * 10 : col.height;
        let xOff = 0;
        let yOff = 0;
        if(this.facing == 3)        xOff = -w; 
        else if(this.facing == 2)   xOff = col.width;
        if(this.facing == 0)        yOff = -h;
        else if(this.facing == 1)   yOff = col.height;

        return {type: "box", corner: {x: col.corner.x + xOff, y: col.corner.y + yOff}, width: w, height: h};
    }

    dealDamage(entity, kb){
        entity.takeDamage(1, kb);
    }

    takeDamage(amount, kb){
        //console.log("That fleshwound only hurt: " + amount);
        this.kbVect = {x: kb.x, y: kb.y};
        this.kbLeft = Knight.KB_DUR;
        this.hp -= amount;
        if(this.hp <= 0){
            this.removeFromWorld = true;
        }

        this.target = undefined;
    }

    facePlayer(){
        let p = Player.CURR_PLAYER;
        let xDiff = this.collider.corner.x - p.collider.corner.x;
        let yDiff = this.collider.corner.y - p.collider.corner.y;

        if(Math.abs(xDiff) >= Math.abs(yDiff)){
            if(xDiff < 0)   this.facing = 2;
            else            this.facing = 3;
        }else{
            if(yDiff < 0)   this.facing = 1;
            else            this.facing = 0;
        }
    }

    updateCollider() {
        let xOff = 3 * SCALE; //this.facing == 3 ? 12 * SCALE : 3 * SCALE;
        this.collider = {type: "box", corner: {x: this.x + xOff, y: (this.y + 12 * SCALE)}, width: 14 * SCALE, height: 14 * SCALE};
    }

    draw(ctx, scale) {
        this.animations[this.state][this.facing].setAnimaSpeed(this.target ? 300 : 100);
        this.animations[this.state][this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale);
        if(this.DEBUG) drawBoxCollider(ctx, this.getSwordCol(), true);
    }
}