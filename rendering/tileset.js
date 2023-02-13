/**
 * @author Christopher Henderson
 */
class TileSet {
    constructor(the_id) {
        this.id = the_id
        this.tiles = new Map();  // <string, Tile>
        this.spriteLibrary = new Map(); // <label, Sprite>
        this.tileCount = 0;
    }

    getTile(id) {return this.tiles.get(id);}

    addSpriteSet(spriteSet, labels) {
        let theSprites = spriteSet.getSprites();
        for (let i = 0; i < spriteSet.getCount(); i++)
            this.spriteLibrary.set
            (
                labels === undefined ? (theSprites[i].label === undefined ? i.toString() : theSprites[i].label) :  labels[i],
                theSprites[i]
            );
    }

    addTile(id, ...sprites) {
        const mcTile = new Tile(id);
        sprites.forEach(sprite => mcTile.addLayer(this.spriteLibrary.get(sprite)));
    }
}

class Tile {
    constructor(id, width = TILE_SIZE, height =TILE_SIZE, x_scl = SCALE, y_scl = x_scl, backgroundColor = null) {
        Object.assign(this, {id, width, height, x_scl, y_scl, backgroundColor});
        if (backgroundColor !== null) setBackgroundColor(backgroundColor);
        this.layers = new Array(); // fill with Sprite Objects
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

    drawTile(ctx, dx, dy) {
        if (this.backgroundColor !== null) {
            ctx.fillStyle = this.backgroundColor
            ctx.fillRect(dx, dy, this.width, this.height);
        }
        this.layers.forEach(sprite => sprite.draw(ctx, dx, dy, this.x_scl, this.y_scl))
    }
}