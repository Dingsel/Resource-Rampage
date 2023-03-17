import { GameMode, MinecraftEntityTypes, MolangVariableMap, Vector, world } from "@minecraft/server";
import { AoeMolandVariableMap } from "utilities/MolangVariableMaps";

const map = new AoeMolandVariableMap();
map.setSpeed(5);
map.setCount(75);
map.setScale(0.2);
map.setLifeTime(40);

world.events.playerSpawn.subscribe(async ({player,initialSpawn})=>{
    if(!initialSpawn){
        console.warn("Spawn");
        player.teleport(player.deadLocation, player.dimension, player.deadRotation.x, player.deadRotation.y);
        await sleep(10);
        player.gamemode = GameMode.adventure;
    }
})
world.events.entityDie.subscribe(async ({deadEntity})=>{
    deadEntity.gamemode = GameMode.spectator;
    const loc = deadEntity.location;
    deadEntity.deadLocation = deadEntity.location;
    deadEntity.deadRotation = deadEntity.getRotation();
    for (let i = 0; i < 10; i++) {
        deadEntity.dimension.spawnParticle(`dest:aoe_custom`, loc, map);
        await sleep(12);
    }
},{entityTypes:[MinecraftEntityTypes.player.id]})