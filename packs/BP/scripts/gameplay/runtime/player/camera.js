import { GameMode, MinecraftEntityTypes, MolangVariableMap, system, Vector, world, World } from "@minecraft/server";
import { force1, force2 } from "resources/game";
import { ImpulseParticlePropertiesBuilder, SquareParticlePropertiesBuilder } from "utilities/MolangVariableMaps";


world.events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        console.warn("Spawn");
        player.teleport(player.deadLocation, player.dimension, player.deadRotation.x, player.deadRotation.y);
        await sleep(10);
        player.gamemode = GameMode.adventure;
    }
})
world.events.entityDie.subscribe( async ({ deadEntity }) => {
    deadEntity.gamemode = GameMode.spectator;
    deadEntity.deadLocation = deadEntity.location;
    deadEntity.deadRotation = deadEntity.getRotation();
    const {x,y,z} = deadEntity.getViewDirection();
    console.warn(x,y,z);
    await sleep(10);
    console.log(deadEntity.mainhand.getLore().length);
    deadEntity.dimension.spawnParticle(`dest:ignite_impulse`, deadEntity.location,force1);
    deadEntity.dimension.spawnParticle(`dest:ignite_impulse`, deadEntity.location,force2);
}, { entityTypes: [MinecraftEntityTypes.player.id] })
