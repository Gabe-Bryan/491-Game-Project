var DEBUG_ANIMA = 0;

/** TODO change NAME to graphics_manager
 * Manages the Animations, and also the sprites
 * @author Christopher Henderson
 */
class GraphicsManager {
    constructor() {
        this.spriteSheets = new Map(); // <string: id, object: Image>
        this.spriteSets =  new Map();  // <string: id, object: SpriteSet>
        this.animations =  new Map();  // <string: id, object: Animation>
        //this.tileSets  =  new Map();   // <string: is, object: TitleSet>
        this.tiles =  new Map();  // <string: id, object: Animation>

        // should work like a look up table, ie get me <name of any valid type object> --> returns that object
        this.library = new Map();  // <string: id, object: valid type>
        // valid types are: SpriteSheet, SpriteSet, Animation, Tile
    }

    /**
     * 
     * @param {string} id 
     * @param {string} type 
     * @param {Object} object SpriteSheet, SpriteSet, Animation, Tile
     */
    add(id, type, object) { 
        switch (type) {
            case 'SpriteSheet' :
                this.spriteSheets.set(id, object);
                this.library.set(id, type);
                break;
            case 'SpriteSet' :
                this.spriteSets.set(id, object);
                this.library.set(id, type);
                break;
            case 'Animation' :
                this.animations.set(id, object);
                this.library.set(id, type);
                break;
            // case 'TileSet' :
            //     this.tileSets.set(id, object);
            //     this.library.set(id, type);
            //     break;
            case 'Tile' :
                this.tiles.set(id, object);
                this.library.set(id, type);
                break;
        }
    }

    /**
     * Get `id` from wherever it may be...
     * @param {string} id 
     */
    get(id) {
        let type = this.library.get(id);
        switch (type) {
            case 'SpriteSheet' :
                return this.spriteSheets.get(id);
            case 'SpriteSet' :
                return this.spriteSets.get(id);
            case 'Animation' :
                return this.animations.get(id);
            // case 'TileSet' :
            //     return this.TileSets.get(id);
            case 'Tile' :
                return this.tiles.get(id);
        }
    }

    // idk how well this works?????
    render(id, keyORtick, ctx, dx, dy, xScale, yScale) {
        let type = this.library.get(id);
        switch (type) {
            case 'SpriteSet' :
                this.spriteSets.get(id).drawSprite(keyORtick, ctx, dx, dy, xScale, yScale);
                break;
            case 'Animation' :
                this.animations.get(id).animate(keyORtick, ctx, dx, dy, xScale, yScale)
                break;
            // case 'TileSet' :
            //     this.TileSets.set(id, object);
            //     break;
        }
    }


    // only lame people still use these old fashioned getters, use the 'get' method to become cool 😎
    /** Retrieves a Sprite Sheet from the Library
     * @param {string} id The unique ID of this Sprite Sheet */
    getSpriteSheet(id) { return this.spriteSheets.get(id); }

    /** Retrieves a Sprite Set from the Library
     * @param {string} id The unique ID of this Sprite Set */
    getSpriteSet(id) { return this.spriteSets.get(id); }

    /** Retrieves a Animation from the Library
     * @param {string} id The unique ID of this Animation */
    getAnimation(id) { return this.animations.get(id); }

    // /** Retrieves a TileSet from the Library
    //  * @param {string} id The unique ID of this TileSet */
    // getTileSet(id) { return this.TileSets.get(id); }

    /** Retrieves a Tile from the Library
     * @param {string} id The unique ID of this TileSet */
    getTiles(id) { return this.Tiles.get(id); }

