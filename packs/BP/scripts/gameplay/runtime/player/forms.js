import { Block, ItemLockMode, MinecraftBlockTypes, MolangVariableMap, Player, Vector } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { buildWall } from "gameplay/building/import.js";
import { Informations, Settings, WallBuildSettings } from "gameplay/forms/import";
import { InfoMapProperties, uiFormat, MenuItemNameTag, MenuItemStacks, WallLevels, Textures } from "resources";
import { SquareParticlePropertiesBuilder } from "utils";

const actionSymbol = Symbol('action');
const mainDelay = 15;
const busy = Symbol('busy');
Player.prototype[actionSymbol] = defualtAction;

events.beforeItemUse.subscribe(ev=>run(ev.source,ev,EventTypes.beforeItemUse));
events.beforeItemUseOn.subscribe(ev=>run(ev.source,ev,EventTypes.beforeItemUseOn));
events.entityHit.subscribe(ev=>run(ev.entity,ev,EventTypes.entityHit),{entityTypes:["minecraft:player"]});

/**@param {Player} player */
async function run(player,data,eventType){
    try {
        const {mainhand: item, selectedSlot} = player;
        if(item == undefined || player[busy]) return;
        if(item.nameTag==MenuItemNameTag && item.lockMode == ItemLockMode.slot && item.keepOnDeath && selectedSlot == 8) {
            player[busy] = true;
            await player[actionSymbol](data,eventType);
            delete player[busy];
        }
    } catch (error) {errorHandle(error); delete player[busy];}
}

const EventTypes = {
    beforeItemUse:"beforeItemUse",
    beforeItemUseOn:"beforeItemUseOn",
    entityHit:"entityHit"
}






const onSettings = [
    informations,
    towers,
    onWall,
    uisettings
]
/**@this {Player} */
async function defualtAction(data,eventType){
    const {output,canceled} = await Settings.show(this);
    if(canceled) return;
    await onSettings[output]?.(this);
}

/**@param {Player} player */
async function informations(player){
    let text = "";
    text += `§hCastel Level: §7${global.infoMap.get(InfoMapProperties.level)}\n`;
    text += `§hCastel Coins: §g${global.infoMap.get(InfoMapProperties.coins).unitFormat(1)} §2$\n`;
    text += `§hMob Kills: §7${global.infoMap.get(InfoMapProperties.kills)}\n`;
    await Informations.body(text).show(player);
}







async function onWall(player){
    player[actionSymbol] = wallPickLocation;
    player.sendMessage("%selection.start.message");
    wallStart(player).catch(errorHandle);
}
const loc1Symbol = Symbol('loc1');
const loc2Symbol = Symbol('loc2');
/**@param {Player} player */
async function wallStart(player){
    player.container.setItem(8,MenuItemStacks.WallBuilder);
    while(player.isOnline){
        await nextTick;
        if(player.selectedSlot != 8){
            player.sendMessage('%selection.focusLost.message1');
            return await wallEnd(player);
        }
        if(player[loc1Symbol] && player[loc2Symbol]){
            player.container.setItem(8,MenuItemStacks.Menu);
            const {output,canceled} = await WallBuildSettings.show(player);
            if(canceled) return await wallEnd(player);
            const cost = (output[0]+1) * Vector.subtract(player[loc1Symbol], player[loc2Symbol]).length() * 10;
            if(cost > global.infoMap.get(InfoMapProperties.coins)){
                player.info("%gameplay.notCoins §g" + (~~(cost - global.infoMap.get(InfoMapProperties.coins))).unitFormat(1) + " §2$");
                return await wallEnd(player);
            }
            const confirm = await player.confirm(`§h§lBuild Level ${output[0] + 1} wall between selected positions for §g${(~~cost).unitFormat(2)} $?\n§r§7Position 1  §l${formatXYZ(player[loc1Symbol])}\n§r§7Position 2 §l ${formatXYZ(player[loc2Symbol])}`);
            if(confirm){
                player.sendMessage("%construction.started");
                global.infoMap.set(InfoMapProperties.coins,global.infoMap.get(InfoMapProperties.coins) - (~~cost))
                player[actionSymbol] = async function(){return this.info("construction.progress");}
                await buildWall(player[loc1Symbol],player[loc2Symbol],WallLevels[output[0]]);
                player.sendMessage("%construction.done");
            }
            return await wallEnd(player);
        }
    }
    return await wallEnd(player);
}
async function wallEnd(player){
    delete player[actionSymbol];
    delete player[loc1Symbol];
    delete player[loc2Symbol];
    if(player.isOnline) player.container.setItem(8,MenuItemStacks.Menu);
}
/**@this {Player} */
async function wallPickLocation(data,eventType){
    if(this.isSneaking) {
        delete this[loc1Symbol];
        delete this[loc2Symbol];
        this.playSound('mob.shulker.close', { pitch: 0.3, volume: 0.7 });
        await sleep(3);
        this.sendMessage(`%selection.onclear.message`);
        await sleep(mainDelay);
    } else if(eventType == EventTypes.entityHit && data.hitBlock){
        await onUse(this, data.hitBlock, eventType);
    } else if (eventType == EventTypes.beforeItemUseOn){
        await onUse(this, this.dimension.getBlock(data.getBlockLocation()), eventType);
    }
}
const blockInUse = new Set();
async function onUse(player, block, eventType) {
    const { dimension } = player
    const { x, y, z, location, permutation } = block;
    const key = dimension.id + `${x}.${y}.${z}`;
    if (blockInUse.has(key)) return;
    if(Vector.equals({x,y,z},player[loc1Symbol]??{}) || Vector.equals({x,y,z},player[loc2Symbol]??{})){
        player.sendMessage(`%selection.same.message`);
        return await sleep(15);
    }
    const {x:x1,z:z1} = (eventType==EventTypes.entityHit?player[loc2Symbol]:player[loc1Symbol])??{x:-9999,z:-99999};
    if(Vector.subtract({x,y:0,z},{x:x1,y:0,z:z1}).length() < 5){
        player.sendMessage(`%selection.small.message`);
        return await sleep(15);
    }
    blockInUse.add(key);
    const perm = permutation;
    world.playSound('bubble.pop', { location, pitch: 0.6, volume: 1 });
    player.sendMessage(`%selection.onselect.message${eventType == EventTypes.entityHit ? 1 : 2}    ${formatXYZ(block)}`);
    player[eventType==EventTypes.entityHit?loc1Symbol:loc2Symbol] = {x,y,z};
    dimension.spawnParticle("minecraft:large_explosion", Vector.add(block, { x: 0.5, y: 0.5, z: 0.5 }), new MolangVariableMap());
    if (block.container == undefined) {
        block.setType(MinecraftBlockTypes.invisibleBedrock);
        await sleep(2);
        block.setPermutation(perm);
    }
    await sleep(10);
    blockInUse.delete(key);
}
function formatXYZ({ x, y, z }) {
    return `§2X§8:§a${x} §4Y§8:§c${y} §tZ§8:§9${z}`;
}




