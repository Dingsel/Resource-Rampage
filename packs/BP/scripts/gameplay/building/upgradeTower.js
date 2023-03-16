import { world, Vector } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { towers, towerUpgrades } from "resources/pack";

world.events.beforeItemUseOn.subscribe(async (event) => {
    try {
        const { cancel, item, source: player } = event
        const loc = player?.viewBlock.location
        if (player.isBusy) return;
        player.isBusy = true

        const structure = world.db.find((x) => {
            const maxLoc = Vector.add(x.location, { x: x.size[0], y: 0, z: x.size[1] })
            return (
                loc.x >= Math.trunc(x.location.x - 1) && loc.x <= Math.trunc(maxLoc.x) &&
                loc.z >= Math.trunc(x.location.z - 1) && loc.z <= Math.trunc(maxLoc.z)
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

            await player.dimension.runCommandAsync(`structure load ${type}_${tier + 1} ${x} ${y} ${z} 0_degrees none`)
            const e = world.getEntity(entity)

            const towerDef = towerUpgrades.find(x => {
                return (
                    x.tier == tier + 1 &&
                    x.type == type
                )
            })

            const spawned = player.dimension.spawnEntity(`dest:${towerDef.structureId}`, e.location)
            e.kill()

            world.db = world.db.slice(world.db.indexOf(structure), 1)

            world.db.push({ location: structure.location, size: towerDef.size, type: type, tier: tier + 1, entity: spawned.id })
        }
    } catch (error) {
        console.error(error, error.stack)
    }
})