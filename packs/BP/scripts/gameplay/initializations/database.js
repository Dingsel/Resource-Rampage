import { GameDatabase, TowerElement } from "utils.js";
import { promise } from './base.js';

const {scoreboard} = world;
const game_db_key = "world_db", loadPromise = GameDatabase.Start(game_db_key);
let database = null;

async function loadDB(){
    await promise;
    let n = Date.now();
    const database = await loadPromise;
    const session = await database.getSession();
    const keys = await session.getTowerIDs();
    console.warn("Available towers:" + JSON.stringify(keys));
    /**@type {TowerElement} */
    let tower;
    if(keys.length<1) tower = await database.addTower();
    else tower = await database.getTower(keys[0]);
    await tower.setTowerName(tower.getTowerName() + "-" + tower.getTowerName());
    if(tower.getTowerName().length > 1000) await tower.setTowerName("");
    console.log(await session.getCurrentLevel());
    console.log("New Tower Name is: " + tower.getTowerName());
    return database;
}
export const promise = loadDB();