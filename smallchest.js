class SmallChest {
    constructor(pos, contentsType = null, state="closed") {
        this.xLoc = pos.x;
        this.yLoc = pos.y;
        this.state = state;
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: this.xLoc+1*SCALE, y: this.yLoc+1 *SCALE}, height: 14 * SCALE, width: 14 * SCALE};

        this.contents = false
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

        this.tag = 'env_interact';
        this.DEBUG = false;

    };

    update() {
    };

    interact() {
        if (this.state != 'closed')
            return;
        this.state = 'open';
        console.log(this.contents);
        if (this.contents){
            // this.contents.x += this.collider.width/2 - this.contents.collider.width/2;
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