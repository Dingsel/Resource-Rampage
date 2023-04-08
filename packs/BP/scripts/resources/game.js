import { EquipmentSlot, ItemLockMode, ItemStack, MinecraftBlockTypes, MinecraftItemTypes } from "@minecraft/server";

export const EntityKillReward = {
    "dest:centipede_head": 150,
    "dest:battlepillar":15,
    "dest:ladybug":10,
    "dest:spit_bug":3
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
export const PlayerDynamicProperties = {
    BlueXp:"blue_xp",
    Armor:"armor",
    Shield:"shield",
    Sword:"sword",
    Tools:"tools"
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
export class ToolSlot{
    /**@protected */
    constructor(){};
    /**@readonly */
    static sword = "sword";
    /**@readonly */
    static axe = "axe";
    /**@readonly */
    static pickaxe = "pickaxe";
}
export const ToolSlots = {
    [ToolSlot.sword]:0,
    [ToolSlot.axe]:1,
    [ToolSlot.pickaxe]:2
}
export const PickaxeCanDestroy = ["minecraft:stone"];
export const AxeCanDestroy = ["wood",...MinecraftBlockTypes.getAllBlockTypes().filter(n=>n.id.includes('log')).map(n=>n.id)];

export const ItemModifiers = {
    /**@param {ItemStack} itemStack */
    [ToolSlot.pickaxe](itemStack){
        itemStack.setCanDestroy(PickaxeCanDestroy)
    },
    /**@param {ItemStack} itemStack */
    [ToolSlot.axe](itemStack){
        itemStack.setCanDestroy(AxeCanDestroy)
    }
}
export const InventoryItems = {
    [EquipmentSlot.head]:[
        MinecraftItemTypes.leatherHelmet,
        MinecraftItemTypes.chainmailHelmet,
        MinecraftItemTypes.ironHelmet,
        MinecraftItemTypes.diamondHelmet,
        MinecraftItemTypes.netheriteHelmet
    ],
    [EquipmentSlot.chest]:[
        MinecraftItemTypes.leatherChestplate,
        MinecraftItemTypes.chainmailChestplate,
        MinecraftItemTypes.ironChestplate,
        MinecraftItemTypes.diamondChestplate,
        MinecraftItemTypes.netheriteChestplate
    ],
    [EquipmentSlot.legs]:[
        MinecraftItemTypes.leatherLeggings,
        MinecraftItemTypes.chainmailLeggings,
        MinecraftItemTypes.ironLeggings,
        MinecraftItemTypes.diamondLeggings,
        MinecraftItemTypes.netheriteLeggings
    ],
    [EquipmentSlot.feet]:[
        MinecraftItemTypes.leatherBoots,
        MinecraftItemTypes.chainmailBoots,
        MinecraftItemTypes.ironBoots,
        MinecraftItemTypes.diamondBoots,
        MinecraftItemTypes.netheriteBoots
    ],
    [EquipmentSlot.offhand]:[
        undefined,
        MinecraftItemTypes.shield
    ],
    [ToolSlot.sword]:[
        MinecraftItemTypes.woodenSword,
        MinecraftItemTypes.stoneSword,
        MinecraftItemTypes.ironSword,
        MinecraftItemTypes.diamondSword,
        MinecraftItemTypes.netheriteSword,
    ],
    [ToolSlot.pickaxe]:[
        MinecraftItemTypes.woodenPickaxe,
        MinecraftItemTypes.stonePickaxe,
        MinecraftItemTypes.ironPickaxe,
        MinecraftItemTypes.diamondPickaxe,
        MinecraftItemTypes.netheritePickaxe,
    ],
    [ToolSlot.axe]:[
        MinecraftItemTypes.woodenAxe,
        MinecraftItemTypes.stoneAxe,
        MinecraftItemTypes.ironAxe,
        MinecraftItemTypes.diamondAxe,
        MinecraftItemTypes.netheriteAxe,
    ]
}