class SmallChest {
    constructor(_start_pos, _contents, _state="closed") {
        // Object.assign(this, {xLoc, yLoc, contents, state});
        this.xLoc = _start_pos.x;
        this.yLoc = _start_pos.y;
        this.contents = _contents;
        this.state = _state

        this.DEBUG = true;
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: this.xLoc+1*SCALE, y: this.yLoc+1 *SCALE}, height: 14 * SCALE, width: 14 * SCALE};
        this.tag = 'env_interact';
    };

    update() {
    };

    interact() {
        if (this.state != 'closed')
            return;
        this.state = 'open';
        console.log(this.contents);
        this.contents.x += this.collider.width/2 - this.contents.collider.width/2;
        let pos = gameEngine.scene.interact_entities.findIndex((element) => this == element)
        gameEngine.scene.interact_entities.splice(pos, 0, this.contents);
        this.phys2d = {static: true, isSolid: false};
    };

    draw(ctx, scale) {
        if (this.state == 'open')   GRAPHICS.getInstance('chests').drawSprite(0, ctx, this.xLoc, this.yLoc, scale, scale);
        else                        GRAPHICS.getInstance('chests').drawSprite(1, ctx, this.xLoc, this.yLoc, scale, scale);
    };
}