import { world, Vector, Player } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui"
import { SquareParticlePropertiesBuilder } from "utils";

// Constants
const selectorId = "minecraft:iron_sword"
const menuId = "minecraft:apple"
//

class DbTowerEntry {
    /**
     * @param {towerTypes} type 
     * @param {import("@minecraft/server").Vector3} location 
     * @param {[number,number]} size 
     * @param {dbEntryOptions} options 
     */
    constructor(type, location, size, options) {
        this.type = type
        this.location = location
        this.size = size
        this.options = options
    }
}


export class TowerDefenition {
    /**
     * @param {towerTypes} towerType
     * @param {function(number) : upgradeStats} getStats
     * @param {appearanceModifierOptions} appearanceModifierOptions
     * @param {any} structures
     * @param {function}
     * @param {number}
     */
    constructor(towerType, getStats, appearanceModifierOptions, structures, attackFunction, baseRadius) {
        this.type = towerType
        this.getStats = getStats
        this.attackFunction = attackFunction
        this.appearanceModifierOptions = appearanceModifierOptions
        this.structures = structures
        this.baseRadius = baseRadius
    }
}

class Tower {
    /**
     * @param {DbTowerEntry} DbTowerEntry 
     * @param {TowerDefenition} TowerDefenition 
     */
    constructor(DbTowerEntry, TowerDefenition) {
        this.towerEntry = DbTowerEntry
        this.tower = TowerDefenition
    }

    /**@param {DbTowerEntry} DbTowerEntry */
    static from(DbTowerEntry) {
        const towerDef = defs.find(x => x.type == DbTowerEntry.type)
        if (!towerDef) throw new TypeError("Couldn't find Tower Deffenition")
        return new Tower(DbTowerEntry, towerDef)
    }
}

/** @type {Array<DbTowerEntry>} */
const db = [

]

/** @type {Array<TowerDefenition>} */
const defs = [
    new TowerDefenition("mage",
        function (level) {
            const stats = {}
            stats.damage = 2 + level - 1
            stats.attackInterval = 200 - ((level - 1) * 30)
            stats.power = 1 + level - 1
            return { stats }
        },
        {
            name: "Mage Tower",
            description: "Burns Enemies!",
            icon: "textures/icons/mageTower_1.png"
        },
        {
            "mage_1": [5, 5],
            "mage_2": [5, 5],
            "mage_3": [11, 11]
        }, function () { }, 5)
]



////#region Display

const Towers = defs

const buildingForm = new ActionFormData()
    .title("%building.title")
    .body("%building.body")
Towers.forEach((x) => {
    const { description, icon, name } = x.appearanceModifierOptions
    buildingForm.button(`${name}\n${description}`, icon)
})


world.events.beforeItemUse.subscribe(async (event) => {
    const { item, source: player } = event
    if (item.typeId != menuId) return
    const res = await buildingForm.show(player)
    if (res.canceled) return
    player.selectedTower = defs[res.selection]
})

////#endregion Display

const { trunc } = Math
function checkInterfearance(loc1, [s1, s2]) {
    const structure = db.find(({ location, size: [s2_1, s2_2] }) => {
        const maxLoc1 = Vector.add(loc1, { x: s1, y: 0, z: s2 })

        const maxLoc2 = Vector.add(location, { x: s2_1, y: 0, z: s2_2 })

        return (
            loc1.x < maxLoc2.x &&
            loc1.z < maxLoc2.z &&
            location.x < maxLoc1.x &&
            location.z < maxLoc1.z
        )
    })
    return !!structure
}


//Show grid

const builder = new SquareParticlePropertiesBuilder()

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!player.selectedTower) return
        const block = player.viewBlock
        if (!block) return

        const offset = player.selectedTower.baseRadius / 2
        const structureStart = Vector.subtract(Vector.add(block.location, { x: 0.50, y: 1.25, z: 0.50 }), { x: offset, y: 0, z: offset })
        const interfearing = checkInterfearance(structureStart, [player.selectedTower.baseRadius, player.selectedTower.baseRadius])
        //console.warn(interfearing)
        const colour = interfearing ? { red: 255 / 255, green: 80 / 255, blue: 80 / 255, alpha: 1 } : { red: 80 / 255, green: 255 / 255, blue: 80 / 255, alpha: 1 }
        player.dimension.spawnParticle("dest:square", Vector.add(block.location, { x: 0.50, y: 1.25, z: 0.50 }), builder.setRadius(player.selectedTower.baseRadius / 2).setColor(colour).variableMap)
    }
})
//

//build the Structure
world.events.beforeItemUseOn.subscribe(async (event) => {
    const { item, source: player } = event
    if (!(player instanceof Player) || !player.selectedTower || player.isBussy) return
    player.isBussy = true

    const confirmForm = new MessageFormData()
        .title("ajof")
        .body("afhk")
        .button1("Confirm")
        .button2("Cancel")
    const res = await confirmForm.show(player)
    player.isBussy = false
    if (!res.selection) { delete player.selectedTower; return }
    const block = player.viewBlock
    if (!block) { delete player.selectedTower; return }
    const offset = player.selectedTower.baseRadius / 2
    const structureStart = Vector.subtract(Vector.add(block.location, { x: 0.50, y: 1.25, z: 0.50 }), { x: offset, y: 0, z: offset })
    const { x, y, z } = structureStart
    const structureId = Object.keys(player.selectedTower.structures)[0]
    await player.dimension.runCommandAsync(`structure load ${structureId} ${x} ${y} ${z} 0_degrees none`)

    const { type, baseRadius, getStats } = player.selectedTower
    db.push(new DbTowerEntry(type, structureStart, [baseRadius, baseRadius], getStats(1)))
    delete player.selectedTower
})
//




/**
 * @typedef {"mage" | "archer"} towerTypes
 */

/**
 * @typedef dbEntryOptions
 * @property {number} tier
 * @property {number} attackInterval
 * @property {number} damage
 * @property {number} power
 */


/**
 * @typedef {Object} upgradeStats
 * @property {number} attackInterval
 * @property {number} damage
 * @property {number} power
 */


/**
 * @typedef appearanceModifierOptions
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */