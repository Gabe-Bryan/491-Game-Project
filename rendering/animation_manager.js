var DEBUG_ANIMA = 0;

/** TODO change NAME to Rendex
 * Manages the Animations, and also the sprites
 * @author Christopher Henderson
 */
class AnimationManager {
    constructor() {
        this.spriteSheets = new Map(); // <string: id, object: Image>
        this.spriteSets =  new Map();  // <string: id, object: SpriteSet>
        this.animations =  new Map();  // <string: id, object: Animation>
        this.TileSets  =  new Map();   // <string: is, object: TitleSet>

        // should work like a look up table, ie get me <name of any valid type object> --> returns that object
        this.library = new Map();  // <string: id, object: valid type>   ~> valid types are: SpriteSheet, SpriteSet, Animation, TileSet
    }

    /** Retrieves a Sprite Sheet from the Library
     * @param {string} id The unique ID of this Sprite Sheet */
    getSpriteSheet(id) { return this.spriteSheets.get(id); }

    /** Retrieves a Sprite Set from the Library
     * @param {string} id The unique ID of this Sprite Set */
    getSpriteSet(id) { return this.spriteSets.get(id); }

    /** Retrieves a Animation from the Library
     * @param {string} id The unique ID of this Animation */
    getAnimation(id) { return this.animations.get(id); }

