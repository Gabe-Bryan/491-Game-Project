/**
 * @author Christopher Henderson
 */

/*
class TileSet {
    constructor(the_id) {
        this.id = the_id
        this.tilesLibrary = new Map();  // <string, Tile>
        this.spriteLibrary = new Map(); // <label, Sprite>
        this.tileCount = 0;
    }

    getTile(id) {return this.tilesLibrary.get(id);}
    getSprite(label) {return this.spriteLibrary.get(label);}
    printSpriteLib() {this.spriteLibrary.forEach((label, sprite) => console.log(`label: ${label}, sprite: ${sprite}`));}

    addSpriteSet(spriteSet, labels) {
        let theSprites = spriteSet.getSprites();
        for (let i = 0; i < spriteSet.getCount(); i++)
            this.spriteLibrary.set (
                labels === undefined ? (theSprites[i].label === undefined ? i.toString() : theSprites[i].label) :  labels[i],
                    theSprites[i]  );
    }

    makeEasyTileSet(spriteSet) {
        let theSprites = spriteSet.getSprites();
        for (let i = 0; i < spriteSet.getCount(); i++) {
            let label = theSprites[i].label;
            this.spriteLibrary.set(label, theSprites[i]);
            this.addTile(label, label)
        }
    }

    addManyTiles(sprites, ids) {
        if (ids instanceof Array && ids.length != sprites.length)
            throw new Error(`'id' and 'sprites' arrays must have equal lengths! sprites: ${sprites}  ids: ${ids}`);
        // else
        for (let i = 0; i < ids.length; i++) {
            let id = ids instanceof Array ? id[i] : sprites[i].label;
            this.addTile(id, sprites[i]);
        }
    }

    addTile(id, ...spriteLabels) {
        const mcTile = new Tile(id);
        spriteLabels.forEach(sprite => mcTile.addLayer(this.spriteLibrary.get(sprite)));
        this.tilesLibrary.set(is, mcTile);
        return mcTile;
    }

    cloneTile(clone_id, orig_id) {
        const clonedTile = this.getTile(orig_id).clone(clone_id);
        this.set(clone_id, clonedTile);
        return clonedTile;
    }

    removeTile(id) {this.tilesLibrary.delete(id);}
    removeSprite(label) {this.spriteLibrary.delete(label);}
}

*/


class Tile {
    constructor(id, width = TILE_SIZE, height = TILE_SIZE, x_scl = SCALE, y_scl = x_scl, backgroundColor = null) {
        Object.assign(this, {id, width, height, x_scl, y_scl, backgroundColor});
        if (backgroundColor !== null) setBackgroundColor(backgroundColor);
        this.layers = new Array(); // fill with Sprite Objects
    }

    clone(clone_id) {
        return new Tile(clone_id, this.width, this.height, this.x_scl, this.y_scl, this.backgroundColor, [...this.layers]);
    }

    getLayerCount() {return this.layers.length;}

    /** @param {string} color set the background color. Input a string like: "rgba(red, green, blue, alpha)"*/
    setBackgroundColor(color) {
        if (typeof color === "string") this.backgroundColor = color;
        else console.error(`color should be a string such as "rgba(2,1,3,0.2)" NOT ${color}`)
    }

    removeBackgound() {this.backgroundColor = null}
    
    /** Add a single layer sprite to topmost layer or specific layer index, does not overwrite anything. */
    addLayer(Sprite, layer_index = this.layers.length) {this.layers.splice(layer_index, 0, Sprite);}

    /** replace (overwrite) a single layer at a given index with a different sprite. */
    replaceLayer(Sprite, layer_index) {this.layers.splice(layer_index, 1, Sprite);}

    /** remove a single layer at a given index. */
    removeLayer(layer_index) {this.layers.splice(layer_index, 1);}

    /**
     * Fills-in a world map square with this title!
     * @param {*} ctx context to draw to
     * @param {*} row_num the row number in the map grid (0 indexed)
     * @param {*} col_num the column number in the map grid (0 indexed)
     */
    fill(ctx, row_num, col_num) {
        let block = TILE_SIZE * SCALE;
        let dx = col_num * block;
        let dy = row_num * block;
        if (this.backgroundColor !== null) {
            ctx.fillStyle = this.backgroundColor
            ctx.fillRect(dx, dy, block, block);
        }
        this.layers.forEach(sprite => sprite.draw(ctx, dx, dy, SCALE, SCALE))
    }

    /**
     * Good ol'fashin with all the fixins  🤮
     * @param {*} ctx 
     * @param {*} dx 
     * @param {*} dy 
     */
    drawTile(ctx, dx, dy) {
        if (this.backgroundColor !== null) {
            ctx.fillStyle = this.backgroundColor
            ctx.fillRect(dx, dy, this.width * this.x_scl, this.height * this.y_scl);
        }
        this.layers.forEach(sprite => {
            //console.log(this.layers)
            sprite.draw(ctx, dx, dy, this.x_scl, this.y_scl)
        })
    }
}