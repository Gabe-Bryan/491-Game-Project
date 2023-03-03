/**
 * @author Christopher Henderson
 */
class SpriteSet {

    static SPRITE_SET_COUNT = 0;
    
    /** don't use this! Instead use the Animation Manager to build SpriteSet. */
    constructor(the_id) {
        this.id = the_id;
        this.sprites = new Array();
        SpriteSet.SPRITE_SET_COUNT++
        // console.log(`Sprite Set Count = ${SpriteSet.SPRITE_SET_COUNT}`);
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
        let array = new_x_offsets instanceof Array ? true : false;
        for (let i = 0; i < this.getCount(); i++)
            this.sprites[i].x_ofs = array ? new_x_offsets[i] : new_x_offsets;
    }

    set_y_ofs(new_y_offsets) {
        let array = new_y_offsets instanceof Array ? true : false;
        for (let i = 0; i < this.getCount(); i++)
            this.sprites[i].y_ofs = array ? new_y_offsets[i] : new_y_offsets;
    }

    clone(clones_id) {
        const clone = new SpriteSet(clones_id);
        clone.sprites = this.spriteSetClone();
        return clone;
    }

    spriteSetClone() {
        const clone_SpriteSet = new Array();
        for (let i = 0; i < this.getCount(); i++)
            clone_SpriteSet.push(this.sprites[i].clone());
        return clone_SpriteSet;
    }

    instanceClone() {
        const instanceClone_SpriteSet = new SpriteSet(this.id);
        instanceClone_SpriteSet.sprites = this.sprites;
        return instanceClone_SpriteSet
    }
    
    cloneAndAppendSprite(frameNum, quant = 1) {
        while (quant > 0) {
            let sprite_clone = this.sprites[frameNum].clone();
            this.sprites.push(sprite_clone);
            quant--;
        }
    }

    /**
     * Will mirror every sprite in this SpriteSet
     * @param {boolean} horz flip horizontally ?
     * @param {boolean} vert flip vertically ? 
     */
    mirrorSet(horz, vert) {this.sprites.forEach(sprite => sprite.mirrorImg(horz, vert));}

    // /** Horizontally mirrors (flip over x-axis) all the sprites in this set. */
    // mirrorSet_Horz() {this.sprites.forEach(sprite => sprite.mirrorImg(true, false));}

    // /** Vertically mirrors (flip over y-axis) all the sprites in this set. */
    // mirrorSet_Vert() {this.sprites.forEach(sprite => sprite.mirrorImg(false, true));}

    // /** Horizontally & Vertically mirrors all the sprites in this set. */
    // mirrorSet_Both() {this.sprites.forEach(sprite => sprite.mirrorImg(true, true));}

    colorMod(R, G, B, A) {
        this.sprites.forEach(sprt => sprt.pixelMorph_RGBA(R, G, B, A))
        return this;
    }

    append_colorMod(frameNum, R, G, B, A) {
        sprite_clone = this.sprites[frameNum].clone();
        sprite_clone.pixelMorph_RGBA(R, G, B, A);
        this.sprites.push(sprite_clone);
        return this;
    }

    drawSprite(sKey, ctx, dx, dy, xScale = 1, yScale = xScale) {
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

    projectileBuilder(origDir) { // 0 → north  |  1 → east  |  2 → south  |  3 → west
        this.cloneAndAppendSprite(0, 3);

        if (origDir == 0) {
            this.sprites[1].rotateImg(1);
            this.sprites[2].rotateImg(2);
            this.sprites[3].rotateImg(3);
        }
        if (origDir == 1) {
            this.sprites[0].rotateImg(3);
            this.sprites[2].rotateImg(1);
            this.sprites[3].rotateImg(2);
        }
        if (origDir == 2) {
            this.sprites[0].rotateImg(2);
            this.sprites[1].rotateImg(3);
            this.sprites[3].rotateImg(1);
        }
        if (origDir == 3) {
            this.sprites[0].rotateImg(1);
            this.sprites[1].rotateImg(2);
            this.sprites[2].rotateImg(3);
        }
    }

};