import { MolangVariableMap } from "@minecraft/server";
import { EntityKillReward, InfoMapProperties } from "resources";

const map = new MolangVariableMap();
const infoMap = ()=>global.infoMap;
const maxChars = 20; //Move into global pls there are like 3 different files for it and idk which one to choose




function updateName(entity) {
    const { health, maxHealth,typeId } = entity;
    if(!typeId.startsWith("dest") || health<=0) return;
    const fullChars = maxChars - ~~(health / maxHealth * maxChars);
    entity.nameTag = "§4|".repeat(maxChars - fullChars) + "§8|".repeat(fullChars);
}
events.entitySpawn.subscribe(ev=>updateName(ev.entity));
events.entityHurt.subscribe(ev=>updateName(ev.hurtEntity));
events.entityDie.subscribe(({ deadEntity:entity}) => {
    if (!entity.typeId.startsWith("dest")) return;
    overworld.spawnParticle("dest:coin", entity.location, map);
    infoMap().relative(InfoMapProperties.coins, EntityKillReward[entity.typeId]??1);
});