import { world, system } from "@minecraft/server"
import { coinId } from "./globalVars"

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        for (const entity of player.dimension.getEntities({ type: coinId, location: player.location, maxDistance: 2 })) {
            player.runCommandAsync(`playsound random.orb @s ~~~ 1 ${getRandomFloat(1.3, 1.7)}`)
            entity.triggerEvent(`despawn`)
            player.coins++
        }
    }
}, 1)