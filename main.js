const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager("./assets/");
const GRAPHICS = new GraphicsManager();
const SCALE = 3;
const TILE_SIZE = 16;
ASSET_MANAGER.queueDownload("prototype_map.png", "link.png", "overworld_tiles.png", "enemies.png", "characters.png", "heart.png", "bomb.png", "key.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	new GraphicsLoader(); // <- just to build the sprites & animations into GRAPHICS

	Player.CURR_PLAYER = new Player(canvas.width/2 - 144, canvas.height/2 - 32);
	gameEngine.addEntity(Player.CURR_PLAYER); 
	gameEngine.addEntity(new Knight(canvas.width/4, canvas.height/2));
	

	let roomWidth = 20;
	let roomHeight = 16;
	let testMap = new GameMap("prototype_map.png", roomWidth, roomHeight, 16*SCALE, 16*SCALE, {
		'#00ff00':'grass',
		'#555555':'stone_grass',
		'#333333':'stone_sand',
		'#ffff00':'sand'
	});

	let roomIndexX = 2;
	let roomIndexY = 2;
	testMap.loadMapCell(roomIndexX, roomIndexY);
	setInterval(bun, bt)
	//gameEngine.scene.addEnvEntity(new TestCollisionBox(300, 300));
	testMap.addMapEntitiesToEngine(gameEngine);
	gameEngine.currMap = testMap;


	gameEngine.init(ctx);

	gameEngine.start();
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
		gameEngine.addEntity(new Bunny(200 + (Math.random()*560), 200 + (Math.random()*368)));
		bc++;
	}
	
}