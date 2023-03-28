import { Player, EquipmentSlot, MinecraftItemTypes, Container, EntityEquipmentInventoryComponent, ItemStack, ItemLockMode, MinecraftBlockTypes } from "@minecraft/server";
/*
const setEquipment = Function.prototype.call.bind(EntityEquipmentInventoryComponent.prototype.setEquipment);
const getEquipment = Function.prototype.call.bind(EntityEquipmentInventoryComponent.prototype.getEquipment);
const setItem = Function.prototype.call.bind(Container.prototype.setItem);
const getItem = Function.prototype.call.bind(Container.prototype.getItem);
*/
class ToolSlot{
    /**@protected */
    constructor(){};
    /**@readonly */
    static sword = "sword";
    /**@readonly */
    static axe = "axe";
    /**@readonly */
    static pickaxe = "pickaxe";
}
const ToolSlots = {
    [ToolSlot.sword]:0,
    [ToolSlot.axe]:1,
    [ToolSlot.pickaxe]:2
}
const pickaxeCanDestroy = ["minecraft:stone"];
const axeCanDestroy = ["wood",...MinecraftBlockTypes.getAllBlockTypes().filter(n=>n.id.includes('log')).map(n=>n.id)];
events.playerSpawn.subscribe(toolsReload);
events.blockBreak.subscribe(async ({player})=>{
    const {armor,container} = player;
    await nextTick;
    for(const key of Object.keys(items)){
        const itemStack = (key in EquipmentSlot)?armor.getEquipment(key):container.getItem(ToolSlots[key]);
        if((!itemStack) || itemStack?.damage == 0) continue;
        itemStack.damage = 0;
        (key in EquipmentSlot)?armor.setEquipment(key,itemStack):container.setItem(ToolSlots[key],itemStack);
    }
})
Player.prototype.playerInteraction = function(){
    toolsReload({player:this});
}
/**@param {{player:Player}} */
function toolsReload({player}){
    const {armor,container} = player;
    for(const key of Object.keys(items)){
        console.log(key);
        if(!items[key][0])continue;
        const itemStack = new ItemStack(items[key][0]).setLockMode(ItemLockMode.slot);
        if(key in modifiers) modifiers[key](itemStack);
        if(key in EquipmentSlot){
            const {enchantments} = armor.getEquipment(key)??{};
            if(enchantments) itemStack.enchantments = enchantments;
            armor.setEquipment(key, itemStack);
        }else{
            const {enchantments} = container.getItem(ToolSlots[key])??{};
            if(enchantments && enchantments.slot == itemStack.enchantments.slot) itemStack.enchantments = enchantments;
            container.setItem(ToolSlots[key], itemStack);
        }
    }
}
const modifiers = {
    /**@param {ItemStack} itemStack */
    [ToolSlot.pickaxe](itemStack){
        itemStack.setCanDestroy(pickaxeCanDestroy)
    },
    /**@param {ItemStack} itemStack */
    [ToolSlot.axe](itemStack){
        itemStack.setCanDestroy(axeCanDestroy)
    }
}



const items = {
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

for (const p of world.getPlayers()) toolsReload({player:p});