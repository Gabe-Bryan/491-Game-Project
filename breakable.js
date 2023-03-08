class Pot {
    constructor(pos, spawnType, spawnChances){
        Object.assign(this, {spawnType, spawnChances})
        this.x = pos.x; this.y = pos.y;

        this.updateCollider();
        this.sprite = GRAPHICS.getInstance('SET_pot');
        this.tag = "env_interact_breakable";
        this.phys2d= {static: true}
        // this.DEBUG = true;

    }

    updateCollider() {
        this.collider = {type: "box", corner: {x: this.x + 2 * SCALE, y: this.y + 1 * SCALE}, width: 12*SCALE, height: 13*SCALE};
    }

    takeDamage() {
        this.removeFromWorld = true;
        gameEngine.scene.addInteractable(new DeathCloud(this.x - 5.5 *SCALE, this.y - 4 *SCALE, this.spawnType, this.spawnChances));
    }

    interact() {
        Player.CURR_PLAYER.pickUpObj(1);
        this.removeFromWorld = true;
    }

    update() {}

    draw(ctx) {
        this.sprite.drawSprite(0, ctx, this.x, this.y, SCALE);
        // drawBoxCollider(ctx, this.collider, true);
    }

}

class BombFlower {
    static WIDTH = 16
    static HEIGHT = 17
    constructor(pos, _type = 2) {
        this.x = pos.x;
        this.y = pos.y;
        this.type = _type
        this.picked = false;

        this.spriteSet = GRAPHICS.getInstance("SET_bomb_flowers");
        this.tag = "env_interact_breakable";

        this.updateCollider();
        this.DEBUG = false;
        this.phys2d = {static: true, isSolid: true};
    }

    updateCollider() {
        this.collider = {
            type: "box",
            corner: {x: this.x + 6, y: this.y},
            width:  BombFlower.WIDTH  * SCALE * 0.75,
            height: BombFlower.HEIGHT * SCALE * 0.75
        };
    }

    takeDamage() {
        const detB = new Bomb(this.x + 6, this.y, false)
        gameEngine.scene.addInteractable(detB);
        this.detach();

        let pos = gameEngine.scene.interact_entities.findIndex((element) => this == element)
        gameEngine.scene.interact_entities.splice(pos, 0, detB);
    }

    interact() {
        Player.CURR_PLAYER.pickUpObj(0);
        this.detach();
    }

    detach() {
        this.picked = true;
        this.phys2d = {static: true, isSolid: false};
        this.tag = 'environment';
        // let xCell = gameEngine.currMap.getMapCellX();
        // let yCell = gameEngine.currMap.getMapCellY();
        // console.log("x" + xCell + "  Y" + yCell)
        // gameEngine.addEntity(new bFlowerPad(500, 500))
        // gameEngine.currMap.addMapCellEntity()
        // this.currCellTileMap[y][x].push(tile)
        // this.currCellTileMap[10][10].push(new bFlowerPad(500, 500))
    }
    
    update() {}

    draw(ctx) {
        // this.spriteSet.drawSprite(this.picked ? this.type+4 : this.type, ctx, this.x, this.y-3, SCALE);
        this.spriteSet.drawSprite(this.picked ? this.type+4 : this.type, ctx, this.x, this.y-3, SCALE);
        // drawBoxCollider(ctx, this.collider, true);
    }
}
// class bFlowerPad{
//     constructor(pos, _type = 2) {
//         this.x = pos.x;
//         this.y = pos.y;
//         this.type = _type + 4

//         this.spriteSet = GRAPHICS.getInstance("SET_bomb_flowers");
//         // this.tag = 'environment';
//     }
//     update() {}

//     draw(ctx) {
//         this.spriteSet.drawSprite(this.type, ctx, this.x, this.y-3, SCALE);
//     }
// }