import { ItemLockMode, ItemStack, MinecraftBlockTypes } from "@minecraft/server";

export const EntityKillReward = {
    "dest:centipede_head": 3
}
export const InfoMapProperties = {
    coins: "coins",
    level: "level",
    kills: "kills",
    woods: "woods",
    stones: "stones"
}
export const uiFormat = {
    reset: "§_,§_,ui",
    Bold: "§l",
    Italic: "§o",
    Obfuscated: "§k",
    Special: "§´",
    color: {
        "§_§rNormal": "§_", "§1Dark Blue": "§1", "§9Blue": "§9", "§2Dark Green": "§2",
        "§aGreen": "§a", "§3Dark Aqua": "§3", "§bAqua": "§b", "§4Dark Red": "§4", "§cRed": "§c",
        "§5Purple": "§5", "§dMagenta": "§d", "§6Gold": "§6", "§eYellow": "§e", "§gMinecoin Gold": "§g",
        "§nBrown": "§n", "§0Black": "§0", "§8Dark Gray": "§8", "§7Gray": "§7", "§fWhite": "§f"
    }
}
export const centerLocation = Object.create({x:82,y:100,z:52});
export const MenuItemNameTag = "§l§hMenu";
export const CanDestroy = MinecraftBlockTypes.getAllBlockTypes().map(n=>n.id);
export const HammerItemStack = new ItemStack("dest:hammer").setNameTag(MenuItemNameTag).setKeepOnDeath(true).setLockMode(ItemLockMode.slot).setCanDestroy(CanDestroy)
export const MenuItemStacks = {
    Menu: new ItemStack("dest:menu").setNameTag(MenuItemNameTag).setKeepOnDeath(true).setLockMode(ItemLockMode.slot).setCanDestroy(CanDestroy),
    TowerEditor: HammerItemStack,
    WallBuilder: HammerItemStack
}