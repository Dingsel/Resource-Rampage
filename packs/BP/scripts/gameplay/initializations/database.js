import { GameDatabase } from "utils.js";
import { promise } from './enchantments_load.js';

const {scoreboard} = world;
const game_db_key = "world_db", loadPromise = GameDatabase.Start(game_db_key);
let database = null;

async function loadDB(){
    await promise;
    const n = Date.now();
    const database = await loadPromise;
    console.log("Current SessionId: ", database.getSessionId());
    return database;
}
export const promise = loadDB();