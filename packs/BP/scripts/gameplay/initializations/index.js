export * from './castle.js';
export * from './enchantments_load.js';
export * from './database.js';

const modules = ["./castle.js","./database.js","./enchantments_load.js"];
async function Initialization(){
    const a = [];
    for (const m of modules) a.push((await import(m)).promise);
    await Promise.allSettled(a);
    global.initialized = true;
    await system.events.gameInitialize.trigger();
    console.log("Susccessfully Initialized");
}
export const promise = Initialization().catch(errorHandle);