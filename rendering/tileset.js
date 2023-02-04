/**
 * @author Christopher Henderson
 */
class TileSet {
    constructor() {
        this.tiles = new Map(); // <string, Tile>
        this.tileCount = 0;
    }

    // addTileSet(id, sprites) {
    //     if (sprites === undefined) this.tileSets.set(id, new TileSet(id))
    //     if (sprites instanceof SpriteSet) {

    //     }
    // }


    // addSpriteSet(spriteSet, labels) {
    //     this.count = labels.length();
    //     for (let i = 0; i < this.count; i++)
    //         this.tiles.set(labels[i], sprites[i])
    // }
}

class Tile {
    constructor(tile_id, ...sprites) {
        this.id = tile_id
        this.layers = new Map(); // <string: label, object: Sprite>
    }
}