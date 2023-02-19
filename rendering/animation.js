/**
 * @author Christopher Henderson
 */
class Animation {
    /** don't use this! Instead use the Animation Manager to build Animation. */
    constructor(id, spriteSet, fSequence, fTiming, x_offset, y_offset) {
        if (fSequence.length !== fTiming.length)
            throw new Error('Animation: fSequence and fTiming are not same length');
            
        Object.assign(this, {id, spriteSet, fSequence, fTiming, x_offset, y_offset });

        this.fCount = this.fSequence.length;
        this.init();
    }

    init() {
        this.fTiming_mod = [...this.fTiming];
        this.fSequence_mod = [...this.fSequence];
        this.x_offset_mod = this.x_offset;
        this.y_offset_mod = this.y_offset;

        this.tempo = 1;
        this.elapsedTime = 0;
        this.currFrame = 0;
        this.nextFrameAt = this.fTiming_mod[0] * this.tempo;
        
        this.looping = true;
        this.reversed = false;
        this.done = false;
        return this;
    }

    reset() {
        this.elapsedTime = 0;
        this.currFrame = 0;
        this.done = false;
        this.nextFrameAt = this.fTiming_mod[0] * this.tempo;
        return this;
    }

    clone(clones_id, clone_x_offset = this.x_offset, clone_y_offset = this.y_offset) {
        const copy_sprites = this.spriteSet.clone(this.spriteSet.id.concat("_clone"))
        const copy_anima = new Animation(clones_id, copy_sprites,
            [...this.fSequence], [...this.fTiming], clone_x_offset, clone_y_offset);
        return copy_anima;
    }

    mirrorAnimation_Horz(new_x_offsets_sprite, new_x_offset_anima) {       
        this.spriteSet.mirrorSet_Horz();
        this.spriteSet.id = String(this.spriteSet.get_id() + "_HorzMirr");
        let setSize = this.spriteSet.getCount();

        // sprite set x offset
        if (new_x_offsets_sprite instanceof Array && new_x_offsets_sprite.length === setSize)
            this.spriteSet.set_x_ofs(new_x_offsets_sprite);
        else if (typeof new_x_offsets_sprite === 'number')
            this.spriteSet.set_x_ofs(new Array(setSize).fill(new_x_offsets_sprite));
        
        // animation x offset
        if (new_x_offset_anima instanceof Array && new_x_offset_anima.length === setSize)
            x_offset = new_x_offset_anima;
        else if (typeof new_x_offset_anima === 'number')
            x_offset.fill(new_x_offset_anima);

        return this.init();
    }

    getCurrentFrame() {return this.currFrame;}
    getElapsedTime()  {return this.elapsedTime;}
    getNextFrameAt()  {return this.nextFrameAt;}
    isLooping() {return this.looping;}
    isReversed() {return this.reversed;}
    isDone() {return this.done;}
    //getFlags() {return {looping: this.looping, reversed: this.reversed}}

    getFrameDimensions(log = false) {
        return spriteSet.getSpriteDimensions(this.currFrame, log);
    }

    setLooping(the_looping) {
        this.looping = the_looping;
        return this;
    }

    setAnimaSpeed(the_animationSpeed) {
        this.tempo = 100 / the_animationSpeed;
        return this;
    }

    setReverseAnima() {
        this.fTiming_mod.reverse();
        this.fSequence_mod.reverse();
        this.reversed = this.reversed? false : true;
        return this;
    }

    calcFrame() {
        if (!this.done && this.elapsedTime >= this.nextFrameAt ) {
            if (this.currFrame < this.fCount - 1) {
                this.currFrame++;
                this.nextFrameAt += this.fTiming_mod[this.currFrame] * this.tempo;
            }
            else if (this.looping) this.reset();
            else this.done = true; // will keep returning the last frame if called again
        }
        return this.fSequence_mod[this.currFrame];
    }

    animate(tick, ctx, dx, dy, xScale = 1, yScale = xScale) {
        //console.log(this.spriteSet)
        let frameNum = this.calcFrame();
        //console.log(frameNum)
        this.spriteSet.drawSprite(frameNum, ctx, dx + this.x_offset_mod * xScale, dy + this.y_offset_mod * yScale, xScale, yScale)
        
        if (0) {
            ctx.lineWidth = 1;
            ctx.fillStyle = "rgba(100, 220, 255, 1)";
            ctx.strokeStyle = "rgba(50, 255, 50, 0.8)";
            ctx.font = '12px monospace';

            ctx.fillText('f:' + this.fSequence[this.currFrame], dx + 45, dy - 15); // animation frame number

            let dur = Math.floor(this.fTiming_mod[this.currFrame] * 1000);
            ctx.fillText('ms:' + dur, dx + 70, dy - 15); // animation frame duration in milliseconds
        }

        this.elapsedTime += tick;

    }
}