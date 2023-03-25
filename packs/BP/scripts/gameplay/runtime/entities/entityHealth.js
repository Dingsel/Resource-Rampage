import { system, world } from "@minecraft/server";

const maxChars = 20; //Move into global pls there are like 3 different files for it and idk which one to choose
const { floor } = Math, {overworld} = world, getEntities = overworld.getEntities.bind(overworld);

function updateName(entity) {
    const { health, maxHealth } = entity
    const fullChars = maxChars - floor(health / maxHealth * maxChars)
    const emptyChars = maxChars - fullChars
    const nameStr = "§2|".repeat(emptyChars) + "§c|".repeat(fullChars)
    entity.nameTag = nameStr
}
events.entitySpawn.subscribe(({entity})=>{
    if(entity.id.startsWith("dest")) updateName(entity);
})
events.entityHurt.subscribe(({hurtEntity})=>{
    if(hurtEntity.id.startsWith("dest")) updateName(hurtEntity);
});