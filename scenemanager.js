class SceneManager{
    constructor(){
        this.env_entities = [];
        this.interact_entities = [];
    }

    draw(ctx, scale){
        drawList(this.env_entities, ctx, scale);
        drawList(this.interact_entities, ctx, scale);
    }

    update(){
        updateList(this.env_entities);
        updateList(this.interact_entities);
    }

    addInteractable(entity){
        this.interact_entities.push(entity);
    }

    addEnvEntity(entity){
        this.env_entities.push(entity);
    }

    clearScene(){
        console.log("clearing scene...");
        this.env_entities = [];
        this.interact_entities = [];
    }

    getEnvEntityAtCoord(xTileCoord, yTileCoord) {
        let tilesWide = gameEngine.currMap.cellWidthInTiles;
        return this.env_entities[yTileCoord*tilesWide + xTileCoord];
    }

    getEnvNeighborTiles(xTileCoord, yTileCoord) {
        let tilesWide = gameEngine.currMap.cellWidthInTiles,
            tilesHigh = gameEngine.currMap.cellHeightInTiles;
            
        let northTile = null,
            southTile = null,
            westTile = null,
            eastTile = null;
            
        if (yTileCoord > 0)         northTile = this.getEnvEntityAtCoord(xTileCoord, yTileCoord - 1);
        if (yTileCoord < tilesWide) southTile = this.getEnvEntityAtCoord(xTileCoord, yTileCoord + 1);
        if (xTileCoord > 0)         westTile = this.getEnvEntityAtCoord(xTileCoord - 1, yTileCoord);
        if (xTileCoord < tilesHigh) eastTile = this.getEnvEntityAtCoord(xTileCoord + 1, yTileCoord);

        //console.log(northTile)

        return {'north':northTile, 'south':southTile, 'west':westTile, 'east':eastTile};
    }

    getEnvNeighborTilesSameType(xTileCoord, yTileCoord) {
        let currTile = this.getEnvEntityAtCoord(xTileCoord, yTileCoord);
        let neighbors = this.getEnvNeighborTiles(xTileCoord, yTileCoord);
        
        let northSame = false,
            southSame = false,
            westSame = false,
            eastSame = false;

        if (neighbors.north) northSame = neighbors.north.typeName == currTile.typeName;
        if (neighbors.south) southSame = neighbors.south.typeName == currTile.typeName;
        if (neighbors.east)  eastSame = neighbors.east.typeName == currTile.typeName;
        if (neighbors.west)  westSame = neighbors.west.typeName == currTile.typeName;

        return {
                'northSame': northSame,
                'southSame': southSame,
                'westSame':  westSame,
                'eastSame':  eastSame
            };
    }

    fixMultiblockEnvEntities() {
        for (let i = 0; i < this.env_entities.length; i++) {
            
            let tile = this.env_entities[i];
            if (tile.typeName=="WallComplex") {
                let tileX = tile.xLoc / gameEngine.currMap.pxTileWidth,
                    tileY = tile.yLoc / gameEngine.currMap.pxTileHeight;
                let neighbors = gameEngine.scene.getEnvNeighborTilesSameType(tileX, tileY);

                //console.log(tileX, tileY, neighbors)
                
                if (neighbors.southSame && neighbors.eastSame) {            // NW CORNER
                    tile.tileString = 'wall_NW';
                } else if (neighbors.southSame && neighbors.westSame) {     // NE CORNER
                    tile.tileString = 'wall_NE';
                } else if (neighbors.westSame && neighbors.eastSame) {      // HORIZ
                    tile.tileString = 'wall_HORIZ';
                } else if (neighbors.northSame && neighbors.eastSame) {     // SW CORNER
                    tile.tileString = 'wall_SW';
                } else if (neighbors.northSame && neighbors.westSame) {     // SE CORNER
                    tile.tileString = 'wall_SE';
                } else if (neighbors.northSame && neighbors.southSame) {    // VERT
                    tile.tileString = 'wall_VERT';
                }
            }
        }
    }
}

