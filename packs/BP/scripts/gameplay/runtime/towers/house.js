import { Vector } from "@minecraft/server"
import { asyncTimeout } from "../../centipede/boss"
import { ImpulseParticlePropertiesBuilder } from "../../../utils"

class Home {
    static structures = {
        "house_1": {
            coins: 1000,
            wood: 250
        },
        "house_2": {
            coins: 2000,
            wood: 500,
            stone: 250
        },
        "house_3": {
        }
    }
    /**@private */
    static upgradeCallbacks = []
    /** @param {function(number):void} callback */
    static onUpgrade(callback) {
        this.upgradeCallbacks.push({ callback: callback })
    }
    upgrade() {
        tier++
        this.upgradeCallbacks.forEach(x => x(tier))
    }
}


Home.onUpgrade((level) => {
    const entries = Object.entries(Home.structures)
    const structureId = entries[level][0]
    if (!structureId) return
})



const builder = new ImpulseParticlePropertiesBuilder().setColor({ red: 0.3, green: 1, blue: 0.3 })
system.runInterval(() => {
    const health = world.getDynamicProperty("health") ?? 0
    const radius = health * 2.5
    for (const player of world.overworld.getEntities({ location: { x: 75, y: 62, z: 115 }, maxDistance: radius })) {
        player.health = Math.min(player.maxHealth, player.health + 2)
    }
    world.overworld.spawnParticle("dest:ignite_impulse", { x: 75, y: 62, z: 115 }, builder.setRadius(radius).getMolangVariableMap())
}, 20)


world.events.playerSpawn.subscribe(async (event) => {
    const { initialSpawn, player } = event
    if (!initialSpawn || world.getDynamicProperty("load")) return
    await asyncTimeout(100)
    world.hp = 100
    const size = [20, 20]
    const start = Vector.subtract({ x: 75, y: 62, z: 115 }, { x: size[0] / 2, y: 0, z: size[1] / 2 })
    world.overworld.runCommandAsync(`structure load house_1 ${start.x} ${start.y} ${start.z}`)
    world.overworld.spawnEntity("dest:objective", { x: 75, y: 69, z: 112 })
    world.overworld.spawnEntity("dest:start_round", { x: 75, y: 63, z: 112 })
    world.setDynamicProperty("load", true)
})

let lost

system.runInterval(() => {
    const objective = world.overworld.getEntities({ type: "dest:objective" })[0]
    for (const mob of world.overworld.getEntities({ location: objective?.location, maxDistance: 25, families: ["enemy"] })) {
        world.hp -= 1
        mob.applyDamage(2)
        if (0 >= world.hp && !lost) {
            lost = true
            world.sendMessage("You Lost")
            world.overworld.runCommandAsync("gamemode spectator @a")
        }
    }
}, 20)