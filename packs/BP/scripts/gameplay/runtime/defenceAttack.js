import { system, world } from "@minecraft/server";
import { aoeFire } from "./fireAoe";

const defences = {
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
    }
}


Object.keys(defences).forEach((key) => {
    system.runInterval(() => {
        for (const entity of world.overworld.getEntities({ type: key })) {

            if (entity.cd > 0) entity.cd -= 1
            if (entity.cd != 0) continue

            const targets = world.overworld.getEntities({
                location: entity.location,
                maxDistance: defences[key]?.radius,
                excludeTypes: ["minecraft:player"],
                excludeFamilies: ["tower"]
            })

            if (targets.length > 0) {
                defences[key]?.attackFunction(defences[key]?.level, entity.location)
                entity.cd = defences[key]?.attackInterval
            }
        }
    })
}) 