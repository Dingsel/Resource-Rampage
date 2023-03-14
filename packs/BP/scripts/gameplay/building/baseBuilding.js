import { MolangVariableMap, system, world, Vector } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { towers } from "resources/pack";

const baseSelection = new ActionFormData()
baseSelection.title("Select a Piece to Build!")
baseSelection.body("Test")
for (const tower of towers) {
    baseSelection.button(`${tower.alias}\n${tower.description}`, tower.icon)
}
const spawnParticle = overworld.spawnParticle.bind(overworld)


beforeItemUse.subscribe(async ({ item, source: player }) => {
    if (item.typeId != "minecraft:apple" || player.structureTemp) return;
    const result = await baseSelection.show(player)
    player.structureTemp = towers[result.selection]
})



const map = new MolangVariableMap()

/**
 * 
 * @param {Vector} lookAt 
 * @param {Array<number>} size 
 */
function draw(lookAt, size, player) {

    let intercepting;
    for (const obj of world.db) {
        const loc = player.viewBlock?.location

        loc.x -= size[0] / 2 - 1
        loc.z -= size[1] / 2 - 1

        if (checkOverlap(loc, size, obj.location, obj.size)) {
            intercepting = true
            break
        }
    }

    let colour = intercepting ? "red" : "green"


    for (let i = 0; i < size[0] + 1; i++) {
        const { x, y, z } = lookAt
        const loc = {
            x: x + i - size[0] / 2 + 0.5,
            y: y + 1,
            z: z - size[1] / 2 + 0.5
        }
        spawnParticle(`dest:${colour}`, loc, map)
        loc.z += size[1]
        spawnParticle(`dest:${colour}`, loc, map)
    }

    for (let i = 0; i < size[1] + 1; i++) {
        const { x, y, z } = lookAt
        const loc = {
            x: x - size[0] / 2 + 0.5,
            y: y + 1,
            z: z + i - size[1] / 2 + 0.5
        }
        spawnParticle(`dest:${colour}`, loc, map)
        loc.x += size[0]
        spawnParticle(`dest:${colour}`, loc, map)
    }
}

setInterval(() => {
    for (const player of world.getPlayers()) {
        const { location } = player.viewBlock ?? {}
        if (!player.structureTemp || !location) continue;
        draw(location, player.structureTemp.size, player)
    }
})


function checkOverlap({ x: x1, y: y1, z: z1 }, [s1_0, s1_1], { x: x3, y: y3, z: z3 }, [s2_0, s2_1]) {
    const x2 = x1 + s1_0,
        y2 = y1 + s1_1,
        z2 = z1 + s1_1,

        x4 = x2 + s2_0,
        y4 = y2 + s1_1,
        z4 = z2 + s2_1;

    return (
        x1 <= x4 && x2 >= x3 &&
        y1 <= y4 && y2 >= y3 &&
        z1 <= z4 && z2 >= z3
    )
}



beforeItemUseOn.subscribe(async (event) => {
    try {
        const { source: player } = event
        const loc = player.viewBlock?.location
        if (!player.structureTemp || player.isBusy || !loc) return;
        event.cancel = true;
        player.isBusy = true
        const confirmScreen = new MessageFormData()
            .title("Place Structure?")
            .body(`Do you want to place ${player.structureTemp.alias}?`)
            .button1("Confirm")
            .button2("Close")
        const result = await confirmScreen.show(player)
        delete player.isBusy

        const size = player.structureTemp.size

        loc.x -= size[0] / 2 - 1
        loc.z -= size[1] / 2 - 1

        let intercepting;

        for (const obj of world.db) {
            if (checkOverlap(loc, size, obj.location, obj.size)) {
                intercepting = true
                break
            }
        }
        if (intercepting) {
            console.warn("yikes")
            delete player.structureTemp
            return
        }

        if (result.selection) {
            loc.y += 1

            await player.dimension.runCommandAsync(`structure load ${player.structureTemp.structureId} ${loc.x} ${loc.y} ${loc.z} 0_degrees none`)

            world.db.push({ location: loc, size: size })
        }
        delete player.structureTemp
    } catch (error) {
        console.error(error, error.stack)
    }
})