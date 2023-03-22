import { ItemLockMode, Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Informations, Settings } from "gameplay/forms/import";
import { InfoMapProperties, SettingsItemId } from "resources";

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
    console.warn('pick blocks-not working in progress');
}
async function onTowerSelect(player,towerId){
    console.log("on tower select");

}
async function buyTower(player){
    console.log("buy tower");
}
async function towers(player){
    const actions = [];
    const towers = await global.session.getTowerIDsAsync(); 
    towers.forEach(()=>actions.push(onTowerSelect));
    const form = new ActionFormData().title('form.towers.title')
    .body(`§hTowers: §7 ${towers.length}§8/§710`);
    if(towers.length<10){
        actions.push(buyTower)
        form.button('§2§lBuy New')
    }
    form.button('form.close');
    const {output} = await form.show(player);
    actions[output]?.(player,towers[output]);
}
async function informations(player){
    let text = "";
    text += `§hCastel Level: §7${global.infoMap.get(InfoMapProperties.level)}\n`;
    text += `§hCastel Coins: §g${global.infoMap.get(InfoMapProperties.coins).unitFormat(1)} §2$\n`;
    text += `§hMob Kills: §7${global.infoMap.get(InfoMapProperties.kills)}\n`;
    Informations.body(text).show(player);
}