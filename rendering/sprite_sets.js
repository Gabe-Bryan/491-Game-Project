/**
 * @author Christopher Henderson
 */
class SpriteSet {
    /** don't use this! Instead use the Animation Manager to build SpriteSet. */
    constructor(the_id) {
        this.id = the_id;
        this.sprites = new Array();
    }

    get_id() {return this.id;}
    getCount() {return this.sprites.length;}
    getSprites() {return this.sprites};
    getSpriteDim(sKey) {return [this.sprites[sKey].sWidth, this.sprites[sKey].sHeight];}

    addSprite(spriteSheet, sx, sy, sWidth, sHeight, x_ofs, y_ofs, label) {
        this.sprites.push(new Sprite(spriteSheet, sx, sy, sWidth, sHeight, x_ofs, y_ofs, label));
    }

    getSprite_byIndex(index) {return this.sprites[index];}
    getSprite_byLabel(label) {return this.sprites.find(s => s.label === label);}
    gsl(label) {return this.getSprite_byLabel(label);}

    set_x_ofs(new_x_offsets) {
        for (let i = 0; i < new_x_offsets.length; i++){
            this.sprites[i].x_ofs = new_x_offsets[i];
        }
    }

    set_y_ofs(new_y_offsets) {
        for (let i = 0; i < new_y_offsets.length; i++){
            this.sprites[i].y_ofs = new_y_offsets[i];
        }
    }

    clone(clones_id) {
        const clone = new SpriteSet(clones_id);
        clone.sprites = this.spriteSetClone();
        return clone;
    }

    spriteSetClone() {
        const cloneSet = new Array();
        for (let i = 0; i < this.getCount(); i++)
            cloneSet.push(this.sprites[i].clone());
        return cloneSet;
    }
    
    /**
     * Will mirror every sprite in this SpriteSet
     * @param {boolean} horz flip horizontally ?
     * @param {boolean} vert flip vertically ? 
     */
    mirrorSet(horz, vert) {this.sprites.forEach(sprite => sprite.mirrorImg(horz, vert));}

    /** Horizontally mirrors (flip over x-axis) all the sprites in this set. */
    mirrorSet_Horz() {this.sprites.forEach(sprite => sprite.mirrorImg(true, false));}

    /** Vertically mirrors (flip over y-axis) all the sprites in this set. */
    mirrorSet_Vert() {this.sprites.forEach(sprite => sprite.mirrorImg(false, true));}

    /** Horizontally & Vertically mirrors all the sprites in this set. */
    mirrorSet_Both() {this.sprites.forEach(sprite => sprite.mirrorImg(true, true));}

    addDeathFlashes(frameNum = 0) {
        let redF = this.sprites[frameNum].clone();
        let whiteF = this.sprites[frameNum].clone();
        redF.pixelMorph_RGBA(255,null,null,null);
        whiteF.pixelMorph_RGBA(255,255,255,null);
        let i = this.getCount();
        this.sprites[i-1] = redF;
        this.sprites[i] = whiteF;
    }

    colorMod(R, G, B, A) {
        this.sprites.forEach(sprt => sprt.pixelMorph_RGBA(R, G, B, A))
        return this;
    }

    drawSprite(sKey, ctx, dx, dy, xScale, yScale) {
        if (sKey >= this.getCount()) return;
        this.sprites[sKey].draw(ctx, dx, dy, xScale, yScale);

        if(0) this.sprites[sKey].drawDebug(sKey, ctx, dx, dy, xScale, yScale)
    }

    tileSprite(ctx, spriteIndex, dx, dy, numHorzTiles, numVertTiles, xScale = 1, yScale = xScale) {
        const tileS = this.sprites[spriteIndex];
        for (let h = 0; h < numHorzTiles; h++) {
            for (let v = 0; v < numVertTiles; v++) {
                let dx_t = dx + h * tileS.sWidth * xScale;
                let dy_t = dy + v * tileS.sHeight * yScale;
                tileS.draw(ctx, dx_t, dy_t, xScale, yScale);
            }
        }
    }

};