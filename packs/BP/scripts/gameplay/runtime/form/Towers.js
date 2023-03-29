import { Block, MinecraftBlockTypes, Player, Vector } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { InfoMapProperties, MenuItemStacks, Textures, TowerTypes, TowerNames, TowerStructureDefinitions, TowerDefaultAbilities, TowerCost, TowerAbilityInformations, StructureSizes, MageTowerLevelStructure, ArcherTowerAbilities, MageTowerAbilities, TowerAbilities } from "resources";
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
function getAbility(towerType,level){return towerType==TowerTypes.Archer?new ArcherTowerAbilities(level):new MageTowerAbilities(level);}

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
    const menu = new MenuFormData(), level = tower.get('level')??1, type = tower.get('type')??TowerTypes.Mage, location = tower.get('location'),
    /**@type {TowerAbilities} */
    ability = getAbility(type,level);
    menu.title(Texts.InfoTitle);
    let text = "";
    text += `§hType: §7%${TowerNames[type]} \n`;
    text += `§hPosition: ${location?.formatXYZ()}\n§r`;
    let text2 = `§hInterval: §a${(ability.getInterval()/20).toFixed(1)}§2s\n§r`;
    text2 += `§hRadius: §a${ability.getRange().toFixed(1)} §2(blocks)\n`;
    text2 += `§hDamage: §a${ability.getDamage().toFixed(1)} §2hp\n`;
    text2 += `§hCritical Chance: §a${(ability.getCriticalDamageChance()/100).toFixed(3)}%%\n`;
    text2 += `§hCritical Factor: §a${(ability.getCriticalDamageFactor()/100).toFixed(3)}%%\n`;
    if(type==TowerTypes.Mage) text2 += `§hPower: §a${ability.getPower().toFixed(1)}\n`;
    else if(type==TowerTypes.Archer) text2 += `§hMax Targets: §a${ability.getMaxTargets()}\n`;
    text2 += `§hLevel: §a${ability.level}/${ability.maxLevel}\n§r`;
    if(ability.level >= ability.maxLevel) text2 = text2.replaceAll('§a','§g').replaceAll('§2','§6')
    menu.body(text + text2);
    if(ability.level < ability.maxLevel) menu.addAction(()=>onUpgrade(player,tower,ability,type,location),Texts.Upgrade);
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
    const ability = getAbility(towerType,level);
    if(location){
        const {x,y,z} = StructureSizes[TowerStructureDefinitions[towerType][ability.getStructureLevel()]];
        const loc1 = Vector.subtract(location,{x:(x-1)/2,y:0,z:(z-1)/2}),
        loc2 = Vector.add(loc1, {x,y,z});
        overworld.fillBlocks(loc1,loc2,MinecraftBlockTypes.air);
    }
    const a = await global.database.removeTowerAsync(tower.getId());
}
/**@param {Player} player @param {TowerElement} tower @param {TowerAbilities} abilities @param {keyof TowerTypes} type  @param {import("@minecraft/server").Vector3} location */
async function onUpgrade(player, tower, abilities, type, location){ let ability2 = new abilities.constructor(abilities.level+1), {coins,stone,wood} = abilities.getUpgradeCost()
    let text = "";
    text += `§hCost: §r\uE112${coins.unitFormat(2,"")} \uE100${wood.unitFormat(2,"")} \uE111${stone.unitFormat(2,"")} \n`;
    text += `§hInterval: §a${((ability2.getInterval() - abilities.getInterval())/20).toFixed(1)}§2s\n§r`;
    text += `§hRadius: §a+${(ability2.getRange() - abilities.getRange()).toFixed(1)} §2(blocks)\n `;
    text += `§hDamage: §a+${(ability2.getDamage() - abilities.getDamage()).toFixed(1)} §2hp\n`;
    text += `§hCritical Chance: §a+${((ability2.getCriticalDamageChance() - abilities.getCriticalDamageChance())/100).toFixed(3)}%%%\n`;
    text += `§hCritical Factor: §a+${((ability2.getCriticalDamageFactor() - abilities.getCriticalDamageFactor())/100).toFixed(3)}%%%\n`;
    if(type==TowerTypes.Mage) text += `§hPower: §a+${(ability2.getPower() - abilities.getPower()).toFixed(1)}\n`;
    else if(type==TowerTypes.Archer) text += `§hMax Targets: §a+${(ability2.getMaxTargets() - abilities.getMaxTargets())}\n`;
    if(coins > global.coins ||stone > global.stone ||wood > global.wood){
        await player.info('§4You dont have anouth materials, you need\n\n' + `§r\uE112${coins.unitFormat(2,"")} \uE100${wood.unitFormat(2,"")} \uE111${stone.unitFormat(2,"")} \n`);
    }else if(await player.confirm(text,"form.tower.upgrade.title")){
        await tower.set('level',ability2.level);
        await placeStructure(location,TowerStructureDefinitions[type][ability2.getStructureLevel()  ]);
        global.coins-=coins;
        global.stone-=stone;
        global.wood-=wood;
    }
    onTowerSelected(player,tower);
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
    const towerType = getTowerType(output[0]), ability =  getAbility(towerType,0), {coins, stone, wood} = ability.getUpgradeCost();
    if(coins > global.coins ||stone > global.stone ||wood > global.wood){
        return await player.info('§4You dont have anouth materials, you need\n\n' + `§r\uE112${coins.unitFormat(2,"")} \uE100${wood.unitFormat(2,"")} \uE111${stone.unitFormat(2,"")} \n`);
    }
    else if (!await player.confirm(`§hDo you want to buy new %${TowerNames[towerType]} for \n\n§r\uE112${coins.unitFormat(2,"")} \uE100${wood.unitFormat(2,"")} \uE111${stone.unitFormat(2,"")}`)) return delay;
    
    const {x,y,z} = block;
    placeStructure({x,y:y+1,z},TowerStructureDefinitions[towerType][0]);
    await onCreateTower(player, towerType, {x,y:y+1,z});
    global.coins -= coins;
    global.stone -= stone;
    global.wood -= wood;
}
async function onCreateTower(player, towerType, location){
    const tower = await global.database.addTowerAsync();
    tower.set('type', towerType);
    await tower.setTowerLocationAsync(location);
    player.sendTip("§hYou created new tower?\nCool...");
    return tower;
}

function placeStructure(location,structureId){
    const {x,y,z} = location, towerSize = StructureSizes[structureId];
    return overworld.runCommandAsync(`structure load ${structureId} ${x - (towerSize.x-1)/2} ${y} ${z - (towerSize.z-1)/2} 0_degrees none`);
}