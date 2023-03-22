import { InitTowers } from "../runtime/towers/theTowers.js";
import { promise as pms } from "./database.js";



async function Init(){
    await pms;
    await InitTowers();
    return {};
}

export const promise = Init();