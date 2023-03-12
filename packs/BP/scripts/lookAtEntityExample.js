import { world, Entity, system } from "@minecraft/server"

/**
 * 
 * @param {Entity} entity1 Entity thats get rotated to target entity
 * @param {Entity} entity2 Target entity that the other entity should rotate to
 */
function rotateTo(entity1, entity2) {
    const { x: x1, y: y1, z: z1 } = entity1.getHeadLocation()
    const { x: x2, y: y2, z: z2 } = entity2.getHeadLocation()

    const deltaX = x1 - x2
    const deltaY = y1 - y2
    const deltaZ = z1 - z2

    const rotationX = Math.atan2(deltaX, deltaZ)
    //need to figue out y rotation
    entity1.setRotation(0, rotationX * (180 / Math.PI) + 90)
}