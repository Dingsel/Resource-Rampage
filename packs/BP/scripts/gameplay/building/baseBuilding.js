import { MolangVariableMap, system, world, Vector, ItemStack, Player } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { towers } from "resources/pack";
import { Selection } from "utils";
import { buildWall } from "./thewalls";

const selectorId = "minecraft:iron_sword"
const menuId = "minecraft:apple"

const baseSelection = new ActionFormData()
baseSelection.title("Select a Piece to Build!")
baseSelection.body("Test")
for (const tower of towers) {
    baseSelection.button(`Walls`, `textures/icons/walls`)
    baseSelection.button(`${tower.alias}\n${tower.description}`, tower.icon)
}

const spawnParticle = world.overworld.spawnParticle.bind(world.overworld)

const wallForm = new ModalFormData()
    .title("Customize your wall!")
    .slider("height", 3, 10, 3, 3)


beforeItemUse.subscribe(async ({ item, source: player }) => {
    if (item.typeId != menuId || player.structureTemp) return;
    const sel = Selection.getSelection(player.id)
    if (sel.location1 && sel.location2) {
        const res = await wallForm.show(player)
        if (res.canceled) return
        const offset = { x: 0, y: res.formValues[0], z: 0 }
        buildWall(Vector.add(sel.location1, offset), Vector.add(sel.location2, offset))
        player.isBusy = false
        sel.clear()
        return
    }

    const result = await baseSelection.show(player)
    if (result.selection === 0) {
        delete player.structureTemp;
        player.walls = true;
        player.container.addItem(new ItemStack(selectorId))
        return
    }
    player.structureTemp = towers[result.selection - 1]
})



const map = new MolangVariableMap()

/**
 * 
 * @param {Vector} lookAt 
 * @param {[number,number]} size 
 */
function draw(lookAt, [s0, s1], player) {

    let intercepting;
    for (const obj of world.db) {
        const loc = player.viewBlock?.location

        loc.x -= s0 / 2 - 1
        loc.z -= s1 / 2 - 1

        if (checkOverlap(loc, [s0, s1], obj.location, obj.size)) {
            intercepting = true
            break
        }
    }

    let colour = intercepting ? "red" : "green"


    for (let i = 0; i < s0 + 1; i++) {
        const { x, y, z } = lookAt
        const loc = {
            x: x + i - s0 / 2 + 0.5,
            y: y + 1.5,
            z: z - s1 / 2 + 0.5
        }
        spawnParticle(`dest:${colour}`, loc, map)
        loc.z += s1
        spawnParticle(`dest:${colour}`, loc, map)
    }

    for (let i = 0; i < s1 + 1; i++) {
        const { x, y, z } = lookAt
        const loc = {
            x: x - s0 / 2 + 0.5,
            y: y + 1.5,
            z: z + i - s1 / 2 + 0.5
        }
        spawnParticle(`dest:${colour}`, loc, map)
        loc.x += s0
        spawnParticle(`dest:${colour}`, loc, map)
    }
}

setInterval(() => {
    for (const player of world.getPlayers()) {
        const { location } = player.viewBlock ?? {}
        if ((!player.structureTemp) || !location) continue;
        draw(location, player.structureTemp.size, player)
    }
})


function checkOverlap({ x: x1, y: y1, z: z1 }, [s1_0, s1_1], { x: x3, y: y3, z: z3 }, [s2_0, s2_1]) {

    const x2 = x1 + s1_0,
        y2 = y1 + s1_1,
        z2 = z1 + s1_1,

        x4 = x3 + s2_0,
        y4 = y3 + s1_1,
        z4 = z3 + s2_1;

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

            const middle = {
                x: loc.x + size[0] / 2 - 0.5,
                y: loc.y + 1,
                z: loc.z + size[1] / 2 - 0.5
            }

            const entity = player.dimension.spawnEntity(`dest:${player.structureTemp.structureId}`, middle)
            world.db.push({ location: loc, size: size, type: player.structureTemp.type, tier: player.structureTemp.tier, entity: entity.id })
        }
        delete player.structureTemp
    } catch (error) {
        console.error(error, error.stack)
    }
})