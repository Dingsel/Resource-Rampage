import { ItemLockMode, ItemStack } from "@minecraft/server";
import { MenuItemStacks, centerLocation } from "resources";

for (const p of world.getPlayers()) {
    p.container.setItem(8,MenuItemStacks.Menu);
}
events.playerSpawn.subscribe(async ({player,initialSpawn})=>{
    if(!initialSpawn) return; 
    player.teleportFacing(global.config.default_spawn_point,overworld,centerLocation);
    player.container.setItem(8,MenuItemStacks.Menu);
    await player.setGameMode(global.config.defualt_game_mode);
    await player.setMovementPermission(true);
    await player.setCameraPermission(true);
    await player.runCommandAsync('fug @s remove test')
    await player.runCommandAsync('fug @s remove fog')
    await player.runCommandAsync('fog @s push dest:custom_fog test');
});