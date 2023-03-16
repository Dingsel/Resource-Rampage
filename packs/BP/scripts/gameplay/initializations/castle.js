import { world } from "@minecraft/server";
import { Castle } from "utilities/import.js";

const gameplay = "gameplay"
const overworld = world.overworld;

async function init(long){
    let obj = world.scoreboard.getObjective(gameplay);
    if(obj == null){
        console.warn('initial castle setup');
        obj = world.scoreboard.addObjective(gameplay,"The Gameplay");
        await Promise.all([
            overworld.runCommandAsync(`scoreboard players set coins gameplay 0`),
            overworld.runCommandAsync(`scoreboard players set lvl gameplay 0`)
        ]);
    }
    try {
        global.castle = global.castle??new Castle(obj);
    } catch (error) {
        if(long < 1) throw new Error("Objective couln`t be initialized");
        await nextTick;
        world.scoreboard.removeObjective(obj);
        init(long-1);
    }
}
init(5).catch((er)=>console.error(er,er.stack));