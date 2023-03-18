import { GameMode, MinecraftEntityTypes, MolangVariableMap, Vector, world, World } from "@minecraft/server";
import { CrossImpulseMolangVariableMap, ImpulseMolangVariableMap } from "utilities/MolangVariableMaps";

world.events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        console.warn("Spawn");
        player.teleport(player.deadLocation, player.dimension, player.deadRotation.x, player.deadRotation.y);
        await sleep(10);
        player.gamemode = GameMode.adventure;
    }
})
world.events.entityDie.subscribe(async ({ deadEntity }) => {
    deadEntity.gamemode = GameMode.spectator;
    const loc = deadEntity.location;
    deadEntity.deadLocation = deadEntity.location;
    deadEntity.deadRotation = deadEntity.getRotation();
    const {x,y,z} = deadEntity.getViewDirection();
    console.warn(x,y,z);
    deadEntity.dimension.spawnParticle(`dest:laser`, deadEntity.getHeadLocation(), new MolangVariableMap().setSpeedAndDirection("variable.speed_direction", 2, new Vector(x,y,z)).setVector3("variable.settings",new Vector(50,5,0.1)).setColorRGBA("variable.color",{red:0,green:1,blue:1,alpha:1}));
}, { entityTypes: [MinecraftEntityTypes.player.id] })