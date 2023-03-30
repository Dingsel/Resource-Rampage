import { Vector } from "@minecraft/server";
import { BossBarBuilder } from "../runtime/bossbar";
import { summonCentipede } from "./centipede";

let fill = 0
const bossbar = new BossBarBuilder(false)

export function spawnBoss(location, length) {
    const centipede = summonCentipede(length, location)
    const head = centipede[0]
    head.setDynamicProperty("length", length - 1)
    bossbar.useSecondary = true
}


export function asyncTimeout(ticks) {
    return new Promise((resolve) => {
        system.runTimeout(resolve, ticks)
    })
}

world.events.entityDie.subscribe(async (event) => {
    try {
        const { deadEntity } = event, { typeId, dimension: dim } = deadEntity
        if (typeId != "dest:centipede_head" || !deadEntity.hasTag('centipede')) return
        const tags = [deadEntity.getTags()[1]]
        const current = deadEntity.getDynamicProperty("length") ?? 0
        const centipede_parts = dim.getEntities({ tags })

        if (current > 3) {
            await asyncTimeout(2)
            spawnBoss(deadEntity.location, current - 1)
        } else {
            bossbar.useSecondary = false
        }
        const locations = centipede_parts.map(x => x.location)

        for (const location of locations) {
            dim.createExplosion(location, 1, { breaksBlocks: false })
            await asyncTimeout(2)
        }
    } catch (error) {
        errorHandle(error)
    }
})


world.events.entityHurt.subscribe((event) => {
    const { hurtEntity } = event
    if (hurtEntity.typeId != "dest:centipede_head") return
    let stage = hurtEntity.getDynamicProperty("length") - 2
    const MaxHealth = hurtEntity.maxHealth * 7
    const MaxHealthStage = hurtEntity.maxHealth * stage
    const health = MaxHealthStage - (hurtEntity.maxHealth - hurtEntity.health)
    fill = health / MaxHealth * 100
})



system.runInterval(() => {
    for (const player of world.getPlayers()) {
        bossbar
            .setFill(world.hp)
            .setSecondaryFill(fill)
            .show(player)
    }
})


system.runInterval(() => {
    for (const head of world.overworld.getEntities({ type: "dest:centipede_head" })) {
        const { x, y, z } = head.getVelocity()
        const length = new Vector(x, y, z).length()
        if (length < 0.1) return;
        const players = head.dimension.getEntities({ type: "player", maxDistance: 30, location: head.location })
        for (const player of players) {
            player.runCommandAsync(`camerashake add @s ${(30 - Math.abs(Vector.distance(player.location, head.location))) * 0.0008} 0.1 rotational`)
        }
    }
})

system.runInterval(async () => {
    for (const head of world.overworld.getEntities({ type: "dest:centipede_body" })) {
        const { x, y, z } = head.getVelocity()
        const length = new Vector(x, y, z).length()
        if (length < 0.1) return;
        world.playSound("dig.stone", { pitch: 2, location: head.getHeadLocation(), volume: 2 })
        await asyncTimeout(1)
    }
}, 5)