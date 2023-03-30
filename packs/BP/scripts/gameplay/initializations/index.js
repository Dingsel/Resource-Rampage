import { DynamicPropertiesDefinition, EntityTypes } from '@minecraft/server';

export * from './infomap.js';
export * from './enchantments_load.js';
export * from './database.js';
export * from './towers.js';

const modules = ["./database.js", "./infomap.js", "./enchantments_load.js", "./towers.js"];
async function Initialization() {
    const a = [];
    for (const m of modules) a.push((await import(m)).promise);
    const n = await Promise.allSettled(a);
    const values = [];
    for (const { status, reason, value } of n) {
        if (status == 'rejected') {
            errorHandle(reason); values.push(reason);
        } else values.push(value);
    }
    global.initialized = true;
    const [database] = values;
    await system.events.gameInitialize.trigger(database);
    console.log("Susccessfully Initialized");
}
export const promise = Initialization().catch(errorHandle);


world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
    const def = new DynamicPropertiesDefinition()
    def.defineNumber("round")
    def.defineNumber("tier")

    def.defineNumber("health")
    def.defineNumber("defence")
    def.defineNumber("forge")
    def.defineBoolean("load")
    def.defineNumber("hp")

    propertyRegistry.registerWorldDynamicProperties(def)

    const bossDef = new DynamicPropertiesDefinition()
    bossDef.defineNumber("length")
    bossDef.defineString("boundBar", 50)
    propertyRegistry.registerEntityTypeDynamicProperties(bossDef, EntityTypes.get("dest:centipede_head"))
})