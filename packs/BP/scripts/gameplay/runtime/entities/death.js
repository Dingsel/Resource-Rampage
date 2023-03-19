import { MolangVariableMap, Player, world } from "@minecraft/server";

const map = new MolangVariableMap()

events.entityDie.subscribe(({ deadEntity }) => {
    if (deadEntity instanceof Player) return
    deadEntity.dimension.spawnParticle("dest:coin", deadEntity.location, map)
    coins++
})
