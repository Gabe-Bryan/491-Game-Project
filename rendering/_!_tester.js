const ENGINE = new GameEngine();
const ASSET_MANAGER = new AssetManager("../assets/");
const ANIMANAGER = new AnimationManager();
const SCALE = 5;

ASSET_MANAGER.queueDownload("link.png")

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
    ANIMANAGER.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'));

    //         id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs
    ANIMANAGER.addSpriteRow('SET_link_south', 'LINK', 9, 90, 11, 16, 24, [16, 11,  9,  7, 10, 10,  7, 10]);

    //                            id, spriteSheet, x_orig, y_orig, width, height, count, gaps, x_offsets = 0, y_offset = 0
    //ANIMANAGER.addSpriteRow('SET_link_south', 'LINK', 90, 11, 16, 24,  9, [16, 11,  9,  7, 10, 10,  7, 10]);

    // ANIMANAGER.addSpriteRow('SET_link_north', 'LINK',  3, 94, 16, 24,  9, [11, 11,  8, 11,  7,  9,  8,  8]);
    // ANIMANAGER.addSpriteRow('SET_link_east' , 'LINK',  4, 55, 17, 24,  9, [10,  9, 10,  6,  8,  9,  4,  4]);

    ANIMANAGER.addAnimation('ANIMA_link_run_south', 'SET_link_south', [1,2,3,4,5,6,7], 0.1);
    // ANIMANAGER.addAnimation('ANIMA_link_run_north', 'SET_link_north', [1,2,3,4,5,6,7], 0.1);
    // ANIMANAGER.addAnimation('ANIMA_link_run_east',  'SET_link_east',  [1,2,3,4,5,6,7], 0.1);
    // ANIMANAGER.cloneAnimation('ANIMA_link_run_west', 'ANIMA_link_run_east').mirrorAnimation_Horz();

    // ANIMANAGER.addAnimation('ANIMA_link_Idle_south', 'SET_link_south', [0], 2);
    // ANIMANAGER.addAnimation('ANIMA_link_Idle_north', 'SET_link_north', [0], 2);
    // ANIMANAGER.addAnimation('ANIMA_link_Idle_east', 'SET_link_east', [0], 2);
    // ANIMANAGER.cloneAnimation('ANIMA_link_Idle_west', 'ANIMA_link_Idle_east').mirrorAnimation_Horz();
}


class Testy{
    constructor(canvas, scale) {
        this.x = (canvas.width - 16 * scale) / 2;
        this.y = (canvas.height - 24 * scale) / 2;

    }

    update() {
    }

    draw(ctx, scale) {
        ANIMANAGER.getAnimation('ANIMA_link_run_south').animate(ENGINE.clockTick, ctx, this.x, this.y, scale);
    }
}