    /**
     * Adds a Sprite Sheet to the Library
     * @param {string} id 
     * @param {string} spriteSheet
     * @returns the new SpriteSheet
     */
    addSpriteSheet(id, spriteSheet) {
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`)
        if (spriteSheet instanceof Image) {
            this.add(id, 'SpriteSheet', spriteSheet);
            return this.getSpriteSheet(id);
        } else throw new Error(`spriteSheet must be an Image, not this: ${spriteSheet}`)
    }

    /** Validates input, makes new SpriteSet if `id` doesn't already exist, else returns the set named `id`*/
    spriteSetSetup(id, spriteSheet) {
        if (typeof id !== 'string')
            throw new Error(`id must be a string, not this: ${id}`);

        if ((typeof spriteSheet === 'string') && (this.spriteSheets.has(spriteSheet)))
            spriteSheet = this.spriteSheets.get(spriteSheet);

        if (!(spriteSheet instanceof Image))
            throw new Error(`spriteSheet must be the id of a SpriteSheet object OR an Image, not this: ${spriteSheet}`);

        return (this.spriteSets.has(id))? this.spriteSets.get(id) : this.addEmptySpriteSet(id);
    }

    /**
     * Adds an empty Sprite Set to the Library.
     * Can also be used to erase an existing Sprite Set by overwriting it!
     * 
     * @param {string} id
     * @returns The empty Sprite Set
     */
    addEmptySpriteSet(id) {
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`)
        if (this.spriteSets.has(id)) console.log(`Sprite Set ${id} has been erased!`);
        const spriteSet = new SpriteSet(id);
        this.add(id, 'SpriteSet', spriteSet);
        return spriteSet
    }

    /**
     * Adds a new Sprite Set to the Library if 'id' doesn't already exist
     * and puts a single Sprite in it that you specify here.
     * 
     * @param {string} id The unique ID of this Sprite Set
     * @param {string | object} spriteSheet Unique ID of Sprite-Sheet or a Sprite Sheet Object
     * @param {number} x_orig X origin coordinate of the Sprite
     * @param {number} y_orig Y origin coordinate of the Sprite
     * @param {number} width Width of the Sprite
     * @param {number} height Height of the Sprite
     * @param {number} x_ofs X offset: alters X origin coordinate when Sprite is drawn
     * @param {number} y_ofs Y offset: alters Y origin coordinate when Sprite is drawn
     * @param {string} label OPTIONAL! label for the sprite, only helpful if using for tiles
     * @returns The Sprite Set
     */
    addSpriteSingle(id, spriteSheet, x_orig, y_orig, width, height, x_ofs = 0, y_ofs = 0, label) {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSheet = this.spriteSheets.get(spriteSheet);
        spriteSet.addSprite(spriteSheet, x_orig, y_orig, width, height, x_ofs, y_ofs, label);
        return spriteSet;
    }

    /**
     * Build a SpriteSet from a regular, or at least semi-regular, grid of sprites!
     * 
     * @param {string} id Unique ID of this Sprite Set
     * @param {string | Image} spriteSheet Unique ID of Sprite-Sheet or a Sprite Sheet Object
     * 
     * @param {number} row_count Number of rows
     * @param {number} col_count Number of column
     * 
     * @param {number} x_orig X origin coordinate of the Sprite
     * @param {number} y_orig Y origin coordinate of the Sprite
     * 
     * @param {number | number[]} widths Widths of sprites in each column
     * @param {number | number[]} heights Heights of sprites in each row
     * 
     * @param {number | number[]} row_gaps Empty spaces between the entire rows themselves
     * @param {number | number[]} col_gaps Empty spaces between the entire columns themselves 
     * 
     * ↓ X & Y offsets alter the (X,Y) origin coordinate when a sprite is drawn ↓
     * @param {number[]| number[][]} x_ofs 2D array[row][col] of every Sprites X offset <OR>
     *                                     1D array[col] every X offset in the 1 row or column
     * 
     * @param {number[]| number[][]} y_ofs 2D array[row][col] of every Sprites Y offset <OR>
     *                                     1D array[col] every Y offset in the 1 row or column
     * 
     * @param {number[]| number[][]} labels 2D array[row][col] of every Sprite label <OR>
     *                                      1D array[col] every label in the one row or one column
     * 
     * @returns The Sprite Set
     */
    addSpriteGrid( id, spriteSheet, row_count, col_count, x_orig, y_orig, widths, heights,
                   row_gaps, col_gaps, x_ofs, y_ofs, labels) {

        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSheet = this.spriteSheets.get(spriteSheet);
        let nf = [false,false,false,false] // number flags for [widths, heights, col_gaps, row_gaps]: true = is a number, false = is an Array
        if (typeof heights  === 'number') nf[0] = true;
        if (typeof widths   === 'number') nf[1] = true;
        if (typeof col_gaps === 'number') nf[2] = true;
        if (typeof row_gaps === 'number') nf[3] = true;

        // there is 1 less gap than the number of sprites in each row / column
        // so we need to add an extra 0 to end of the user's inputted array
        if (!nf[2]) col_gaps.push(0)
        if (!nf[3]) row_gaps.push(0)

        //        [x  1D,  x 2D]  [y  1D,  y 2D]  [ L 1D,  L 2D]
        let af = [[false, false], [false, false], [false, false]] // is array flags 
        if (x_ofs instanceof Array) {
            af[0][0] = true;
            if (x_ofs[0] instanceof Array) af[0][1] = true;
        }
        if (y_ofs instanceof Array) {
            af[1][0] = true;
            if (y_ofs[0] instanceof Array) af[1][1] = true;
        }
        if (labels instanceof Array) {
            af[2][0] = true;
            if (labels[0] instanceof Array) af[2][1] = true;
        }

        // getting all set up
        let monoRow = row_count === 1;
        let monoCol = col_count === 1;
        let _x_orig = x_orig; let _y_orig = y_orig;

        for (let row = 0; row < row_count; row++) {
            for (let col = 0; col < col_count; col++) {
                // determine the width and hight, depends on input type
                let _width  = nf[0] ? widths  : widths[col];
                let _height = nf[1] ? heights : heights[row];

                // determine the X offset and Y offset, depends on if using 2D or 1D arrays and the offsets mode
                let _x_ofs  = af[0][0] ? (af[0][1] ?  x_ofs[row][col] : (monoRow ? x_ofs[col]  : x_ofs[row])) : 0;
                let _y_ofs  = af[1][0] ? (af[1][1] ?  y_ofs[row][col] : (monoRow ? y_ofs[col]  : y_ofs[row])) : 0;
                let _label  = af[2][0] ? (af[2][1] ? labels[row][col] : (monoRow ? labels[col] : labels[row])) : undefined;

                // add that sprite directly to the Set
                spriteSet.addSprite(spriteSheet, _x_orig, _y_orig, _width, _height, _x_ofs, _y_ofs, _label);

                // calculate the x-origin point for next sprite in this row
                _x_orig += _width + (nf[2] ? col_gaps : col_gaps[col]);
            }
            // move down to the next row, same idea as above ↑
            _y_orig += (nf[1] ? heights : heights[row]) + (nf[3] ? row_gaps : row_gaps[col]);
        }

        return spriteSet;
    }

    /**
     * Build a SpriteSet from a regular, or at least semi-regular, row of sprites!
     * 
     * @param {string} id Unique ID of this Sprite Set
     * @param {string | Image} spriteSheet Unique ID of Sprite-Sheet or a Sprite Sheet Object
     * @param {number} sprite_count Number of sprites in the row
     * 
     * @param {number} x_orig X origin coordinate of the Sprite
     * @param {number} y_orig Y origin coordinate of the Sprite
     * 
     * @param {number | number[]} widths Widths of the Sprites
     * @param {number | number[]} heights Heights of the Sprites
     * @param {number | number[]} gaps Empty spaces between Sprites
     * 
     * @param {number[]} x_ofs X offset: alters X origin coordinate when Sprite is drawn
     * @param {number[]} y_ofs Y offset: alters Y origin coordinate when Sprite is drawn
     * @param {string[]} labels OPTIONAL! labels for each sprite, only helpful if using for tiles
     * 
     * @returns The Sprite Set
     */
    addSpriteRow(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs, labels) {
        return this.addSpriteGrid (
            id, spriteSheet,
            1, sprite_count,  // row_count, col_count
            x_orig, y_orig,   // x_orig, y_orig
            widths, heights,  // widths, heights
            0, gaps,          // row_gaps, col_gaps
            x_ofs, y_ofs,     // x_ofs, y_ofs
            labels
        );
    }
    
    /**
     * Build a SpriteSet from a regular, or at least semi-regular, column of sprites!
     * 
     * @param {string} id Unique ID of this Sprite Set
     * @param {string | Image} spriteSheet Unique ID of Sprite-Sheet or a Sprite Sheet Object
     * @param {number} sprite_count Number of sprites in the row
     * 
     * @param {number} x_orig X origin coordinate of the Sprite
     * @param {number} y_orig Y origin coordinate of the Sprite
     * 
     * @param {number | number[]} widths Widths of the Sprites
     * @param {number | number[]} heights Heights of the Sprites
     * @param {number | number[]} gaps Empty spaces between Sprites
     * 
     * @param {number[]} x_ofs X offset: alters X origin coordinate when Sprite is drawn
     * @param {number[]} y_ofs Y offset: alters Y origin coordinate when Sprite is drawn
     * @param {string[]} labels OPTIONAL! labels for each sprite, only helpful if using for tiles
     * 
     * @returns The Sprite Set
     */
    addSpriteColumn(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs, labels) {
        return this.addSpriteGrid (
            id, spriteSheet,
            sprite_count, 1,  // row_count, col_count
            x_orig, y_orig,   // x_orig, y_orig
            widths, heights,  // widths, heights
            gaps, 0,          // row_gaps, col_gaps
            x_ofs, y_ofs,     // x_ofs, y_ofs
            labels
        );
    }

    /**
     * Build a SpriteSet from any rectangle on the sprite sheet
     * 
     * @param {string} id Unique ID of this Sprite Set
     * @param {string | Image} spriteSheet Unique ID of Sprite-Sheet or a Sprite Sheet Object
     * @param {number} x_orig X origin coordinate of Sprites
     * @param {number} y_orig Y origin coordinate of Sprites
     * @param {number | number[]} widths Width of Sprites
     * @param {number | number[]} heights Height of Sprites
     * @param {number[]} x_ofs X offset: alters X origin coordinate when Sprite is drawn
     * @param {number[]} y_ofs Y offset: alters Y origin coordinate when Sprite is drawn
     * @param {string[]} labels OPTIONAL! labels for each sprite, only helpful if using for tiles
     * 
     * @returns The Sprite Set
     */
    addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs = 0, y_ofs = 0, labels) {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSheet = this.spriteSheets.get(spriteSheet);

        // number flags for [x_origs, y_origs, widths, heights]: true = is a number, false = is an Array (we assume if not number then Array)
        let nf = [false,false,false,false] 
        if (typeof x_origs === 'number') nf[0] = true;
        if (typeof y_origs === 'number') nf[1] = true;
        if (typeof widths  === 'number') nf[2] = true;
        if (typeof heights === 'number') nf[3] = true;

        let ofs = [false, false, false] // see if we have offsets / labels 
        if (x_ofs  instanceof Array) ofs[0] = true;
        if (y_ofs  instanceof Array) ofs[1] = true;
        if (labels instanceof Array) ofs[2] = true;

        // determines the number of sprites being added, good luck reading it lolz
        let count = nf[0] ? (nf[1] ? (nf[2] ? (nf[3] ? 1 : heights.length) : widths.length) : y_origs.length) : x_origs.length;

        for (let i = 0; i < count; i++) {
            let _x_orig = nf[0] ? x_origs : x_origs[i];
            let _y_orig = nf[1] ? y_origs : y_origs[i];
            let _width  = nf[2] ? widths  : widths[i];
            let _height = nf[3] ? heights : heights[i];
            // offsets & label now if defined
            let _x_ofs = ofs[0] ? x_ofs[i] : 0;
            let _y_ofs = ofs[1] ? y_ofs[i] : 0;
            let _label = ofs[2] ? labels[i] : undefined;

            spriteSet.addSprite(spriteSheet, _x_orig, _y_orig, _width, _height, _x_ofs, _y_ofs, _label);
        }

        return spriteSet
    }

    /**
     * Adds a new Animation to the library if animations 
     * 
     * @param {string | Animation} id The unique ID of this Animation, or a pre-built Animation object
     * @param {string} spriteSetName Unique ID of SpriteSet this Animation uses
     * @param {number[]} fSequence In-order list of sprites in animation 
     * @param {number[] | number} fTiming In-order list of frame durations (milliseconds) pass one number for all same timing
     * @param {number} x_offset Optional, default 0 | set offset of x-position when drawing animation
     * @param {*} y_offset Optional, default 0 | set offset of y-position when drawing animation
     * @returns This new Animation
     */
    addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0) {
        if (typeof fSequence === 'number') {
            let count = fSequence;
            fSequence = Array(count);
            for (let i = 0; i < count; i++) fSequence[i] = i;
        }
        if (typeof fTiming === 'number') fTiming = Array(fSequence.length).fill(fTiming);

        if (fSequence.length !== fTiming.length) {
            // Willy-Wonka-Wack-Attack: GOOD DAY SIR!
            throw new Error(`fSequence.length = ${fSequence.length} but fTiming.length = ${fTiming.length} ... GOOD DAY SIR!`);
        }
        if (this.animations.has(id)) {
            console.log(`addAnimation: animations.${id} has been overridden!`);
        }

        const setObj = this.spriteSets.get(spriteSetName); // Animation class constructor wants the SpriteSet object
        const theNewAnimation = new Animation(id, setObj, fSequence, fTiming, x_offset, y_offset);
        this.add(id, 'Animation', theNewAnimation)
        return theNewAnimation;
    }

    // /**
    //  *  make A tile set
    //  * @param {string} id The unique ID of this TileSet
    //  * @param {SpriteSet} spriteSet OPTIONAL! you can maybe skip a step by building with a SpriteSet
    //  * @returns The new TileSet
    //  */
    // addTileSet(id, spriteSet = null) {
    //     const tileSet = new TileSet(id);
    //     this.add(id, 'TileSet', tileSet);
    //     if (spriteSet instanceof SpriteSet) tileSet.addSpriteSet(spriteSet);
    //     return tileSet;
    // }

    /**
     * Make a tile with given sprites.
     * @param {string} id 
     * @param  {...Sprite} sprites 
     */
    addTile(id, ...sprites) {
        const theTile = new Tile(id);
        sprites.forEach(sprite => theTile.addLayer(sprite));
        this.add(id, 'Tile', theTile);
        //console.log(theTile)
        return theTile;
    }

    /**
     * Clones a SpriteSet and puts the clone into the spriteSets map.
     * DOES NOT clone any modifications to the sprites in the Set, ie the array of Sprite objects
     * @param {string} clone_id
     * @param {string} orig_id 
     * @returns SpriteSet clone
     */
    cloneSpriteSet(clone_id, orig_id) {
        const clonedSpriteSet = this.getSpriteSet(orig_id).clone(clone_id);
        this.add(clone_id, 'SpriteSet', clonedSpriteSet);
        return clonedSpriteSet;
    }

    /**
     * Clones an Animation and puts the clone into the animations map.
     * DOES NOT clone any modifications to the Animation after it first declared
     * @param {string} clone_id 
     * @param {string} orig_id
     * @returns Animation clone 
     */
    cloneAnimation(clone_id, orig_id, clone_x_offset, clone_y_offset) {
        const clonedAnimation = this.getAnimation(orig_id).clone(clone_id, clone_x_offset, clone_y_offset);
        this.add(clone_id, 'Animation', clonedAnimation);
        return clonedAnimation;
    }

}



////// U T I L I T I E S  ///////


function validInput(inputs, types) {
    // check that all the element of types are strings
    // types.forEach(t => {if(!(typeof t === 'string')) throw new Error(`${t} is not a valid type!`)});
    if (!(types.every(s => typeof s === 'string'))) throw new Error(`${t} is not a valid type!`);
    let valid = Array(inputs.length).fill(false)
    for (let i = 0; i < inputs.length; i++) {
        types.forEach(function (type) {
            if (capitol(type)) { // if first letter is uppercase ie an Object
                if (inputs[i] instanceof type) valid[i] = true;
            } else {
                if (typeof inputs[i] === type) valid[i] = true; // else it a primitive
            }
        })
    }

    for (let i = 0; i < inputs.length; i++) {
        if (!valid[i]) console.log(`Inputs[${i}] is of type: ${typeof inputs[i] === 'object' ? inputs[i].constructor.name : typeof inputs[i]}, which is not a valid type.\nValid types are: ${types}`)
    }
}
// let var1 = 5; let var2 = "Timmy"; let var3 = [1];
// validInput([var1, var2, var3], ['number', 'string']);



function capitol(str) {
    return (str.charAt(0) <= 90 && str.charAt(0) >= 65);
}
