import { ItemLockMode, ItemStack } from "@minecraft/server";
import { MenuItemStacks } from "resources";


events.playerSpawn.subscribe(({player,initialSpawn})=>{
    if(!initialSpawn) return;
    player.teleport(global.config.default_spawn_point,overworld,0,0);
    player.container.setItem(8,MenuItemStacks.Menu);
    player.gamemode = global.config.defualt_game_mode;
});