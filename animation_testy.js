const ENGINE = new GameEngine();
const ASSETLOAD = new AssetManager("./assets/");
const RENDER = new AnimationManager();

ASSETLOAD.queueDownload("link3.png", "overworld_tiles.png")

ASSETLOAD.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

    aniBuild();
    ENGINE.addEntity(new Testy());

	ENGINE.init(ctx);
	ENGINE.start();
	
});

function aniBuild() {
    RENDER.addSpriteSheet('LINK', ASSETLOAD.getAsset('link3.png'));

    RENDER.addSpriteRow('southRun', 'LINK', 19, 2, 16, 24, 8, 1);
    
    RENDER.getSpriteSet('southRun').mirrorSet_Vert();

    RENDER.addAnimation('aniSouthRun', 'southRun', 8, 0.10);
    RENDER.getAnimation('aniSouthRun').setAnimaSpeed(75);


    RENDER.addAnimation('aniSouthWalk', 'southRun', 8, 0.4);

    RENDER.addSpriteRow('northRun', 'LINK', 19, 110, 16, 24, 8, 1);
    RENDER.addAnimation('aniNorthRun', 'northRun', 8, 0.15);

    RENDER.addSpriteRow('eastRun', 'LINK', 19, 58, 17, 24, 8, 1);
    RENDER.getSpriteSet('eastRun').mirrorSet_Horz();
    RENDER.addAnimation('aniEastRun', 'eastRun', 8, 0.15);

    RENDER.addSpriteRow('southWalk', 'LINK', 156, 2, 16, 24, 6, 1);
    RENDER.addAnimation('blop', 'southWalk', 6, 0.15);

    RENDER.addSpriteRow('test1', 'LINK', 19, 137, 16, 28, 5, 1);
    RENDER.addAnimation('aniTest1', 'test1', 5, 0.15);

    RENDER.addSpriteSet('falling', 'LINK',
            [72,  94, 112, 128, 138, 147],
            [94, 112, 127, 138, 147, 153],
            168, 189,
            [0, 0, 0, 2, 4, 4]
    );

    RENDER.addAnimation('aniFall', 'falling', 7, [1,0.2,0.2,0.2,0.2,0.2,1]);
    RENDER.getAnimation('aniFall').reverseAnima();

    RENDER.addSpriteRow('test2', 'LINK', 308, 171, 16, 19, 4, 1);
    RENDER.addAnimation('aniTest2', 'test2', 4, 0.2);

    // addSpriteRow(id, spriteSheet, x_orig, y_orig, width, height, count, gap, x_offsets = 0, y_offsets = 0)
    // addSpriteSet(id, spriteSheet, x_origs, x_ends, y_origs, y_ends, x_offsets = 0, y_offsets = 0)
    // addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0)
}


class Testy{
    constructor() {
        this.scale = 6
    }

    update() {

    }

    draw(ctx) {
        let s = this.scale
        // RENDER.getAnimation('aniNorthRun').animate(ENGINE.clockTick, ctx, 10*s, 10*s, s, s);
        // RENDER.getAnimation('aniSouthRun').animate(ENGINE.clockTick, ctx, 10*s, 40*s, s, s);
        RENDER.getAnimation('aniEastRun').animate(ENGINE.clockTick, ctx, 10*s, 60*s, s, s);
        // RENDER.getAnimation('aniSouthWalk').animate(ENGINE.clockTick, ctx, 40*s, 40*s, s, s);
        RENDER.getAnimation('aniFall').animate(ENGINE.clockTick, ctx, 250, 250, s, s);
        RENDER.getAnimation('aniSouthRun').animate(ENGINE.clockTick, ctx, 80, 80, s);
        //RENDER.getSpriteSet('southRun').drawSprite(ctx, 0, 100, 100,5)
    }

    //drawSprite(ctx, sKey, dx, dy, xScale = 1, yScale = xScale) {
}