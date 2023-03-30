import { World, Dimension, world, MinecraftDimensionTypes, System, system } from '@minecraft/server';

const { overworld, nether, theEnd } = MinecraftDimensionTypes, { defineProperties: setProperties } = Object;

let db = null;

setProperties(World.prototype, {
    overworld: { value: world.getDimension(overworld) },
    nether: { value: world.getDimension(nether) },
    theEnd: { value: world.getDimension(theEnd) },
    time: { get() { return this.getTime(); }, set(num) { return this.setTime(num); } },
    find: {
        value(entity, queryOptions) {
            queryOptions.location = entity.location;
            queryOptions.closest = 1;
            delete queryOptions.farthest;
            for (const e of entity.dimension.getEntities(queryOptions)) {
                if (entity == e) return e;
            }
            return false;
        }
    },
    db: { get() { return db; }, set(val) { db = val; } },
    round: { get() { return this.getDynamicProperty("round") ?? 0 }, set(n) { this.setDynamicProperty("round", n) } },
    hp: { get() { return this.getDynamicProperty("hp") ?? 0 }, set(n) { this.setDynamicProperty("hp", n) } }
});

setProperties(Dimension.prototype, {
    setBlock: { value: function setBlock(loc, permutation) { return this.fillBlocks(loc, loc, permutation); } }
});

setProperties(System.prototype, {
    nextTick: { get() { return new Promise(res => this.run(res)); } },
    deltaTime: { get() { return deltaTime; } }
});

let deltaTime = 0;
let lastTime = 0;
system.runInterval(() => {
    deltaTime = (Date.now() - lastTime) / 5;
    lastTime = Date.now();
}, 5);