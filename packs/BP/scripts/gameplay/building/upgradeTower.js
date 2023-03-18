import { world, Vector } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { towers, towerUpgrades } from "resources/pack";

const { trunc } = Math

beforeItemUseOn.subscribe(async (event) => {
    try {
        const { item, source: player } = event
        const loc = player?.viewBlock.location
        if (player.isBusy) return;
        player.isBusy = true

        const structure = world.db.find(({ location, size: [a, b] }) => {
            const maxLoc = Vector.add(location, { x: a, y: 0, z: b })
            return (
                loc.x >= trunc(location.x - 1) && loc.x <= trunc(maxLoc.x) &&
                loc.z >= trunc(location.z - 1) && loc.z <= trunc(maxLoc.z)
            )
        })

        if (!structure) {
            player.isBusy = false
            return
        }

        const upgradeForm = new MessageFormData()
            .title("Upgrade")
            .body("BlaBla")
            .button1("YesYes")
            .button2("cancel")

        const res = await upgradeForm.show(player)
        player.isBusy = false
        if (res.selection) {

            const { x, y, z } = structure.location
            const { type, tier, entity } = structure

            const towerDef = towerUpgrades.find(x => {
                return (
                    x.tier == tier + 1 &&
                    x.type == type
                )
            })

            await player.dimension.runCommandAsync(`structure load ${type}_${tier + 1} ${x - (Math.abs(towerDef.size[0] - structure.size[0]) / 2)} ${y} ${z - (Math.abs(towerDef.size[1] - structure.size[1]) / 2)} 0_degrees none`)
            const e = world.getEntity(entity)


            const spawned = player.dimension.spawnEntity(`dest:${towerDef.structureId}`, e.location)
            e.triggerEvent("despawn")

            world.db = world.db.slice(world.db.indexOf(structure), 1)

            world.db.push({ location: structure.location, size: towerDef.size, type: type, tier: tier + 1, entity: spawned.id })
        }
    } catch (error) {
        console.error(error, error.stack)
    }
})