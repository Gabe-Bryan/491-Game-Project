class GraphicsLoader {
    constructor() {

        /// /// T I L E S /// ///
        GRAPHICS.addSpriteSheet('OW_TILES', ASSET_MANAGER.getAsset('overworld_tiles.png'));
        GRAPHICS.addSpriteSheet('DUNGEON_TILES', ASSET_MANAGER.getAsset('dungeon_tiles.png'));

        GRAPHICS.addSpriteSet(
            'environment', 'OW_TILES',
            [253, 270, 287, 304, 725, 759, 776, 83],
            [ 57,  57,  57,  57,  33, 67, 67, 299],
            16, 16, 0, 0,
            ['grass_light', 'grass_thick', 'signpost_stump', 'bush1', 'grass_patch', 'light8block', 'dark8block', 'sand']
        );

        GRAPHICS.addSpriteSet(
            'environment', 'DUNGEON_TILES',
            [31, 59, 391],
            [46, 30, 712],
            16, 16, 0, 0,
            ['floor_blue_cobblestone', 'floor_purple_stone_tile', 'blocker_yellow_stone']
        );

        const spt = GRAPHICS.get('environment');
        GRAPHICS.addTile('grass', spt.gsl('grass_thick'));
        GRAPHICS.addTile('sand', spt.gsl('sand'));
        GRAPHICS.addTile('stone on grass', spt.gsl('grass_thick'), spt.gsl('light8block')).setBackgroundColor('rgb(72,152,72)');
        GRAPHICS.addTile('stone on sand', spt.gsl('sand'), spt.gsl('light8block'));
        GRAPHICS.addTile('floor blue cobblestone', spt.gsl('floor_blue_cobblestone'));
        GRAPHICS.addTile('floor purple stone tile', spt.gsl('floor_purple_stone_tile'));
        GRAPHICS.addTile('blocker yellow stone', spt.gsl('blocker_yellow_stone'))
        

        // const theSprites = GRAPHICS.get('environment');
        // theSprites.forEach(sprite => {
        //     let label = sprite.label; // every sprite in the set needs to be already labeled
        //     theTileSet.addTile(String(label + '_tile'), label);
        // });


        /// /// L I N K /// ///
        
        GRAPHICS.addSpriteSheet('LINK', ASSET_MANAGER.getAsset('link.png'));
        GRAPHICS.addSpriteRow('SET_link_south', 'LINK', 9, 90, 11, 16, 24, [16, 11,  9,  7, 10, 10,  7, 10]);
        GRAPHICS.addSpriteRow('SET_link_north', 'LINK', 9,  3, 94, 16, 24, [11, 11,  8, 11,  7,  9,  8,  8]);
        GRAPHICS.addSpriteRow('SET_link_east' , 'LINK', 9,  4, 55, 17, 24, [10,  9, 10,  6,  8,  9,  4,  4]);

        // pain game
        GRAPHICS.get('SET_link_south').addDeathFlashes();
        GRAPHICS.get('SET_link_north').addDeathFlashes();
        GRAPHICS.get('SET_link_east').addDeathFlashes();

        GRAPHICS.addAnimation('ANIMA_link_hurt_south', 'SET_link_south', [0,8,9,8], [0.1, 0.15, 0.1, 0.15]);
        GRAPHICS.addAnimation('ANIMA_link_hurt_north', 'SET_link_north', [0,8,9,8], [0.1, 0.15, 0.1, 0.15]);
        GRAPHICS.addAnimation('ANIMA_link_hurt_east', 'SET_link_east', [0,8,9,8], [0.1, 0.15, 0.1, 0.15]);
        GRAPHICS.cloneAnimation('ANIMA_link_hurt_west', 'ANIMA_link_hurt_east').mirrorAnimation_Horz();


        GRAPHICS.addAnimation('ANIMA_link_run_south', 'SET_link_south', [1,2,3,4,5,6,7], 0.1);
        GRAPHICS.addAnimation('ANIMA_link_run_north', 'SET_link_north', [1,2,3,4,5,6,7], 0.1);
        GRAPHICS.addAnimation('ANIMA_link_run_east',  'SET_link_east',  [1,2,3,4,5,6,7], 0.1);
        GRAPHICS.cloneAnimation('ANIMA_link_run_west', 'ANIMA_link_run_east').mirrorAnimation_Horz();

        GRAPHICS.addAnimation('ANIMA_link_Idle_south', 'SET_link_south', [0], 2);
        GRAPHICS.addAnimation('ANIMA_link_Idle_north', 'SET_link_north', [0], 2);
        GRAPHICS.addAnimation('ANIMA_link_Idle_east', 'SET_link_east', [0], 2);
        GRAPHICS.cloneAnimation('ANIMA_link_Idle_west', 'ANIMA_link_Idle_east').mirrorAnimation_Horz();

        GRAPHICS.addSpriteSet( // Link attack
        'SET_link_attack_west', 'LINK',
            [519, 546, 574, 611, 652, 681, 708], [192, 191, 192, 192, 192, 192, 192],
            [ 16,  23,  30,  31,  28,  23,  24], [ 23,  24,  23,  23,  29,  31,  23],
            [0, -7, -13, -14, -12, -7, 0], [0, -1, 0, 0, 0, 0, 0]
        );

        GRAPHICS.addAnimation('ANIMA_link_attack_west', 'SET_link_attack_west', 6, [0.095, 0.06, 0.04, 0.03, 0.06, 0.095]); 
        GRAPHICS.cloneAnimation('ANIMA_link_attack_east', 'ANIMA_link_attack_west').mirrorAnimation_Horz(0);

        GRAPHICS.addSpriteSet(
            'SET_link_attack_north', 'LINK',
            [517, 546, 582, 611, 643, 686], [243, 235, 230, 235, 242, 239],
            [ 22,  22,  20,  24,  32,  19], [ 22,  30,  35,  30,  23,  26],
            [  0,   0,   0,  -4, -11,   0], [  0,  -7,  -9,  -5,   0,  -4]
        );
        GRAPHICS.addAnimation('ANIMA_link_attack_north', 'SET_link_attack_north', [0,1,2,3,4], [0.10, 0.07, 0.04, 0.07, 0.10]);
    
        GRAPHICS.addSpriteSet(
            'SET_link_attack_south', 'LINK',
            [510, 542, 571, 598, 624, 661, 701], [282, 283, 282, 283, 284, 284, 284],
            [ 20,  22,  20,  20,  28,  32,  19], [ 23,  24,  31,  31,  29,  27,  30],
            [  0,  -2,   0,   0,   0,   0,   0], [  0,   0,   0,   0,   0,   0,   0]
        );
    
        GRAPHICS.addAnimation('ANIMA_link_attack_south', 'SET_link_attack_south', 6, [0.095, 0.06, 0.04, 0.03, 0.06, 0.095], -3, 3);


        GRAPHICS.addSpriteSheet('CHARS', ASSET_MANAGER.getAsset('characters.png'));
        GRAPHICS.addSpriteSet('link_dead', 'CHARS', 267, 388, 24, 15);

        /// /// E N E M I E S /// /// /// 
        GRAPHICS.addSpriteSheet('ENEMIES', ASSET_MANAGER.getAsset('enemies.png'));
        GRAPHICS.addSpriteSet('SET_blue_enemy_south', 'ENEMIES',  1, [156, 197, 235, 277], 22, 38);
        GRAPHICS.addSpriteSet('SET_blue_enemy_north', 'ENEMIES', 81, [161, 197, 240, 281], 22, 35, 0, [0, -6, 0, 0]);
        GRAPHICS.addSpriteSet('SET_blue_enemy_west',  'ENEMIES', 36, [161, 200, 240], [30,33,30], 28, [-12, -15, -12]);
        
        GRAPHICS.addAnimation('ANIMA_blue_enemy_south', 'SET_blue_enemy_south', 4, 0.2);
        GRAPHICS.addAnimation('ANIMA_blue_enemy_north', 'SET_blue_enemy_north', 4, 0.2);
        GRAPHICS.addAnimation('ANIMA_blue_enemy_west', 'SET_blue_enemy_west', 3, 0.2);
        GRAPHICS.cloneAnimation('ANIMA_blue_enemy_east', 'ANIMA_blue_enemy_west').mirrorAnimation_Horz(0);


        GRAPHICS.addSpriteSet('SET_monster_enemy_south', 'ENEMIES', 124, [0, 38, 81], 16, [28, 32, 26]);
        GRAPHICS.addSpriteSet('SET_monster_enemy_north', 'ENEMIES', 203, [1, 41, 81], 18, [25, 25, 28]);
        GRAPHICS.addSpriteSet('SET_monster_enemy_west', 'ENEMIES', [162, 160, 163], [1, 42, 81], [19, 24, 17], [25, 24, 25]);
    
        GRAPHICS.addAnimation('ANIMA_monster_enemy_south', 'SET_monster_enemy_south', 3, 0.5, 0, 0);
        GRAPHICS.addAnimation('ANIMA_monster_enemy_north', 'SET_monster_enemy_north', 3, 0.5, 0, 0).setReverseAnima();
        GRAPHICS.addAnimation('ANIMA_monster_enemy_west', 'SET_monster_enemy_west', 3, 1, 0, 0);
        GRAPHICS.cloneAnimation('ANIMA_monster_enemy_east', 'ANIMA_monster_enemy_west').mirrorAnimation_Horz([-2,-10,0]).setReverseAnima();

        GRAPHICS.addSpriteGrid('SET_green_goblin', 'ENEMIES', 1, 6, 449, 295, 22, 25, 11, 5);
        GRAPHICS.addSpriteSet('SET_green_goblin_east', 'ENEMIES', [402, 427], 293, 18, 25);
    
        GRAPHICS.addSpriteGrid('SET_red_goblins', 'ENEMIES', 1, 6, 448, 331, 22, 25, 0, [3, 4, 7, 3, 4]);
        GRAPHICS.addSpriteSet('SET_red_goblin_east', 'ENEMIES', [402, 424], 330, 18, 25);

        GRAPHICS.addAnimation('ANIMA_green_goblin_south', 'SET_green_goblin', [0,1,2], 0.5);
        GRAPHICS.addAnimation('ANIMA_green_goblin_north', 'SET_green_goblin', [3,4,5], 0.5);
        GRAPHICS.addAnimation('ANIMA_green_goblin_east', 'SET_green_goblin_east', 2, 0.5);
        GRAPHICS.cloneAnimation('ANIMA_green_goblin_west', 'ANIMA_green_goblin_east').mirrorAnimation_Horz();
    
        GRAPHICS.addAnimation('ANIMA_red_goblin_south', 'SET_red_goblin', [0,1,2], 0.5);
        GRAPHICS.addAnimation('ANIMA_red_goblin_north', 'SET_red_goblin', [3,4,5], 0.5);
        GRAPHICS.addAnimation('ANIMA_red_goblin_east', 'SET_red_goblin_east', 2, 0.5);
        GRAPHICS.cloneAnimation('ANIMA_red_goblin_west', 'ANIMA_red_goblin_east').mirrorAnimation_Horz();
    
        GRAPHICS.addSpriteRow('SET_skull_enemy', 'ENEMIES', 5, 602, 172, 18, 18, [3,4,4,3]);
        GRAPHICS.addAnimation('ANIMA_skull_enemy', 'SET_skull_enemy', [0,1,2,4,3,1], 0.3, -3, -2);


        /// /// B U N N Y /./././././././././
        GRAPHICS.addSpriteSheet('CHARTR1', ASSET_MANAGER.getAsset('characters.png'))
        GRAPHICS.addSpriteSet('SET_bunny', 'CHARTR1', [4, 28, 52, 76, 100, 125, 149, 174], 419, 17, 25, 0, [0,0,0,0,0,0,0,-1]);

        GRAPHICS.addAnimation('ANIMA_bunny_south', 'SET_bunny', [2,3,4], 0.2);
        GRAPHICS.addAnimation('ANIMA_bunny_north', 'SET_bunny', [5,6,7], 0.2);
        GRAPHICS.addAnimation('ANIMA_bunny_east', 'SET_bunny', [0,1], 0.2);
        GRAPHICS.cloneAnimation('ANIMA_bunny_west','ANIMA_bunny_east').mirrorAnimation_Horz()

        /// /// EFFECTS /// /// /// 
        GRAPHICS.addSpriteGrid('SET_explode', 'ENEMIES', 1, 6, 441, 733, 32, 33, 0, [8, 6, 6, 5, 7])
        GRAPHICS.addAnimation('ANIMA_explode', 'SET_explode', 
            [   0,    1,    2,    3,    4,    1,    2,    3,    4,    5, 999],
            [0.20, 0.15, 0.10, 0.15, 0.10, 0.15, 0.10, 0.10, 0.15,  0.3, 0]).setLooping(false);
        
        GRAPHICS.addSpriteSheet('DEATHFX', ASSET_MANAGER.getAsset('death_effects.png'));
        GRAPHICS.addSpriteRow('SET_death_effects', 'DEATHFX',7, 0,4,26,23,0);
        GRAPHICS.addAnimation('ANIMA_enemy_death_cloud', 'SET_death_effects', [3,4,5,6,7], 0.3).setLooping(false);

        GRAPHICS.addSpriteSheet('OW_ITEMS', ASSET_MANAGER.getAsset('items.png'));
        GRAPHICS.addSpriteSet(
            "SET_ow_heart", 'OW_ITEMS',
            [88, 104, 85, 100], 280,
            [ 8, 8, 11, 12], [7, 7, 26, 26]
        );
        // GRAPHICS.addAnimation('ANIMA_ow_heart', 'SET_ow_heart', 2, 0.3)

        GRAPHICS.addSpriteSet(
            'SET_end_game', 'LINK',
            [742, 835, 789, 765], [297, 225, 241, 235], 
            [ 80,  41,  24,  21], [ 80,  61,  15,  21],
            [  0,   0,   0,   3], [  0,   0,  10,   3]
        );

    }

    // addSpriteSet(id, spriteSheet, x_origs, y_origs, widths, heights, x_ofs = 0, y_ofs = 0, labels)
    // addSpriteRow(id, spriteSheet, sprite_count, x_orig, y_orig, widths, heights, gaps, x_ofs, y_ofs, labels)
}