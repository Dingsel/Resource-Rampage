import { ItemLockMode, Player } from "@minecraft/server";
import { Informations, Settings } from "gameplay/forms/import";
import { SettingsItemId } from "resources";

Player.prototype.itemAction = defualtAction;

events.beforeItemUse.subscribe(({source})=>{
    source.itemAction(source).catch(errorHandle);
});

const actions = {
    
}
const onSettings = [
    informations,
    towers,
    walls
]
/**@this {Player} */
async function defualtAction(){
    const {mainhand} = this;
    const item = mainhand.getItem();
    if(item.typeId == SettingsItemId && item.lockMode == ItemLockMode.slot && item.keepOnDeath){
        const {output} = await Settings.show(this);
        await onSettings[output]?.(this);
    }
}
async function walls(player){

}
async function towers(player){
    player.sendMessage("towers page");
}
async function informations(player){
    Informations.body(`${player.nameTag}`).show(player);
}