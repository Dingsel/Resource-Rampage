import { world } from "@minecraft/server";
import { promise } from "./base.js";
import { Castle } from "utilities/import.js";

const gameplay = "gameplay";
const objective = world.scoreboard.getObjective(gameplay)??world.scoreboard.addObjective(gameplay,gameplay);

async function init(){
    await promise;
    global.castle = global.castle??new Castle(objective);
    return global.castle;
}
export const promise = init();