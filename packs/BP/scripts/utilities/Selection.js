import {Block, ItemStack, MinecraftBlockTypes, MinecraftItemTypes, MolangVariableMap, Player, Vector, world} from '@minecraft/server';

export class Selection{
    static timeout = 10000;
    static selectionToolId = MinecraftItemTypes.ironSword.id;
    static blocksInUse = new Set();
    static playerInUse = new Set();
    constructor(player){
        this.#player = player;
    }
    updateLocation(location1){
        
    }
    updateLocation(location2){

    }
    #player;
}
/** @param {Player} player @param {Boolean} initialSpawn */
function onJoin({player,initialSpawn}){
    if(initialSpawn){
        Selection.registry(new Selection(player));
    }
}
world.events.worldInitialize.subscribe(()=>{for(let p of world.getPlayers()) onJoin(p,true);})
world.events.playerSpawn.subscribe(onJoin);
world.events.playerLeave.subscribe(({playerId})=>Selection.playerInUse.delete(playerId));
world.events.beforeItemUseOn.subscribe((e)=>onUse(e.source,e.source.dimension.getBlock(e.getBlockLocation()),e.item));
world.events.entityHit.subscribe((ev)=>{if(ev.hitBlock && ev.entity.typeId == 'minecraft:player') onUse(ev.entity,ev.hitBlock,ev.entity.mainhand.getItem());},{entityTypes:["minecraft:player"]});

/**@param {Player} player, @param {Block} block, @param {ItemStack} item */
async function onUse(player, block, item){
    if(item.typeId != Selection.selectionToolId) return;
    const key = block.dimension.id + `${block.x}.${block.y}.${block.z}`;
    if(Selection.blocksInUse.has(key) || Selection.playerInUse.has(player.id)) return;
    Selection.blocksInUse.add(key);Selection.playerInUse.add(player.id);
    const perm = block.permutation;
    await player.runCommandAsync(`playsound bubble.pop @a ${block.x} ${block.y} ${block.z} 1 0.6`);
    player.dimension.spawnParticle("minecraft:large_explosion",Vector.add(block,{x:0.5,y:0.5,z:0.5}),new MolangVariableMap());
    if(block.container == undefined){
        block.setType(MinecraftBlockTypes.invisibleBedrock);
        await sleep(2);
        block.setPermutation(perm);
    }
    await sleep(5);
    Selection.blocksInUse.delete(key); Selection.playerInUse.delete(player.id);
}
console.warn('Tool item: ' + Selection.selectionToolId);