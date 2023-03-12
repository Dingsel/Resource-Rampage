import { world, Entity, system } from "@minecraft/server"

/**
 * 
 * @param {Entity} entity1 
 * @param {Entity} entity2 
 */
function lookat(entity1, entity2) {
    const { x: x1, y: y1, z: z1 } = entity1.getHeadLocation()
    const { x: x2, y: y2, z: z2 } = entity2.getHeadLocation()

    const deltaX = x1 - x2
    const deltaY = y1 - y2
    const deltaZ = z1 - z2

    const rotationX = Math.atan2(deltaX, deltaZ)
    //const rotationY = Math.asin(deltaY)
    console.warn(rotationX * (180 / Math.PI))
    entity1.setRotation(0, rotationX * (180 / Math.PI) + 90)
}

system.runInterval(() => {
    const player = world.getAllPlayers()[0]
    for (const entity of player.dimension.getEntities({ type: "minecraft:spider" })) {
        lookat(entity, player)
    }
}, 1)
//do u need every tick? performance...
//im just testing
//ok