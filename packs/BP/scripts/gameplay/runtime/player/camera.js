import { GameMode, MinecraftEffectTypes, MinecraftEntityTypes, MolangVariableMap, Player, system, Vector, world, World } from "@minecraft/server";
import { ImpulseParticlePropertiesBuilder, SquareParticlePropertiesBuilder } from "utilities/MolangVariableMaps";


events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        await nextTick;
        player.addEffect(MinecraftEffectTypes.blindness,25,5,false);
        for (let i = 0; i < 50; i++) 
        {
            await nextTick;
            player.applyKnockback(1,1,1,0.2);
        }
        await sleep(25);
        await player.setMovementPermission(true);
        await player.setCameraPermission(true);
        const t = player.setGameMode(global.config.defualt_game_mode);
        player.teleport(world.getDefaultSpawnPosition(),overworld,0,0);
        player.addEffect(MinecraftEffectTypes.blindness,25,5,false);
        await t;
    }
});
events.entityDie.subscribe(async ({ deadEntity }) => {
    const { location, dimension } = deadEntity;
    deadEntity.setSpawn(location, dimension);
    deadEntity.setGameMode(GameMode.spectator);
    deadEntity.setMovementPermission(false);
    deadEntity.setCameraPermission(false);
}, { entityTypes: [MinecraftEntityTypes.player.id] })
