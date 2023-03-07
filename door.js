class Door {
    constructor(_start_pos, _facing = 0, _locked = false) {
        this.x = _start_pos.x;
        this.y = _start_pos.y;
        this.facing = _facing;

        this.updateCollider();
        this.phys2d = {static: true};
        this.DEBUG = false;
        this.tag = 'env_interact';
        this.state = _locked ? 2 : 0;

        this.spritesSetup();
    }

    updateCollider() {
        let width = this.facing <= 1 ? 32 * SCALE : 16 * SCALE;
        let height = this.facing <= 1 ? 16 * SCALE : 32 * SCALE;
        this.collider = {type: 'box', corner: {x: this.x, y: this.y}, height: height, width: width};
    }

    spritesSetup(){
        this.sprites = [
            GRAPHICS.getInstance('SET_door_north'),
            GRAPHICS.getInstance('SET_door_south'),
            GRAPHICS.getInstance('SET_door_east'),
            GRAPHICS.getInstance('SET_door_west')
        ];
    }

    update(){

    }

    interact(hasKey = false){
        if(this.state == 2 && hasKey){
            this.state = 0;
            return true;
        }else if(this.state != 2){
            this.state = 1;
            this.phys2d = {static: true, isSolid: false};
        }
        return false;
    }

    draw(ctx){
        this.sprites[this.facing].drawSprite(this.state, ctx, this.x, this.y, SCALE);
    }
}