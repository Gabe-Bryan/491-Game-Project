class Grass {
    constructor(xLoc, yLoc) {
        Object.assign(this, {xLoc, yLoc});

        // this.tiles = GRAPHICS.getSpriteSet('env_grasses');
        this.tag = 'environment';        
    };

    update() {

    };

    draw(ctx, scale) {
        // this.tiles.drawSprite(1, ctx, this.xLoc, this.yLoc, scale);
        GRAPHICS.get('grass').drawTile(ctx, this.xLoc, this.yLoc)
    };
}

class Stone {
    constructor(xLoc, yLoc, bgTile="grass") {
        Object.assign(this, {xLoc, yLoc, bgTile});
        // this.tiles = GRAPHICS.getSpriteSet('env_stones');
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: xLoc, y: yLoc}, height: 16 * SCALE, width: 16 * SCALE};
        this.tag = 'environment';
    };

    update() {
        
    };

    draw(ctx, scale) {
        let temp, tileIndex = 0;
        
        // if (this.bgTile == "grass")
        //     [temp,tileIndex] = [new Grass(this.xLoc, this.yLoc), 1];    
        // else if (this.bgTile == "sand")
        //     temp = new Sand(this.xLoc, this.yLoc);
        // if (temp)
        //     temp.tiles.drawSprite(tileIndex, ctx, this.xLoc, this.yLoc, scale);
        // this.tiles.drawSprite(0, ctx, this.xLoc, this.yLoc, scale);
        if (this.bgTile == "grass") GRAPHICS.get('stone on grass').drawTile(ctx, this.xLoc, this.yLoc);
        else GRAPHICS.get('stone on sand').drawTile(ctx, this.xLoc, this.yLoc);
    }
}

class Sand {
    constructor(xLoc, yLoc) {
        Object.assign(this, {xLoc, yLoc});

        this.tiles = GRAPHICS.getSpriteSet('env_sands');
        this.tag = 'environment';
    };

    update() {
        
    };

    draw(ctx, scale) {
        //this.tiles.drawSprite(0, ctx, this.xLoc, this.yLoc, scale);
        GRAPHICS.get('sand').drawTile(ctx, this.xLoc, this.yLoc);
    };
}

class BlueStoneFloor {
    constructor(xLoc, yLoc) {
        Object.assign(this, {xLoc, yLoc});
    }

    update() {

    };

    draw(ctx, scale) {
        GRAPHICS.get('floor blue cobblestone').drawTile(ctx, this.xLoc, this.yLoc);
    }
}

class BlockerYellowDoor {
    constructor(xLoc, yLoc) {
        Object.assign(this, {xLoc, yLoc});
        this.locked = true;
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: xLoc, y: yLoc}, height: 16 * SCALE, width: 16 * SCALE};
        this.tag = 'environment';
    }

    update() {

        if (getEnemiesLeft(gameEngine.scene.interact_entities) <= 0) {
            this.locked = false;
            //this.phys2d = {static: true, isSolid: false};
            this.collider = null;
        }
    };

    draw(ctx, scale) {
        if (this.locked) {
            GRAPHICS.get('blocker yellow stone').drawTile(ctx, this.xLoc, this.yLoc);
        } else {
            GRAPHICS.get('floor blue cobblestone').drawTile(ctx, this.xLoc, this.yLoc);
        }
    }
}

class WallGreyBlock {
    constructor(xLoc, yLoc) {
        Object.assign(this, { xLoc, yLoc });
        this.typeName = "WallGreyBlock";
    }

    update() {

    };

    draw(ctx, scale) {
        GRAPHICS.get('wall grey block').drawTile(ctx, this.xLoc, this.yLoc);
    }
}

class WallComplex {
    constructor(xLoc, yLoc) {
        Object.assign(this, { xLoc, yLoc });
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: xLoc, y: yLoc}, height: 16 * SCALE, width: 16 * SCALE};
        this.tag = 'environment';
        this.typeName = "WallComplex";
        this.tileString = 'wall grey block';
    }

    update() {

    };

    draw(ctx, scale) {
        GRAPHICS.get(this.tileString).drawTile(ctx, this.xLoc, this.yLoc);
    }
}

class Portal {
    constructor(xLoc, yLoc, portalColor, mapCellX=null, mapCellY=null, bgTile=null) {
        Object.assign(this, {xLoc, yLoc, portalColor, mapCellX, mapCellY, bgTile});
        this.DEBUG = false;
        this.linkedTo = null;
        this.collider = {type: "box", corner: {x:xLoc, y: yLoc}, height: 16 * SCALE, width: 16 * SCALE};

        this.animation = GRAPHICS.getInstance('ANIMA_portal_'+portalColor);
    }

    update() {
        let pc = Player.CURR_PLAYER;
        let playerCollided = checkCollision(this, pc);
        
        if (playerCollided && this.linkedTo != null) {
            
            let currMapCellX = gameEngine.currMap.getMapCellX(),
                currMapCellY = gameEngine.currMap.getMapCellY(),
                destMapCellX = this.linkedTo.mapCellX,
                destMapCellY = this.linkedTo.mapCellY;

            if (currMapCellX != destMapCellX || currMapCellY != destMapCellY) {
                gameEngine.currMap.teleportPlayerToMapCell(destMapCellX, destMapCellY);
            }

            let currPlayerVel = Player.CURR_PLAYER.phys2d.velocity;
            
            let portalEdgeBuffer = 3,
                xVelOffset = 0,
                yVelOffset = 0;

            if (currPlayerVel.x < 0) xVelOffset = -portalEdgeBuffer;
            else if (currPlayerVel.x > 0) xVelOffset = portalEdgeBuffer;

            if (currPlayerVel.y < 0) yVelOffset = -portalEdgeBuffer;
            else if (currPlayerVel.y > 0) yVelOffset = portalEdgeBuffer;

            let vertColliderFix = 26;

            Player.CURR_PLAYER.x = this.linkedTo.xLoc + Math.floor(currPlayerVel.x)+xVelOffset * 16;
            Player.CURR_PLAYER.y = this.linkedTo.yLoc - vertColliderFix + Math.floor(currPlayerVel.y)+yVelOffset * 16;
        }
    };

    draw(ctx, scale) {
        this.animation.animate(gameEngine.clockTick, ctx, this.xLoc, this.yLoc, scale);
    };

    setLinkedEntity(linkedEntity) {
        this.linkedTo = linkedEntity;
    }

    setTwoWayLinkedEntity(linkedEntity) {
        this.linkedTo = linkedEntity;
        linkedEntity.linkedTo = this;
    }
}