import { ItemLockMode, ItemStack } from "@minecraft/server";
import { SettingsItemId } from "resources";

const item = new ItemStack(SettingsItemId);
item.lockMode = ItemLockMode.slot;
item.keepOnDeath = true;

events.playerSpawn.subscribe(({player,initialSpawn})=>{
    if(!initialSpawn) return;
    player.teleport(global.config.default_spawn_point,overworld,0,0);
    player.container.setItem(8,item);
    player.gamemode = global.config.defualt_game_mode;
});