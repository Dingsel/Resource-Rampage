import { promise } from "./base.js";
import { ScoreboardMap } from "utils.js";
import { InfoMapProperties } from "resources.js";

const gameplay = "gameplay";
const objective = objectives(gameplay);


async function init() {
    await promise;
    global.infoMap = global.infoMap ?? new ScoreboardMap(objective);
    await setDefault(global.infoMap);
    return global.castle;
}
/**@param {ScoreboardMap} scoreMap */
async function setDefault(scoreMap) {
    let promises = [];
    for (const p of Object.getOwnPropertyNames(InfoMapProperties)) {
        promises.push(scoreMap.addAsyncNoUpdate(InfoMapProperties[p]));
    }
    await Promise.all(promises);
    scoreMap.update();
}
export const promise = init();