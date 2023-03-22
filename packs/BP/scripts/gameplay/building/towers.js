import { world, Vector, Player } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui"
import { Selection, SquareParticlePropertiesBuilder } from "utils";
import { buildWall } from "./thewalls";

// Constants
const menuId = "dest:building_gadged"
//

class DbTowerEntry {
    /**
     * @param {towerTypes} type 
     * @param {import("@minecraft/server").Vector3} location 
     * @param {[number,number]} size 
     * @param {dbEntryOptions} options 
     * @param {number} level
     * @param {[number,number,number]} statsLevel
     */
    constructor(type, location, size, options, level, statsLevel) {
        this.type = type
        this.location = location
        this.size = size
        this.options = options
        this.level = level
        this.statsLevel = statsLevel
    }
}


export class TowerDefenition {
    /**
     * @param {towerTypes} towerType
     * @param {upgradeStats} defaultStats
     * @param {appearanceModifierOptions} appearanceModifierOptions
     * @param {any} structures
     * @param {function([number,number,number]) : dbEntryOptions} levelFunction
     * @param {function} attackFunction
     * @param {number} baseRadius
     */
    constructor(towerType, defaultStats, appearanceModifierOptions, structures, levelFunction, attackFunction, baseRadius) {
        this.type = towerType
        this.defaultStats = defaultStats
        this.attackFunction = attackFunction
        this.appearanceModifierOptions = appearanceModifierOptions
        this.levelFunction = levelFunction
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
        {
            damage: 2,
            attackInterval: 200,
            power: 1
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
        },
        function ([stat1, stat2, stat3]) {
            const stats = {}
            stats.attackInterval = 0 - stat1 * 20
            stats.damage = stat2
            stats.power = stat3
            return stats
        },
        function () { }, 5)
]



////#region Display

const Towers = defs

const buildingForm = new ActionFormData()
    .title("Select A Defence To Build!")
    .body("Different Towers Have Different Effects.")
Towers.forEach((x) => {
    const { description, icon, name } = x.appearanceModifierOptions
    buildingForm.button(`${name}\n${description}`, icon)
})


const wallForm = new ActionFormData()
    .title("%building.wallTitle")
    .body("%building.wallBody")
    .button("Build")
    .button("Cancel")


world.events.beforeItemUse.subscribe(async (event) => {
    const { item, source: player } = event
    const sel = Selection.getSelection(player.id)
    if (item.typeId != menuId) return
    event.cancel = true
    if (sel.isAvailable()) {
        const res = await wallForm.show(player)
        if (res.selection == 0) {
            //if building walls
            buildWall(sel.location1, sel.location2)
        }
        sel.clear()
        return
    }
    const res = await buildingForm.show(player)
    if (res.canceled) return
    player.selectedTower = defs[res.selection]
})

////#endregion Display

function checkInterfearance(loc1, [s1, s2] = [1, 1]) {
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
    return structure
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
        const interfearing = !!checkInterfearance(structureStart, [player.selectedTower.baseRadius, player.selectedTower.baseRadius])
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
    event.cancel = true
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

    const { type, baseRadius, defaultStats } = player.selectedTower
    db.push(new DbTowerEntry(type, structureStart, [baseRadius, baseRadius], defaultStats, 1, [0, 0, 0]))
    delete player.selectedTower
})
//

const char = "§a:"
const emptyChar = "§c:"
function drawProgress(statLevel, tier, chars = 50) {
    const maxLevel = tier * 3

    const fullChars = Math.abs((statLevel / maxLevel) * chars)
    const emptyChars = chars - fullChars

    return `${char.repeat(fullChars)}${emptyChar.repeat(emptyChars)}`
}


//Upgrade Towers
world.events.beforeItemUseOn.subscribe(async (event) => {
    try {
        const { source: player } = event
        if (player.isBussy) return
        player.isBussy = true
        const block = player.viewBlock
        const interacted = checkInterfearance(block.location)
        if (!interacted) { player.isBussy = false; return }
        event.cancel = true;
        
        const tower = Tower.from(interacted)
        const stats = tower.tower.defaultStats
        const upgrades = tower.towerEntry.statsLevel
        const current = tower.tower.levelFunction(upgrades)
        //console.warn(JSON.stringify(current))

        const upgradeForm = new ActionFormData()
            .title("%upgrade.title")
            .body("%upgrade.body")
        const keys = Object.keys(current)
        for (const [key, value] of Object.entries(current)) {
            upgradeForm.button(`${key} ${Number(stats[key]) + value}\n${drawProgress(upgrades[keys.indexOf(key)], tower.towerEntry.level)}`)
        }
        const upgraded = Object.keys(current).map((key) => {
            return !(upgrades[keys.indexOf(key)] >= tower.towerEntry.level * 3)
        })
        const containsTrue = upgraded.find(x => x)
        if (!containsTrue && (3 > tower.towerEntry.level) && tower.towerEntry.level <= tier) upgradeForm.button("Upgrade Tier")

        const res = await upgradeForm.show(player)
        if (res.canceled) { player.isBussy = false; return }
        const selection = res.selection
        const inDb = db.find(x => {
            return (x.location == interacted.location)
        })

        if (!containsTrue && (3 > tower.towerEntry.level) && tower.towerEntry.level <= tier) {
            const keys = Object.keys(tower.tower.structures)
            const structureId = keys[tower.towerEntry.level]
            const prevId = keys[tower.towerEntry.level - 1]
            const size = tower.tower.structures[structureId]
            const prevSize = tower.tower.structures[prevId]
            const offset = { x: Math.abs((size[0] / 2) - (prevSize[0] / 2)), y: 0, z: Math.abs((size[1] / 2) - (prevSize[1] / 2)) }
            const location = Vector.subtract(tower.towerEntry.location, offset)
            const { x, y, z } = location
            //const intercect = !!checkInterfearance(interacted, size)
            await player.runCommandAsync(`structure load ${structureId} ${x} ${y} ${z} 0_degrees none`)
            inDb.level += 1
            inDb.size = size
            inDb.location = location
            db[0] = inDb
            player.isBussy = false
            return
        }
        if (inDb.statsLevel[selection] + 1 > tower.towerEntry.level * 3) {
            console.warn("Max")
            player.isBussy = false
            return
        }
        inDb.statsLevel[selection]++
        db[0] = inDb
        player.isBussy = false
    } catch (error) {
        console.error(error, error.stack)
    }

})
//


/**
 * @typedef {"mage" | "archer"} towerTypes
 */

/**
 * @typedef dbEntryOptions
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