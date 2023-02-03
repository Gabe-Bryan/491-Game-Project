var DEBUG = 0;

/**
 * @author Christopher Henderson
 */
class Sprite { 
    /**@access PRIVATE so don't use*/
    constructor(image, sx = 0, sy = 0, sWidth = image.width, sHeight = image.height) {
        Object.assign(this, { image, sx, sy, sWidth, sHeight });
        this.isImageBitmap = image instanceof ImageBitmap;
    }

    fitToImage() {
        this.sx = 0; this.sy = 0;
        this.sWidth = this.image.width;
        this.sHeight = this.image.height;
    }

    isImageBitmap() { return this.isImageBitmap; }

    convertToImageBitmap() {
        if (this.image instanceof ImageBitmap) {
            console.error("Cannot convert To ImageBitmap because this sprite is already a ImageBitmap");
            return;
        }
        let offscn_canvas = new OffscreenCanvas(this.sWidth, this.sHeight);
        let offscn_ctx = offscn_canvas.getContext('2d');
        offscn_ctx.drawImage(this.image, this.sx, this.sy, this.sWidth, this.sHeight, 0, 0, this.sWidth, this.sHeight);
        this.image = offscn_canvas.transferToImageBitmap();
        this.fitToImage();
    }

    mirrorImg(horz, vert) {
        if (!(this.isImageBitmap)) {
            this.convertToImageBitmap();
        }
        let ofscn_canvas = new OffscreenCanvas(this.sWidth, this.sHeight);
        let ofscn_ctx = ofscn_canvas.getContext('2d');
        ofscn_ctx.scale(horz ? -1 : 1, vert ? -1 : 1);
        ofscn_ctx.drawImage(this.image, this.sx, this.sy, this.sWidth, this.sHeight,
            horz ? -this.sWidth : 0, vert ? -this.sHeight : 0, this.sWidth, this.sHeight
        );
        this.image = ofscn_canvas.transferToImageBitmap();
    }

    draw(ctx, dx, dy, dWidth, dHeight) {
        ctx.drawImage(this.image, this.sx, this.sy, this.sWidth, this.sHeight, dx, dy, dWidth, dHeight);
    }
}