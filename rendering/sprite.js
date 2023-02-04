/**
 * @author Christopher Henderson
 */
class Sprite { 
    /** don't use this! Instead use the Animation Manager to build Sprite. */
    constructor(src, sx, sy, sWidth, sHeight, x_ofs = 0, y_ofs = 0) {
        Object.assign(this, {src, sx, sy, sWidth, sHeight, x_ofs, y_ofs});
        this.isImageBitmap = src instanceof ImageBitmap;
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
    }

    mirrorImg(horz, vert) {
        if (!(this.isImageBitmap)) {
            this.convertToImageBitmap();
        }
        let ofscn_canvas = new OffscreenCanvas(this.sWidth, this.sHeight);
        let ofscn_ctx = ofscn_canvas.getContext('2d');
        ofscn_ctx.scale(horz ? -1 : 1, vert ? -1 : 1);
        ofscn_ctx.drawImage(this.src, this.sx, this.sy, this.sWidth, this.sHeight,
            horz ? -this.sWidth : 0, vert ? -this.sHeight : 0, this.sWidth, this.sHeight
        );
        this.src = ofscn_canvas.transferToImageBitmap();
    }

    draw(ctx, dx, dy, x_scl = 1, y_scl = x_scl) {
        ctx.drawImage(this.src, this.sx, this.sy, this.sWidth, this.sHeight,
            dx + this.x_ofs, dy + this.y_ofs, this.sWidth * x_scl, this.sHeight * y_scl
        );
    }
}