class Projectile {
    constructor(type, x, y, direction) {
        Object.assign(this, {type, x, y, direction});
        let validTypes = ["bomb"];


         // sprit set should be: north, south, east, west
        // make go brrrrrr
    }
}

class _Bomb_Proj_ {
    constructor(type, x, y, dir) {
        Object.assign(this, {type, x, y, dir});
        // all the same sprite for NSEW
        this.spriteSet = GRAPHICS.getInstance('PROX_reg_bomb')
    }
}