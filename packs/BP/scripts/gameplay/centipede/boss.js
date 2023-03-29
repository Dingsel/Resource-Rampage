import { BossBarBuilder } from "../runtime/bossbar";
import { summonCentipede } from "./centipede";

export function spawnBoss(location, length) {
    const centipede = summonCentipede(length, location)
    const head = centipede[0]
    head.setDynamicProperty("length", length - 1)
}


export function asyncTimeout(ticks) {
    return new Promise((resolve) => {
        system.runTimeout(resolve, ticks)
    })
}

world.events.entityDie.subscribe(async (event) => {
    try {
        const { deadEntity } = event
        const dim = world.getDimension(deadEntity.dimension.id)
        if (deadEntity.typeId != "dest:centipede_head") return
        const current = deadEntity.getDynamicProperty("length") ?? 0
        const centipede_parts = dim.getEntities({ tags: ["centipede"] })

        if (current > 3) {
            system.run(() => {
                spawnBoss(deadEntity.location, current - 1)
            })
        }
        const locations = centipede_parts.map(x => x.location)

        for (const location of locations) {
            dim.createExplosion(location, 1, { breaksBlocks: false })
            await asyncTimeout(2)
        }
    } catch (error) {
        console.error(error)
    }
})


world.events.entityHurt.subscribe((event) => {
    const { hurtEntity } = event
    if (hurtEntity.typeId != "dest:centipede_head") return
    const length = hurtEntity.getDynamicProperty("length")
})



const bossbar = new BossBarBuilder("Centipide")

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        bossbar
            .setFill(system.currentTick % 100)
            .show(player)
    }
})