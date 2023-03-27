import { Block, Player, Vector } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { InfoMapProperties, MenuItemStacks, Textures, TowerTypes, TowerNames, TowerStructureDefinitions, TowerDefaultAbilities, TowerCost, TowerAbilityInformations, StructureSizes, MageTowerLevelStructure } from "resources";
import { SquareParticlePropertiesBuilder, TowerElement,MenuFormData } from "utils";
import { EventTypes, MainMenu, clearAction, defualtSlot, setAction, setItem } from "./default";


MainMenu.towers = {
    action:onStart,
    content:"The Towers",
    icon: Textures.IconTowers
}
const Texts = {
    FormPickTitle:"%form.pickTower.title",
    FormPickDropdown:"%form.pickTower.dropdown",
    FormTowersTitle:"%form.towers.title",
    FocusLost:"%selection.focusLost.message2",
    NoCions:"%gameplay.notCoins",
}
const actionDelay = 15;
const maxTowers = 8;
const _doing = Symbol('doing');
const rayCast = {maxDistance:25,includeLiquidBlocks:false,includePassableBlocks:false};
const vMap = new SquareParticlePropertiesBuilder(2.5).setLifeTime(0.07);
const particleOffSet = { x: 0.50, y: 1.25, z: 0.50 }
const TowerPicker = new ModalFormData();
const variableMaps = {
    allow: vMap.setColor({red:0.2,green:0.7,blue:0.32}).variableMap,
    deny: vMap.setColor({red:0.7,green:0.2,blue:0.1}).variableMap,
    place: vMap.setColor({red:0.6,green:0.5,blue:0.1}).setLifeTime(7).setDirection({x:0,y:1,z:0}).setSpeed(1).setDynamicMotion(0.5).variableMap
}
TowerPicker.title(Texts.FormPickTitle)
TowerPicker.dropdown(Texts.FormPickDropdown + "\n\n§r\n",Object.getOwnPropertyNames(TowerTypes).map(k=>TowerNames[TowerTypes[k]]),0)
function getTowers(){return global.database.getTowerIDsAsync();}
function getTower(id){return global.database.getTowerAsync(id);}
function getTowerType(index){return TowerTypes[Object.getOwnPropertyNames(TowerTypes)[index]];}
function isValidArea({x:baseX,y,z:baseZ,dimension}){
    for (let x = baseX - 2; x < baseX+3; x++) {
        for (let z = baseZ - 2; z < baseZ + 3; z++) {
            const b1 = dimension.getBlock({x,y,z});
            const b2 = dimension.getBlock({x,y:y+1,z});
            if(!(b1.isSolid() && (!b2.isLiquid() && !b2.isSolid()))) return false;
        }
    }
    return true;
}



async function onStart(player){
    const towerIds = await getTowers(),
    menu = new MenuFormData(); menu.title(Texts.FormTowersTitle).body(`§hTowers: §7 ${towerIds.length}§8/§7` + maxTowers);
    for (const towerId of towerIds) {
        const tower = await getTower(towerId), {x,y,z} = tower.getTowerLocation()??{}, towerType = tower.getTowerType();
        const content = `%${TowerNames[towerType]}§8: §2${x} §4${y} §t${z}\n§r§jLevel§8: §2§l${tower.getTowerLevel()}`;
        menu.addAction(()=>onTowerSelected(player,tower),content);
    }
    if(towerIds.length < maxTowers) menu.addAction(onBuyNew,"§2Buy New");
    menu.button("form.close");
    await menu.show(player);
}


async function onBuyNew(player){
    player[_doing] = true;
    setAction(player,onAction);
    setItem(player,MenuItemStacks.TowerEditor);
    onLoop(player);
}
async function onTowerSelected(player, tower){
    console.log("info");
}



/** @param {Player} player */
async function onLoop(player){
    while(player[_doing] && player.isOnline){ await nextTick;
        if(player.selectedSlot != defualtSlot) return onBuyEnd(player), player.sendMessage(Texts.FocusLost);
        const block = player.getBlockFromViewDirection(rayCast);
        if(block)
            block.dimension.spawnParticle(
                "dest:square", 
                Vector.add(block, particleOffSet), 
                isValidArea(block)?variableMaps.allow:variableMaps.deny
            );
    }
    onBuyEnd(player);
}

