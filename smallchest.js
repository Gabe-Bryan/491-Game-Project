class SmallChest {
    constructor(xLoc, yLoc, contents, state="closed") {
        Object.assign(this, {xLoc, yLoc, contents, state});
        this.DEBUG = false;
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: xLoc, y: yLoc}, height: 16 * SCALE, width: 16 * SCALE};
        this.tag = 'environment';
    };

    update() {

        if (gameEngine.keys['o']) this.state = 'open';
    };

    interact() {
        if (this.state != 'closed')
            return;
        this.state = 'open';
        return this.contents;
    };

    draw(ctx, scale) {
        if (this.state == 'open')   GRAPHICS.getInstance('chests').drawSprite(0, ctx, this.xLoc, this.yLoc, scale, scale);
        else                        GRAPHICS.getInstance('chests').drawSprite(1, ctx, this.xLoc, this.yLoc, scale, scale);
    };
}