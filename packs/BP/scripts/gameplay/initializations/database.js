import { GameDatabase, TowerElement } from "utils.js";
import { promise } from './base.js';

const {scoreboard} = world;
const game_db_key = "world_db", loadPromise = GameDatabase.Start(game_db_key);

async function loadDB(){
    await promise;
    const database = await loadPromise;
    const session = await database.getSession();
    global.database = database;
    global.session = session;
    return {database,session};
}
export const promise = loadDB();