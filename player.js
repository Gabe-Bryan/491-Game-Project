class Player {
    
    static MAX_HP = 10;
    static MAX_VEL = 250; //Pixels per second (I think -Gabe)
    static KB_DUR = 0.1;
    static KB_STR = 300;

    static SWING_CD = 0.25;

    static CURR_PLAYER = undefined;

    constructor(x, y) {
        Object.assign(this, {x, y});

        this.DEBUG = false;
        this.state = 0;     // 0:idle, 1:walking, 2:attacking, 3: taking damage
        this.facing = 1;    
        this.attackHitbox = undefined;
        this.attackHBDim = {width: 15 * SCALE, height: 30 * SCALE};
        this.attackHBOffset = {x: 0, y: -3 * SCALE};

        this.animations = [];
        this.setupAnimations();

        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.tag = "player";
        this.updateCollider();
        this.alive = true;
        this.pain = {hurting : false, timer: 0, cooldown: 0.5} // cooldown in sec

        this.setHp(Player.MAX_HP);
        this.kbLeft = 0;
        this.swingCD = 0;
    };

    setupAnimations() {
        // Animation array: [state][facing]
        this.animations = new Array(4)

        // idle animations
        this.animations[0] = [
            GRAPHICS.get('ANIMA_link_Idle_north'),
            GRAPHICS.get('ANIMA_link_Idle_south'),
            GRAPHICS.get('ANIMA_link_Idle_east'),
            GRAPHICS.get('ANIMA_link_Idle_west'),
        ]
        //walking animations
        this.animations[1] = [
            GRAPHICS.get('ANIMA_link_run_north'),
            GRAPHICS.get('ANIMA_link_run_south'),
            GRAPHICS.get('ANIMA_link_run_east'),
            GRAPHICS.get('ANIMA_link_run_west')
        ]
        // attacking animations
        this.animations[2] = [
            GRAPHICS.get('ANIMA_link_attack_north'),
            GRAPHICS.get('ANIMA_link_attack_south'),
            GRAPHICS.get('ANIMA_link_attack_east'),
            GRAPHICS.get('ANIMA_link_attack_west')
        ]
        // taking damage animations
        this.animations[3] = [
            GRAPHICS.get('ANIMA_link_hurt_north'),
            GRAPHICS.get('ANIMA_link_hurt_south'),
            GRAPHICS.get('ANIMA_link_hurt_east'),
            GRAPHICS.get('ANIMA_link_hurt_west')
        ]

        // other animations / sprites
        this.attackTime = GRAPHICS.getAnimation('ANIMA_link_attack_west').fTiming.reduce((a, b) => a+b);
        this.endSprites = GRAPHICS.getSpriteSet('SET_end_game');
    };

    updateState(moveIn, attackIn) {
        if (attackIn || this.state == 2) {
            if (this.state != 2) {
                this.attackTimeLeft = this.attackTime;
                this.attackHits = [];
            }
            this.state = 2;
        }
        else if(moveIn.x != 0 || moveIn.y != 0) this.state = 1;
        else this.state = 0;
    }



    updateDirection(moveIn) {
        if(moveIn.x > 0) this.facing = 2;
        else if(moveIn.x < 0) this.facing = 3;
        else if(moveIn.y > 0) this.facing = 0;
        else if (moveIn.y < 0) this.facing = 1;
    }

    update() { // this.pain = {hurting : false, timer: 0, cooldown: 20}
        if (!this.alive) return;
        let prevFacing = this.facing;
        this.sidesAffected = undefined;
        
        if (this.pain.hurting) { // damage animation stuff
            this.pain.timer -= gameEngine.clockTick;
            if (this.pain.timer <= 0) {
                this.pain.hurting = false;
                this.pain.timer = 0;
            }
        }

        let walkStateChange = this.state <= 1 ? 1 : this.state;
        let moveIn = {x: 0, y: 0}
        if (gameEngine.keys["w"])      moveIn.y = 1;//[this.facing, this.state, this.phys2d.velocity.y] = [0, walkStateChange, -Player.MAX_VEL];
        else if (gameEngine.keys["s"]) moveIn.y = -1;//[this.facing, this.state, this.phys2d.velocity.y] = [1, walkStateChange, Player.MAX_VEL];
        
        if (gameEngine.keys["d"])      moveIn.x = 1;//[this.facing, this.state, this.phys2d.velocity.x] = [2, walkStateChange, Player.MAX_VEL];
        else if (gameEngine.keys["a"]) moveIn.x = -1;//[this.facing, this.state, this.phys2d.velocity.x] = [3, walkStateChange, -Player.MAX_VEL];
        
        this.moveIn = normalizeVector(moveIn);
        this.swingCD -= gameEngine.clockTick;
        this.attackIn = gameEngine.keys['j'] && this.swingCD <= 0;
        this.updateState(this.moveIn, this.attackIn);

        if (this.state != 2) this.updateDirection(this.moveIn);
        else this.processAttack();

        if (this.kbLeft > 0){
            this.phys2d.velocity = {x: this.kbVect.x, y: this.kbVect.y};
            //console.log(this.phys2d.velocity);
            //console.log(this.kbVect);
            this.phys2d.velocity.x *= gameEngine.clockTick;
            this.phys2d.velocity.y *= gameEngine.clockTick;

            this.kbLeft -= gameEngine.clockTick;
        } else {
            let velocityMod = this.state == 2 ? 1/2 : 1;
            this.phys2d.velocity.x = this.moveIn.x * Player.MAX_VEL * gameEngine.clockTick * velocityMod;
            this.phys2d.velocity.y = this.moveIn.y * -1 * Player.MAX_VEL * gameEngine.clockTick * velocityMod;    
        }
        
        gameEngine.currMap.screenEdgeTransition(this);
    };

    processAttack() {
        this.attackTimeLeft -= gameEngine.clockTick;
        if(this.attackTimeLeft - gameEngine.clockTick <= 0) {
            this.state = 0;
            this.resetAnims();
            this.swingCD = Player.SWING_CD;
        }
        else {
            //console.log("Time left for attack: " + this.attackTimeLeft);
            this.setAttackHB();
            //Attack collision det and handling
            this.hitEnemy = false;
            gameEngine.scene.interact_entities.forEach((entity) =>{
                if(entity != this && entity.collider && entity.collider.type == "box" 
                    && entity.tag == "enemy" && !this.attackHits.includes(entity)){
                    let hit = boxBoxCol(this.attackHitbox, entity.collider);
                    this.hitEnemy = hit || this.hitEnemy;//stored for debugging
                    if (hit) {
                        let kbDir = normalizeVector(distVect(this.collider.corner, entity.collider.corner));
                        let kb = scaleVect(kbDir, Player.KB_STR * SCALE);
                        //console.log(kb);
                        this.dealDamage(entity, kb);
                        this.attackHits.push(entity);
                    }
                }
            });
        }
    }

    dealDamage(entity, kb) {
        entity.takeDamage(1, kb);
    }

    takeDamage(amount, kb) {
        //console.log("GYahaAAaaa: " + amount);
        this.kbVect = {x: kb.x, y: kb.y};
        this.kbLeft = Player.KB_DUR;
        this.setHp(this.hp - amount);
        if(this.hp <= 0){
            //console.log("Game over!!!!!!!!!");
            gameEngine.gameOver = true;
            this.alive = false
            this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        }

        this.pain.hurting = true;
        this.pain.timer = this.pain.cooldown;
    }

    setHp(newHp) {
        this.hp = newHp;
        GAMEDISPLAY.heartCount = this.hp;
    }

    heal(amount) {
        let tempHP = this.hp + amount;
        if (tempHP > Player.MAX_HP) tempHP = Player.MAX_HP;          
        this.setHp(tempHP);
    }

    updateCollider() {
        let xOff = 1.5 * SCALE;
        this.collider = {type: "box", corner: {x: this.x + xOff, y: (this.y + 28)}, width: 14*SCALE, height: 14*SCALE};
    }

    setAttackHB() {
        if (this.facing == 2 || this.facing == 3){
            let hDist = this.attackHBDim.height - this.collider.height;
            let yAdjust = hDist/2;
    
            let xAdjust = this.facing == 3 ? -this.attackHBDim.width : this.collider.width;
    
            let AHBcorner = {x: this.collider.corner.x + xAdjust, y: this.collider.corner.y - yAdjust + this.attackHBOffset.y};
            this.attackHitbox = {type: "box", corner: AHBcorner, width: this.attackHBDim.width, height: this.attackHBDim.height};    
        } else {
            let wDist = this.attackHBDim.height - this.collider.width;
            let xAdjust = wDist/2;

            let yAdjust = this.facing == 1 ? -this.collider.height : this.attackHBDim.width;
            let AHBcorner = {x: this.collider.corner.x - xAdjust /*+ this.attackHBOffset.y*/, y: this.collider.corner.y - yAdjust};
            this.attackHitbox = {type: "box", corner: AHBcorner, width: this.attackHBDim.height, height: this.attackHBDim.width}; 
        }
    }

    resetAnims() {
        for(let i = 0; i < this.animations.length; i++){
            for(let j = 0; j < this.animations[i].length; j++){
                this.animations[i][j].reset();
            }
        }
    }

    drawAttack(ctx, scale){
        ctx.strokeStyle = this.hitEnemy ? "red" : "green";
        //console.log(this.hitEnemy);
        ctx.lineWidth = 2;
        //ctx.fillRect(0, 0, 1000, 1000);
        ctx.strokeRect(this.attackHitbox.corner.x, this.attackHitbox.corner.y, this.attackHitbox.width, this.attackHitbox.height);
    }

    draw (ctx, scale) {
        // game has ended
        if (!this.alive) this.endSprites.drawSprite(2, ctx, this.x, this.y, scale);
        else if(gameEngine.victory) this.endSprites.drawSprite(1, ctx, this.x, this.y, scale);
        // Game is still going 
        else this.animations[this.state][this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale, this.pain.hurting);

        // GRAPHICS.get('SET_end_game').drawSprite(0, ctx, this.x+100, this.y, scale);
        // GRAPHICS.get('ANIMA_link_dead').animate(gameEngine.clockTick, ctx, this.x +100, this.y, scale);

        if(this.DEBUG) {
            //this.drawCollider(ctx);
            if(this.state == 2) this.drawAttack(ctx, scale);
            /*
            ctx.fillStyle = "#f0f";
            let cW = this.collider.width;
            let cH = this.collider.height;
            let cX = this.collider.corner.x;
            let cY = this.collider.corner.y;
            let nX = cX + (cW/2);
            let nY = cY + (cH/2);
            let dS = 3;
            ctx.fillStyle = "#f00";
            ctx.fillRect(cX, cY, cW, cH);
            ctx.fillStyle = "#00f";
            ctx.fillRect(nX-dS, nY-dS, dS*scale, dS*scale);
            ctx.fillStyle = "#333";
            ctx.fillRect(10, ctx.canvas.height - 40, 100, 30)
            ctx.fillStyle = "#fff";
            ctx.font = "20px monospace";
            ctx.fillText(`(${Math.floor(cX)},${Math.floor(cY)})`, 10, ctx.canvas.height-20);
            */
        }
        
        
    };

    /**    
        drawCollider(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.collider.corner.x, this.collider.corner.y);
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.sidesAffected.down ? "green" : "red";
        ctx.lineTo(this.collider.corner.x + this.collider.width, this.collider.corner.y);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.moveTo(this.collider.corner.x + this.collider.width, this.collider.corner.y);
        ctx.strokeStyle = this.sidesAffected.left ? "green" : "red";
        ctx.lineTo(this.collider.corner.x + this.collider.width, this.collider.corner.y + this.collider.height);
        ctx.stroke();
        ctx.closePath();

        
        ctx.beginPath();
        ctx.moveTo(this.collider.corner.x + this.collider.width, this.collider.corner.y + this.collider.height);
        ctx.strokeStyle = this.sidesAffected.up ? "green" : "red";
        ctx.lineTo(this.collider.corner.x, this.collider.corner.y + this.collider.height);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.moveTo(this.collider.corner.x, this.collider.corner.y + this.collider.height);
        ctx.strokeStyle = this.sidesAffected.right ? "green" : "red";
        ctx.lineTo(this.collider.corner.x, this.collider.corner.y);
        ctx.stroke();
        ctx.closePath();
    } */
}
