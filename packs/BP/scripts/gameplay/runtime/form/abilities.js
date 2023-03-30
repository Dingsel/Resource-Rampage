import { MenuFormData } from "utils.js";
import { MainMenu } from "./default.js";
import { EquipmentSlot, MinecraftEnchantmentTypes, Player } from "@minecraft/server";


/* Settings Registration */
MainMenu.SelfUpdate = {
    action: start,
    content: "Tools & Abilities"
}
/**@param {Player} player */
async function start(player){
    const menu = new MenuFormData();
    let body = "§gBlue Expirience: §9" + player.toolsLevel + " poins";
    body +="\n§l§h-----------Abilities-----------§r"
    body+="\n§gStrength: §6" + (getStrength(player)+1);
    body+="\n§gResistance: §6" + (getResistance(player)+1);
    body+="\n§gMining Speed: §6" + (getMiningSpeed(player)+1);
    body+="\n§l§h------------Tools------------"
    body+="\n§gArmor Level: §6" + player.armorLevel;
    body+="\n§gWeapon Level: §6" + player.swordLevel;
    body+="\n§gTool Level: §6" + player.blueXp;
    menu.button("form.close");
    await menu.title('form.tools.title').body(body).show(player);
    console.log('test')
}
/**@param {Player} player */
function getStrength(player){return player.container.getItem(0).enchantments.hasEnchantment(MinecraftEnchantmentTypes.sharpness);}
/**@param {Player} player */
function getResistance(player){return player.armor.getEquipment(EquipmentSlot.chest).enchantments.hasEnchantment(MinecraftEnchantmentTypes.protection);}
/**@param {Player} player */
function getMiningSpeed(player){return player.container.getItem(0).enchantments.hasEnchantment(MinecraftEnchantmentTypes.efficiency);}