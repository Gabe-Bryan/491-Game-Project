// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];
        this.scene = new SceneManager();

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };

        this.running = false;
        this.gameOver = false;
        this.victory = false;
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
        GAMEDISPLAY.init(ctx);
    };

    start() {
        this.running = true;
        ASSET_MANAGER.playAsset("aboda_village.mp3");
        ASSET_MANAGER.adjustVolume(0.2);
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
           // ASSET_MANAGER.playAsset("aboda_village.mp3");
           // ASSET_MANAGER.adjustVolume(0.2);
        });


        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw the scene first
        drawList(this.scene.env_entities, this.ctx);
        drawList(this.entities.concat(this.scene.interact_entities).sort((a, b) => b.y - a.y), this.ctx);
        drawList(new Triforce(500,500))

        GAMEDISPLAY.draw();
    };

    update() {
        //All of the real updating takes place in this method @util.js
        updateList(this.entities);
        this.scene.update();
        if (this.keys['m']) ASSET_MANAGER.muteAudio(true);
        if (this.keys['p']) ASSET_MANAGER.muteAudio(false);

    };

    loop() {
        if (this.running) {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();
        }
    };

};

// KV Le was here :)