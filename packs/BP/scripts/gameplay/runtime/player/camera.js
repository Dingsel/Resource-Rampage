import { GameMode, MinecraftEntityTypes, MolangVariableMap, Vector, world, World } from "@minecraft/server";
import { CrossImpulseMolangVariableMap, ImpulseMolangVariableMap, ImpulseParticlePropertiesBuilder } from "utilities/MolangVariableMaps";

const map = new ImpulseParticlePropertiesBuilder(5).setDynamicMotion(1.5).setSpeed(15).setScale(0.3).setColor({red:0.1,blue:0.3,alpha:0.6}).getMolangVariableMap();

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
    deadEntity.dimension.spawnParticle(`dest:cross_impulse`, deadEntity.getHeadLocation(),map);
}, { entityTypes: [MinecraftEntityTypes.player.id] })
