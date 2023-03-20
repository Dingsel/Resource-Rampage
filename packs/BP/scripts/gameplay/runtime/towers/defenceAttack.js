import { world, Vector } from "@minecraft/server";
import { aoeFire } from "./fireAoe";

class Defence {
    /**
     * @type {Array<defence>}
     */
    static defence = [];
    /**
     * @param {towerTypes} type
     * @param {function(number,Vector)} callback
     * @param {defenceOptions} options
     */
    static addDefence(type, callback, options) {
        this.defence.push({ id: type, callback: callback, options: options })
    }

    static init() {
        system.runInterval(() => {
            const entities = world.overworld.getEntities({ families: ["tower"] })
            for (const entity of entities) {
                const { cd, location } = entity
                if (cd != 0) { entity.cd--; return }
                const obj = this.defence.find(x => entity.typeId.includes(x.id))
                const level = entity.typeId.split("_")[1]
                const targets = world.overworld.getEntities({
                    location: location,
                    closest: 1,
                    maxDistance: obj.options.radius(level),
                    excludeFamilies: ["tower"],
                    excludeTypes: ["minecraft:player"]
                })
                if (targets.length > 0) {
                    entity.cd = obj.options.attackInterval
                    obj.callback(level, entity.location)
                }
            }
        })
    }
}


//#region Defence Defenitions

Defence.addDefence("mage", aoeFire, {
    attackInterval: 200,
    radius: function (level) { return 1 + level * 5 }
})
//#endregion Defence


/**
 * @typedef {Object} defenceOptions
 * @property {number} attackInterval
 * @property {function(number):number} radius
 */

/**
 * @typedef {"mage" | "archer"} towerTypes
 */

/**
 * @typedef defence
 * @property {towerTypes} id
 * @property {function(number,Vector)} callback
 * @property {defenceOptions} options
 */

Defence.init()