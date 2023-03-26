import { Block, Player, Vector } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { InfoMapProperties, MenuItemStacks, Textures, TowerTypes, TowerNames, TowerStructureDefinitions, TowerDefaultAbilities, TowerCost, TowerAbilityInformations } from "resources";
import { SquareParticlePropertiesBuilder, TowerElement,MenuFormData } from "utils";
import { EventTypes, MainMenu, clearAction, setAction, setItem } from "./default";


const mainDelay = 15;
const maxTowers = 5;

MainMenu.towers = {
    action:towers,
    content:"The Towers",
    icon: Textures.IconTowers
}


const TowerPicker = new ModalFormData()
.title("form.pickTower.title")
.dropdown("\n%form.pickTower.dropdown \n§r\n",Object.getOwnPropertyNames(TowerTypes).map(k=>TowerNames[TowerTypes[k]]),0)
const vMap = new SquareParticlePropertiesBuilder(2.5).setLifeTime(0.07);
const variableMaps = {
    allow: vMap.setColor({red:0.2,green:0.7,blue:0.32}).variableMap,
    deny: vMap.setColor({red:0.7,green:0.2,blue:0.1}).variableMap,
    place: vMap.setColor({red:0.6,green:0.5,blue:0.1}).setLifeTime(7).setDirection({x:0,y:1,z:0}).setSpeed(1).setDynamicMotion(0.5).variableMap
}
const running = Symbol('place');
const rayCast = {maxDistance:20,includeLiquidBlocks:false,includePassableBlocks:false};


/** @param {Player} player */
async function onPlace(player,data, eventType){
    let block = null;
    if(eventType == EventTypes.beforeItemUse) block = player.getBlockFromViewDirection(rayCast);
    else if(eventType== EventTypes.beforeItemUseOn) block = player.dimension.getBlock(data.getBlockLocation());
    else if(eventType== EventTypes.entityHit) block = data.hitBlock;
    if(!block) return await sleep(mainDelay);
    if(!await checkArea(block)) return await sleep(mainDelay);
    delete player[running];
    const {output, canceled} = await TowerPicker.show(player);
    if(canceled) return await sleep(mainDelay);
    const towerType = TowerTypes[Object.getOwnPropertyNames(TowerTypes)[output[0]]];
    const cost = TowerCost[towerType];
    if (cost > global.infoMap.get(InfoMapProperties.coins)) return await player.info("%gameplay.notCoins §g" + (~~(cost - global.infoMap.get(InfoMapProperties.coins))).unitFormat(1) + " §2$");
    else if(!await player.confirm(`§hDo you want to buy new %${TowerNames[towerType]} for ${cost.unitFormat(1)} §2$`)) return;
    const {x,y,z} = block;
    overworld.spawnParticle("dest:square", Vector.add(block, { x: 0.50, y: 1.25, z: 0.50 }), variableMaps.place);
    const {successCount} = await overworld.runCommandAsync(`structure load ${TowerStructureDefinitions[towerType][0]} ${x-2} ${y + 1} ${z-2} 0_degrees none`);
    const tower = await global.database.addTowerAsync();
    console.log(tower,towerType);
    await tower.set("type",towerType);
    await tower.setTowerLocationAsync({x,y:y+1,z});
    global.infoMap.relative(InfoMapProperties.coins,-cost);
    await sleep(15);
}

/**@param {Player} player */
async function startPickLocation(player){
    player[running] = true;
    setAction(player,onPlace);
    setItem(player,MenuItemStacks.TowerEditor);
    buyTower(player);
}
/**@param {Player} player */
async function buyTower(player){
    while(player[running]){
        await nextTick;
        if(player.selectedSlot != 8){
            player.sendMessage('%selection.focusLost.message2');
            return await towerEnd(player);
        }
        const block = player.getBlockFromViewDirection(rayCast);
        if(block) overworld.spawnParticle("dest:square", Vector.add(block, { x: 0.50, y: 1.25, z: 0.50 }), (await checkArea(block))?variableMaps.allow:variableMaps.deny);
    }
    await towerEnd(player)
}
/**@param {Block} centerBlock */
async function checkArea(centerBlock){
    const {x:baseX,y,z:baseZ,dimension} = centerBlock;
    for (let x = baseX - 2; x < baseX+3; x++) {
        for (let z = baseZ - 2; z < baseZ + 3; z++) {
            const b1 = dimension.getBlock({x,y,z});
            const b2 = dimension.getBlock({x,y:y+1,z});
            if(!(b1.isSolid() && (!b2.isLiquid() && !b2.isSolid()))) return false;
        }
    }
    return true;
}
async function towerEnd(player){
    clearAction(player);
    delete player[running];
    if(player.isOnline) player.container.setItem(8,MenuItemStacks.Menu);
}
async function towers(player){
    const actions = [];
    const towers = [];
    const ids = await global.session.getTowerIDsAsync(); 
    const form = new ActionFormData().title('form.towers.title')
    .body(`§hTowers: §7 ${ids.length}§8/§7` + maxTowers);
    for (const id of ids) {
        const tower = await global.database.getTowerAsync(id);
        towers.push(tower);
        const {x,y,z} = tower.getTowerLocation();
        const towerType = tower.getTowerType();
        form.button(`%${TowerNames[towerType]}§8: §2${x} §4${y} §t${z}\n§r§jLevel§8: §2§l${tower.getTowerLevel()}`);
        actions.push(onTowerSelect);
    }
    if(ids.length<maxTowers){
        actions.push(startPickLocation)
        form.button('§2§lBuy New')
    }
    form.button('form.close');
    const {output} = await form.show(player);
    actions[output]?.(player,towers[output]);
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