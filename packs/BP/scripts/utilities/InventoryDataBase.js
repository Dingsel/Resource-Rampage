import { ContainerSlot } from "@minecraft/server";

const loreMax = 32e3;

export class DataBase extends Map{
    /** @param {ContainerSlot} containerSlot */
    constructor(containerSlot){
        const n = parseLore(containerSlot.getLore());
        if((n??"") == "") this.data = {};
        this.data = parseLore(containerSlot.getLore());
        return 
    }
}
export class Base{
    getSection(){}
}



function buildLore(string, perLore){
    const lore = [];
    let n = 0;
    while(n<string.length){
        lore.push(string.substring(n,n+perLore));
        n+=perLore;
    }
    return lore;
}
function parseLore(lore){return lore.join("");}
export {};