import { world } from "@minecraft/server";
import { Castle } from "utilities/import.js";

const gameplay = "gameplay"
const overworld = world.overworld;

async function init(long){
    const {successCount:sus} = await overworld.runCommandAsync('tickingarea remove ticking_area');
    const {successCount:sus2} = await overworld.runCommandAsync('function onStart');
    if(!(sus && sus2)) return console.error("Castle couldn`t be initialized")
    let obj = world.scoreboard.getObjective(gameplay);
    try {
        global.castle = global.castle??new Castle(obj);
    } catch (error) {
        if(long < 1) throw new Error("Objective couldn`t be initialized");
        await nextTick;
        world.scoreboard.removeObjective(obj);
        init(long-1);
    }
}
const promise = init(5).catch((er)=>console.error(er,er.stack));
export {promise};