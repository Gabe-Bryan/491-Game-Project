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