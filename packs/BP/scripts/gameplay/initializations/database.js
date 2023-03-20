import { GameDatabase } from "utils.js";
import { promise } from './base.js';

const {scoreboard} = world;
const game_db_key = "world_db", loadPromise = GameDatabase.Start(game_db_key);
let database = null;

async function loadDB(){
    await promise;
    const n = Date.now();
    const database = await loadPromise;
    const session = await database.getSession();
    console.warn("db_info",`\nlevelName:"${session.levelName}"`,session.levelName.length,"/",50,"\nsessionId:",database.getSessionId());
    await session.setLevelName(session.levelName + "a");
    if(session.levelName.length>50) await session.setLevelName("");
    return database;
}
export const promise = loadDB();