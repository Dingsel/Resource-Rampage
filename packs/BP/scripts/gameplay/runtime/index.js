import { Vector, system, world } from '@minecraft/server';

export * from './entities/import.js';
export * from './player/import.js';
export * from './towers/import.js';

/*
const {overworld} = world;
system.runInterval(async ()=>{
    try {
        let i = system.currentTick;
        while(system.currentTick - i < 50){
            for (const n of overworld.getEntities({type:"armor_stand"})) {
                const loc = n.location;
                for (const e of overworld.getEntities({location:loc,maxDistance:5,excludeTypes:["armor_stand"],families:["mob"]})) {
                    let location = e.location;
                    const x = location.x - loc.x, y = location.y - loc.y, z = location.z - loc.z;
                    e.applyImpulse(Vector.add(Vector.multiply(new Vector(x,y+5,z).normalized(),-0.4),{x:0,y:0.1,z:0}));
                    await null;
                }
            }
            await nextTick;
        }
        let promises = [];
        await nextTick;
        for (const n of overworld.getEntities({type:"armor_stand"})) {Impulse(n)
        }
        await Promise.all(promises);
    } catch (error) {
        console.warn(error,error.stack);
    }
},200);
function Impulse(n){
    const loc = n.location;
    for (const e of overworld.getEntities({location:loc,maxDistance:5,excludeTypes:["armor_stand"],families:["mob"]})) {
        let location = e.location;
        const x = location.x - loc.x, y = location.y - loc.y, z = location.z - loc.z;
        e.applyImpulse(Vector.multiply(new Vector(x,y+3,z).normalized(),0.4))
        e.applyDamage(5);
    }
}
function add(vec1, vec2){
    return {x:vec1.x + vec2.x,y:vec1.y + vec2.y,z:vec1.z + vec2.z};
}*/