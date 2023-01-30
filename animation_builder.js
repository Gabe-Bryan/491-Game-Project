class AnimationBuilder {
    constructor() {
        ANIMANAGER.addSpriteSheet('OW_TILES', ASSET_MANAGER.getAsset('overworld_tiles.png'));
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
    
        
        ANIMANAGER.addSpriteSheet('LINKold', ASSET_MANAGER.getAsset('linkNWSE.png'));

        ANIMANAGER.addSpriteRow('SET_link_run_west', 'LINKold', 0, 74, 17, 24, 8, 1);
        ANIMANAGER.addSpriteRow('SET_link_Idle_SNEW', 'LINKold', 0, 104, 16, 24, 8, 1);

        // addSpriteRow(id, spriteSheet, x_orig, y_orig, width, height, count, gaps, x_offsets = 0, y_offset = 0) {

        ANIMANAGER.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'));
        ANIMANAGER.addSpriteRow('SET_link_south', 'LINK', 90, 11, 16, 24,  9, [16, 11,  9,  7, 10, 10,  7, 10]);
        ANIMANAGER.addSpriteRow('SET_link_north', 'LINK',  3, 94, 16, 24,  9, [11, 11,  8, 11,  7,  9,  8,  8]);
        ANIMANAGER.addSpriteRow('SET_link_east' , 'LINK',  4, 55, 17, 24,  9, [10,  9, 10,  6,  8,  9,  4,  4]);
        ANIMANAGER.getSpriteSet('SET_link_east').clone('SET_link_west', ANIMANAGER).mirrorSet_Horz();

        //ANIMANAGER.addSpriteRow('SET_link_Idle_SNEW', 'LINKold', 0, 104, 16, 24, 8, 1);

        ANIMANAGER.addSpriteSet('SET_link_attack_west', 'LINK', [519, 546, 574, 611, 652, 681], [535, 569, 604, 642, 680, 704], [192, 191, 192, 192, 192, 192], [215, 215, 215, 215, 221, 223], [0, -9, -13, -14, -12, -7], [0, -1, 0, 0, 0, 0]);
        let clone = ANIMANAGER.getSpriteSet('SET_link_attack_west').clone('SET_link_attack_east', ANIMANAGER);
        clone.mirrorSet_Horz();
        clone.x_offset_s = [0, 0, 0, 0, 0, 0];

        //addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0) {
        ANIMANAGER.addAnimation('ANIMA_link_run_south', 'SET_link_south', [1,2,3,4,5,6,7,8], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_north', 'SET_link_north', [1,2,3,4,5,6,7,8], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_west', 'SET_link_west', [1,2,3,4,5,6,7,8], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_east', 'SET_link_east', [1,2,3,4,5,6,7,8], 0.1);

        ANIMANAGER.addAnimation('ANIMA_link_Idle_south', 'SET_link_south', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_north', 'SET_link_north', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_east', 'SET_link_east', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_west', 'SET_link_west', [0], 2);

        ANIMANAGER.addAnimation('ANIMA_link_attack_west', 'SET_link_attack_west', 6, [0.1, 0.07, 0.05, 0.04, 0.07, 0.1]);        
        ANIMANAGER.addAnimation('ANIMA_link_attack_east', 'SET_link_attack_east', 6, [0.1, 0.07, 0.05, 0.04, 0.07, 0.1]);  
    }
}