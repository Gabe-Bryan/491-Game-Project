/**
 * @author Christopher Henderson
 */
class SpriteSet {
    /** don't use this! Instead use the Animation Manager to build SpriteSet. */
    constructor(the_id) {
        this.id = the_id;
        this.count = 0;
        this.sprites = new Array();
    }

    get_id() {return this.id;}
    getCount() {return this.count;}
    getSprites() {return this.sprites};
    getSpriteDim(sKey) {return [this.sprites[sKey].sWidth, this.sprites[sKey].sHeight];}

    // spriteIngester(spriteSheet, count, sx_s, sy_s, sWidth_s, sHeight_s, x_ofs, y_ofs) {
    //     for (let i = 0; i < count; i++)
    //         addSprite(spriteSheet, sx_s[i], sy_s[i], sWidth_s[i], sHeight_s[i], x_ofs[i], y_ofs[i])
    // }

    addSprite(spriteSheet, sx, sy, sWidth, sHeight, x_ofs, y_ofs, label) {
        this.sprites.push(new Sprite(spriteSheet, sx, sy, sWidth, sHeight, x_ofs, y_ofs, label));
        this.count++;
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
        clone.count = this.count;
        clone.sprites = this.spriteSetClone();
        return clone;
    }

    spriteSetClone() {
        const cloneSet = new Array();
        for (let i = 0; i < this.count; i++)
            cloneSet.push(this.sprites[i].clone());
        return cloneSet;
    }
    
    /** Horizontally mirrors (flip over x-axis) all the sprites in this set. */
    mirrorSet_Horz() {this.sprites.forEach(sprite => sprite.mirrorImg(true, false));}

    /** Vertically mirrors (flip over y-axis) all the sprites in this set. */
    mirrorSet_Vert() {this.sprites.forEach(sprite => sprite.mirrorImg(false, true));}

    /** Horizontally & Vertically mirrors all the sprites in this set. */
    mirrorSet_Both() {this.sprites.forEach(sprite => sprite.mirrorImg(true, true));}

    drawSprite(sKey, ctx, dx, dy, xScale, yScale) {
        if (sKey >= this.count) return;
        this.sprites[sKey].draw(ctx, dx, dy, xScale, yScale);

        if(0) this.sprites[sKey].drawDebug(sKey, ctx, dx, dy, xScale, yScale)
    }

};