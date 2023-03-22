export * from './castle.js';
export * from './enchantments_load.js';
export * from './database.js';
export * from './towers.js';

const modules = ["./database.js","./castle.js","./enchantments_load.js","./towers.js"];
async function Initialization(){
    const a = [];
    for (const m of modules) a.push((await import(m)).promise);
    const n = await Promise.allSettled(a);
    const values = [];
    for (const {status, reason, value} of n) {
        if(status == 'rejected') {
            errorHandle(reason); values.push(reason);
        } else values.push(value);
    }
    global.initialized = true;
    const [database, castle ] = values;
    await system.events.gameInitialize.trigger(database,castle);
    console.log("Susccessfully Initialized");
}
export const promise = Initialization().catch(errorHandle);