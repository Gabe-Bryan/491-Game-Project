/**
 * @author Christopher Henderson
 */
class SpriteSet {
    /** don't use this! Instead use the Animation Manager to build SpriteSet. */
    constructor(the_id) {
        this.id = the_id;
        this.count = 0;
        this.sprites = new Set();
    }

    spriteIngester(spriteSheet, count, sx_s, sy_s, sWidth_s, sHeight_s, x_ofs, y_ofs) {
        for (let i = 0; i < count; i++)
            addSprite(spriteSheet, sx_s[i], sy_s[i], sWidth_s[i], sHeight_s[i], x_ofs[i], y_ofs[i])
    }

    addSprite(spriteSheet, sx, sy, sWidth, sHeight, x_ofs, y_ofs) {
        this.sprites.add(new Sprite(spriteSheet, sx, sy, sWidth, sHeight, x_ofs, y_ofs));
        this.count++;
    }

    get_id() {return this.id;}
    // set_x_offsets(new_x_offsets) {this.x_offset_s = new_x_offsets;}

    clone(clones_id) {
        return new SpriteSet(
            clones_id, this.spriteSheet,
            this.sx_s, this.sy_s, 
            this.sWidth_s, this.sHeight_s,
            this.x_ofs, this.y_ofs
        );
    }
    
    /** Horizontally mirrors (flip over x-axis) all the sprites in this set. */
    mirrorSet_Horz() {this.sprites.forEach(sprite => sprite.mirrorImg(true, false));}

    /** Vertically mirrors (flip over y-axis) all the sprites in this set. */
    mirrorSet_Vert() {this.sprites.forEach(sprite => sprite.mirrorImg(false, true));}

    /** Horizontally & Vertically mirrors all the sprites in this set. */
    mirrorSet_Both() {this.sprites.forEach(sprite => sprite.mirrorImg(true, true));}

    getSpriteCount() {return this.count;}

    getSpriteSet() {return this.sprites};

    getSpriteDimensions(sKey) {
        return [this.sprites[sKey].sWidth, this.sprites[sKey].sHeight];
    }

    drawSprite(ctx, sKey, dx, dy, xScale = 1, yScale = xScale) {
        if (sKey >= this.count) return;
        this.sprites[sKey].draw(ctx, dx, dy, xScale, yScale);

        if (DEBUG_ANIMA >= 1) {
            ctx.lineWidth = 1;
            ctx.fillStyle = "rgba(100, 220, 255, 1)";
            ctx.strokeStyle = "rgba(50, 255, 50, 0.8)";
            ctx.font = '9px monospace';

            ctx.strokeRect(dx, dy, dWidth, dHeight);
            ctx.fillText('s:' + sKey, dx + 2, dy - 5); // sprite number
            ctx.fillText('x:' + Math.floor(dx), dx + 2, dy - 25); // x orig-cord
            ctx.fillText('y:' + Math.floor(dy), dx + 2, dy - 15); // y orig-cord
            ctx.fillText('w:' + dWidth, dx + (dWidth / 2) - 12, dy + dHeight + 15); // width of sprite
            ctx.fillText('h:' + dHeight, dx + dWidth + 5, dy + (dHeight / 2) + 5);  // height of sprite
        }
    }

};