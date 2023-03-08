const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager("./assets/");
const GRAPHICS = new GraphicsManager();
const GAMEDISPLAY = new GameDisplay();
const SCALE = 3;
const TILE_SIZE = 16;
const HUD_BUFFER = 100;
ASSET_MANAGER.queueDownload(
	"prototype_map.png", 
	"link.png", 
	"overworld_tiles.png", 
	"castle_tiles.png",
	"dungeon_tiles.png",
	"cliff_water_tiles.png",
	"enemies.png", 
	"death_effects.png",
	"characters.png",
	"heart.png", 
	"bomb.png", 
	"key.png",
	"items.png",
	"aboda_village.mp3",
	"slash.wav",
	"link_die.wav",
	"link_hurt.wav",
	"enemy_hurt.wav",
	"enemy_die.wav",
	"bombs.png"
);

let START_POS 
ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	canvas.height += HUD_BUFFER;
	ctx.translate(0, HUD_BUFFER);
	ctx.imageSmoothingEnabled = false;
	new GraphicsLoader();

	Player.CURR_PLAYER = new Player(tileToScreenCoord(7, 6));
	gameEngine.addEntity(Player.CURR_PLAYER); 
	
	let roomWidth = 20;
	let roomHeight = 16;
	let testMap = new GameMap("prototype_map.png", roomWidth, roomHeight, 16*SCALE, 16*SCALE, {
		'#00ff00':'grass',
		'#555555':'stone_grass',
		'#333333':'stone_sand',
		'#ffff00':'sand',
		'#0000ff':'floor_blue_cobblestone',
		'#008800':'blocker_yellow_stone',
		'#444444':'wall_complex',
		'#483828':'mountain',
		'#485b28':'grass_mount_edge_S',
		'#480028':'grass_mount_edge_S_Stone',
		'#584828':'stairs'
	});

	gameEngine.currMap = testMap;
	new _obj_Placer(testMap)
	
	////// P O R T A L S //////
	let dungeonPortalInXY = tileToScreenCoord(7, 8),
		dungeonPortalOutXY = tileToScreenCoord(9, 2);

	dungeonPortalOutXY.x += 8*SCALE;
	
	let dungeonPortalIn = new Portal(dungeonPortalInXY.x, dungeonPortalInXY.y, 'pink', 12, 1),
		dungeonPortalOut = new Portal(dungeonPortalOutXY.x, dungeonPortalOutXY.y, 'pink', 1, 2);

	dungeonPortalIn.setTwoWayLinkedEntity(dungeonPortalOut);

	testMap.addMapCellEntity(12, 1, dungeonPortalIn);
	testMap.addMapCellEntity(1, 2, dungeonPortalOut);
	////// . . . . . . . . . . 

	// setInterval(bun, bt) <- bunny generator
	// actual starting room is (11, 1)
	let startMapCellX = 11, // 11
		startMapCellY = 1;  // 1

	testMap.loadMapCell(startMapCellX, startMapCellY);
	testMap.addMapEntitiesToEngine(gameEngine);
	testMap.addInteractableToEngine(gameEngine);

	gameEngine.init(ctx);
	gameEngine.start();   
	
	// console.log(`   Sprites loaded ${Sprite.SPRITE_COUNT}`);
	// console.log(`SpriteSets loaded ${SpriteSet.SPRITE_SET_COUNT}`);
	// console.log(`Animations loaded ${Animation.ANIMATION_COUNT}`);

});




































// nothing to see here, go back up













































// no really, its dark down here, you wouldn't like it.
















































// very well, BEHOLD!



    //-----------------------------------\\
   // * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ \\
  // ~※~ ⁘ ~ B U N N Y   F A R M ~ ⁘ ~※~ \\
 // ~※~ ⁕ 🐇 ⁘⁕⁘ 🐇  ⁘⁕⁘ 🐇 ⁘⁕⁘ 🐇⁕ ~※~ \\
//-------------------------------------------\\
var bt = 20000; var bc = 0;
function bun() {
	bt *= 0.95;
	console.log(`bunny, time:${bt}`);
	if (bc < 25000) {
		gameEngine.scene.addInteractable(gameEngine.currMap.getMapCellX(), gameEngine.currMap.getMapCellY(), new Bunny(200 + (Math.random()*560), 200 + (Math.random()*368)));
		bc++;
	}
	
}