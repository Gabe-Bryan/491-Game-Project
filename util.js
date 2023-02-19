/** Global Parameters Object */
const params = { };

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * The core function responsible for the update loop
 * 1. Calls each entities update function
 * 2. Performs all of the physics updates
 * 3. Deletes any entities marked with "removeFromWorld" as true
 * @param {} entities the list of entities that should be updated
 */
const updateList = (entities) => {
    let entitiesCount = entities.length;

    for (let i = 0; i < entitiesCount; i++) {
        let entity = entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    updatePhys(entities);

    for (let i = entities.length - 1; i >= 0; --i) {
        if (entities[i].removeFromWorld) {
            entities.splice(i, 1);
        }
    }
}

const drawList = (entities, ctx, scale) => {
    // Draw latest things first
    for (let i = entities.length - 1; i >= 0; i--) {
        let entity = entities[i];
        entity.draw(ctx, SCALE);
        if(entity.DEBUG && entity.collider && entity.collider.type == 'box'){
            
            if(entity == undefined) console.log("happens here too");
            //console.log(entity);
            drawBoxCollider(ctx, entity);
        }
    }
}

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * returns the normalized vector for the direction
 *  0:north, 1:south, 2:east, 3:west
 */ 
const getDirVect = (dir) => {
    switch(dir){
        case 0: return {x: 0, y: 1};
        case 1: return {x: 0, y: -1};
        case 2: return {x: 1, y: 0};
        case 3: return {x: -1, y: 0};
    }
}