import { EntityScaleComponent, ItemLockMode, ItemStack } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { MenuItemStacks, centerLocation } from "resources";

const { scoreboard } = world, now =()=> `§${Date.now().toString().split('').join('§')}`;
const { config: { default_spawn_point, defualt_game_mode } } = global;
const obj = scoreboard.getObjective('online') ?? scoreboard.addObjective('online', 'online')

for (const p of world.getPlayers()) {
    p.container.setItem(8, MenuItemStacks.Menu);
    p.getComponent(EntityScaleComponent.componentId).value = 0.8;
}

events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    const {container,name} = player
    player.teleportFacing(default_spawn_point, overworld, centerLocation);
    container.setItem(8, MenuItemStacks.Menu);
    player.getComponent(EntityScaleComponent.componentId).value = 0.8;
    await player.setGameMode(defualt_game_mode);
    await player.setMovementPermission(true);
    await player.setCameraPermission(true);
    await player.runCommandAsync('fog @s remove test');
    await player.runCommandAsync('fog @s remove fog');
    await player.runCommandAsync('fog @s push dest:custom_fog test');
    if (!obj.getParticipants()?.find(({displayName:n})=>n.endsWith(`§ ${name}`))){
        await player.runCommandAsync(`scoreboard players set "${now()}§ ${name}" ${obj.displayName} 0`);
    }
});
