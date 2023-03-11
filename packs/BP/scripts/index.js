import { world, DynamicPropertiesDefinition, MinecraftEntityTypes, system } from "@minecraft/server"
import "./player.js"

world.events.worldInitialize.subscribe((data) => {
    const propertyDefinitions = new DynamicPropertiesDefinition()
    propertyDefinitions.defineNumber("coins")
    data.propertyRegistry.registerEntityTypeDynamicProperties(propertyDefinitions, MinecraftEntityTypes.player)
})

world.events.beforeChat.subscribe((data) => {
    if (!data.message.startsWith("-")) return
    data.cancel = true
    const player = data.sender
    const args = data.message.slice(1).trimEnd().split(/\s+/g)
    const commandName = args.shift()
    switch (commandName) {
        case "coins":
            const amount = parseInt(args[0])
            if (isNaN(amount)) {
                player.tell(`Invalid coin amount!`)
                break
            }
            player.coins = (player.coins || 0) + amount
            break
        default:
            player.tell("Invalid command!")
            break
    }
})

system.runSchedule(() => {
    for (const player of world.getPlayers()) {
        player.onScreenDisplay.setActionBar(`Coins: ${player.coins}`)
    }
}, 1)

import("./coins.js")