    /**
     * Adds a Sprite Sheet to the Library
     * @param {string} id 
     * @param {string} spriteSheet
     * @returns the new SpriteSheet
     */
    addSpriteSheet(id, spriteSheet) {
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`)
        if (spriteSheet instanceof Image) {
            this.spriteSheets.set(id, spriteSheet);
            return this.getSpriteSheet(id);
        } else throw new Error(`spriteSheet must be an Image, not this: ${spriteSheet}`)
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
        this.spriteSets.set(id, spriteSet);
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
     * @returns The Sprite Set
     */
    addSpriteSingle(id, spriteSheet, x_orig, y_orig, width, height, x_ofs = 0, y_ofs = 0) {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSheet = this.spriteSheets.get(spriteSheet);
        spriteSet.addSprite(spriteSheet, x_orig, y_orig, width, height, x_ofs, y_ofs)
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
     *                                     1D array[col] every row or column has same X offset depending on ofs_mode
     * @param {number[]| number[][]} y_ofs 2D array[row][col] of every Sprites Y offset <OR>
     *                                     1D array[col] every row or column has same Y offset depending on ofs_mode
     * 
     * ↓ Only used if x_ofs and/or y_ofs are 1D arrays ↓
     * @param {boolean} x_ofs_m True if every row will have same X offsets, false if columns : defaults to rows
     * @param {boolean} y_ofs_m True if every row will have same Y offsets, false if columns : defaults to x_ofs_m
     * 
     * @returns The Sprite Set
     */
    addSpriteGrid(id, spriteSheet, row_count, col_count, x_orig, y_orig, widths, heights,
                      row_gaps, col_gaps, x_ofs, y_ofs, x_ofs_m = true, y_ofs_m = x_ofs_m  )
    {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSheet = this.spriteSheets.get(spriteSheet);
        let nf = [false,false,false,false] // number flags for [widths, heights, col_gaps, row_gaps]: true = is a number, false = is an Array
        if (typeof heights  === 'number') nf[0] = true;
        if (typeof widths   === 'number') nf[1] = true;
        if (typeof col_gaps === 'number') nf[2] = true;
        if (typeof row_gaps === 'number') nf[3] = true;

        // their is 1 less gap than the number of sprites in each row / column
        // so we need to add an extra 0 to end of the user's inputted array
        if (!nf[2]) col_gaps.push(0)
        if (!nf[3]) row_gaps.push(0)

        //          [x 1D, x 2D]    [y 1D, y 2D]
        let af = [[false, false], [false, false]] // is array flags 
        if (x_ofs instanceof Array) {
            af[0][0] = true;
            if (x_ofs[0] instanceof Array) af[0][1] = true;
        }
        if (y_ofs instanceof Array) {
            af[1][0] = true;
            if (y_ofs[0] instanceof Array) af[1][1] = true;
        }

        

        let _x_orig = x_orig; let _y_orig = y_orig;
        for (let row = 0; row < row_count; row++) {
            for (let col = 0; col < col_count; col++) {
                // determine the width and hight, depends on input type
                let _width  = nf[0] ? widths  : widths[col];
                let _height = nf[1] ? heights : heights[row];

                // determine the X offset and Y offset, depends on if using 2D or 1D arrays and the offsets mode
                let _x_ofs  = af[0][0] ? (af[0][1] ? x_ofs[row][col] : (x_ofs_m ? x_ofs[col] : x_ofs[row])) : 0;
                let _y_ofs  = af[1][0] ? (af[1][1] ? y_ofs[row][col] : (y_ofs_m ? y_ofs[col] : y_ofs[row])) : 0;

                // add that sprite directly to the Set
                spriteSet.addSprite(spriteSheet, _x_orig, _y_orig, _width, _height, _x_ofs, _y_ofs);

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
     * 
     * @returns The Sprite Set
     */
    addSpriteRow(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs) {
        return this.addSpriteGrid (
            id, spriteSheet,
            1, sprite_count,  // row_count, col_count
            x_orig, y_orig,   // x_orig, y_orig
            widths, heights,  // widths, heights
            0, gaps,          // row_gaps, col_gaps
            x_ofs, y_ofs,     // x_ofs, y_ofs
            true, true
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
     * 
     * @returns The Sprite Set
     */
    addSpriteColumn(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs) {
        return this.addSpriteGrid (
            id, spriteSheet,
            sprite_count, 1,  // row_count, col_count
            x_orig, y_orig,   // x_orig, y_orig
            widths, heights,  // widths, heights
            gaps, 0,          // row_gaps, col_gaps
            x_ofs, y_ofs,     // x_ofs, y_ofs
            false, false
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
     * 
     * @returns The Sprite Set
     */
    addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs, y_ofs) {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSheet = this.spriteSheets.get(spriteSheet);

        // number flags for [x_origs, y_origs, widths, heights]: true = is a number, false = is an Array (we assume if not number then Array)
        let nf = [false,false,false,false] 
        if (typeof x_origs === 'number') nf[0] = true;
        if (typeof y_origs === 'number') nf[1] = true;
        if (typeof widths  === 'number') nf[2] = true;
        if (typeof heights === 'number') nf[3] = true;

        let ofs = [false, false] // see if we have offsets
        if (x_ofs instanceof Array) ofs[0] = true;
        if (y_ofs instanceof Array) ofs[1] = true;

        // determines the number of sprites being added, good luck reading it lolz
        let count = nf[0] ? (nf[1] ? (nf[2] ? (nf[3] ? 1 : heights.length) : widths.length) : y_origs.length) : x_origs.length;

        for (let i = 0; i < count; i++) {
            let _x_orig = nf[0] ? x_origs : x_origs[i];
            let _y_orig = nf[1] ? y_origs : y_origs[i];
            let _width  = nf[2] ? widths  : widths[i];
            let _height = nf[3] ? heights : heights[i];
            // offsets now
            let _x_ofs = ofs[0] ? x_ofs[i] : 0;
            let _y_ofs = ofs[1] ? y_ofs[i] : 0;

            spriteSet.addSprite(spriteSheet, _x_orig, _y_orig, _width, _height, _x_ofs, _y_ofs)
        }

        return spriteSet
    }

    

/* ///////////////    G R A V E Y A R D   /////////////////////////////////////////


     * Adds a new Sprite Set to the Library and adds Sprites which all line up in a row,
     * they need to have const width and height!
     * 
     * @param {string} id The unique ID of this Sprite
     * @param {string} spriteSheet Unique ID of SpriteSheet or a SpriteSheet Object
     * @param {number} x_orig the x position of the entire row
     * @param {number} y_orig the y position of the entire row
     * @param {number} width the width of all sprite in row
     * @param {number} height the height of all sprite in the row
     * @param {number} count the number of sprite in the row 
     * @param {number | number[]} gaps the gap between the sprites in the row
     * @param {number[]} x_ofs optional : offsets the sprite's x position when drawn
     * @param {number[]} y_ofs optional : offsets the sprite's y position when drawn
     * @returns the new Sprite Set

    addSpriteRow(id, spriteSheet, x_orig, y_orig, width, height, count, gaps, x_ofs = 0, y_ofs = 0) {
        if (typeof spriteSheet === 'string') spriteSheet = this.spriteSheets.get(spriteSheet); // we need the object

        if (typeof gaps === 'number') gaps = Array(count).fill(gaps);
        else gaps.push(0); // pads a 0 at the end of user array, bc 1 less gap than count

        let xstart = x_orig;
        let x_origs = Array(count);
        for (let i = 0; i < count; i++) {
            x_origs[i] = xstart; xstart += width + gaps[i];
        }
        let y_origs = Array(count).fill(y_orig);
        let widths = Array(count).fill(width);
        let heights = Array(count).fill(height);

        if (typeof x_ofs === 'number')
            x_ofs = Array(count).fill(x_ofs); // x_offsets are all the same

        let y_offsets = Array(count).fill(y_ofs); // y_offsets are all the same 

        if (this.spriteSets.has(id)) console.log(`addSpriteSet: spriteSets.${id} has been overridden!`);
        const theNewSpriteSet = new SpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs, y_offsets);
        this.spriteSets.set(id, theNewSpriteSet);
        return theNewSpriteSet;
    }


     * Add Sprites that all line up in a column, they need to have const width and height
     * 
     * @param {string} id The unique ID of this Sprite
     * @param {string} spriteSheet Unique ID of SpriteSheet or a SpriteSheet Object
     * @param {number} x_orig the x position of the entire column
     * @param {number} y_orig the y position of the entire column
     * @param {number} width the width of all sprite in column
     * @param {number} height the height of all sprite in the column
     * @param {number} count the number of sprite in the column 
     * @param {number | number[]} gaps the gap between the sprites in the column
     * @param {number[]} x_offsets optional : offsets the sprite's x position when drawn
     * @param {number[]} y_offset optional : offsets the sprite's y position when drawn
     * @returns the new SpriteSet

    addSpriteColumn(id, spriteSheet, x_orig, y_orig, width, height, count, gaps, x_offset = 0, y_offsets = 0) {
        if (typeof spriteSheet === 'string') spriteSheet = this.spriteSheets.get(spriteSheet); // we need the object

        if (typeof gaps === 'number') gaps = Array(count).fill(gaps);
        else gaps.push(0); // padds a 0 at the end bc 1 less gap than count

        let ystart = y_orig;
        let y_origs = Array(count);
        
        for (let i = 0; i < count; i++) {
            y_origs[i] = ystart; ystart += height + gaps[i];
        }
        let x_origs = Array(count).fill(x_orig);
        let widths = Array(count).fill(width);
        let heights = Array(count).fill(height);

        if (typeof y_offsets === 'number')
            y_offsets = Array(count).fill(y_offsets); // x_offsets are all the same

        let x_offsets = Array(count).fill(x_offset); // y_offsets are all the same 

        if (this.spriteSets.has(id)) console.log(`addSpriteSet: spriteSets.${id} has been overridden!`);
        const theNewSpriteSet = new SpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_offsets, y_offsets);
        this.spriteSets.set(id, theNewSpriteSet);
        return theNewSpriteSet;
    }


    /
     * Adds a SpriteSet to the collection
     * 
     * @param {string} id The unique ID of this SpriteSet
     * @param {string | object} spriteSheet Unique ID of SpriteSheet or a SpriteSheet Object
     * @param {number[] | number} x_origs List of X-origin's of each sprite or a single shared X-origin
     * @param {number[] | number} x_ends List of X-end cord. of each sprite or a single shared X-end cord
     * @param {number[] | number} y_origs List of Y-origin's of each sprite or a single shared Y-origin
     * @param {number[] | number} y_ends List of Y-end cord. of each sprite or a single shared Y-end cord
     * @param {number[] | number} x_offsets Optional : offsets each sprite's x position when drawn
     * @param {number[] | number} y_offsets Optional : offsets each sprite's y position when drawn
     * @returns the new SpriteSet
     
    addSpriteSet(id, spriteSheet, x_origs, x_ends, y_origs, y_ends, x_offsets = 0, y_offsets = 0) {
        if (typeof spriteSheet === 'string') spriteSheet = this.spriteSheets.get(spriteSheet); // we need the object

        // we need to determine the number of sprites in the set 
        if (x_origs instanceof Array) var sprtCount = x_origs.length;
        else if (y_origs instanceof Array) var sprtCount = y_origs.length;
        else if (widths instanceof Array) var sprtCount = widths.length;
        else if (heights instanceof Array) var sprtCount = heights.length;
        else var sprtCount = 1;

        let widths = [];
        let heights = [];

        if (typeof x_origs === 'number') x_origs = Array(sprtCount).fill(x_origs); // X origins are all the same
        if (typeof y_origs === 'number') y_origs = Array(sprtCount).fill(y_origs); // y origins are all the same

        if (typeof x_ends === 'number') { // widths are all the same
            x_ends = Array(sprtCount).fill(x_ends);
        }
        if (typeof x_ends === 'object') { // calculate widths
            for (let i = 0; i < sprtCount; i++)
                widths.push(x_ends[i] - x_origs[i]);
        }

        if (typeof y_ends === 'number') { // heights are all the same
            y_ends = Array(sprtCount).fill(y_ends);
        }
        if (typeof y_ends === 'object') { // calculate heights
            for (let i = 0; i < sprtCount; i++)
                heights.push(y_ends[i] - y_origs[i]);
        }

        if (typeof x_offsets === 'number') x_offsets = Array(sprtCount).fill(x_offsets); // x_offsets are all the same
        if (typeof y_offsets === 'number') y_offsets = Array(sprtCount).fill(y_offsets); // y_offsets are all the same 

        if (!(x_origs.length === y_origs.length && y_origs.length === widths.length &&
            widths.length === heights.length && heights.length === x_offsets.length &&
            x_offsets.length === y_offsets.length)) { // they should all be the same length

            throw new Error(`The lengths of the addSpriteSetMax() parameter arrays are not
                            all the same, the lengths of each are:\n
                            x-orig = ${x_origs.length}, y-orig = ${y_origs.length},
                            widths = ${widths.length}, heights = ${heights.length},
                            x-offsets = ${x_offsets.length}, y-offsets = ${y_offsets.length})`);
        }

        if (this.spriteSets.has(id)) console.log(`addSpriteSet: spriteSets.${id} has been overridden!`);
        const theNewSpriteSet = new SpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_offsets, y_offsets);
        this.spriteSets.set(id, theNewSpriteSet);
        return theNewSpriteSet;
    }
    
/////////////  ↑ the Old stuff ↑ /////////////////////////////////////////////////////// */

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
        this.animations.set(id, theNewAnimation);
        return theNewAnimation;

    }

    /**
     * Clones a SpriteSet and puts the clone into the spriteSets map.
     * DOES NOT clone any modifications to the sprites in the Set, ie the array of Sprite objects
     * @param {string} clone_id
     * @param {string} orig_id 
     * @returns SpriteSet clone
     */
    cloneSpriteSet(clone_id, orig_id) {
        const mrClone = this.getSpriteSet(orig_id).clone(clone_id);
        this.spriteSets.set(clone_id, mrClone);
        return mrClone;
    }

    /**
     * Clones an Animation and puts the clone into the animations map.
     * DOES NOT clone any modifications to the Animation after it first declared
     * @param {string} clone_id 
     * @param {string} orig_id
     * @returns Animation clone 
     */
    cloneAnimation(clone_id, orig_id) {
        const mrClone = this.getAnimation(orig_id).clone(clone_id);
        this.animations.set(clone_id, mrClone);
        return mrClone;
    }

    /** Validates input, makes new SpriteSet if `id` doesn't already exist, else returns the set named `id`*/
    spriteSetSetup(id, spriteSheet) {
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`);

        if ((typeof spriteSheet === 'string') && (this.spriteSheets.has(spriteSheet)))
            spriteSheet = this.spriteSheets.get(spriteSheet);

        if (!(spriteSheet instanceof Image))
            throw new Error(`spriteSheet must be the id of a SpriteSheet object OR an Image, not this: ${spriteSheet}`);

        return (this.spriteSets.has(id))? this.spriteSets.get(id) : this.addEmptySpriteSet(id);
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
