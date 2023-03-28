import { ActionFormData } from "@minecraft/server-ui"
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
            startRoundForm.button(`Start : Round ${world.round + 1}`)

            const res = await startRoundForm.show(player)
            if (res.canceled) return
            const wave = spawner.nextWave()

            for (const [enemy, location] of wave.generateEnemies()) {
                //console.warn(enemy, location.x)
                world.overworld.runCommand(`summon ${enemy} ${location.x} ${location.y} ${location.z}`)
                world.overworld.runCommand(`execute as @e[type=${enemy},x=${location.x},y=${location.y},z=${location.z},c=1] at @s run spreadplayers ~ ~ 30 31 @s`)
            }
            world.round++
        } catch (error) {
            console.error(error, error.stack)
        }
    })
})
