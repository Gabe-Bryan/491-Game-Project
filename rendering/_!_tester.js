const ENGINE = new GameEngine();
const ASSET_MANAGER = new AssetManager("../assets/");
const GRAPHICS = new GraphicsManager();
const SCALE = 5;

ASSET_MANAGER.queueDownload("link.png", "enemies.png", "characters.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

    loader();
    ENGINE.addEntity(new Testy(canvas, SCALE));

	ENGINE.init(ctx);
	ENGINE.start();
	
});

function loader() {
    // addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs, y_ofs)

    // addSpriteRow(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs) 
    GRAPHICS.addSpriteSheet('CHARTR1', ASSET_MANAGER.getAsset('characters.png'))
    
    // GRAPHICS.addSpriteRow('SET_bunny', 'CHARTR1', 8, 4, 419, 17, 25, 7);
    GRAPHICS.addSpriteSet('SET_bunny', 'CHARTR1', [4, 28, 52, 76, 100, 125, 149, 174], 419, 17, 25);

    
    GRAPHICS.addAnimation('ANIMA_bunny_south', 'SET_bunny', [2,3,4], 1);
    GRAPHICS.addAnimation('ANIMA_bunny_north', 'SET_bunny', [5,6,7], 1);
    GRAPHICS.addAnimation('ANIMA_bunny_east', 'SET_bunny', [0,1], 1);
    GRAPHICS.cloneAnimation('ANIMA_bunny_west','ANIMA_bunny_east').mirrorAnimation_Horz()

}   // addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0)



class Testy{
    constructor(canvas, scale) {
        this.x = 150
        this.y = 100
    }

    update() {
    }

    draw(ctx, scale) {
        GRAPHICS.getAnimation('ANIMA_bunny_west').animate(ENGINE.clockTick, ctx, this.x, this.y, scale);
    }
}