const vMap = new SquareParticlePropertiesBuilder(2.5).setLifeTime(0.05);
const variableMaps = {
    allow: vMap.setColor({red:0.2,green:0.7,blue:0.32}).variableMap,
    deny: vMap.setColor({red:0.7,green:0.2,blue:0.1}).variableMap,
    place: vMap.setColor({red:0.6,green:0.5,blue:0.1}).setLifeTime(5).variableMap
}
const running = Symbol('place');
const rayCast = {maxDistance:20,includeLiquidBlocks:false,includePassableBlocks:false};


/** @this {Player} */
async function onPlace(data, eventType){
    let block = null;
    if(eventType == EventTypes.beforeItemUse) block = this.getBlockFromViewDirection(rayCast);
    else if(eventType== EventTypes.beforeItemUseOn) block = this.dimension.getBlock(data.getBlockLocation());
    else if(eventType== EventTypes.entityHit) block = data.hitBlock;
    if(!block) return await sleep(mainDelay);
    const area = await checkArea(block);
    delete this[running];
    overworld.spawnParticle("dest:square", Vector.add(block, { x: 0.50, y: 1.25, z: 0.50 }), variableMaps.place);
    await sleep(15);
}

/**@param {Player} player */
async function startPickLocation(player){
    player[running] = true;
    player[actionSymbol] = onPlace;
    player.container.setItem(8,MenuItemStacks.TowerEditor);
    buyTower(player);
}
/**@param {Player} player */
async function buyTower(player){
    while(player[running]){
        await sleep(2);
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
    delete player[actionSymbol];
    delete player[running];
    if(player.isOnline) player.container.setItem(8,MenuItemStacks.Menu);
}
async function towers(player){
    const actions = [];
    const towers = await global.session.getTowerIDsAsync(); 
    towers.forEach(()=>actions.push(onTowerSelect));
    const form = new ActionFormData().title('form.towers.title')
    .body(`§hTowers: §7 ${towers.length}§8/§710`);
    if(towers.length<10){
        actions.push(startPickLocation)
        form.button('§2§lBuy New')
    }
    form.button('form.close');
    const {output} = await form.show(player);
    actions[output]?.(player,towers[output]);
}







/**@param {Player}player */
async function uisettings(player) {
    const reset = () => player.getTags().forEach(t => t.match(/,ui/) && player.removeTag(t)),
        ui = player.getTags().find(t => t.match(/,ui/)) ?? ',,ui',
        [a, b] = ui.split(','), { PaintBrush, ColorBrush, Reset, Back } = Textures,
        { output: S, canceled } = await new ActionFormData()
            .title('pack.description')
            .body(a + `Select an option below to customize this user interface as you please.`)
            .button(a + `Titles & Buttons`, PaintBrush)
            .button(a + `Content`, ColorBrush)
            .button(a.replace(/§k/g, '') + `Reset`, Reset)
            .button(a + `Back`, Back)
            .show(player);
    if (canceled) return;
    if (S == 2) return reset(), player.addTag(uiFormat.reset);
    if (S === 3) return player[actionSymbol](player);
    return Apply(player, [a, b, 'ui'], S);
}


async function Apply(player, ui, num) {
    const reset = () => player.getTags().forEach(t => t.match(/,ui/) && player.removeTag(t)),
        [a, b] = ui, type = ui[num], Colours = uiFormat.color,
        which = () => !num ? 'title & buttons' : 'content',
        CLRS = Object.keys(Colours),
        myClr = Object.values(Colours).findIndex(c => type.endsWith(c)),
        { formValues, canceled } = await new ModalFormData()
            .title(a.replace(/§k/g, '') + 'Customize ' + which())
            .toggle(b + `§lBold`, type.includes('§l'))
            .toggle(b + '§oItalic', type.includes('§o'))
            .toggle(b + `§kObfuscated`, type.includes('§k'))
            .toggle(b + '§´Special', type.includes('§´'))
            .dropdown(b + 'Color', CLRS, myClr)
            .show(player);
    if (canceled) return;
    let [B, i, o, s, cl] = formValues, clr = Colours[CLRS[cl]];
    ui[num] = (B ? '§l' : '') + (i ? '§o' : '') + (o ? '§k' : '') + (s ? '§´' : '') + clr;
    reset(); player.addTag(ui.join(','));
}