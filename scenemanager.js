class SceneManager{
    constructor(){
        this.env_entities = [];
        this.interact_entities = [];
    }

    draw(ctx, scale){
        drawList(this.env_entities, ctx, scale);
        drawList(this.interact_entities, ctx, scale);
    }

    update(){
        updateList(this.env_entities);
        updateList(this.interact_entities);
    }

    addInteractable(entity){
        this.interact_entities.push(entity);
    }

    addEnvEntity(entity){
        this.env_entities.push(entity);
    }

    clearScene(){
        console.log("clearing scene...");
        this.env_entities = [];
        this.interact_entities = [];
    }
}