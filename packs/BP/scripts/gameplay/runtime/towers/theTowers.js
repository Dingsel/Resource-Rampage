import { EffectType, Entity, EntityDamageCause, EntityScaleComponent, MinecraftEffectTypes, Player, Vector } from "@minecraft/server";
import { ArcherTowerAbilities, MageTowerAbilities, TowerAbilityInformations, TowerDefaultAbilities, TowerTypes } from "resources";
import { ImpulseParticlePropertiesBuilder, RadiusArea, TowerElement } from "utils";

const defualtQuery = {families:['enemy'],excludeTypes:['dest:centipede_tail','dest:centipede_body']};
export async function InitTowers(){
    setInterval(()=>onReload().catch(errorHandle),120);
}
export const Towers = {
    towers: new Map()
}
async function onReload(){
    let nMap = new Map();
    let towers = Towers.towers;
    for (const id of await global.session.getTowerIDsAsync()) {
        if(towers.has(id)) nMap.set(id,towers.get(id))
        else{nMap.set(id,Tower.getTower(await global.database.getTowerAsync(id)));}
    }
    towers.clear();
    Towers.towers = nMap;
}
class Tower{
    static getTower(element){
        const type = element.get('type')??TowerTypes.Mage;
        return new {
            [TowerTypes.Mage]: MageTower,
            [TowerTypes.Archer]: ArcherTower,
        }[type](element);
    }
    static TowerTypes = {};
    static abilities = MageTowerAbilities;
    #element;#safeArea;#abilities;
    /** @param {TowerElement} towerElement*/
    constructor(towerElement){
        this.#element = towerElement;
        this.#safeArea = new RadiusArea(this.#element.get('location'),10);
        global.safeArea.add(this.#safeArea);
        this.#abilities = new new.target.abilities(towerElement.get('level')??1);
        this.#onImpulse();
    }
    async #onImpulse(){
        const element = this.#element;
        this.#abilities = new this.#abilities.constructor(this.level);
        if(element.isDisposed) return this.onDispose();
        setTimeout(()=>this.#onImpulse().catch(errorHandle),this.interval);
        await this.onImpulse();
    }
    get location(){return this.#element.get('location')??{x:0,y:0,z:0};}
    get type(){return this.#element.get('type')??TowerTypes.Mage;}
    get level(){return this.#element.get('level')??1}
    get element(){return this.#element;}
    get safeArea(){return this.#safeArea;}
    get abilities(){return this.#abilities;}
    get interval(){return this.abilities.getInterval();}
    async onImpulse(){}
    onDispose(){
        this.#element = undefined;
        global.safeArea.delete(this.#safeArea);
    }
    getDamage(){return this.#abilities.getDamage()*(Math.random() < this.#abilities.getCriticalDamageChance()?this.#abilities.getCriticalDamageFactor():1);}
}
class MageTower extends Tower{
    static abilities = MageTowerAbilities;
    async onImpulse(){
        for (let i = 0; i < this.level/3; i++) {
            this.doImpulse().catch(errorHandle);
            await sleep(15/this.abilities.getPower());
        }
    }
    async doImpulse(){let location = this.location; let abilities = this.abilities;
        const r = abilities.getRange();
        const p = abilities.getPower();
        const k = abilities.getKnockback();
        location = Vector.add(location,{x:0.5,y:0.2,z:0.5});
        overworld.spawnParticle('dest:ignite_impulse',  location ,new ImpulseParticlePropertiesBuilder(r,p).variableMap);
        for (const e of overworld.getEntities(Object.setPrototypeOf({location,maxDistance:r},defualtQuery))) {
            try {
                const d = this.getDamage();
                e.health -= d;
                e.setOnFire(p*12+5);
                const vec = Vector.subtract(e.location,location);vec.y = 0;
                const {x,z} = vec.normalized();
                e.applyImpulse(Vector.multiply({x,y:1,z},k));
                await nextTick;
            } catch (error) {}
        }
    }
}
class ArcherTower extends Tower{
    static abilities = ArcherTowerAbilities;
    async onImpulse(){await this.doImpulse().catch(errorHandle);}
    async doImpulse(){ let location = this.location, abilities = this.abilities;
        const r = abilities.getRange();
        location = Vector.add(location,{x:0.5,y:0.2,z:0.5});
        const loc2 = Vector.add(location,{x:0.5,y:10,z:0.5});
        for (const e of overworld.getEntities(Object.setPrototypeOf({location,maxDistance:abilities.getRange(),closest:abilities.getMaxTargets(),},defualtQuery))) {
            try {
                const headLocation = e.getHeadLocation();
                const x = headLocation.x - location.x, z = headLocation.z - location.z, l = (x**2 + z**2)**0.5;
                const impulse = {x:x/l,y:0.2,z:z/l};
                const angles = anglesFromVector(impulse);
                const arrow = overworld.spawnEntity("dest:arrow",loc2);
                arrow.damage = this.getDamage();
                arrow.knockback = {center:location,impulse:abilities.getKnockback()};
                arrow.setRotation(angles.y,angles.x);
                arrow.applyImpulse(impulse);
                await nextTick;
                arrow.scale = 2;
                this.targetEntity(e,arrow).catch(errorHandle);
            } catch (error) {}
        }
    }
    /**@param {Entity} e @param {Entity} arrow */
    async targetEntity(e,arrow){
        await nextTick;
        while(e.isValidHandle && arrow.isValidHandle){
            const loc1 = Vector.subtract(Vector.add(e.getHeadLocation(),{x:0,y:0,z:0}),arrow.location).normalized();
            const velocity = Vector.add(Vector.multiply(Vector.from(arrow.getVelocity()).normalized(),3),loc1).normalized();
            arrow.clearVelocity();
            arrow.applyImpulse(Vector.multiply(velocity,0.75));
            await nextTick;
        }
        if(!e.isValidHandle) {
            delete arrow.damage;
            delete arrow.knockback;
            try {
                arrow.triggerEvent('dest:despawn');
            } catch (error) {}
        }
    }
}
events.projectileHit.subscribe((ev)=>{
    const {projectile} = ev, {damage,knockback:{center,impulse} = {}} = projectile;
    if(damage && center && impulse){
        delete projectile.damage;
        delete projectile.knockback;
        const {entity} = ev.getEntityHit()??{};
        if(entity && entity?.typeId != 'minecraft:player') {
            entity.health -= damage;
            entity.applyImpulse(Vector.multiply(Vector.subtract(entity.location,center).normalized(),impulse));
            entity.updateHealths();
        }
    }
})
function anglesFromVector(vector) {
    const x = vector.z;
    const y = vector.y;
    const z = vector.x;
    const magnitudeXY = Math.sqrt(x ** 2 + z ** 2);
    const angleX = Math.atan2(z, x);
    const angleY = Math.atan2(y, magnitudeXY);
    return { x: angleX*180/Math.PI, y: angleY*180/Math.PI };
}
function angleBetweenVectors(vectorA, vectorB) {
    const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    const magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
    const magnitudeB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2);
    let angleInRadians = Math.acos(dotProduct / (magnitudeA * magnitudeB));
    if (vectorA.x * vectorB.y - vectorA.y * vectorB.x < 0) {
      angleInRadians = 2 * Math.PI - angleInRadians;
    }
    return radiansToDegrees(angleInRadians);
}