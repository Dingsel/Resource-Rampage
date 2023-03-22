import { Vector } from "@minecraft/server";
import { TowerLevelDefinition, TowerTypes } from "resources";
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
        else{
            const element = await global.database.getTowerAsync(id);
            console.log("load tower at: " + JSON.stringify(element.get('location')))
            nMap.set(id,new contrusctors[element.getTowerType()](element));
        }
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
        const data = this.getData();
        setTimeout(()=>this.#onImpulse().catch(errorHandle),data.interval);
        await this.onImpulse(data);
    }
    getData(){
        const {location={x:0,y:0,z:0},damage=0,knockback=0,radius=5,level=1,power=1,interval=baseIntervalDelay} = this.#element.getData();
        return {location,damage,knockback,level,power,interval,radius};
    }
    async onImpulse(){}
    getTowerElement(){return this.#element;}
    onDispose(){this.#element = undefined;}
}
class IgniteTower extends Tower{
    async onImpulse(data){
        for (let i = 0; i < data.level; i++) {
            this.doImpulse(data,data.level*rangePerLevel + rangeOffset).catch(errorHandle);
            await sleep(impulseLevelDelay / data.power);
        }
    }
    async doImpulse({location,radius,power,knockback,damage},range){
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
}

const contrusctors = {
    [TowerTypes.IgniteImpulse]:IgniteTower
}