const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager("./assets/");
const GRAPHICS = new GraphicsManager();
const GAMEDISPLAY = new GameDisplay();
const SCALE = 3;
const TILE_SIZE = 16;
ASSET_MANAGER.queueDownload(
	"prototype_map.png", 
	"link.png", 
	"overworld_tiles.png", 
	"castle_tiles.png",
	"dungeon_tiles.png",
	"enemies.png", 
	"death_effects.png",
	"characters.png",
	"heart.png", 
	"bomb.png", 
	"key.png",
	"items.png",
	"bombs.png"
);

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	new GraphicsLoader(); // <- just to build the sprites & animations into GRAPHICS

	Player.CURR_PLAYER = new Player(canvas.width/2 - 16, canvas.height/2 - 32);
	gameEngine.addEntity(Player.CURR_PLAYER); 
	//gameEngine.addEntity(new Knight(canvas.width/4, canvas.height/2));
	
	let roomWidth = 20;
	let roomHeight = 16;
	let testMap = new GameMap("prototype_map.png", roomWidth, roomHeight, 16*SCALE, 16*SCALE, {
		'#00ff00':'grass',
		'#555555':'stone_grass',
		'#333333':'stone_sand',
		'#ffff00':'sand',
		'#0000ff':'floor_blue_cobblestone',
		'#008800':'blocker_yellow_stone',
		'#444444':'wall_complex'
	});

	// TESTING SPAWNZ
	// gameEngine.scene.addInteractable(new Bomb(240,200));
	gameEngine.scene.addInteractable(new Projectile('bomb',200, 400, 1));
	// gameEngine.scene.addEnvEntity(new Projectile('ironBall', 200, 400, 1));
	// testMap.addMapCellEntity(1, 2, new Bomb(200,370));


	gameEngine.currMap = testMap;

	////////////////////////////////////////////////////////////
	testMap.addMapCellEntity(2, 2, new Knight(500, 600));
	testMap.addMapCellEntity(2, 2, new Knight(600, 600)); 
	testMap.addMapCellEntity(3, 2, new Knight(600, 600));
	testMap.addMapCellEntity(3, 2, new Bunny(400,400));
	//////////////////////////////////////////////////////////
	// testMap.addMapCellEntity(1, 2, new Bunny(400,400));
	testMap.addMapCellEntity(1, 4, new Triforce(400,300));
	// testMap.addMapCellEntity(1, 2, new HeartDrop(80,80));
	// testMap.addMapCellEntity(1, 2, new HeartDrop(80,650));
	// testMap.addMapCellEntity(1, 2, new HeartDrop(850,80));
	// testMap.addMapCellEntity(1, 2, new HeartDrop(850,650));
	//////////////////////////////////////////////////////////


	let r1_KnightXY = tileToScreenCoord(14, 2);
	let r1_SkullXY = tileToScreenCoord(1, 3);
	testMap.addMapCellEntity(1, 3, new Knight(r1_KnightXY.x, r1_KnightXY.y));
	testMap.addMapCellEntity(1, 3, new Skull(r1_SkullXY.x, r1_SkullXY.y));

	let r2_Knight1XY = tileToScreenCoord(6, 2);
	let r2_Knight2XY = tileToScreenCoord(10, 13);
	let r2_SkullXY = tileToScreenCoord(14, 1);
	testMap.addMapCellEntity(2, 3, new Knight(r2_Knight1XY.x, r2_Knight1XY.y));
	testMap.addMapCellEntity(2, 3, new Knight(r2_Knight2XY.x, r2_Knight2XY.y));
	testMap.addMapCellEntity(2, 3, new Skull(r2_SkullXY.x, r2_SkullXY.y));
	
	let r3_Knight1XY = tileToScreenCoord(6, 13),
		r3_Knight2XY = tileToScreenCoord(13, 13),
		r3_SkullXY = tileToScreenCoord(17, 1),
		r3_Skull2XY = tileToScreenCoord(2, 2);
	
	testMap.addMapCellEntity(2, 4, new Knight(r3_Knight1XY.x, r3_Knight1XY.y));
	testMap.addMapCellEntity(2, 4, new Knight(r3_Knight2XY.x, r3_Knight2XY.y));
	testMap.addMapCellEntity(2, 4, new Skull(r3_SkullXY.x, r3_SkullXY.y));
	testMap.addMapCellEntity(2, 4, new Skull(r3_Skull2XY.x, r3_Skull2XY.y));
	
	// PORTAL TEST STUFF
	let test_portal1XY = tileToScreenCoord(4, 4);
	let test_portal1 = new Portal(test_portal1XY.x, test_portal1XY.y, 'portal1', 1, 2);
	test_portal1.destOffset.y = 16*SCALE;
	
	let test_portal2XY = tileToScreenCoord(14, 4);
	let test_portal2 = new Portal(test_portal2XY.x, test_portal2XY.y, 'portal2', 1, 2);
	test_portal2.destOffset.y = 16*SCALE;

	testMap.addMapCellEntity(1, 2, test_portal1);
	testMap.addMapCellEntity(1, 2, test_portal2);

	test_portal1.setLinkedEntity(test_portal2);
	test_portal2.setLinkedEntity(test_portal1);
	
	// actual starting room is (1, 2)
	let startMapCellX = 1,
		startMapCellY = 2;

	testMap.loadMapCell(startMapCellX, startMapCellY);
	//setInterval(bun, bt)
	
	testMap.addMapEntitiesToEngine(gameEngine);
	testMap.addInteractableToEngine(gameEngine);

	gameEngine.init(ctx);

	gameEngine.start();

	console.log(`   Sprites loaded ${Sprite.SPRITE_COUNT}`);
	console.log(`SpriteSets loaded ${SpriteSet.SPRITE_SET_COUNT}`);
	console.log(`Animations loaded ${Animation.ANIMATION_COUNT}`);

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