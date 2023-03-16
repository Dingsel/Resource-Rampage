import { system, world } from "@minecraft/server";

const maxChars = 20; //Move into global pls there are like 3 different files for it and idk which one to choose

function updateName(entity) {
    const percentHealth = entity.health / entity.maxHealth * maxChars
    const fullChars = maxChars - Math.floor(percentHealth)
    const emptyChars = maxChars - fullChars
    const nameStr = "§2|".repeat(emptyChars) + "§c|".repeat(fullChars)
    entity.nameTag = nameStr
}

setInterval(async () => {
    for (const entity of world.overworld.getEntities({ families: ["enemy"] })) {
        try {
            updateName(entity);
            await null;
        } catch (error) { }
    }
}, 5)