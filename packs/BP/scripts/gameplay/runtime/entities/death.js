import { MolangVariableMap, Player, world } from "@minecraft/server";

const map = new MolangVariableMap()

events.entityDie.subscribe(({ deadEntity, damageSource }) => {
    if (deadEntity instanceof Player) return
    deadEntity.dimension.spawnParticle("dest:coin", deadEntity.location, map)
    console.warn(damageSource.cause)
}, {
    entityTypes: ((types = []) => {
        //for non dest entities??
        return types;
    })()
})
