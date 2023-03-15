import { world, Vector } from "@minecraft/server";

world.events.beforeItemUseOn.subscribe((event) => {
    const { cancel, item, source: player } = event
    const loc = player?.viewBlock.location

    const structure = world.db.find((x) => {
        const maxLoc = Vector.add(x.location, { x: x.size[0], y: 0, z: x.size[1] })
        console.warn(maxLoc.x, maxLoc.z, loc.x, loc.z, x.location.x, x.location.z)
        console.warn(`max : ${maxLoc.x} ${maxLoc.x} loc: ${loc.x} ${loc.x} currentLoc : ${x.location.x} ${x.location.z}`)
        return (
            loc.x >= Math.trunc(x.location.x - 1) && loc.x <= Math.trunc(maxLoc.x) &&
            loc.z >= Math.trunc(x.location.z - 1) && loc.z <= Math.trunc(maxLoc.z)
        )
    })

    console.warn(`Found ${structure}`)
})