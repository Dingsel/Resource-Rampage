import { MolangVariableMap, system, world, Vector } from "@minecraft/server";

const asyncTimeout = (time) => {
    return new Promise((resolve) => {
        system.runTimeout(resolve, time)
    })
}


const map = new MolangVariableMap()

/**
 * 
 * @param {number} level 
 * @param {Vector} vec 
 */

async function aoeFire(level, vec) {
    for (let i = 0; i < level; i++) {
        world.overworld.spawnParticle(`dest:aoe_${(level - 1 - i)}`, vec, map)
        world.playSound("mob.ghast.fireball", { location: vec })
        const targets = world.overworld.getEntities({ location: vec, maxDistance: 6 + 5 * (level - 1 - i), excludeTypes: ["minecraft:player"] })
        for (const entity of targets) {
            entity.setOnFire(10, false)
            const impulse = Vector.multiply(Vector.add(Vector.subtract(entity.location, vec), { x: 0, y: 1 * (level - 1 - i), z: 0 }).normalized(), 0.5)
            entity.applyImpulse(impulse)
            entity.applyDamage(5 * level)
        }
        await asyncTimeout(10)
    }
}

// aoe: 0 r:6, 1: r:11, 2: r:16

setInterval(() => {
    aoeFire(3, new Vector(0, 100, 0)).catch(e => console.error(e))
}, 200)