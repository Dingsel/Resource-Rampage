import { GameMode, MinecraftEntityTypes, MolangVariableMap, Vector, world } from "@minecraft/server";
import { CrossImpulseMolangVariableMap, ImpulseMolangVariableMap } from "utilities/MolangVariableMaps";

const map = new CrossImpulseMolangVariableMap(5,{red:0.1,green:1,blue:0,alpha:0.65});

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
    deadEntity.dimension.spawnParticle(`dest:impulse_cross`, loc, map);
},{entityTypes:[MinecraftEntityTypes.player.id]})