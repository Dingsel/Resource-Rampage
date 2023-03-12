import { system, world } from "@minecraft/server";

const maxChars = 10; //Move into global pls there are like 3 different files for it and idk which one to choose

function updateName(entity) {
    const percentHealth = entity.health / entity.maxHealth * 10
    const fullChars = maxChars - Math.floor(percentHealth)
    const emptyChars = maxChars - fullChars
    const nameStr = "§2|".repeat(fullChars) + "§c|".repeat(emptyChars)
    entity.nameTag = nameStr
}

system.runInterval(() => {
    for (const entity of world.overworld.getEntities({ families: ["enemy"] })) {
        updateName(entity)
    }
})