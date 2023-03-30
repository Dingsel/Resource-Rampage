import { MenuFormData } from "utils.js";
import { MainMenu } from "./default.js";
import { Enchantment, EquipmentSlot, MinecraftEnchantmentTypes, Player } from "@minecraft/server";
import { InitInventory } from "../player/default.js";


/* Settings Registration */
MainMenu.SelfUpdate = {
    action: start,
    content: "Tools & Abilities"
}
const AbilityTypes = {
    resistance:"resistance",
    strength:"strength",
    mining:"mining"
}
const ToolTypes = {
    shield:"shield",
    armor:"armor",
    weapon:"weapon",
    tools:"tools"
}
const getTool = {
    [ToolTypes.shield](player){return player.shieldLevel;},
    [ToolTypes.armor](player){return player.armorLevel;},
    [ToolTypes.weapon](player){return player.swordLevel;},
    [ToolTypes.tools](player){return player.toolsLevel;}
}
const setTool = {
    [ToolTypes.shield](player,lvl){return player.shieldLevel = lvl;},
    [ToolTypes.armor](player,lvl){return player.armorLevel = lvl;},
    [ToolTypes.weapon](player,lvl){return player.swordLevel = lvl;},
    [ToolTypes.tools](player,lvl){return player.toolsLevel = lvl;}
}
const getAbility = {
    [AbilityTypes.resistance]:getResistance,
    [AbilityTypes.strength]:getStrength,
    [AbilityTypes.mining]:getMining
}
const setAbility = {
    [AbilityTypes.resistance]:setResistance,
    [AbilityTypes.strength]:setStrength,
    [AbilityTypes.mining]:setMining
}


/**@param {Player} player */
async function start(player){
    const menu = new MenuFormData();
    let body = "§gBlue Expirience: §9" + player.blueXp.toFixed(1) + " poins";
    body +="\n§l§h----------Abilities----------§r"
    body+="\n§gStrength: §6" + (getStrength(player)+1);
    body+="\n§gResistance: §6" + (getResistance(player)+1);
    body+="\n§gMining Speed: §6" + (getMining(player)+1);
    body+="\n§l§h-----------Tools-----------"
    body+="\n§gArmor Level: §6" + player.armorLevel;
    body+="\n§gWeapon Level: §6" + player.swordLevel;
    body+="\n§gTool Level: §6" + player.toolsLevel;
    menu.addAction(onAbility,"§2Upgrade Abilities");
    menu.addAction(onTool,"§2Upgrade Tools");
    menu.button("form.close");
    await menu.title('form.tools_abilities.title').body(body).show(player);
}
async function onAbility(player){
    const menu = new MenuFormData(); menu.title('form.ability.title').body("§gBlue Expirience: §9" + player.blueXp + " poins");
    for (const key of Object.getOwnPropertyNames(AbilityTypes)) {
        const type = AbilityTypes[key];
        const lvl = getAbility[type](player);
        if(lvl < 10) 
            menu.addAction(()=>upgradeAbility(player,type,lvl),"§l§2Upgrade " + key + "§r\n§tCurrent Level: " + lvl);
    }
    menu.onClose(start);
    menu.addAction(start, "form.back").show(player).catch(errorHandle);
}
async function onTool(player){
    const menu = new MenuFormData(); menu.title('form.tools.title').body("§gBlue Expirience: §9" + player.blueXp.toFixed(1) + " poins");
    for (const key of Object.getOwnPropertyNames(ToolTypes)) {
        const type = ToolTypes[key];
        const lvl = getTool[type](player);
        if((type!=ToolTypes.shield && lvl < 4) || (type==ToolTypes.shield && lvl<1)) 
            menu.addAction(()=>upgradeTool(player,type,lvl),"§l§2Upgrade " + key + "§r\n§tCurrent Level: " + lvl);
    }
    menu.onClose(start);
    menu.addAction(start, "form.back").show(player).catch(errorHandle);
}
async function upgradeTool(player,key,lvl){
    if(!await confirm(player,lvl * 12 + 100)) return onTool(player);
    setTool[key](player,lvl + 1);
    InitInventory(player);
    player.blueXp -= lvl * 12 + 100;
    onTool(player);
}
async function upgradeAbility(player,key,lvl){
    if(!await confirm(player,lvl * 9 + 50)) return onAbility(player);
    setAbility[key](player,lvl + 1);
    player.blueXp -= lvl * 9 + 50;
    onAbility(player)
}

async function confirm(player,cost){
    if(cost > player.blueXp){
        await player.confirm("§mYou don't have enough XP points, you need for §9" + cost + "§m this purchase.");
        return false;
    } else {
        return await player.confirm("§hYou sure you want to buy this item for §9" + cost + " points")
    }
}


/**@param {Player} player */
function getStrength(player){return player.container.getItem(0).enchantments.hasEnchantment(MinecraftEnchantmentTypes.sharpness);}
/**@param {Player} player */
function getResistance(player){return player.armor.getEquipment(EquipmentSlot.chest).enchantments.hasEnchantment(MinecraftEnchantmentTypes.protection);}
/**@param {Player} player */
function getMining(player){return player.container.getItem(1).enchantments.hasEnchantment(MinecraftEnchantmentTypes.efficiency);}

/**@param {Player} player */
function setStrength({container},level){
    const item = container.getItem(0), {enchantments} = item;
    enchantments.removeEnchantment(MinecraftEnchantmentTypes.sharpness);
    enchantments.addEnchantment(Enchantment.Custom[MinecraftEnchantmentTypes.sharpness.id][level]);
    item.enchantments = enchantments;
    return container.setItem(0,item);
}
/**@param {Player} player */
function setResistance({armor},level){
    const resistanceSlots = [EquipmentSlot.head,EquipmentSlot.chest,EquipmentSlot.feet,EquipmentSlot.legs];
    for (const slot of resistanceSlots) {
        const item = armor.getEquipment(slot), {enchantments} = item;
        enchantments.removeEnchantment(MinecraftEnchantmentTypes.protection);
        enchantments.addEnchantment(Enchantment.Custom[MinecraftEnchantmentTypes.protection.id][level]);
        item.enchantments = enchantments;
        armor.setEquipment(slot,item);
    }
}
/**@param {Player} player */
function setMining({container},level){
    const minigSlots = [1,2];
    for (const slot of minigSlots) {
        const item = container.getItem(slot), {enchantments} = item;
        enchantments.removeEnchantment(MinecraftEnchantmentTypes.efficiency);
        enchantments.addEnchantment(Enchantment.Custom[MinecraftEnchantmentTypes.efficiency.id][level]);
        item.enchantments = enchantments;
        container.setItem(slot,item);
    }
}