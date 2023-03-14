import { World, Dimension, world, MinecraftDimensionTypes, System } from '@minecraft/server';

const { overworld, nether, theEnd } = MinecraftDimensionTypes;

let dbCache;

Object.defineProperties(World.prototype, {
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

Object.defineProperties(Dimension.prototype, {
    setBlock: { value: function setBlock(loc, permutation) { return this.fillBlocks(loc, loc, permutation); } }
});

Object.defineProperties(System.prototype, {
    nextTick: { get() { return new Promise(res => this.run(res)); } }
});


world.events.worldInitialize.subscribe(() => {
    Object.defineProperties(World.prototype, {
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