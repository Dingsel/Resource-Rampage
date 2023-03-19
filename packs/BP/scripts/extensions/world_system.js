import { World, Dimension, world, MinecraftDimensionTypes, System, system } from '@minecraft/server';

const { overworld, nether, theEnd } = MinecraftDimensionTypes, { defineProperties: setProperties } = Object;

let dbCache = false;

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
    }
});

setProperties(Dimension.prototype, {
    setBlock: { value: function setBlock(loc, permutation) { return this.fillBlocks(loc, loc, permutation); } }
});

setProperties(System.prototype, {
    nextTick: { get() { return new Promise(res => this.run(res)); } },
    deltaTime: {get() { return deltaTime; }}
});

let deltaTime = 0;
let lastTime = 0;
system.runInterval(()=>{
    deltaTime = (Date.now() - lastTime)/5;
    lastTime = Date.now();
},5);

events.worldInitialize.subscribe(() => {
    setProperties(World.prototype, {
        db: {
            get() {
                if (dbCache) return dbCache
                const data = JSON.parse(this.getDynamicProperty("db") ?? "[]")
                dbCache = data
                return dbCache
            },
            set(val) {
                const str = JSON.stringify(val)
                if (str.length > 9800) throw new Error("Maximum Towers Reached")
                this.setDynamicProperty("db", str)
                dbCache = val
            }
        }
    })
})