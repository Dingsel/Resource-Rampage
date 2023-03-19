import { world } from "@minecraft/server";
import { promise } from "./castle.js";

const {overworld} = world;
async function loadDB(){
    await promise;
    let e = null;
    for (const db of overworld.getEntities({type:"dest:world_db"})){
        if(e) {
            db.kill(); continue;
        }
        e=db;
    }
    if(!e){
        e = overworld.spawnEntity("dest:world_db",{x:0,y:-64,z:0});
        console.log("spawning new entity!");
    }
}
export const promise = loadDB();