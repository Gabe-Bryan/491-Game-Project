class AnimationBuilder {
    constructor() {
        ANIMANAGER.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'))
        ANIMANAGER.addSpriteSheet('OW_TILES', ASSET_MANAGER.getAsset('overworld_tiles.png'))

        //addSpriteSet(id, spriteSheet, x_origs, x_ends, y_origs, y_ends, x_offsets = 0, y_offsets = 0)
        ANIMANAGER.addSpriteSet('SET:link_run_south', 'LINK', 
                        [ 90, 122, 149, 174, 197, 223, 249, 272, 298],
                        [106, 138, 165, 190, 213, 239, 265, 288, 314],
                        11, 35);

        //addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0) {
        ANIMANAGER.addAnimation('link_run_south', 'SET:link_run_south', [1,2,3,4,5,6,7], 0.1);
    }
}