export * from './castle.js';
export * from './enchantments_load.js';
export * from './database.js';

import { promise as database } from './database.js';


const modules = ["./database.js","./castle.js","./enchantments_load.js"];
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
    const [database, castle, enchantments ] = values;
    await system.events.gameInitialize.trigger(database,castle);
    console.log("Susccessfully Initialized");
}
export const promise = Initialization().catch(errorHandle);