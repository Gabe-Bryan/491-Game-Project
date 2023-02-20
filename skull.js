class Skull{
    static MAX_VEL = 75;
    static KB_STR = 100;
    static DMG_CD = 1.25;
    constructor(x, y){
        Object.assign(this, {x, y});
        this.updateCollider();
        this.phys2d = this.phys2d = {static: false, velocity: {x: 0, y: 0}};
        this.setupAnimations();
        this.DEBUG = true;
        this.attackCD = 0;
    }
    setupAnimations() {
        this.animation = GRAPHICS.get("ANIMA_skull_enemy").clone();
    }
    checkAttack(dir){
        let p = Player.CURR_PLAYER;
        if(this.attackCD <= 0){
            let hit = checkCollision(this, p);
            if(hit){
                this.dealDamage(p, scaleVect(dir, Skull.KB_STR));
                this.attackCD = Skull.DMG_CD;
            }
        }else{
            this.attackCD -= gameEngine.clockTick;
        }
    }

    dealDamage(entity, kb){
        entity.takeDamage(1, kb);
    }

    update(){
        if(Player.CURR_PLAYER.alive){
            let dir = normalizeVector(distVect(this, Player.CURR_PLAYER));
            this.phys2d.velocity = scaleVect(dir, Skull.MAX_VEL * gameEngine.clockTick);
            this.checkAttack(dir);
        }
    }

    updateCollider(){
        this.collider = {type: "box", corner: {x: this.x, y: this.y}, width: 12 * SCALE, height: 12 * SCALE};
    }
    
    draw(ctx){
        this.animation.animate(gameEngine.clockTick, ctx, this.x, this.y, SCALE);
    }
}