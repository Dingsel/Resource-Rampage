import { world, system } from "@minecraft/server"
import { coinId } from "./globalVars"

const randNum = (min, max) => Math.floor((Math.floor(Math.random() * max - min) + min) * 10) / 10

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const { location, dimension } = player
        for (const entity of dimension.getEntities({ type: coinId, location, maxDistance: 2 })) {
            player.runCommandAsync(`playsound random.orb @s ~~~ 1 ${randNum(1.3, 1.7)}`)
            entity.triggerEvent(`despawn`)
            player.coins++
        }
    }
}, 1)