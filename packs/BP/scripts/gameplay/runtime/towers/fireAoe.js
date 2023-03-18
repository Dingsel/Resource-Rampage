import { MolangVariableMap, system, world, Vector } from "@minecraft/server";
import { ImpulseParticlePropertiesBuilder } from "utilities/MolangVariableMaps";

const { overworld } = world;

const map = new ImpulseParticlePropertiesBuilder(5)

/**
 * 
 * @param {number} level 
 * @param {Vector} location 
 */

export async function aoeFire(level, location) {
    for (let i = 0; i < level; i++) {
        const n = level - 1 - i
        overworld.spawnParticle(`dest:ignite_impulse`, location, map.setRadius(6 + 5 * n).getMolangVariableMap())
        world.playSound("mob.ghast.fireball", { location })
        const targets = overworld.getEntities({ location, maxDistance: 6 + 5 * n, excludeTypes: ["minecraft:player"], excludeFamilies: ["tower"] })
        for (const entity of targets) {
            entity.setOnFire(10, false)
            const impulse = Vector.multiply(Vector.add(Vector.subtract(entity.location, location), { x: 0, y: 1 * n, z: 0 }).normalized(), 0.5)
            entity.applyImpulse(impulse)
            entity.applyDamage(5 * level)
        }
        await sleep(10)
    }
}

// aoe: 0 r:6, 1: r:11, 2: r:16