class Player {
    static MAX_VEL = 200; //Pixels per second (I think -Gabe)
    constructor(x, y) {
        Object.assign(this, {x, y});

        this.DEBUG = false;
        this.state = 0;     // 0:idle, 1:walking, 2:attacking
        this.facing = 1;    // 0:north, 1:south, 2:east, 3:west
        this.attackHitCollector = [];

        this.animations = [];
        this.setupAnimations();

        this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.tag = "player";
    };

    setupAnimations() {
        for (let i = 0; i < 3; i++) {           // states
            this.animations.push([]);          
            for (let j = 0; j < 4; j++) {       // directions
                this.animations[i].push([]);    
            }
        }

        // idle animations
        // facing north
        this.animations[0][0] = ANIMANAGER.getAnimation('ANIMA_link_Idle_north');
        // facing south
        this.animations[0][1] = ANIMANAGER.getAnimation('ANIMA_link_Idle_south');
        // facing east
        this.animations[0][2] = ANIMANAGER.getAnimation('ANIMA_link_Idle_east');
        // facing west
        this.animations[0][3] = ANIMANAGER.getAnimation('ANIMA_link_Idle_west');

        //walking animations
        //facing north
        this.animations[1][0] = ANIMANAGER.getAnimation('ANIMA_link_run_north');
        // facing south
        this.animations[1][1] = ANIMANAGER.getAnimation('ANIMA_link_run_south');
        // facing east
        this.animations[1][2] = ANIMANAGER.getAnimation('ANIMA_link_run_east');
        // facing west
        this.animations[1][3] = ANIMANAGER.getAnimation('ANIMA_link_run_west');

        this.animations[2][0] = ANIMANAGER.getAnimation('ANIMA_link_attack_west');
        this.animations[2][1] = ANIMANAGER.getAnimation('ANIMA_link_attack_east');
        this.animations[2][2] = ANIMANAGER.getAnimation('ANIMA_link_attack_east');
        this.animations[2][3] = ANIMANAGER.getAnimation('ANIMA_link_attack_west');

        this.attackTime = this.animations[2][0].fTiming.reduce((a, b) => a+b);
    };

    updateState() {
        if (this.phys2d.velocity.x != 0 || this.phys2d.velocity.y != 0) this.state = 1;
        else this.state = 0;
    }

    update() {
        let prevFacing = this.facing;
        this.sidesAffected = undefined;
        
        let walkStateChange = this.state <= 1 ? 1 : this.state;
        if (gameEngine.keys["w"])      [this.facing, this.state, this.phys2d.velocity.y] = [0, walkStateChange, -Player.MAX_VEL];
        else if (gameEngine.keys["s"]) [this.facing, this.state, this.phys2d.velocity.y] = [1, walkStateChange, Player.MAX_VEL];
        else                            this.phys2d.velocity.y = 0;
        
        if (gameEngine.keys["d"])      [this.facing, this.state, this.phys2d.velocity.x] = [2, walkStateChange, Player.MAX_VEL];
        else if (gameEngine.keys["a"]) [this.facing, this.state, this.phys2d.velocity.x] = [3, walkStateChange, -Player.MAX_VEL];
        else                            this.phys2d.velocity.x = 0;

        if(gameEngine.keys["j"] && this.state != 2) {this.state = 2; this.attackTimeLeft = this.attackTime;}

        if(this.state == 2) this.processAttack();
        let velocityMod = this.state == 2 ? 1/4 : 1;
        this.phys2d.velocity = normalizeVector(this.phys2d.velocity);
        this.phys2d.velocity.x *= Player.MAX_VEL * gameEngine.clockTick * velocityMod;
        this.phys2d.velocity.y *= Player.MAX_VEL * gameEngine.clockTick * velocityMod;

        if(this.state != 2) this.updateState();

        let prevX = this.x;
        let prevY = this.y;

        this.x += this.phys2d.velocity.x;
        this.y += this.phys2d.velocity.y;
        this.updateCollider();
        this.collisionChecker(prevX, prevY);

        gameEngine.currMap.screenEdgeTransition(this);
    };

    /**
     * Called once per tick after adjusting player position
     * @param {*} prevX x value before velocity was applied
     * @param {*} prevY y value before velocity was applied
     */
    collisionChecker(prevX, prevY) {
        this.colliding = false;//.sort((e1, e2) => -(distance(e1, this) - distance(e2, this)))
        gameEngine.scene.env_entities.forEach(entity => {
            if(entity.collider != undefined && entity.collider.type === "box" && entity != this){
                //Check to see if player is colliding with entity
                let colliding = checkCollision(this, entity);
                this.colliding = colliding || this.colliding;//store for later purposes
                //check to see if the collision entity is solid and the type of entity we are looking for
                if(colliding && entity.phys2d && entity.phys2d.static && entity.tag == "environment"){
                    dynmStaticColHandler(this, entity, prevX, prevY);//Handle collision
                    this.updateCollider();
                    //prevX = this.x;
                    //prevY = this.y;
                }
            }
        });
    }

    processAttack(){
        this.attackTimeLeft -= gameEngine.clockTick;
        if(this.attackTimeLeft - gameEngine.clockTick <= 0) this.state = 0;
        else console.log('time left: ' + this.attackTimeLeft + ' out of: ' + this.attackTime);
    }

    updateCollider(){
        this.collider = {type: "box", corner: {x: this.x+1, y: (this.y + 28)+1}, width: 14*SCALE, height: 14*SCALE};
    }

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
    }

    draw(ctx, scale) {
        this.animations[this.state][this.facing].animate(gameEngine.clockTick, ctx, this.x, this.y, scale);
        if(this.colliding && this.sidesAffected) this.drawCollider(ctx);
        // ANIMANAGER.getAnimation('ANIMA_bunny_west').animate(gameEngine.clockTick, ctx, 200, 200, scale);

        if(this.DEBUG) {
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
        }
    };
}
