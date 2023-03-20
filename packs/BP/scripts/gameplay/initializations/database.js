import { world } from "@minecraft/server";
import { Database } from "utils.js";
import { promise } from './enchantments_load.js';

const {overworld} = world;
async function loadDB(){
    await promise;
    try {
        const n = Date.now();
        const database = Database.createDatabase('world_db');
        for (let i = 0; i < 100; i++) {
            database.set(Number.createUID(),Number.createUID());
        }
        database.clear();
        console.log("100x in ",Date.now() - n,"ms");
    } catch (error) {
        errorHandle(error);
    }

}
export const promise = loadDB();