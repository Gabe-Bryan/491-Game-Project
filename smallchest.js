class SmallChest {
    constructor(pos, contentsType = null, state="closed") {
        this.xLoc = pos.x;
        this.yLoc = pos.y;
        this.state = state;
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: this.xLoc+1*SCALE, y: this.yLoc+1 *SCALE}, height: 14 * SCALE, width: 14 * SCALE};
        this.tag = 'env_interact';
        this.randPool = ['heart', 'heart', 'bomb', 'fart'];

        if (contentsType === 'random') contentsType = this.randCont();

        switch (contentsType) {
            case null    : break
            case 'heart' : this.contents = new HeartDrop(this.xLoc +7.5, this.yLoc - 7)
                break
            case 'key'   : this.contents = new KeyDrop(this.xLoc+7.5, this.yLoc - 28)
                break
            case 'bomb'  : this.contents = new Bomb(this.xLoc+6, this.yLoc-9)
                break
            case 'fart' : this.contents = new BadGas(this.xLoc-42, this.yLoc-20)
                break
        }

        this.DEBUG = false;
    };
    
    randCont() {
        return this.randPool[Math.floor(Math.random() * this.randPool.length)]
    }

    update() {};

    interact() {
        if (this.state != 'closed') return;
        // else ...
        this.state = 'open';
        // console.log(this.contents);
        if (this.contents) {
            let pos = gameEngine.scene.interact_entities.findIndex((element) => this == element)
            gameEngine.scene.interact_entities.splice(pos, 0, this.contents);
        }
        this.phys2d = {static: true, isSolid: false};
    };

    draw(ctx, scale) {
        if (this.state == 'open')   GRAPHICS.getInstance('chests').drawSprite(0, ctx, this.xLoc, this.yLoc, scale, scale);
        else                        GRAPHICS.getInstance('chests').drawSprite(1, ctx, this.xLoc, this.yLoc, scale, scale);
    };
}