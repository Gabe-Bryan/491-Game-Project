var DEBUG_ANIMA = 0;

/** change to Rendex
 * Manages the Animations, and also the sprites
 * @author Christopher Henderson
 */
class AnimationManager {
    constructor() {
        this.spriteSheets = new Map(); // <string: id, object: Image>
        this.spriteSets = new Map();   // <string: id, object: SpriteSet>
        this.animations = new Map();   // <string: id, object: Animation>
        this.library = new Map(); // <string: id, Type (SpriteSheet, Animation, TileSet, etc)
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
        // TODO: check for bad inputs
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`)
        if (spriteSheet instanceof Image) {
            this.spriteSheets.set(id, spriteSheet);
            return this.getSpriteSheet(id);
        } else throw new Error(`spriteSheet must be an Image, not this: ${spriteSheet}`)
    }

    /**
     * Adds an empty Sprite Set to the Library.
     * Can also be used to erase an existing Sprite Set by overwriting it!
     * @param {string} id
     * @returns the new Sprite Set
     */
    addEmptySpriteSet(id) {
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`)
        if (this.spriteSets.has(id)) console.log(`Sprite Set ${id} has been erased!`);
        const spriteSet = new SpriteSet(id);
        this.spriteSets.set(id, spriteSet);
        return spriteSet
    }

    /**
     * @description Adds a new Sprite Set to the Library if 'id' doesn't already exist
     * and puts a single Sprite in it that you specify here.
     * 
     * @param {string} id The unique ID of this Sprite Set
     * @param {string | object} spriteSheet Unique ID of Sprite-Sheet or a Sprite Sheet Object
     * @param {number} x_orig X-origin of the Sprite
     * @param {number} y_orig Y-origin of the Sprite
     * @param {number} width width of the Sprite
     * @param {number} height height of the Sprite
     * @param {number} x_ofs offsets Sprite's X orig position | default is 0
     * @param {number} y_ofs offsets Sprite's Y orig position | default is 0
     * @returns the new Sprite Set
     */
    addSpriteSingle(id, spriteSheet, x_orig, y_orig, width, height, x_ofs = 0, y_ofs = 0) {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);
        spriteSet.addSprite(spriteSheet, x_orig, y_orig, width, height, x_ofs, y_ofs)
        return spriteSet;
    }

    /**
     * 
     * @param {string} id 
     * @param {string | Image} spriteSheet 
     * @param {number} x_orig 
     * @param {number} y_orig 
     * @param {number} row_count number of rows
     * @param {number} col_count number of columns
     * @param {number | number[]} rows_heights the heights of each row
     * @param {number | number[]} col_widths the widths of each column 
     * @param {number | number[]} row_gaps gaps between sprites in the same row
     * @param {number | number[]} col_gaps col_gaps gaps between the columns of the grid
     * @param {number[]} x_ofs 
     * @param {number[]} y_ofs 
     */
    addSpriteGrid(id, spriteSheet, x_orig, y_orig, row_count, col_count, rows_heights, col_widths, row_gaps, col_gaps, x_ofs, y_ofs) {
        const spriteSet = this.spriteSetSetup(id, spriteSheet);

        if (rows_heights === 'number') rows_heights = Array(row_count).fill(rows_heights)
        if (col_widths === 'number') col_widths = Array(col_count).fill(col_widths)
        
        if (typeof row_gaps === 'number') row_gaps = Array(col_gaps).fill(row_gaps);
        else gaps.push(0); // pads a 0 at the end of user array, bc 1 less gap than count

        if (typeof col_gaps === 'number') col_gaps = Array(row_count).fill(col_gaps);
        else gaps.push(0); // pads a 0 at the end of user array, bc 1 less gap than count

        

        // if (x_ofs === 'number') x_ofs = Array(col_count).fill(x_ofs)
        // if (y_ofs === 'number') y_ofs = Array(row_count).fill(y_ofs)

        let xstart = x_orig;
        let ystart = y_orig;

        let x_origs = Array(row_count);
        let y_origs = Array(row_count);
        if (typeof x_ofs === 'number') x_ofs = Array(row_count).fill(x_ofs);
        if (typeof y_ofs === 'number') y_ofs = Array(row_count).fill(y_ofs);
        
        for (let i = 0; i < row_count; i++) {
            x_origs[i] = new Array(col_count)
            y_origs[i] = new Array(col_count)
            if (typeof x_ofs[i] === 'number') x_ofs[i] = Array(col_count).fill(x_ofs);
            if (typeof y_ofs[i] === 'number') y_ofs[i] = Array(col_count).fill(y_ofs);
        }
  
        for (let row = 0; row < row_count; row++) {
            for (let col = 0; col < col_count; col++) {
                // x part
                x_origs[row][col] = xstart;
                xstart += col_widths[col] + col_gaps[col];
                //y part
                y_origs[row][col] = ystart;
                ystart += rows_heights[row] + gaps[row];
            }
        }


    }

    /**
     * @description Adds a new Sprite Set to the Library and adds Sprites which all line up in a row,
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
     */
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

    /**
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
     */
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

        /**
     * 
     * @param {string} id
     * @param {string | Image} spriteSheet
     * @param {number} x_orig
     * @param {number} y_orig
     * @param {number} rows_cont number of rows in sprite sheet
     * @param {number | number[]} rows_len number of sprites in a/each row
     * @param {number | number[] | number[][]} heights the heights of each row
     * @param {number | number[] | number[][]} widths the widths of each column 
     * @param {number | number[] | number[][]} row_gaps gaps between the rows of the grid
     * @param {number | number[] | number[][]} col_gaps gaps between the columns of the grid
     * @param {number | number[] | number[][]} x_ofs 
     * @param {number | number[] | number[][]} y_ofs 
     */
        addSprite2Darray(id, spriteSheet, x_orig, y_orig, rows_cont, rows_len, widths, heights, row_gaps, col_gaps, x_ofs = 0, y_ofs = 0) {
            const spriteSet = this.spriteSetSetup(id, spriteSheet);
    
            // easy fix
            if (rows_len === 'number') rows_len = Array(rows_cont).fill(rows_len)
            // we first check to see if its a number, if not we assume its an array,
            // we then check if its a 1d array, if not we assume its a 2d array
            let widths_dim   = typeof widths === 'number'   ? 1 : typeof widths[0] === 'number'   ? 2 : 3;
            let heights_dim  = typeof heights === 'number'  ? 1 : typeof heights[0] === 'number'  ? 2 : 3;
            let row_gaps_dim = typeof row_gaps === 'number' ? 1 : typeof row_gaps[0] === 'number' ? 2 : 3;
            let col_gaps_dim = typeof col_gaps === 'number' ? 1 : typeof col_gaps[0] === 'number' ? 2 : 3;
            let x_ofs_dim    = typeof x_ofs === 'number'    ? 1 : typeof x_ofs[0] === 'number'    ? 2 : 3;
            let y_ofs_dim    = typeof y_ofs === 'number'    ? 1 : typeof y_ofs[0] === 'number'    ? 2 : 3;
    
            if (row_gaps_dim === 1) row_gaps.push(0);
            else row_gaps.forEach(x => x.push(0));
    
            if (col_gaps_dim === 1) col_gaps.push(0);
            else col_gaps.forEach(x => x.push(0));
    
    
            // if (heights === 'number') heights = Array(row_count).fill(heights)
            // if (widths === 'number') widths = Array(col_count).fill(widths)
            
            // if (typeof row_gaps === 'number') row_gaps = Array(col_gaps).fill(row_gaps);
            // else gaps.push(0); // pads a 0 at the end of user array, bc 1 less gap than count
    
            // if (typeof col_gaps === 'number') col_gaps = Array(row_count).fill(col_gaps);
            // else gaps.push(0); // pads a 0 at the end of user array, bc 1 less gap than count
    
            // if (x_ofs === 'number') x_ofs = Array(col_count).fill(x_ofs)
            // if (y_ofs === 'number') y_ofs = Array(row_count).fill(y_ofs)
    
            let xstart = x_orig;
            let ystart = y_orig;
    
            let x_origs = Array(rows_len);
            let y_origs = Array(rows_len);
    
            
            for (let i = 0; i < rows_len; i++) {
                x_origs[i] = new Array(rows_cont)
                y_origs[i] = new Array(rows_cont)
            }
    
            for (let row = 0; row < rows_cont; row++) {
                for (let sprt = 0; rows_len[row] < rows_cont; sprt++) {
                    // x part
                    x_origs[row][col] = xstart;
                    xstart += widths[col] + col_gaps[col];
                    //y part
                    y_origs[row][col] = ystart;
                    ystart += heights[row] + gaps[row];
                }
            }
    
    
        }

    /**
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
     */
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

    spriteSetSetup(id, spriteSheet) {
        if (typeof id !== 'string') throw new Error(`id must be a string, not this: ${id}`)
        if ((typeof spriteSheet === 'string') && this.spriteSheets.has(spriteSheet)) {
            spriteSheet = this.spriteSheets.get(spriteSheet);
        }
        else if (!(spriteSheet instanceof Image)) {
            throw new Error(`spriteSheet must be the id of a SpriteSheet object OR an Image, not this: ${spriteSheet}`)
        }
        else return (this.spriteSets.has(id))? this.spriteSets.get(id) : addEmptySpriteSet(id);
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
