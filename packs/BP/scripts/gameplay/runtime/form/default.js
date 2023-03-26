import { ItemLockMode, ItemStack, Player } from "@minecraft/server";
import { MenuItemNameTag } from "resources";

const _action = Symbol('action');
const _busy = Symbol('busy');
Player.prototype[_action] = ()=>false;
Player.prototype[_busy] = false;

/** @param {Function} action */
export function setDefaultAction(action){Player.prototype[_action] = action;}
/** @param {Player} player @param {Function} action*/
export function setAction(player, action){player[_action] = action;}
/** @param {Player} player */
export function getAction(player){return player[_action];}
/** @param {Player} player */
export function clearAction(player){return delete player[_action];}
/** @param {Player} player @param {...any} params*/
export async function runAction(player,...params){return await player[_action](player,...params);}
/** @param {Player} player */
export function ValidItemStack({mainhand: item, selectedSlot}){
    if(item == undefined) return false;
    return (item.nameTag==MenuItemNameTag && item.lockMode == ItemLockMode.slot && item.keepOnDeath && selectedSlot == 8);
}
/** @param {Player} player @param {?ItemStack} item*/
export function setItem(player,item){player.container.setItem(defualtSlot,item)};
/** @param {Player} player @returns {ItemStack?}*/
export function getItem(player){return player.container.getItem(defualtSlot);}

/**@param {Player} player @returns {boolean} */
export function IsBusy(player){return player[_busy];}
/**@param {Player} player @param {boolean} busy @returns {boolean} */
export function SetBusy(player,busy){return player[_busy] = busy;}


/**@type {{[key: string]: {action:()=>Promise<void>,content:string,icon?:string}}} */
export const MainMenu = {};
export const defualtSlot = 8;
export const EventTypes = {
    beforeItemUse:"beforeItemUse",
    beforeItemUseOn:"beforeItemUseOn",
    entityHit:"entityHit"
}
