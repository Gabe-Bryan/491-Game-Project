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
    GRAPHICS.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'))
    GRAPHICS.addSpriteSheet('ENEMY', ASSET_MANAGER.getAsset('enemies.png'))
    GRAPHICS.addSpriteSheet('CHAR', ASSET_MANAGER.getAsset('characters.png'))

    // addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs, y_ofs)

    // addSpriteRow(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs) 
    
    
    // GRAPHICS.addSpriteRow('SET_bunny', 'CHARTR1', 8, 4, 419, 17, 25, 7);

    GRAPHICS.addSpriteSet( // Link attack
        'SET_link_attack_west', 'LINK',
        [519, 546, 574, 611, 652, 681],
        [192, 191, 192, 192, 192, 192],
        [16, 23, 30, 31, 28, 23],
        [23, 24, 23, 23, 29, 31],
        [0, -9, -13, -14, -12, -7],
        [0, -1, 0, 0, 0, 0]
    );

    GRAPHICS.addAnimation('ANIMA_link_attack_west', 'SET_link_attack_west', 6, [0.1, 0.07, 0.05, 0.04, 0.07, 0.1]).setAnimaSpeed(20); 
    GRAPHICS.cloneAnimation('ANIMA_link_attack_east', 'ANIMA_link_attack_west').mirrorAnimation_Horz();


}   // addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0)



class Testy{
    constructor(canvas, scale) {
        this.x = 150
        this.y = 100
    }

    update() {
    }

    draw(ctx, scale) {
        GRAPHICS.getAnimation('ANIMA_link_attack_west').animate(ENGINE.clockTick, ctx, this.x, this.y, scale);
    }
}