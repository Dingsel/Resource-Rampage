import { world } from "@minecraft/server"

//chatgpt moment
function getRandomFloat(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

setInterval(() => {
    for (const player of world.getPlayers()) {
        const { location, dimension } = player
        for (const entity of dimension.getEntities({ type: global.coinId, location, maxDistance: 2 })) {
            player.runCommandAsync(`playsound random.orb @s ~~~ 1 ${getRandomFloat(1.3, 1.7)}`)
            entity.triggerEvent(`dest:despawn`)
            player.coins++
        }
    }
}, 1)
