class GameMap {
    constructor(imageFilePath, cellWidthInTiles, cellHeightInTiles, pxTileWidth, pxTileHeight, colorMappings) {
        Object.assign(this, {imageFilePath, 
                             cellWidthInTiles, cellHeightInTiles, 
                             pxTileWidth, pxTileHeight, 
                             colorMappings});

        this.mapImage = ASSET_MANAGER.getAsset(this.imageFilePath);


        this.cellWidthInPx = cellWidthInTiles * pxTileWidth;
        this.cellHeightInPx = cellHeightInTiles * pxTileHeight;
        
        // build the lists for holding per-cell entities
        this.mapCellEntities = []
        for (let iY = 0; iY < cellHeightInTiles; iY++) {
            this.mapCellEntities.push([])
            for (let iX = 0; iX < cellWidthInTiles; iX++) {
                this.mapCellEntities[iY].push([])
            }
        }

        // console.log(this.mapCellEntities.length, this.mapCellEntities[0].length)

        // setup empty array for holding map tiles in
        this.initializeMapCell();
    }

    screenEdgeTransition(player) {
        let horizBuffer = player.collider.width/2;
        let vertBuffer = player.collider.height/2;

        let cX = player.collider.corner.x;
        let cY = player.collider.corner.y;

        if (cX + horizBuffer < 0) {                               // WEST EDGE
            gameEngine.scene.clearScene();
            player.x = this.cellWidthInPx - horizBuffer;
            this.loadMapCell(this.currCellX - 1, this.currCellY);
            this.addMapEntitiesToEngine(gameEngine);
            this.addInteractableToEngine(gameEngine);
        
        } else if (cX + horizBuffer > this.cellWidthInPx) {       // EAST EDGE
            gameEngine.scene.clearScene();
            player.x = 0 - horizBuffer;
            this.loadMapCell(this.currCellX + 1, this.currCellY);
            this.addMapEntitiesToEngine(gameEngine);
            this.addInteractableToEngine(gameEngine);
        
        } else if (cY + vertBuffer < 0) {                        // NORTH EDGE
            gameEngine.scene.clearScene();
            player.y = this.cellHeightInPx - (vertBuffer + 28);
            this.loadMapCell(this.currCellX, this.currCellY - 1);
            this.addMapEntitiesToEngine(gameEngine);
            this.addInteractableToEngine(gameEngine);
        
        } else if (cY + vertBuffer > this.cellHeightInPx) {      // SOUTH EDGE
            gameEngine.scene.clearScene();
            player.y = 0 - (vertBuffer+28);
            this.loadMapCell(this.currCellX, this.currCellY + 1);
            this.addMapEntitiesToEngine(gameEngine);
            this.addInteractableToEngine(gameEngine);
        }
        
    }

    pixelToHexColor(pixel) {
        let r = Number(pixel[0]).toString(16).padStart(2, "0");
        let g = Number(pixel[1]).toString(16).padStart(2, "0");
        let b = Number(pixel[2]).toString(16).padStart(2, "0");
        let a = Number(pixel[3]).toString(16).padStart(2, "0"); // alpha not used currently, but can be
        
        return `#${r}${g}${b}`;
    }

    loadMapCell(mapCellX, mapCellY) {
        //reset all of the map tiles
        this.initializeMapCell();

        [this.currCellX, this.currCellY] = [mapCellX, mapCellY];
        const mapImageCanvas = document.createElement("canvas");
        mapImageCanvas.width = this.cellWidthInTiles;
        mapImageCanvas.height = this.cellHeightInTiles;
        const mapImageCtx = mapImageCanvas.getContext("2d");

        let paddingOffset = 1;
        let cellX = paddingOffset + (paddingOffset + this.cellWidthInTiles) * mapCellX;
        let cellY = paddingOffset + (paddingOffset + this.cellHeightInTiles) * mapCellY;

        mapImageCtx.drawImage(this.mapImage, 
                              cellX, cellY,
                              this.cellWidthInPx, this.cellHeightInPx,
                              0, 0,
                              this.cellWidthInPx, this.cellHeightInPx);

        // gameEngine.running = false;
        // document.querySelector("canvas").getContext("2d").drawImage(mapImageCanvas, 0, 0);
        
        for (let y = 0; y < this.cellHeightInTiles; y++) {
            for (let x = 0; x < this.cellWidthInTiles; x++) {
                
                let mapPixel = mapImageCtx.getImageData(x, y, 1, 1).data;
                let rgb = this.pixelToHexColor(mapPixel);

                let tile = null;
                let tileX = x * 16 * SCALE;
                let tileY = y * 16 * SCALE;
                let tileColor = this.colorMappings[rgb];

                if (tileColor == 'grass')           
                    tile = new Grass(tileX, tileY);
                else if (tileColor == 'stone_grass')
                    tile = new Stone(tileX, tileY, 'grass');
                else if (tileColor == 'stone_sand') 
                    tile = new Stone(tileX, tileY, 'sand');
                else if (tileColor == 'sand')
                    tile = new Sand(tileX, tileY);
                else if (tileColor == 'floor_blue_cobblestone') 
                    tile = new BlueStoneFloor(tileX, tileY);
                else if (tileColor == 'blocker_yellow_stone')
                    tile = new BlockerYellowDoor(tileX, tileY);
                else
                    tile = new Grass(tileX, tileY);

                this.currCellTileMap[y][x].push(tile);
            }
        }
    }

    initializeMapCell(){
        this.currCellTileMap = [];
        for (let h = 0; h < this.cellHeightInTiles; h++) {
            this.currCellTileMap.push([]);
            for (let w = 0; w < this.cellWidthInTiles; w++) {
                this.currCellTileMap[h].push([]);
            }
        }
    }

    addMapEntitiesToEngine(engine) {
        for (let y = 0; y < this.currCellTileMap.length; y++) {
            for (let x = 0; x < this.currCellTileMap[y].length; x++) {
                 engine.scene.addEnvEntity(this.currCellTileMap[y][x][0]);
            }
        }
    }

    addInteractableToEngine(engine) {
        for (let i = 0; i < this.mapCellEntities[this.currCellY][this.currCellX].length; i++) {
            engine.scene.addInteractable(this.mapCellEntities[this.currCellY][this.currCellX][i]);
        }
    }

    getMapCellX() {
        return this.currCellX;
    }

    getMapCellY() {
        return this.currCellY;
    }

    addMapCellEntity(destCellX, destCellY, entity) {
        this.mapCellEntities[destCellY][destCellX].push(entity);
    }

    getCurrMapCellEntities() {
        return this.mapCellEntities[this.currCellY][this.currCellX];
    }

    getMapCellEntities(destCellX, destCellY) {
        return this.mapCellEntities[destCellY][destCellX];
    }
}