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
	"aboda_village.mp3",
	"slash.wav",
	"link_die.wav",
	"link_hurt.wav",
	"enemy_hurt.wav",
	"enemy_die.wav",
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
	// gameEngine.scene.addInteractable(new Projectile('bomb', 400, 600, {x: -0.7, y:0.5}));
	// gameEngine.scene.addEnvEntity(new Projectile('ironBall', 200, 600, {x:-0.5, y:1}));
	// gameEngine.scene.addEnvEntity(new Projectile('arrow', 100, 280, 1));
	// gameEngine.scene.addEnvEntity(new Projectile('trident', 100, 360, 1));
	// gameEngine.scene.addEnvEntity(new Projectile('fireBall', 100, 440, 1));
	// gameEngine.scene.addEnvEntity(new Projectile('redBeam', 100, 520, 1));
	// gameEngine.scene.addEnvEntity(new Projectile('blueBeam', 100, 600, 1));
	gameEngine.scene.addEnvEntity(new BuringGasCloud(100, 300));
	// testMap.addMapCellEntity(1, 2, new Bomb(200,370));


	gameEngine.currMap = testMap;

	////////////////////////////////////////////////////////////
	testMap.addMapCellEntity(2, 2, new Knight(500, 600));
	testMap.addMapCellEntity(2, 2, new Knight(600, 600)); 
	testMap.addMapCellEntity(3, 2, new Knight(600, 600));
	testMap.addMapCellEntity(3, 2, new Bunny(400,400));
	//////////////////////////////////////////////////////////
	testMap.addMapCellEntity(1, 2, new Bunny(400,400));
	testMap.addMapCellEntity(1, 4, new Triforce(400,300));

	let r1_Pot1XY = tileToScreenCoord(1, 1);
	let r1_Pot2XY = tileToScreenCoord(1, 14);
	let r1_Pot3XY = tileToScreenCoord(18, 1);
	let r1_Pot4XY = tileToScreenCoord(18, 14);
	let r1_Door = tileToScreenCoord(9, 15);
	testMap.addMapCellEntity(1, 2, new Pot(r1_Pot1XY.x, r1_Pot1XY.y));
	testMap.addMapCellEntity(1, 2, new Pot(r1_Pot2XY.x, r1_Pot2XY.y));
	testMap.addMapCellEntity(1, 2, new Pot(r1_Pot3XY.x, r1_Pot3XY.y));
	testMap.addMapCellEntity(1, 2, new Pot(r1_Pot4XY.x, r1_Pot4XY.y));
	testMap.addMapCellEntity(1, 2, new Door(r1_Door.x, r1_Door.y, 0, true));

	let r1_Wizard = tileToScreenCoord(3,4);
	testMap.addMapCellEntity(1, 2, new Wizard(r1_Wizard.x, r1_Wizard.y));
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
	
	let chestXY = tileToScreenCoord(7, 5);
	testMap.addMapCellEntity(1, 1, new SmallChest(chestXY.x, chestXY.y, new HeartDrop(chestXY.x, chestXY.y - 8)));
	//gameEngine.scene.addEnvEntity(chest);

	// PORTAL TEST STUFF
	let testPortal1XY = tileToScreenCoord(9, 2),
		testPortal2XY = tileToScreenCoord(9, 13);
	
	testPortal2XY.x += 8*SCALE;
	testPortal1XY.x += 8*SCALE;
	
	let testPortal1 = new Portal(testPortal1XY.x, testPortal1XY.y, 'pink', 1, 2),
		testPortal2 = new Portal(testPortal2XY.x, testPortal2XY.y, 'pink', 1, 1);

	testPortal1.setTwoWayLinkedEntity(testPortal2);

	testMap.addMapCellEntity(1, 2, testPortal1);
	testMap.addMapCellEntity(1, 1, testPortal2);

	let prtl_clrs = ['red', 'green', 'yellow', 'blue', 'orange'];
	for (let i = 0; i < prtl_clrs.length; i++) {
		let left_prtlXY = tileToScreenCoord(5, 1+i);
		let right_prtlXY = tileToScreenCoord(14, 1+i);
		left_prtlXY.y *= 2.3;
		right_prtlXY.y *= 2.3;
		let left_prtl = new Portal(left_prtlXY.x, left_prtlXY.y, prtl_clrs[i], 1, 1);
		let right_prtl = new Portal(right_prtlXY.x, right_prtlXY.y, prtl_clrs[i], 1, 1);
		left_prtl.setLinkedEntity(right_prtl);
		right_prtl.setLinkedEntity(left_prtl);
		testMap.addMapCellEntity(1, 1, left_prtl);
		testMap.addMapCellEntity(1, 1, right_prtl);
	}

	

	// let test_portal1XY = tileToScreenCoord(4, 4);
	// let test_portal1 = new Portal(test_portal1XY.x, test_portal1XY.y, 'red', 1, 2);
	
	
	// let test_portal2XY = tileToScreenCoord(14, 4);
	// let test_portal2 = new Portal(test_portal2XY.x, test_portal2XY.y, 'blue', 1, 2);
	
	// testMap.addMapCellEntity(1, 2, test_portal1);
	// testMap.addMapCellEntity(1, 2, test_portal2);

	// test_portal1.setLinkedEntity(test_portal2);
	// test_portal2.setLinkedEntity(test_portal1);
	
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