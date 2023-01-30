class Grass {
    constructor(xLoc, yLoc) {
        Object.assign(this, {xLoc, yLoc});

        this.tiles = ANIMANAGER.getSpriteSet('env_grasses');
        this.tag = 'environment';        
    };

    update() {

    };

    draw(ctx, scale) {
        this.tiles.drawSprite(ctx, 1, this.xLoc, this.yLoc, scale);
    };
}

class Stone {
    constructor(xLoc, yLoc, bgTile="grass") {
        Object.assign(this, {xLoc, yLoc, bgTile});
        this.tiles = ANIMANAGER.getSpriteSet('env_stones');
        this.phys2d = {static: true};
        this.collider = {type: "box", corner: {x: xLoc, y: yLoc}, height: 16 * SCALE, width: 16 * SCALE};
        this.tag = 'environment';
    };

    update() {
        
    };

    draw(ctx, scale) {
        let temp, tileIndex = 0;
        
        if (this.bgTile == "grass")
            [temp,tileIndex] = [new Grass(this.xLoc, this.yLoc), 1];    
        else if (this.bgTile == "sand")
            temp = new Sand(this.xLoc, this.yLoc);
        if (temp)
            temp.tiles.drawSprite(ctx, tileIndex, this.xLoc, this.yLoc, scale);
        this.tiles.drawSprite(ctx, 0, this.xLoc, this.yLoc, scale);
    }
}

class Sand {
    constructor(xLoc, yLoc) {
        Object.assign(this, {xLoc, yLoc});

        this.tiles = ANIMANAGER.getSpriteSet('env_sands');
        this.tag = 'environment';
    };

    update() {
        
    };

    draw(ctx, scale) {
        this.tiles.drawSprite(ctx, 0, this.xLoc, this.yLoc, scale);
    };
}