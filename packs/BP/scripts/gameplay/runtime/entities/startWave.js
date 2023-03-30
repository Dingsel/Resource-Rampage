import { ActionFormData, MessageFormData } from "@minecraft/server-ui"
import { asyncTimeout, spawnBoss } from "../../centipede/boss"
import { EnemySpawner } from "./waveSystem"

const starterId = "dest:start_round"

world.events.worldInitialize.subscribe(() => {
    const spawner = new EnemySpawner()
    spawner.waveNumber = world.round
    world.events.entityHit.subscribe(async (event) => {
        try {
            const { hitEntity, entity: player } = event
            if (hitEntity?.typeId != starterId) return
            const entitysAlive = world.overworld.getEntities({ families: ["enemy"] })
            if (entitysAlive.length > 0) { player.sendMessage("Clear the current wave!"); return; }
            const startRoundForm = new ActionFormData()
                .title("Start a new Round")
                .body("Start A Round Here")
                .button(`Start : Round ${world.round + 1}`)
                .button(`Upgrade Home`)

            const res = await startRoundForm.show(player)
            if (res.canceled) return
            switch (res.selection) {
                case 0: {
                    if (world.round && world.round % 10 == 0) {
                        spawnBoss({ x: 260, y: 75, z: 95 }, world.round/2)
                    }
                    const wave = spawner.nextWave()
                    world.round++
                    for (const [enemy, location] of wave.generateEnemies()) {
                        await sleep(15);
                        world.overworld.runCommand(`summon ${enemy} ${location.x} ${location.y} ${location.z}`)
                        world.overworld.runCommand(`execute as @e[type=${enemy},x=${location.x},y=${location.y},z=${location.z},c=1] at @s run spreadplayers ~ ~ 30 31 @s`)
                    }
                    break;
                }
                case 1: {
                    const health = world.getDynamicProperty("health") ?? 0
                    const defence = world.getDynamicProperty("defence") ?? 0
                    const forge = world.getDynamicProperty("forge") ?? 0

                    const upgradeForm = new ActionFormData().title("Upgrades").body(`Upgrades`)
                    upgradeForm.button(`Regen Radius\n${health}`)
                    //upgradeForm.button(`Defences\n${defence}`)
                    //upgradeForm.button(`Forge\n${forge}`)

                    const res = await upgradeForm.show(player)
                    switch (res.selection) {
                        case 0: {
                            const price = calc(health)
                            await confrim("health", price, player) && world.setDynamicProperty("health", health + 1)
                            break;
                        }
                        case 1: {
                            const price = calc(defence)
                            await confrim("defence", price, player) && world.setDynamicProperty("defence", defence + 1)
                            break;
                        }
                        case 2: {
                            const price = calc(forge)
                            await confrim("forge", price, player) && world.setDynamicProperty("forge", forge + 1)
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error, error.stack)
        }
    })
})

function calc(level) {
    return {
        coins: Math.pow((level + 1) * 10, 1.2 + level / 10),
        wood: Math.pow((level + 1) * 10, 1.1 + level / 10),
        stone: Math.pow((level + 1) * 10, 1.05 + level / 10)
    }
}

function checkIfValid(obj) {
    const { stone, coins, wood } = global
    const { stone: stone_2, coins: coins_2, wood: wood_2 } = obj
    const buyable = (stone >= stone_2 && coins >= coins_2 && wood >= wood_2)
    if (buyable) {
        coins - coins_2;
        wood - wood_2;
        stone - stone_2;
    }
    return buyable
}

async function confrim(name, obj, player) {
    const { stone, coins, wood } = obj
    const form = new MessageFormData()
        .title("Confirm")
        .body(`${name} for ${coins} ${wood} ${stone}`)
        .button1("Confirm")
        .button2("Cancel")
    const res = await form.show(player)
    if (res.selection) {
        return checkIfValid(obj)
    }
}