import { world } from "@minecraft/server";
import { aoeFire } from "./fireAoe";

const { overworld } = world,
    defences = {
        "dest:mage_1": {
            attackInterval: 200,
            level: 1,
            attackFunction: aoeFire,
            radius: 6
        },
        "dest:mage_2": {
            attackInterval: 200,
            level: 2,
            attackFunction: aoeFire,
            radius: 11
        },
        "dest:mage_3": {
            attackInterval: 200,
            level: 3,
            attackFunction: aoeFire,
            radius: 16
        }
    };


Object.keys(defences).forEach((type) => {
    const { radius, level, attackFunction, attackInterval } = defences[type]

    setInterval(() => {
        for (const entity of overworld.getEntities({ type })) {
            const { cd, location } = entity

            if (cd > 0) entity.cd -= 1
            if (cd != 0) continue

            const targets = overworld.getEntities({
                location,
                maxDistance: radius,
                excludeTypes: ["minecraft:player"],
                excludeFamilies: ["tower"]
            })

            if (targets.length > 0) {
                attackFunction(level, location)
                entity.cd = attackInterval
            }
        }
    })
}) 