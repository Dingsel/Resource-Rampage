import { InfoMapProperties, MenuItemStacks, Textures, WallLevels } from "resources";
import { EventTypes, MainMenu, clearAction, setAction, setItem } from "./default.js";
import { ModalFormData } from "@minecraft/server-ui";
import { MinecraftBlockTypes, MolangVariableMap, Vector } from "@minecraft/server";
import { buildWall } from "gameplay/building/import.js";

/* Settings Registration */
MainMenu.WallBuilder = {
    action: start,
    content: "Wall Builder",
    icon: Textures.IconWall
}

const _loc1 = Symbol('loc1');
const _loc2 = Symbol('loc2');
const blockInUse = new Set();
const actionDelay = 15;
const Texts = {
    Start:"%selection.start.message",
    FocusLost:"%selection.focusLost.message1",
    FormDropdown:"%form.wallBuild.dropdown",
    FormTitle:"%form.wallBuild.title",
    FormSlider:"%form.wallBuild.slider",
    NoCions:"%gameplay.notCoins",
    ConstructionStarted:"%construction.started",
    ConstructionDone:"%construction.done",
    ConstructionProgress:"%construction.progress",
    Clear:"%selection.onclear.message",
    Same:"%selection.same.message",
    Small:"%selection.small.message",
    OnSelect:"%selection.onselect.message",
    CantBuild:"%selection.cantBuild.message"
}
export const WallTypeForm = new ModalFormData().title(Texts.FormTitle)
.slider(Texts.FormSlider,3,15,3,4)
.dropdown(Texts.FormDropdown,WallLevels.map((a,i)=>"Level " + i),0);




async function start(player){
    setAction(player,wallAction);
    player.sendMessage(Texts.Start);
    loop(player).catch((er)=>{end(player);errorHandle(er)});
}
async function end(player){
    console.log(player);
    console.log(clearAction(player));
    delete player[_loc1];
    delete player[_loc2];
    if(player.isOnline) setItem(player,MenuItemStacks.Menu);
}
async function showWallTypeForm(player){
    const {output:[height,level]=[],canceled} = await WallTypeForm.show(player);
    return {level,canceled,height};
}
/**@param {Player} player */
async function loop(player){
    const {infoMap} = global;
    setItem(player,MenuItemStacks.WallBuilder);
    await nextTick;
    while(player.isOnline){
        const {selectedSlot,[_loc1]: loc1, [_loc2]: loc2} = player;
        if(selectedSlot != 8){player.sendMessage(Texts.FocusLost);break;}
        if(loc1 && loc2){
            setItem(player,MenuItemStacks.Menu);
            const {level,height,canceled} = await showWallTypeForm(player);
            if(canceled) break;
            const cost = (level+1) * Vector.subtract(loc1, loc2).length() * height * 2;
            if(cost > infoMap.get(InfoMapProperties.coins)){
                player.info(Texts.NoCions + " §g" + (~~(cost - infoMap.get(InfoMapProperties.coins))).unitFormat(1) + " §2$");
                break;
            }
            const confirm = await player.confirm(`§h§lBuild Level ${level + 1} wall between selected positions for §g${(~~cost).unitFormat(2)} $?\n§r§7Position 1  §l${loc1.formatXYZ()}\n§r§7Position 2 §l ${loc2.formatXYZ()}`);
            if(confirm){
                player.sendMessage(Texts.ConstructionStarted);
                infoMap.relative(InfoMapProperties.coins, -cost.floor());
                setAction(player,async ()=>player.info(Texts.ConstructionProgress));
                const p = {x:0,y:height,z:0};
                await buildWall(Vector.add(loc1,p),Vector.add(loc2,p),WallLevels[level]);
                player.sendMessage(Texts.ConstructionDone);
            }
            break;
        }
        await nextTick;
    }
    return await end(player);
}
/**@this {Player} */
async function wallAction(player,data,eventType){
    if(player.isSneaking) {
        delete player[_loc1];
        delete player[_loc2];
        player.playSound('mob.shulker.close', { pitch: 0.3, volume: 0.7 });
        await sleep(3);
        player.sendMessage(Texts.Clear);
        await sleep(actionDelay);
    } else if(eventType == EventTypes.entityHit && data.hitBlock){
        if(await onSelect(player, data.hitBlock, eventType)) await sleep(actionDelay);
    } else if (eventType == EventTypes.beforeItemUseOn){
        if(await onSelect(player, player.dimension.getBlock(data.getBlockLocation()), eventType)) await sleep(actionDelay);
    }
}
async function onSelect(player, block, eventType) {
    const { dimension,[_loc1]:loc1,[_loc2]:loc2 } = player;
    const { x, y, z, location, permutation } = block;
    const key = dimension.id + `${x}.${y}.${z}`;
    if (blockInUse.has(key)) return false;
    if(Vector.equals({x,y,z},loc1??{}) || Vector.equals({x,y,z},loc2??{})){
        player.sendMessage(Texts.Same);return true;
    }
    const {x:x1,z:z1} = (eventType==EventTypes.entityHit?loc2:loc1)??{x:-9999,z:-99999};
    if(Vector.subtract({x,y:0,z},{x:x1,y:0,z:z1}).length() < 5){
        player.sendMessage(Texts.Small);return true;
    }
    if(!global.safeArea.isValid(location)) return true, player.sendMessage(Texts.CantBuild);
    blockInUse.add(key);
    world.playSound('bubble.pop', { location, pitch: 0.6, volume: 1 });
    player.sendMessage(`${Texts.OnSelect}${eventType == EventTypes.entityHit ? 1 : 2}    ${block.formatXYZ()}`);
    player[eventType==EventTypes.entityHit?_loc1:_loc2] = {x,y,z};
    dimension.spawnParticle("minecraft:large_explosion", Vector.add(block, { x: 0.5, y: 0.5, z: 0.5 }), new MolangVariableMap());
    if (block.container == undefined) {
        block.setType(MinecraftBlockTypes.invisibleBedrock);
        await sleep(2);
        block.setPermutation(permutation);
    }
    await sleep(10);
    blockInUse.delete(key);
    return false;
}