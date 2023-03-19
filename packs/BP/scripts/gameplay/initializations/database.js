import { world } from "@minecraft/server";
import { promise } from './enchantments_load.js';

const {overworld} = world;
let container = null;
async function loadDB(){
    await promise;
    let e = null;
    for (const entityDB of overworld.getEntities({type:"dest:world_db"})){
        if(e) {
            console.log("killing entity");
            entityDB.kill(); continue;
        }
        e=entityDB;
    }
    if(!e){
        e = overworld.spawnEntity("dest:world_db",{x:0,y:-64,z:0});
        container = e.container;
        console.log("spawning new entity!");
    }
}
export const promise = loadDB();