export * from './castle.js';
export * from './scores.js';
export * from './enchantments_load.js';

import * as castle from './castle.js';
import * as score from './scores.js';
import * as enchantments_load from './enchantments_load.js';

const modules = ["./castle.js","./scores.js","./enchantments_load.js"];
async function Initialization(){
    const a = [];
    for (const m of modules) a.push((await import(m)).promise);
    await Promise.allSettled(a);
    global.initialized = true;
    console.log("Initialized");
}
export const promise = Initialization();
