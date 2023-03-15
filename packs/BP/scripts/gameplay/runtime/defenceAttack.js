import { system, world } from "@minecraft/server";
import { aoeFire } from "./fireAoe";

const defences = {
    "dest:mage_1": {
        attackInterval: 200,
        level: 1,
        attackFunction: aoeFire
    }
}


Object.keys(defences).forEach((key) => {
    system.runInterval(() => {
        for (const entity of world.overworld.getEntities({ type: key })) {
            defences[key]?.attackFunction(defences[key]?.level, entity.location)
        }
    }, defences[key]?.attackInterval)
}) 