class AnimationBuilder {
    constructor() {
        ANIMANAGER.addSpriteSheet('OW_TILES', ASSET_MANAGER.getAsset('overworld_tiles.png'));

        ANIMANAGER.addSpriteSet('env_grasses', 'OW_TILES',
                        [253, 270, 287, 304, 725],
                        [269, 286, 303, 320, 741],
                        [ 57,  57,  57,  57,  33],
                        [ 73,  73,  73,  73,  49]);

        ANIMANAGER.addSpriteSet('env_stones', 'OW_TILES', 
                        [759, 776],
                        [775, 792],
                        [67, 67],
                        [83, 83]);

        ANIMANAGER.addSpriteSet('env_sands', 'OW_TILES',
                        [83],
                        [99],
                        [299],
                        [315]);
    
        
        
        // ANIMANAGER.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('linkNWSE.png'));
        // // addSpriteRow(id, spriteSheet, x_orig, y_orig, width, height, count, gaps, x_offsets = 0, y_offset = 0) {
        // ANIMANAGER.addSpriteRow('SET_link_run_south', 'LINK', 0, 0, 16, 24, 8, 1);
        // ANIMANAGER.addSpriteRow('SET_link_run_north', 'LINK', 0, 24, 16, 24, 8, 1);
        // ANIMANAGER.addSpriteRow('SET_link_run_east', 'LINK', 0, 49, 17, 24, 8, 1);
        // ANIMANAGER.addSpriteRow('SET_link_run_west', 'LINK', 0, 74, 17, 24, 8, 1);
        // ANIMANAGER.addSpriteRow('SET_link_Idle_SNEW', 'LINK', 0, 104, 16, 24, 8, 1);

        // //addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0) {
        // ANIMANAGER.addAnimation('ANIMA_link_run_south', 'SET_link_run_south', 8, 0.1);
        // ANIMANAGER.addAnimation('ANIMA_link_run_north', 'SET_link_run_north', 8, 0.1);
        // ANIMANAGER.addAnimation('ANIMA_link_run_west', 'SET_link_run_west', 8, 0.1);
        // ANIMANAGER.addAnimation('ANIMA_link_run_east', 'SET_link_run_east', 8, 0.1);

        // ANIMANAGER.addAnimation('ANIMA_link_Idle_south', 'SET_link_Idle_SNEW', [0], 2);
        // ANIMANAGER.addAnimation('ANIMA_link_Idle_north', 'SET_link_Idle_SNEW', [1], 2);
        // ANIMANAGER.addAnimation('ANIMA_link_Idle_east', 'SET_link_Idle_SNEW', [2], 2);
        // ANIMANAGER.addAnimation('ANIMA_link_Idle_west', 'SET_link_Idle_SNEW', [3], 2);

        ANIMANAGER.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'));
        ANIMANAGER.addSpriteRow('SET_link_south', 'LINK', 90, 11, 16, 24,  9, [16, 11,  9,  7, 10, 10,  7, 10]);
        ANIMANAGER.addSpriteRow('SET_link_north', 'LINK',  3, 94, 16, 24,  9, [11, 11,  8, 11,  7,  9,  8,  8]);
        ANIMANAGER.addSpriteRow('SET_link_east' , 'LINK',  4, 55, 17, 24,  9, [10,  9, 10,  6,  8,  9,  4,  4]);
        ANIMANAGER.getSpriteSet('SET_link_east').clone('SET_link_west', ANIMANAGER).mirrorHorz();

        ANIMANAGER.addAnimation('ANIMA_link_run_south', 'SET_link_south', [1,2,3,4,5,6,7,8], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_north', 'SET_link_north', [1,2,3,4,5,6,7,8], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_west', 'SET_link_west', [1,2,3,4,5,6,7,8], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_east', 'SET_link_east', [1,2,3,4,5,6,7,8], 0.1);

        ANIMANAGER.addAnimation('ANIMA_link_Idle_south', 'SET_link_south', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_north', 'SET_link_north', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_east', 'SET_link_east', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_west', 'SET_link_west', [0], 2);
        
    }
}