import { EffectType, Entity, EntityDamageCause, EntityScaleComponent, MinecraftEffectTypes, Player, Vector } from "@minecraft/server";
import { TowerAbilityInformations, TowerDefaultAbilities, TowerTypes } from "resources";
import { ImpulseParticlePropertiesBuilder, RadiusArea, TowerElement } from "utils";

export async function InitTowers(){
    setInterval(()=>onReload().catch(errorHandle),90);
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
class Tower{
    #element;#safeArea;
    /** @param {TowerElement} towerElement*/
    constructor(towerElement){
        this.#element = towerElement;
        this.#safeArea = new RadiusArea(this.#element.get('location'),10);
        global.safeArea.add(this.#safeArea);
        this.#onImpulse();
    }
    getRawInfo(){return this.#element.getRawInfo();}
    async #onImpulse(){
        const element = this.#element;
        if(element.isDisposed) return this.onDispose();
        const data = this.getData();
        setTimeout(()=>this.#onImpulse().catch(errorHandle),TowerAbilityInformations[data.type].getInterval(data.interval));
        await this.onImpulse(data);
    }
    getData(){
        const type = this.#element.get('type')??TowerTypes.Mage;
        const {location={x:0,y:0,z:0},damage,knockback,range,level=1,power,interval} = Object.setPrototypeOf(this.#element.getData(),TowerDefaultAbilities[type]);
        return {location,damage,knockback,level,power,interval,range,type};
    }
    async onImpulse(){}
    getTowerElement(){return this.#element;}
    onDispose(){
        this.#element = undefined;
        global.safeArea.delete(this.#safeArea);
        console.log('dispose');
    }
}
class IgniteTower extends Tower{
    static INFO =  TowerAbilityInformations[TowerTypes.Mage];
    async onImpulse(data){
        for (let i = 0; i < data.level; i++) {
            this.doImpulse(data).catch(errorHandle);
            await sleep(15/data.power);
        }
    }
    async doImpulse({location,range,power,knockback,damage}){
        const r = IgniteTower.INFO.getRange(range);
        const p = IgniteTower.INFO.getPower(power);
        const k = IgniteTower.INFO.getKnockback(knockback);
        const d = IgniteTower.INFO.getDamage(damage);
        location = Vector.add(location,{x:0.5,y:0.2,z:0.5});
        overworld.spawnParticle('dest:ignite_impulse',  location ,new ImpulseParticlePropertiesBuilder(r,p).variableMap);
        for (const e of overworld.getEntities({location,maxDistance:r,excludeTypes:["player"]})) {
            try {
                e.setOnFire(p*8);
                const vec = Vector.subtract(e.location,location);
                vec.y = 0;
                const {x,z} = vec.normalized();
                const vec2 = Vector.multiply({x,y:1,z},k);
                e.applyDamage(d,{cause:EntityDamageCause.fire})
                e.applyImpulse(vec2);
                await nextTick;
            } catch (error) {}
        }
    }
}

class ArcherTower extends Tower{
    static INFO =  TowerAbilityInformations[TowerTypes.Archer];
    async onImpulse(data){
        for (let i = 0; i < data.level + 50; i++) {
            await this.doImpulse(data).catch(errorHandle);
        }
    }
    async doImpulse({location,range,power,level,knockback,damage}){
        const r = ArcherTower.INFO.getRange(range);
        const p = ArcherTower.INFO.getPower(power);
        const k = ArcherTower.INFO.getKnockback(knockback);
        const d = ArcherTower.INFO.getDamage(damage);
        location = Vector.add(location,{x:0.5,y:0.2,z:0.5});
        const loc2 = Vector.add(location,{x:0.5,y:10,z:0.5});
        for (const e of overworld.getEntities({location,maxDistance:r + 20,closest:1,excludeTypes:["player","dest:arrow","item"]})) {
            try {
                const headLocation = e.getHeadLocation();
                const arrow = overworld.spawnEntity("dest:arrow",loc2);
                const x = headLocation.x - location.x, z = headLocation.z - location.z, l = (x**2 + z**2)**0.5;
                arrow.addEffect(MinecraftEffectTypes.invisibility,2);
                const scale = arrow.getComponent(EntityScaleComponent.componentId);
                console.log(scale.value);
                scale.value = 0.5;
                console.log(scale.value);
                arrow.setRotation(30,40);
                arrow.applyImpulse({x:x/l,y:0.2,z:z/l});
                this.targetEntity(e,arrow,damage,knockback).catch(errorHandle);
                await sleep(3);
            } catch (error) {}
        }
    }
    /**@param {Entity} e @param {Entity} arrow */
    async targetEntity(e,arrow,data){
        await sleep(5);
        while(e.isValidHandle && arrow.isValidHandle){
            const loc1 = Vector.subtract(Vector.add(e.getHeadLocation(),{x:0,y:0,z:0}),arrow.location).normalized();
            const velocity = Vector.add(Vector.multiply(Vector.from(arrow.getVelocity()).normalized(),2),loc1).normalized();
            arrow.clearVelocity();
            arrow.applyImpulse(Vector.multiply(velocity,1.75));
            await nextTick;
        }
        if(arrow.isValidHandle) arrow.triggerEvent("dest:despawn");
    }
}
const contrusctors = {
    [TowerTypes.Mage]:IgniteTower,
    [TowerTypes.Archer]:ArcherTower
}