/** @param {Player} player */
function onBuyEnd(player){
    delete player[_doing];
    clearAction(player);
    setItem(player,MenuItemStacks.Menu);
}

/** @param {Player} player */
async function onAction(player, data, eventType){ let block, infoMap = global.infoMap;
    const delay = sleep(actionDelay);
    switch (eventType) {
        case EventTypes.beforeItemUse: block = player.getBlockFromViewDirection(rayCast); break;
        case EventTypes.beforeItemUseOn: block = player.dimension.getBlock(data.getBlockLocation()); break;
        case EventTypes.entityHit: block = data.hitBlock; break;
    } if (!block || !isValidArea(block)) return delay;
    delete player[_doing];
    const {output, canceled} = await TowerPicker.show(player); if(canceled) return delay;
    const towerType = getTowerType(output[0]), towerCost = TowerCost[towerType];
    if(towerCost > global.coins) return await player.info(Texts.NoCions + " §g" + (towerCost - global.coins).floor().unitFormat(1) + " §2$");
    else if (!await player.confirm(`§hDo you want to buy new %${TowerNames[towerType]} for ${towerCost.unitFormat(1)} §2$`)) return delay;
    const {x,y,z} = block, towerSize = StructureSizes[MageTowerLevelStructure[0]];
    overworld.runCommandAsync(`structure load ${TowerStructureDefinitions[towerType][0]} ${x - (towerSize.x-1)/2} ${y + 1} ${z - (towerSize.z-1)/2} 0_degrees none`);
    await onCreateTower(player, towerType, {x,y:y+1,z});
    global.coins -= towerCost;
}
async function onCreateTower(player, towerType, location){
    const tower = await global.database.addTowerAsync();
    tower.set('type', towerType);
    tower.set('interval', 3);
    tower.set('level',3);
    await tower.setTowerLocationAsync(location);
    return tower;
}






/**@param {Player} player @param {TowerElement} tower */
async function onTowerSelect(player,tower){
    try {
        const n = getTowerData(tower);
        const info = new ActionFormData();
        info.title('§tTower Informations');
        const a = TowerAbilityInformations[n.type];
        let text = "";
        text += `§hType: §7%${TowerNames[n.type]} \n`;
        text += `§hPostion: ${n.location.formatXYZ()}\n§r`;
        text += `§hInterval: §a${(a.getInterval(n.interval)/20).toFixed(1)} s\n§r`;
        text += `§hPower: §a${a.getPower(n.power)}\n`;
        text += `§hRadius: §a${a.getRange(n.range)}\n`;
        text += `§hDamage: §a${a.getDamage(n.damage)}\n`;
        text += `§hLevel: §a${n.level}\n§r`;
        info.body(text);
        const canUp = canUpgreade(n);
        if(canUp) info.button('form.upgrade');
        info.button("form.close");
        const {output, canceled} = await info.show(player);
        if(canceled || output == (canUp?1:0)) return;
        await upgreade(player,tower);

    } catch (error) {
        errorHandle(error);
    }
}
async function upgreade(player,tower,data){
    const info = new MenuFormData();
    info.title('§tTower Upgrades');
    info.addAction(()=>{},``);
    let text = "";
    text += `§hPostion: ${n.location.formatXYZ()}\n§r`;
    text += `§hInterval: §a${n.interval/255}\n§r`;
    text += `§hPower: §a${n.power}\n`;
    text += `§hRadius: §a${n.radius}\n`;
    text += `§hDamage: §a${n.damage}\n`;
    text += `§hLevel: §a${n.level}\n§r`;
    info.body(text);
    console.warn('upgrade')
}
function maxUpgrades(data = getTowerData(null)){

}
function canUpgreade(data = getTowerData(null)){
    return true;
}
function getTowerData(tower){
    tower.get('type')
    const {location={x:0,y:0,z:0},damage,knockback,range,level=1,power,interval,type=TowerTypes.Mage} = Object.setPrototypeOf(tower.getData(),TowerDefaultAbilities[tower.get('type')??TowerTypes.Mage]);
    return {location,damage,knockback,level,power,interval,range,type};
}