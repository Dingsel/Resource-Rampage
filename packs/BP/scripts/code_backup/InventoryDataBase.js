import { ContainerSlot, EntityInventoryComponent, ItemStack } from "@minecraft/server";

const loreMax = 32e3;
export const DataBaseSessions={
    Testing:0,
    Towers:1,
    Castle:2
}

export class DataBase{
    /** @param {ContainerSlot} containerSlot */
    constructor(containerSlot){
        const n = parseLore(containerSlot.getLore());
        if((n??"") == "") this.data = {};
        else this.data = JSON.parse(n);
        return new Structure(()=>{
            containerSlot.setLore(buildLore(JSON.stringify(this.data),loreMax));
        },this.data);
    }
}
export class Structure{
    constructor(onChange, object){
        this.#onChange = onChange;
        this.#data = object;
    }
    clear(){for (const k of this.keys()) delete this.#data[k]; this.#update();}
    set(property, value){
        if(value instanceof Structure) value = value.getRawData();
        this.#data[property] = value;
        this.#update();
    }
    delete(property){return delete this.#data[property];}
    get(property){
        if(typeof this.#data[property] == 'object') return new Structure(this.#onChange, this.#data[property]);
        return this.#data[property];
    }
    keys(){return Object.getOwnPropertyNames(this.#data);}
    has(property){return Object.prototype.hasOwnProperty.call(this.#data,property);}
    getRaw(property){return this.#data[property];}
    getRawData(){return this.#data;}
    #update(){this.#onChange();}
    #onChange;
    #data;
}
export class Base{
    /**@param {EntityInventoryComponent} inventory*/
    constructor(inventory)
    {
        this.inventory = inventory;
        this.container = inventory.container;
        this.selections = {};
    }
    /** @param {number} id @returns {Promise<Structure>}*/
    async getSession(id){
        if(id >= this.inventory.inventorySize || id < 0) throw new RangeError("Session is not available");
        if(id in this.selections) return this.selections[id];
        const slot = this.container.getSlot(id);
        if(slot.typeId == undefined) slot.setItem(new ItemStack("stick"));
        this.selections[id] = new DataBase(slot);
        return await this.selections[id];
    }
}



function buildLore(string, perLore){
    const lore = [];
    let n = 0;
    while(n < string.length){
        lore.push(string.substring(n,n+perLore));
        n+=perLore;
    }
    return lore;
}
function parseLore(lore){return lore.join("");}
export {};