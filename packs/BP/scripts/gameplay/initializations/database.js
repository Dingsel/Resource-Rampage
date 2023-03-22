import { GameDatabase, TowerElement } from "utils.js";
import { promise } from './base.js';

const {scoreboard} = world;
const game_db_key = "world_db", loadPromise = GameDatabase.Start(game_db_key);
let database = null;

async function loadDB(){
    await promise;
    const database = await loadPromise;
    const session = await database.getSession();
    global.database = database;
    global.session = session;
    const keys = await session.getTowerIDsAsync();
    console.warn("Available towers:" + JSON.stringify(keys));
    /**@type {TowerElement} */
    let tower;
    if(keys.length<1) tower = await database.addTower();
    else tower = await database.getTowerAsync(keys[0]);
    await tower.setTowerPowerAsync(1);
    await tower.setTowerLevelAsync(3);
    await tower.setTowerLocationAsync({x:0.5,y:70.2,z:0.5});
    return {database,session};
}
export const promise = loadDB();