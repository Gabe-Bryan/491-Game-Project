/**
 * @author Christopher Henderson
 */
class Sprite { 

    static SPRITE_COUNT = 0

    /** don't use this! Instead use the Animation Manager to build Sprite. */
    constructor(src, sx, sy, sWidth, sHeight, x_ofs, y_ofs, label) {
        Object.assign(this, {src, sx, sy, sWidth, sHeight, x_ofs, y_ofs, label});
        this.isImageBitmap = src instanceof ImageBitmap;
        Sprite.SPRITE_COUNT++
        // console.log(`Sprites Count = ${Sprite.SPRITE_COUNT}`);
    }

    hasLabel() {return typeof label === 'string';}
    getLabel() {return label;}

    clone() {
        return new Sprite( this.src, this.sx, this.sy, 
            this.sWidth, this.sHeight, this.x_ofs, this.y_ofs, this.label
        );
    }

    clone_ImageBitmap() {
        let baby = new Sprite( this.src, this.sx, this.sy, 
            this.sWidth, this.sHeight, this.x_ofs, this.y_ofs, this.label
        );
        baby.convertToImageBitmap();
        return baby;
    }

    fitBoundsToImageBitmap() {
        this.sx = 0; this.sy = 0;
        this.sWidth = this.src.width;
        this.sHeight = this.src.height;
    }

    isImageBitmap() { return this.isImageBitmap; }

    convertToImageBitmap() {
        if (this.src instanceof ImageBitmap) {
            console.error("Cannot convert To ImageBitmap because this sprite is already a ImageBitmap");
            return;
        }
        let canvas = new OffscreenCanvas(this.sWidth, this.sHeight);
        let ctx = canvas.getContext('2d');
        ctx.drawImage(this.src, this.sx, this.sy, this.sWidth, this.sHeight, 0, 0, this.sWidth, this.sHeight);
        this.src = canvas.transferToImageBitmap();
        this.fitBoundsToImageBitmap();
        this.isImageBitmap = true;
    }

    pixelMorph_RGBA(R, G, B, A) {
        if (!this.isImageBitmap) this.convertToImageBitmap();
        let canvas = new OffscreenCanvas(this.sWidth, this.sHeight);
        let ctx = canvas.getContext('2d');
        ctx.drawImage(this.src, this.sx, this.sy, this.sWidth, this.sHeight, 0, 0, this.sWidth, this.sHeight);

        let imageData = ctx.getImageData(this.sx, this.sy, this.sWidth, this.sHeight);
        let pixels = imageData.data;

        for (let i = 0; i < pixels.length; i+=4) {
            if(typeof R === 'number') imageData.data[i+0] = R
            if(typeof G === 'number') imageData.data[i+1] = G
            if(typeof B === 'number') imageData.data[i+2] = B
            if(typeof A === 'number') imageData.data[i+3] = A
        }
        
        ctx.putImageData(imageData, 0, 0);

        
        this.src = canvas.transferToImageBitmap();
        this.fitBoundsToImageBitmap();
    }

    mirrorImg(horz, vert) {
        // console.log(this.src)
        if (!(this.isImageBitmap)) this.convertToImageBitmap();

        let ofscn_canvas = new OffscreenCanvas(this.sWidth, this.sHeight);
        let ofscn_ctx = ofscn_canvas.getContext('2d');

        ofscn_ctx.scale(horz ? -1 : 1, vert ? -1 : 1);

        ofscn_ctx.drawImage (
            this.src, this.sx, this.sy, this.sWidth, this.sHeight,
            horz ? - this.sWidth : 0, vert ? - this.sHeight : 0, this.sWidth, this.sHeight
        );

        this.src = ofscn_canvas.transferToImageBitmap();
    }

    rotateImg(number_Of_90_Deg_CW_rotations) {
        const NUM_ROTATE = number_Of_90_Deg_CW_rotations % 4;
        if (NUM_ROTATE == 0) return; // ← no need to do anything!

        if (!(this.isImageBitmap)) this.convertToImageBitmap();

        if (NUM_ROTATE == 1 ) this.src = rot90(this.src).transferToImageBitmap();
        if (NUM_ROTATE == 2 ) this.src = rot180(this.src).transferToImageBitmap();
        if (NUM_ROTATE == 3 ) this.src = rot270(this.src).transferToImageBitmap();

        if (NUM_ROTATE == 1 || NUM_ROTATE == 3) {
            // need to swap hight and width bc aspect ratio get inverted
            // with a 90 or 270 deg rotation
            let swap = this.sWidth;
            this.sWidth = this.sHeight;
            this.sHeight = swap;
        }
    }

    draw(ctx, dx, dy, x_scl = 1, y_scl = x_scl) {
        ctx.drawImage(this.src, this.sx, this.sy, this.sWidth, this.sHeight,
            dx + this.x_ofs * x_scl, dy + this.y_ofs * y_scl, this.sWidth * x_scl, this.sHeight * y_scl
        );
    }

    drawDebug(sKey, ctx, dx, dy, x_scl = 1, y_scl = x_scl) {
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(100, 220, 255, 1)";
        ctx.strokeStyle = "rgba(50, 255, 50, 0.8)";
        ctx.font = '12px monospace';

        let _dx = dx + this.x_ofs;
        let _dy = dy + this.y_ofs
        let _dWidth = this.sWidth * x_scl;
        let _dHeight = this.sHeight * y_scl;

        ctx.strokeRect(_dx, _dy, _dWidth, _dHeight);
        ctx.fillText('s:' + sKey, _dx + 2, _dy - 5); // sprite number
        ctx.fillText('x:' + Math.floor(_dx), _dx + 2, _dy - 25); // x orig-cord
        ctx.fillText('y:' + Math.floor(_dy), _dx + 2, _dy - 15); // y orig-cord
        ctx.fillText('w:' + _dWidth, _dx + (_dWidth / 2) - 12, _dy + _dHeight + 15); // width of sprite
        ctx.fillText('h:' + _dHeight, _dx + _dWidth + 5, _dy + (_dHeight / 2) + 5);  // height of sprite
    }
}

///// HELPER FUNCTIONS FOR ROTATION MONSTER ►▽◄ //////
function rot90(og_image) {
    let iWidth = og_image.width;
    let iHeight = og_image.height;
    
    let canvas = new OffscreenCanvas(iHeight, iWidth);
    let ctx = canvas.getContext('2d');
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(og_image, 0, -iHeight, iWidth, iHeight);
    return canvas;
}

function rot180(og_image) {
    let iWidth = og_image.width;
    let iHeight = og_image.height;
    
    let canvas = new OffscreenCanvas(iWidth, iHeight);
    let ctx = canvas.getContext('2d');
    ctx.rotate(180 * Math.PI / 180);
    ctx.drawImage(og_image, -iWidth, -iHeight, iWidth, iHeight);
    return canvas;
}


function rot270(og_image) {
    let iWidth = og_image.width;
    let iHeight = og_image.height;
    
    let canvas = new OffscreenCanvas(iHeight, iWidth);
    let ctx = canvas.getContext('2d');
    ctx.rotate(270 * Math.PI / 180);
    ctx.drawImage(og_image, -iWidth, 0, iWidth, iHeight);
    return canvas;
}