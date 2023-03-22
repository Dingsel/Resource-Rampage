import { Vector } from "@minecraft/server";
import { TowerLevelDefinition } from "resources";
import { ImpulseParticlePropertiesBuilder, TowerElement } from "utils";

export async function InitTowers(){
    setInterval(onReload,90);
}
export const Towers = {
    towers: new Map()
}
async function onReload(){
    let nMap = new Map();
    let towers = Towers.towers;
    for (const id of await global.session.getTowerIDsAsync()) {
        if(towers.has(id)) nMap.set(id,towers.get(id))
        else nMap.set(id,new Tower(await global.database.getTowerAsync(id)))
    }
    towers.clear();
    Towers.towers = nMap;
}

const {rangePerLevel,rangeOffset,baseIntervalDelay,intervalLevelInflation,impulseLevelDelay} = TowerLevelDefinition;

class Tower{
    #element;
    /** @param {TowerElement} towerElement*/
    constructor(towerElement){
        this.#element = towerElement;
        this.#onImpulse();
    }
    getRawInfo(){return this.#element.getRawInfo();}
    async #onImpulse(){
        const element = this.#element;
        if(element.isDisposed) return onDispose();
        const {location={x:0,y:0,z:0},damage,knockback,level,power,interval} = element.getRawInfo();
        const inter = baseIntervalDelay - (interval * intervalLevelInflation);
        console.log(inter);
        setTimeout(()=>this.#onImpulse().catch(errorHandle),inter<1?1:inter);
        await null;
        for (let i = 0; i < level; i++) {
            this.doImpulse(location,power,level*rangePerLevel + rangeOffset,knockback,damage).catch(errorHandle);
            await sleep(impulseLevelDelay / power);
        }
    }
    async doImpulse(location,power,range,knockback,damage){
        overworld.spawnParticle('dest:ignite_impulse',  location ,new ImpulseParticlePropertiesBuilder(range,power).variableMap);
        await nextTick;
        for (const e of overworld.getEntities({location,maxDistance:range,excludeTypes:["player"]})) {
            e.setOnFire(power*3);
            await null;
            const vec = Vector.subtract(e.location,location);
            vec.y = 0;
            const {x,z} = vec.normalized();
            const vec2 = Vector.multiply({x,y:1,z},knockback/10);
            e.applyDamage(damage)
            e.applyImpulse(vec2);
        }
    }
    getTowerElement(){return this.#element;}
    onDispose(){this.#element = undefined;}
}