import { world, Vector } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { aoeFire } from "gameplay/runtime";
import { towers, towerUpgrades } from "resources/pack";
import { checkOverlap } from "./baseBuilding";

const { trunc } = Math

events.beforeItemUseOn.subscribe(async (event) => {
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

        console.warn(structure.tier)
        if (structure.tier >= 3) return

        const upgradeForm = new MessageFormData()
            .title("Upgrade")
            .body("BlaBla")
            .button1("YesYes")
            .button2("cancel")

        const res = await upgradeForm.show(player)
        player.isBusy = false
        if (res.selection) {

            const { type, tier, entity } = structure

            const towerDef = towerUpgrades.find(x => {
                return (
                    x.tier == tier + 1 &&
                    x.type == type
                )
            })


            const modified = Vector.subtract(structure.location, {
                x: Math.abs(towerDef.size[0] - structure.size[0]) / 2,
                y: 0,
                z: Math.abs(towerDef.size[1] - structure.size[1]) / 2
            })
            const { x, y, z } = modified

            const overlap = world.db.find(x => {
                return checkOverlap(x.location, x.size, modified, towerDef.size) && x.entity != structure.entity
            })

            if (overlap) {
                player.sendMessage(`error`)
                return
            }

            await player.dimension.runCommandAsync(`structure load ${type}_${tier + 1} ${x} ${y} ${z} 0_degrees none`)
            const e = world.getEntity(entity)


            const spawned = player.dimension.spawnEntity(`dest:${towerDef.structureId}`, e.location)
            e.triggerEvent("dest:despawn")

            world.db = []

            world.db.push({ location: modified, size: towerDef.size, type: type, tier: (tier + 1), entity: spawned.id })
        }
    } catch (error) {
        console.error(error, error.stack)
    }
})

world.db = []



class TowerDefenition {
    /**
     * @param {towerTypes} type 
     * @param {TowerLevelDefenition} levelDefenition 
     * @param {TowerDefence} defence 
     */
    constructor(type, levelDefenition, defence) {
        this.type = type
        this.levelDefenition = levelDefenition
        this.defence = defence
    }
}

class TowerLevelDefenition {
    /**
     * @param {function(upgradeStats, number) : upgradeStats} changeStats
     */
    constructor(towerType, changeStats, structures) {
        this.type = towerType
        this.changeStats = changeStats
        this.structures = structures
    }
}

class TowerDefence {
    /**
     * @param {function(number,Vector)} callback
     * @param {defenceOptions} options
     */
    constructor(callback, options) {
        this.callback = callback
        this.options = options
    }
}



const def = new TowerLevelDefenition((stat, level) => {

    const stats = stat
    stats.damage += level * 2
    stats.attackInterval -= level * 5
    stats.power += 1

    return { stats }
}, {
    "mage_1": [5, 5],
    "mage_2": [5, 5],
    "mage_3": [11, 11]
})


const a = new TowerDefence(aoeFire, {
    attackInterval: 200,
    radius: function (level) { return 1 + level * 5 }
})



const tower = new TowerDefenition("mage", def, a)


/**
 * @typedef {Object} defenceOptions
 * @property {number} attackInterval
 * @property {function(number):number} radius
 */

/**
 * @typedef defence
 * @property {towerTypes} id
 * @property {function(number,Vector)} callback
 * @property {defenceOptions} options
 */

/**
 * @typedef {"mage" | "archer"} towerTypes
 */

/**
 * @typedef {Object} upgradeStats
 * @property {number} attackInterval
 * @property {number} damage
 * @property {number} power
 */