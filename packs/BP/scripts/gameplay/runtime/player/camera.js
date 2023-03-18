import { GameMode, MinecraftEntityTypes, MolangVariableMap, system, Vector, world, World } from "@minecraft/server";
import { ImpulseParticlePropertiesBuilder, SquareParticlePropertiesBuilder } from "utilities/MolangVariableMaps";


world.events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        console.warn("Spawn");
        player.teleport(player.deadLocation, player.dimension, player.deadRotation.x, player.deadRotation.y);
        await sleep(10);
        player.gamemode = GameMode.adventure;
    }
})
world.events.entityDie.subscribe(({ deadEntity }) => {
    deadEntity.gamemode = GameMode.spectator;
    deadEntity.deadLocation = deadEntity.location;
    deadEntity.deadRotation = deadEntity.getRotation();
    const {x,y,z} = deadEntity.getViewDirection();
    console.warn(x,y,z);
    deadEntity.dimension.spawnParticle(`dest:square`, deadEntity.getHeadLocation(),map);
}, { entityTypes: [MinecraftEntityTypes.player.id] })