class _obj_Placer {
    constructor(_map_) {
        const MAP = _map_;
        this.betaWorld(MAP);
        this.betaDungeon(MAP);
        this.demoWorld(MAP);
        this.portalsTest(MAP);
        this.alpha(MAP);
        // this.testJunk()

    // note: gameEngine.currMap.teleportPlayerToMapCell(0,0)
    }

    portalsTest(testMap) {
        let prtl_clrs = ['red', 'green', 'yellow', 'blue', 'orange'];
        for (let i = 0; i < prtl_clrs.length; i++) {
        	let left_prtlXY = tileToScreenCoord(5, 1+i);
        	let right_prtlXY = tileToScreenCoord(14, 1+i);
        	left_prtlXY.y *= 2.3;
        	right_prtlXY.y *= 2.3;
        	let left_prtl = new Portal(left_prtlXY.x, left_prtlXY.y, prtl_clrs[i], 1, 1);
        	let right_prtl = new Portal(right_prtlXY.x, right_prtlXY.y, prtl_clrs[i], 1, 1);
        	left_prtl.setLinkedEntity(right_prtl);
        	right_prtl.setLinkedEntity(left_prtl);
        	testMap.addMapCellEntity(1, 1, left_prtl);
        	testMap.addMapCellEntity(1, 1, right_prtl);
        }
    }

    testJunk() {
        gameEngine.scene.addInteractable(new Bomb(240,200));
        gameEngine.scene.addInteractable(new Projectile('bomb', 400, 600, {x: -0.7, y:0.5}));
        gameEngine.scene.addEnvEntity(new Projectile('ironBall', 200, 600, {x:-0.5, y:1}));
        gameEngine.scene.addEnvEntity(new Projectile('arrow', 100, 280, 1));
        gameEngine.scene.addEnvEntity(new Projectile('trident', 100, 360, 1));
        gameEngine.scene.addEnvEntity(new Projectile('fireBall', 100, 440, 1));
        gameEngine.scene.addEnvEntity(new Projectile('redBeam', 100, 520, 1));
        gameEngine.scene.addEnvEntity(new Projectile('blueBeam', 100, 600, 1));
        gameEngine.scene.addEnvEntity(new BadGas(100, 300));
    }


    // cells: (col, row)

