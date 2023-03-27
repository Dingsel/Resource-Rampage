import { Block, MinecraftBlockTypes, Player, Vector } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { InfoMapProperties, MenuItemStacks, Textures, TowerTypes, TowerNames, TowerStructureDefinitions, TowerDefaultAbilities, TowerCost, TowerAbilityInformations, StructureSizes, MageTowerLevelStructure, TowerUpgrades } from "resources";
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
    InfoTitle:"%form.tower.title",
    Upgrade:"%form.upgrade",
    DeleteTower:"%form.confirm.body.deleteTower"
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
    return global.safeArea.isValid({x:baseX,y,z:baseZ});
}
function getTowerData(tower){
    const {location={x:0,y:0,z:0},damage,knockback,range,level=1,power,interval,type=TowerTypes.Mage} = Object.setPrototypeOf(tower.getData(),TowerDefaultAbilities[tower.get('type')??TowerTypes.Mage]);
    return {location,damage,knockback,level,power,interval,range,type};
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
    const menu = new MenuFormData(), n = getTowerData(tower), a = TowerAbilityInformations[tower.get('type')??TowerTypes.Mage]; menu.title(Texts.InfoTitle);
    let text = "";
    text += `§hType: §7%${TowerNames[n.type]} \n`;
    text += `§hPostion: ${n.location.formatXYZ()}\n§r`;
    text += `§hInterval: §a${(a.getInterval(n.interval)/20).toFixed(1)} s\n§r`;
    text += `§hPower: §a${a.getPower(n.power)}\n`;
    text += `§hRadius: §a${a.getRange(n.range)}\n`;
    text += `§hDamage: §a${a.getDamage(n.damage)}\n`;
    text += `§hLevel: §a${n.level}\n§r`;
    menu.body(text);
    if(TowerUpgrades.canUpgrade(tower)) menu.addAction(()=>onUpgrade(player,tower),Texts.Upgrade);
    menu.addAction(()=>onDelete(player,tower),"from.delete");
    menu.button('form.close');
    await menu.show(player);
}
/**@param {Player} player @param {TowerElement} tower */
async function onDelete(player,tower){
    if(!await player.confirm(Texts.DeleteTower)) return onTowerSelected(player,tower);
    const towerType = tower.get('type')??TowerTypes.Mage;
    const level = tower.getTowerLevel()??1;
    const location = tower.getTowerLocation();
    if(location){
        const {x,y,z} = StructureSizes[TowerStructureDefinitions[towerType][level-1]];
        const loc1 = Vector.subtract(location,{x:(x-1)/2,y:0,z:(z-1)/2}),
        loc2 = Vector.add(loc1, {x,y,z});
        overworld.fillBlocks(loc1,loc2,MinecraftBlockTypes.air);
    }
    const a = await global.database.removeTowerAsync(tower.getId());
    global.coins+=TowerCost[towerType] * level * 0.75;
}
/**@param {Player} player @param {TowerElement} tower */
async function onUpgrade(player, tower){
    const menu = new MenuFormData();
    for (const {action,content,cost} of TowerUpgrades.getMenuDataTemplate(tower)) {
        menu.addAction(action,content +"\n" + cost);
    }
    menu.button('form.close');
    await menu.show(player);
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
    await tower.setTowerLocationAsync(location);
    player.sendTip("§hYou created new tower?\nCool...");
    return tower;
}

