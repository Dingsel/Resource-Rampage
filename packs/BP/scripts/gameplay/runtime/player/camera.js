import { GameMode, MinecraftEntityTypes, MolangVariableMap, Player, system, Vector, world, World } from "@minecraft/server";
import { force1, force2 } from "resources/game";
import { ImpulseParticlePropertiesBuilder, SquareParticlePropertiesBuilder } from "utilities/MolangVariableMaps";


events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        console.warn("Spawn");
        await sleep(255);
        return player.gamemode = GameMode.adventure;
    }
})
events.entityDie.subscribe(async ({ deadEntity }) => {
    deadEntity.gamemode = GameMode.spectator;
    const { location, dimension } = deadEntity;
    deadEntity.setSpawn(location, dimension);
    await sleep(10);
    // console.log(deadEntity.mainhand.getLore().length);
    dimension.spawnParticle(`dest:ignite_impulse`, location, force1);
    dimension.spawnParticle(`dest:ignite_impulse`, location, force2);
}, { entityTypes: [MinecraftEntityTypes.player.id] })