    alpha(map) {
        // map cell : column, row
        let   mc   =  {c:-1,  r:-1}

        // 0 - 0 //
        mc = {c:0, r:0}
        // map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(4,2)));
        // map.addMapCellEntity(mc.c, mc.r, new Bunny(tileToScreenCoord(4, 6)));
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(7, 5), 'random'));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(1, 1)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 1)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(1, 14)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(7, 8)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 14)));
	    // map.addMapCellEntity(mc.c, mc.r, new Wizard(tileToScreenCoord(3,4)));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(4, 5), 2));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(10, 5), 2));

    }

    /**cells (2,2) (3,1) (3,2) (3,3) (4,2) */
    betaWorld(map) {
        // map cell =  column,  row
        let   mc    =  { c:-1,  r:-1}
        // 2 - 2 //
        mc = {c:2, r:2}

        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(12, 12)));
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(2, 2)));
        // 3 - 1 //

        // 3 - 2 //
        mc = {c:3, r:2}

        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(12, 12)));
        map.addMapCellEntity(mc.c, mc.r, new Bunny(tileToScreenCoord(5, 5)));
        // 3 - 3 //
        mc = {c:3, r:3}
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(12, 2)));

        
        // 4 - 2 //
        mc = {c:4, r:2}


    }
    /**cells (1,1) (1,2) (1,3) (1,4) (2,3) (2,4) */
    betaDungeon(map) {
        // map cell =  column,  row
        let   mc    =  { c:-1,  r:-1}

        // 1 - 1 //
        mc = {c:1, r:1}

    
        // 1 - 2 // * dungeon enter
        mc = {c:1, r:2}

        map.addMapCellEntity(mc.c, mc.r, new Bunny(tileToScreenCoord(3, 3)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(1, 1)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(1, 14)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 1)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 14)));
        // map.addMapCellEntity(mc.c, mc.r, new Door(tileToScreenCoord(9, 15)));
	    // map.addMapCellEntity(mc.c, mc.r, new Wizard(tileToScreenCoord(3,4)));


        // 1 - 3 //
        mc = {c:1, r:3}

        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(14, 2)));
        map.addMapCellEntity(mc.c, mc.r, new Skull(tileToScreenCoord(1, 3)));
        map.addMapCellEntity(mc.c, mc.r, new Wizard(tileToScreenCoord(1,14)));
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(13, 1), 'heart'));
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(18, 1), 'heart'));
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(1, 1), 'fart'));


        // 1 - 4 // * dungeon exit
        mc = {c:1, r:4}

        map.addMapCellEntity(mc.c, mc.r, new Triforce(400,300));

        // 2 - 3 //
        mc = {c:2, r:3}

        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(6, 2)));
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(10, 13)));
        map.addMapCellEntity(mc.c, mc.r, new Skull(tileToScreenCoord(14, 1)));

        // 2 - 4 //
        mc = {c:2, r:4}
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(6, 13)));
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(13, 13)));
        map.addMapCellEntity(mc.c, mc.r, new Skull(tileToScreenCoord(17, 1)));
        map.addMapCellEntity(mc.c, mc.r, new Skull(tileToScreenCoord(2, 2)));
    }

    /** cells (10,1) (10,2) (11,1) (11,2) (12,1) (12,2)*/
    demoWorld(map) {
        // map cell =  column,  row
        let   mc    =  { c:-1,  r:-1}

        // 10 - 1 //
        mc = {c:10, r:1}
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(14, 5)));
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(4, 8)));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(2, 3), 2));


        // 10 - 2 //
        mc = {c:10, r:2}
        map.addMapCellEntity(mc.c, mc.r, new Wizard(tileToScreenCoord(8,11)));
        map.addMapCellEntity(mc.c, mc.r, new Wizard(tileToScreenCoord(13,4)));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(12, 4), 2));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(2, 14), 2));


        // 11 - 1 //
        mc = {c:11, r:1}
        map.addMapCellEntity(mc.c, mc.r, new Bunny(tileToScreenCoord(10, 10)));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(2, 3), 2));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(3, 14), 2));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(15, 14), 2));

        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 3)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 5)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(16, 3)));

        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 10)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 10)));
        map.addMapCellEntity(mc.c, mc.r, new Pot(tileToScreenCoord(18, 10)));
        
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(8, 1)), 'heart');
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(11, 1), 'fart'));
        // map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(8, 9)), true);

        // 11 - 2 //s
        mc = {c:11, r:2}
        map.addMapCellEntity(mc.c, mc.r, new Wizard(tileToScreenCoord(10, 10)));
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(8, 1)), 'random');
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(11, 1), 'random'));

        // map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(2, 8), false, 'airRaid'));
        // map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(2, 9), false, 'airRaid'));
        // map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(2, 10), false, 'airRaid'));
        // map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(2, 11), false, 'airRaid'));

        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(1, 6), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(2, 6), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(3, 6), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(3, 5), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(4, 5), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(5, 5), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(6, 5), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(7, 5), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(7, 4), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(8, 4), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(9, 4), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(10, 4), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(11, 4), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(12, 4), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(12, 4), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(12, 5), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(13, 5), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(14, 5), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(15, 5), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(16, 5), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(16, 6), false, 'chest'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(17, 6), false, 'airRaid'));
        map.addMapCellEntity(mc.c, mc.r, new Bomb(tileToScreenCoord(17, 6), false, 'chest'));



        // 12 - 1 //
        mc = {c:12, r:1}
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(12, 3)));
        map.addMapCellEntity(mc.c, mc.r, new Knight(tileToScreenCoord(17, 8)));

        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(2, 2), 2));
        map.addMapCellEntity(mc.c, mc.r, new BombFlower(tileToScreenCoord(17, 2), 2));
        map.addMapCellEntity(mc.c, mc.r, new SmallChest(tileToScreenCoord(2, 12), 'fart'));

        // 12 - 2 //
        mc = {c:12, r:2}
        map.addMapCellEntity(mc.c, mc.r, new Bunny(tileToScreenCoord(10, 10)));

    }
}