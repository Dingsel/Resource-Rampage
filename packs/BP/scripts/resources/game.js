import { ItemLockMode, ItemStack, MinecraftBlockTypes } from "@minecraft/server";
import { ArcherTowerLevelStructure, MageTowerLevelStructure } from "./pack";

export const TowerTypes = {
    Mage: "mage",
    Archer: "archer"
}
export const TowerNames = {
    [TowerTypes.Mage]: "tower.type.mage.name",
    [TowerTypes.Archer]: "tower.type.archer.name"
}
export const TowerLevelsDefinitions = {
    [TowerTypes.Mage]: MageTowerLevelStructure,
    [TowerTypes.Archer]: ArcherTowerLevelStructure
}
export const TowerLevelDefinition = {
    maxLevel: 3,
    rangePerLevel: 5,
    rangeOffset: 2,
    intervalLevelInflation: 30,
    baseIntervalDelay: 450,
    impulseLevelDelay: 10,
    1: {
        maxPower: 5,
        maxKnockback: 2,
        maxDamage: 0,
        maxInterval: 3
    },
    2: {
        maxPower: 6,
        maxKnockback: 3,
        maxDamage: 2,
        maxInterval: 3
    },
    3: {
        maxPower: 7,
        maxKnockback: 5,
        maxDamage: 4,
        maxInterval: 3
    }
}
export const InfoMapProperties = {
    coins: "coins",
    level: "level",
    kills: "kills"
}
export const uiFormat = {
    reset: "§_,§_,ui",
    Bold: "§l",
    Italic: "§o",
    Obfuscated: "§k",
    Special: "§´",
    color: {
        "§_§rNormal": "§_§r", "§1Dark Blue": "§1", "§9Blue": "§9", "§2Dark Green": "§2",
        "§aGreen": "§a", "§3Dark Aqua": "§3", "§bAqua": "§b", "§4Dark Red": "§4", "§cRed": "§c",
        "§5Purple": "§5", "§dMagenta": "§d", "§6Gold": "§6", "§eYellow": "§e", "§gMinecoin Gold": "§g",
        "§nBrown": "§n", "§0Black": "§0", "§8Dark Gray": "§8", "§7Gray": "§7", "§fWhite": "§f"
    }
}
export const centerLocation = Object.create({x:82,y:100,z:52});
export const MenuItemNameTag = "§l§hMenu";
export const CanDestroy = MinecraftBlockTypes.getAllBlockTypes().map(n=>n.id);
export const MenuItemStacks = {
    Menu: new ItemStack("dest:menu").setNameTag(MenuItemNameTag).setKeepOnDeath(true).setLockMode(ItemLockMode.slot).setCanDestroy(CanDestroy),
    TowerEditor: new ItemStack("dest:edit_pickaxe").setNameTag(MenuItemNameTag).setKeepOnDeath(true).setLockMode(ItemLockMode.slot).setCanDestroy(CanDestroy),
    WallBuilder: new ItemStack("dest:edit_axe").setNameTag(MenuItemNameTag).setKeepOnDeath(true).setLockMode(ItemLockMode.slot).setCanDestroy(CanDestroy)
}