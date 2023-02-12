class AnimationBuilder {
    constructor() {

        /// /// T I L E S /// ///
        ANIMANAGER.addSpriteSheet('OW_TILES', ASSET_MANAGER.getAsset('overworld_tiles.png'));

        // addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs, y_ofs) {
        ANIMANAGER.addSpriteSet(
            'env_grasses', 'OW_TILES',
            [253, 270, 287, 304, 725],
            [269, 286, 303, 320, 741],
            64, 64
        );
        /*
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

        /// /// L I N K /// ///
        
        ANIMANAGER.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'));
        ANIMANAGER.addSpriteRow('SET_link_south', 'LINK', 90, 11, 16, 24,  9, [16, 11,  9,  7, 10, 10,  7, 10]);
        ANIMANAGER.addSpriteRow('SET_link_north', 'LINK',  3, 94, 16, 24,  9, [11, 11,  8, 11,  7,  9,  8,  8]);
        ANIMANAGER.addSpriteRow('SET_link_east' , 'LINK',  4, 55, 17, 24,  9, [10,  9, 10,  6,  8,  9,  4,  4]);

        ANIMANAGER.addAnimation('ANIMA_link_run_south', 'SET_link_south', [1,2,3,4,5,6,7], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_north', 'SET_link_north', [1,2,3,4,5,6,7], 0.1);
        ANIMANAGER.addAnimation('ANIMA_link_run_east',  'SET_link_east',  [1,2,3,4,5,6,7], 0.1);
        ANIMANAGER.cloneAnimation('ANIMA_link_run_west', 'ANIMA_link_run_east').mirrorAnimation_Horz();

        ANIMANAGER.addAnimation('ANIMA_link_Idle_south', 'SET_link_south', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_north', 'SET_link_north', [0], 2);
        ANIMANAGER.addAnimation('ANIMA_link_Idle_east', 'SET_link_east', [0], 2);
        ANIMANAGER.cloneAnimation('ANIMA_link_Idle_west', 'ANIMA_link_Idle_east').mirrorAnimation_Horz();

        ANIMANAGER.addSpriteSet( // Link attack
            'SET_link_attack_west', 'LINK',
            [519, 546, 574, 611, 652, 681],
            [535, 569, 604, 642, 680, 704],
            [192, 191, 192, 192, 192, 192],
            [215, 215, 215, 215, 221, 223],
            [0, -9, -13, -14, -12, -7],
            [0, -1, 0, 0, 0, 0]
        );

        ANIMANAGER.addAnimation('ANIMA_link_attack_west', 'SET_link_attack_west', 6, [0.1, 0.07, 0.05, 0.04, 0.07, 0.1]); 
        ANIMANAGER.cloneAnimation('ANIMA_link_attack_east', 'ANIMA_link_attack_west').mirrorAnimation_Horz([0, 0, 0, 0, 0, 0]);

        /// /// E N E M I E S /// /// ///
        ANIMANAGER.addSpriteSheet('ENEMIES', ASSET_MANAGER.getAsset('enemies.png'));

        ANIMANAGER.addSpriteSet('SET_blue_enemy_south', 'ENEMIES', 1, 23, [156, 197, 235, 277], [191, 230, 273, 311])
        ANIMANAGER.addSpriteSet('SET_blue_enemy_north', 'ENEMIES', 81, 103, [156, 197, 235, 277], [191, 230, 273, 311], 0, [0, -1, 0, 1])
        ANIMANAGER.addSpriteSet('SET_blue_enemy_west', 'ENEMIES', 36, 68, [161, 200, 240], [187, 227, 267], [0,-2,0])
        
        ANIMANAGER.addAnimation('ANIMA_blue_enemy_south', 'SET_blue_enemy_south', 4, 0.2);
        ANIMANAGER.addAnimation('ANIMA_blue_enemy_north', 'SET_blue_enemy_north', 4, 0.2);
        ANIMANAGER.addAnimation('ANIMA_blue_enemy_west', 'SET_blue_enemy_west', 3, 0.2);
        ANIMANAGER.cloneAnimation('ANIMA_blue_enemy_east', 'ANIMA_blue_enemy_west').mirrorAnimation_Horz([0, 2, 0]);
        

        /// /// B U N N Y /./././././././././
        ANIMANAGER.addSpriteSheet('CHARTR1', ASSET_MANAGER.getAsset('characters.png'))
        ANIMANAGER.addSpriteRow('SET_bunny', 'CHARTR1', 4, 419, 17, 25, 8, 7);

        ANIMANAGER.addAnimation('ANIMA_bunny_south', 'SET_bunny', [2,3,4], 0.2);
        ANIMANAGER.addAnimation('ANIMA_bunny_north', 'SET_bunny', [5,6,7], 0.2);
        ANIMANAGER.addAnimation('ANIMA_bunny_east', 'SET_bunny', [0,1], 0.2);
        ANIMANAGER.cloneAnimation('ANIMA_bunny_west','ANIMA_bunny_east').mirrorAnimation_Horz()

        */
    }
}

        // addSpriteSet(id, spriteSheet, x_origs, x_ends, y_origs, y_ends, x_offsets = 0, y_offsets = 0)
        // addAnimation(id, spriteSetName, fSequence, fTiming, x_offset = 0, y_offset = 0)