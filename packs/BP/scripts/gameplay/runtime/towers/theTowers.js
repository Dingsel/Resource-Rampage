import { EffectType, Entity, EntityDamageCause, EntityScaleComponent, MinecraftEffectTypes, Player, Vector } from "@minecraft/server";
import { TowerAbilityInformations, TowerDefaultAbilities, TowerTypes } from "resources";
import { ImpulseParticlePropertiesBuilder, RadiusArea, TowerElement } from "utils";

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
        else{
            const element = await global.database.getTowerAsync(id);
            nMap.set(id,new Tower(element));
        }
    }
    towers.clear();
    Towers.towers = nMap;
}
class Tower{
    static TowerTypes = {};
    #element;#safeArea;
    /** @param {TowerElement} towerElement*/
    constructor(towerElement,keep = false){
        const type = towerElement.get('type');
        if(type && !keep) return new Tower.TowerTypes[type](towerElement,true);
        console.log("Loaded Tower: ", type);
        this.#element = towerElement;
        this.#safeArea = new RadiusArea(this.#element.get('location'),10);
        global.safeArea.add(this.#safeArea);
        this.#onImpulse();
    }
    async #onImpulse(){
        const element = this.#element;
        if(element.isDisposed) return this.onDispose();
        setTimeout(()=>this.#onImpulse().catch(errorHandle),this.interval);
        await this.onImpulse();
    }
    get location(){return this.#element.get('location')??{x:0,y:0,z:0};}
    get type(){return this.#element.get('type')??TowerTypes.Mage;}
    get level(){return this.#element.get('level')??1}
    get element(){return this.#element;}
    get safeArea(){return this.#safeArea;}
    get interval(){return 20;}
    async onImpulse(){}
    onDispose(){
        this.#element = undefined;
        global.safeArea.delete(this.#safeArea);
    }
}
Tower.TowerTypes[TowerTypes.Mage] = class IgniteTower extends Tower{
    async onImpulse(){
        for (let i = 0; i < this.level; i++) {
            this.doImpulse().catch(errorHandle);
            await sleep(15);
        }
    }
    async doImpulse(){let location = this.location;
        const r = 20;
        const p = 1;
        const k = 1;
        const d = 30;
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

Tower.TowerTypes[TowerTypes.Archer] = class ArcherTower extends Tower{
    async onImpulse(){
        for (let i = 0; i < this.level; i++) {
            await this.doImpulse().catch(errorHandle);
        }
    }
    async doImpulse(){ let location = this.location;
        const r = 20;
        location = Vector.add(location,{x:0.5,y:0.2,z:0.5});
        const loc2 = Vector.add(location,{x:0.5,y:10,z:0.5});
        for (const e of overworld.getEntities({location,maxDistance:r + 20,closest:1,families:['enemy']})) {
            try {
                const headLocation = e.getHeadLocation();
                const arrow = overworld.spawnEntity("dest:arrow",loc2);
                const x = headLocation.x - location.x, z = headLocation.z - location.z, l = (x**2 + z**2)**0.5;
                arrow.addEffect(MinecraftEffectTypes.levitation,20);
                const scale = arrow.getComponent(EntityScaleComponent.componentId);
                arrow.damage = 25;
                const impulse = {x:x/l,y:0.2,z:z/l};
                const angles = anglesFromVector(impulse);
                arrow.setRotation(angles.y,angles.x);
                arrow.applyImpulse(impulse);
                await nextTick;
                scale.value = 2.5;
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
    }
}
events.projectileHit.subscribe((ev)=>{
    const {damage} = ev.projectile;
    if(damage){
        delete ev.projectile.damage;
        const l = ev.getEntityHit();
        if(!l) return;
        l.entity.health -= damage;
        l.entity.updateHealths();
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