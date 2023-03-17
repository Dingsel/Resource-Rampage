import { GameMode, MinecraftEntityTypes, MolangVariableMap, Vector, world } from "@minecraft/server";

const map = new MolangVariableMap();
map.setVector3("variable.lifetimes",new Vector(500,25,5));

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