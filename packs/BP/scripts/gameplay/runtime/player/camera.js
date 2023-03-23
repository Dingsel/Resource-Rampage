import { GameMode, MinecraftEntityTypes, MolangVariableMap, Player, system, Vector, world, World } from "@minecraft/server";
import { ImpulseParticlePropertiesBuilder, SquareParticlePropertiesBuilder } from "utilities/MolangVariableMaps";


events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        await sleep(255);
        player.gamemode = global.config.defualt_game_mode;
        player.teleport(world.getDefaultSpawnPosition(),overworld,0,0);
    }
})
events.entityDie.subscribe(async ({ deadEntity }) => {
    deadEntity.gamemode = GameMode.spectator;
    const { location, dimension } = deadEntity;
    deadEntity.setSpawn(location, dimension);
}, { entityTypes: [MinecraftEntityTypes.player.id] })
