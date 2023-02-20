class GameDisplay {
    static TIME_TO_GO = 3;
    constructor() {
        
        this.ctx = null;

        this.heartCount = 12;
        this.bombCount = 0;
        this.currentWeapon;
        this.keyCount = 0;

        this.heartX = 600; 
        this.heartY = 60;
        this.heartWidth = 30;
        this.heartHeight = 30;
        this.spaceX = this.heartWidth * 1.1;
        this.spaceY = this.heartHeight * 1.1;
        this.bombWidth = 90;
        this.bombHeight = 80;
        this.keyWidth = 30;
        this.keyHeight = 50;
        this.timeGO = 0;

        this.textLineX = this.heartX + 2 * this.spaceX;
        this.textLineY = this.heartY - 20;
        this.textX = this.heartX + 4 * this.spaceX;
        this.textY = this.heartY - 10;
        this.textLineX2 = this.heartX + 6 * this.spaceX + 10;
    };

    init(ctx) {
        this.ctx = ctx;
    };

    draw(ctx) {
        if(gameEngine.gameOver){
            this.drawGameOver();
            this.timeGO += gameEngine.clockTick;
        }else{
            // this.drawBorder(); // remove this
            // this.drawItemBorder(); // remove this
            this.ctx.fillStyle = "white";
            //this.drawText();
            //this.drawBomb(166, 0);
            //  this.drawLifeText();
            this.drawHearts(this.heartX, this.heartY);
            //this.drawKey(274, 14);
            this.drawLifeText();
        }
        
    };

    drawGameOver () {
        let ctx = this.ctx;
        //Draw the transparent black "filter"
        let completion = Math.min(1.0, this.timeGO/GameDisplay.TIME_TO_GO)
        ctx.globalAlpha = completion;
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
        ctx.globalAlpha = 1.0;
        //Draw the text
        ctx.font = "72px Zelda";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER", ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2);
        ctx.textAlign = "start";
    }


    drawLine(sx, sy, dx, dy, stroke = "Black", width = 2) {
        if (stroke) {
            this.ctx.strokeStyle = stroke;
        }
        if (width) {
            this.ctx.width = width;
        }

        this.ctx.beginPath(); 
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(dx, dy);
        this.ctx.stroke();
        this.ctx.closePath();
    };

    drawBorder = () => {
        this.ctx.strokeStyle = "White";
        this.ctx.rect(10, 10, 1004, 100);
        this.ctx.stroke();
    };

    drawItemBorder = () => {
        this.ctx.strokeStyle = "Black";
        // this.ctx.fillText("Equipped", 45, 60);
        // this.ctx.fillText("Bomb", 187, 45);
        // this.ctx.fillText("Key", 272, 45);
        // bomb placeholder
        // this.ctx.strokeRect(180, 20, 60, 40);
        // key placeholder
        // this.ctx.strokeRect(260, 20, 60, 40);
        // equipped weapon image placeholder
        this.ctx.strokeRect(30, 20, 100, 80);
    };

    drawLifeText = () => {
        this.ctx.font = "38px Zelda";
        this.ctx.beginPath();
        this.ctx.strokeStyle = "Black";
        this.ctx.lineWidth = 4;
        this.drawLine(this.textLineX, this.textLineY, this.textLineX + 2 * this.spaceX - 10, this.textLineY, undefined, 10);
        this.ctx.strokeText("LIFE", this.textX, this.textY);
        this.ctx.fillText("LIFE", this.textX, this.textY);
        this.ctx.closePath();
        this.drawLine(this.textLineX2, this.textLineY, this.textLineX2 + 2 * this.spaceX - 10, this.textLineY, undefined, 10);
    };

    drawText = () => {
        this.ctx.font = "60px Zelda";
        this.ctx.fillText((this.bombCount + "").padStart(2, "0"), 180, 105);
        this.ctx.fillText((this.keyCount + "").padStart(2, "0"), 260, 105);
    };

    addBomb() {
        if (this.bombCount < 99) {
            this.bombCount++;
        }
    };

    reduceBomb() {
        if (this.bombCount > 1) {
            this.bombCount--;
        }
    };

    addKey() {
        if (this.keyCount < 99) { // change to a new key count??
            this.keyCount++;
        }
    };

    reduceKey() {
        if (this.keyCount > 1) {
            this.keyCount--;
        }
    };

    addHeart() {
        if (this.heartCount < 20) {
            this.heartCount++;
        }
    };

    reduceHeart() {
        if (this.heartCount > 2) { // what to do when heart count = 0??
            this.heartCount--;
        }
    };


    drawHeart(x, y) {
        this.ctx.drawImage(ASSET_MANAGER.getAsset("heart.png"), x, y, this.heartWidth * 1.2, this.heartHeight * 1.2);
    };

    drawHearts(x, y) {
        for (let i = 0; i < this.heartCount; i++) {
            if (i > 9) {
                this.drawHeart(this.heartX + (i - 10) * this.spaceX, this.heartY + this.spaceY);
            } else {
                this.drawHeart(this.heartX + i * this.spaceX, this.heartY);
            }
        }
    };

    drawBomb(x, y) {
        this.ctx.drawImage(ASSET_MANAGER.getAsset("bomb.png"), x, y, this.bombWidth, this.bombHeight);
    };

    drawKey(x, y) {
        this.ctx.drawImage(ASSET_MANAGER.getAsset("key.png"), x, y, this.keyWidth, this.keyHeight);
    };


}