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


            /// /// E N E M I E S /// /// /// 
    // addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs = 0, y_ofs = 0, labels)
    GRAPHICS.addSpriteSheet('ENEMIES', ASSET_MANAGER.getAsset('enemies.png'));
    GRAPHICS.addSpriteSet('SET_blue_enemy_south', 'ENEMIES',  1, [156, 197, 235, 277], 22, 38);
    GRAPHICS.addSpriteSet('SET_blue_enemy_north', 'ENEMIES', 81, [161, 197, 240, 281], 22, 35, 0, [0, -6, 0, 0]);
    GRAPHICS.addSpriteSet('SET_blue_enemy_west',  'ENEMIES', 36, [161, 200, 240], [30,33,30], 28, [0,-3,0])
    
    GRAPHICS.addAnimation('ANIMA_blue_enemy_south', 'SET_blue_enemy_south', 4,  1);
    GRAPHICS.addAnimation('ANIMA_blue_enemy_north', 'SET_blue_enemy_north', 4, 1);
    GRAPHICS.addAnimation('ANIMA_blue_enemy_west', 'SET_blue_enemy_west', 3, 1);
    GRAPHICS.cloneAnimation('ANIMA_blue_enemy_east', 'ANIMA_blue_enemy_west').mirrorAnimation_Horz(0);

    /// /// B U N N Y /./././././././././
    GRAPHICS.addSpriteSheet('CHARTR1', ASSET_MANAGER.getAsset('characters.png'))
    GRAPHICS.addSpriteSet('SET_bunny', 'CHARTR1', [4, 28, 52, 76, 100, 125, 149, 174], 419, 17, 25, 0, [0,0,0,0,0,0,0,-1]);

    GRAPHICS.addAnimation('ANIMA_bunny_south', 'SET_bunny', [2,3,4], 0.2);
    GRAPHICS.addAnimation('ANIMA_bunny_north', 'SET_bunny', [5,6,7], 1);
    GRAPHICS.addAnimation('ANIMA_bunny_east', 'SET_bunny', [0,1], 0.2);
    GRAPHICS.cloneAnimation('ANIMA_bunny_west','ANIMA_bunny_east').mirrorAnimation_Horz()


}   // addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0)

class Testy{
    constructor(canvas, scale) {this.x = 150; this.y = 100;}
    update(){}
    draw(ctx, scale) {
        GRAPHICS.getAnimation('ANIMA_bunny_west').animate(ENGINE.clockTick, ctx, this.x, this.y, scale);
    }
}