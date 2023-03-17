import { Block, ItemStack, MinecraftBlockTypes, MinecraftItemTypes, MolangVariableMap, Player, Vector, world } from '@minecraft/server';

const selection = Symbol("selection");
export class Selection {
    static timeout = 10000;
    static selectionToolId = MinecraftItemTypes.ironSword.id;
    static _blocksInUse = new Set();
    static _playerInUse = new Set();
    static _registry = new Map();
    /**@param {Selection} selection */
    static registry(selection) {
        if (!selection instanceof Selection) throw new TypeError("Object is not selection instance");
        this._registry.set(selection.getPlayer().id, selection);
    }
    /** @param {string} playerId */
    static delete(playerId) {
        return this._registry.delete(playerId);
    }
    /** @param {Player | string} @returns {Selection} */
    static getSelection(playerId) {
        if (playerId instanceof Player) playerId = playerId.id;
        const a = this._registry.get(playerId);
        return a;
    }
    constructor(player) {
        this.#player = player;
    }
    /** @returns {Player} */
    getPlayer() {
        return this.#player;
    }
    clear() {
        this.location1 = undefined;
        this.location2 = undefined;
    }
    isAvailable() {
        return (Date.now() - this.lastModification < Selection.timeout) && (this.location1 && this.location2);
    }
    location1;
    location2;
    lastModification = 0;
    #player;
}
/** @param {Player} player @param {Boolean} initialSpawn */
function onJoin({ player, initialSpawn }) {
    if (initialSpawn) {
        Selection.registry(new Selection(player));
    }
}

world.events.worldInitialize.subscribe(() => { for (let p of world.getPlayers()) onJoin({ player: p, initialSpawn: true }); })
world.events.playerSpawn.subscribe(onJoin);
world.events.playerLeave.subscribe(({ playerId }) => Selection._playerInUse.delete(playerId));

world.events.beforeItemUseOn.subscribe((e) => onUse(e.source, e.source.dimension.getBlock(e.getBlockLocation()), e.item, "location2").catch(er => console.error(er, er.stack)));
world.events.entityHit.subscribe((ev) => { if (ev.hitBlock && ev.entity.typeId == 'minecraft:player') onUse(ev.entity, ev.hitBlock, ev.entity.mainhand.getItem(), "location1").catch(er => console.error(er, er.stack)); }, { entityTypes: ["minecraft:player"] });

/**@param {Player} player, @param {Block} block, @param {ItemStack} item */
async function onUse(player, block, item, property) {
    const { id, dimension } = player
    const { x, y, z, location, permutation } = block
    if (item.typeId != Selection.selectionToolId) return;
    const key = dimension.id + `${x}.${y}.${z}`;
    if (Selection._blocksInUse.has(key) || Selection._playerInUse.has(id) || (player.isSneaking && property == "location2")) return;
    Selection._blocksInUse.add(key); Selection._playerInUse.add(id);
    const a = Selection.getSelection(id);
    if (Date.now() - a.lastModification > Selection.timeout) {
        a.clear();
    }
    a.lastModification = Date.now();
    a[property] = location;
    const perm = permutation;
    world.playSound('bubble.pop', { location, pitch: 0.6, volume: 1 });
    player.sendMessage(`%selection.onselect.message${property == "location1" ? 1 : 2}    ${formatXYZ(block)}`);
    //await player.runCommandAsync(`playsound bubble.pop @a ${block.x} ${block.y} ${block.z} 1 0.6`);
    dimension.spawnParticle("minecraft:large_explosion", Vector.add(block, { x: 0.5, y: 0.5, z: 0.5 }), new MolangVariableMap());
    if (block.container == undefined) {
        block.setType(MinecraftBlockTypes.invisibleBedrock);
        await sleep(2);
        block.setPermutation(perm);
    }
    await sleep(5);
    Selection._blocksInUse.delete(key); Selection._playerInUse.delete(id);
}
function formatXYZ({ x, y, z }) {
    return `§2X§8:§a${x} §4Y§8:§c${y} §tZ§8:§9${z}`;
}

world.events.beforeItemUse.subscribe(({ item, source }) => {
    const { location } = source
    if (item.typeId != Selection.selectionToolId || !source.isSneaking) return
    const sel = Selection.getSelection(source.id)
    sel.clear()
    world.playSound('mob.shulker.teleport', { location, pitch: 0.5, volume: 0.5 });
    source.sendMessage(`%selection.onclear.message`);
})