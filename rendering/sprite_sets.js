/**
 * @author Christopher Henderson
 */
class SpriteSet {
    /** don't use this! Instead use the Animation Manager to build SpriteSet. */
    constructor(id, spriteSheet, sx_s, sy_s, sWidth_s, sHeight_s, x_offset_s, y_offset_s) {
        Object.assign(this, {id, spriteSheet, sx_s, sy_s, sWidth_s, sHeight_s, x_offset_s, y_offset_s});
        this.count = sx_s.length;

        // building and filling the array of Sprite obj
        this.sprites = Array(this.count);
        for (let i = 0; i < this.count; i++)
            this.sprites[i] = new Sprite(spriteSheet, this.sx_s[i], this.sy_s[i], this.sWidth_s[i], this.sHeight_s[i])
    }

    get_id() {return this.id;}
    set_x_offsets(new_x_offsets) {this.x_offset_s = new_x_offsets;}

    clone(clones_id) {
        return new SpriteSet(
            clones_id, this.spriteSheet,
            this.sx_s, this.sy_s, 
            this.sWidth_s, this.sHeight_s,
            this.x_offset_s, this.y_offset_s
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

    getSpriteDimensions(spriteKey) {
        return [this.sprites[sKey].sWidth, this.sprites[sKey].sHeight];
    }

    drawSprite(ctx, sKey, dx, dy, xScale = 1, yScale = xScale) {
        if (sKey >= this.count) return;

        let dWidth = this.sprites[sKey].sWidth * xScale;
        let dHeight = this.sprites[sKey].sHeight * yScale;

        dx += this.x_offset_s[sKey] * xScale;
        dy += this.y_offset_s[sKey] * yScale;

        // ctx.drawImage(this.spriteSet[sKey], 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
        this.sprites[sKey].draw(ctx, dx, dy, dWidth, dHeight);

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

    /* Not used for this project
    tileSprite(ctx, spriteIndex, dx, dy, numHorzTiles, numVertTiles, xScale = 1, yScale = xScale) {
        if (spriteIndex instanceof Array) {
            let sWidth = this.sWidth_s[spriteIndex[0]];
            let sHeight = this.sHeight_s[spriteIndex[0]];

            for (let h = 0; h < numHorzTiles; h++) {
                for (let v = 0; v < numVertTiles; v++) {
                    let dx_t = dx + h * sWidth * xScale;
                    let dy_t = dy + v * sHeight * yScale;
                    this.drawSprite(ctx, spriteIndex[v, h], dx_t, dy_t, xScale, yScale);
                }
            }
        } else {
            let sWidth = this.sWidth_s[spriteIndex];
            let sHeight = this.sHeight_s[spriteIndex];

            for (let h = 0; h < numHorzTiles; h++) {
                for (let v = 0; v < numVertTiles; v++) {
                    let dx_t = dx + h * sWidth * xScale;
                    let dy_t = dy + v * sHeight * yScale;
                    this.drawSprite(ctx, spriteIndex, dx_t, dy_t, xScale, yScale);
                }
            }
        }
    } */
};