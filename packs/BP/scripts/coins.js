import { world, system, Location } from "@minecraft/server"
import { coinId } from "./globalVars"

system.runSchedule(() => {
    for (const player of world.getPlayers()) {
        for (const entity of player.dimension.getEntities({ type: coinId, location: new Location(player.location.x, player.location.y, player.location.z), maxDistance: 2 })) {
            entity.triggerEvent(`despawn`)
            player.coins++
        }
    }
}, 1)