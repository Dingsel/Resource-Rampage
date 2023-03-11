import { world, DynamicPropertiesDefinition, MinecraftEntityTypes, system } from "@minecraft/server"
import "./extensions/import.js"

world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
    const propertyDefinitions = new DynamicPropertiesDefinition()
    propertyDefinitions.defineNumber("coins")
    propertyRegistry.registerEntityTypeDynamicProperties(propertyDefinitions, MinecraftEntityTypes.player)
})

world.events.beforeChat.subscribe((data) => {
    if (!data.message.startsWith("-")) return
    let { sender: player, message } = data
    data.cancel = true
    const args = message.slice(1).trimEnd().split(/\s+/g)
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
            player.sendMessage("Invalid command!")
            break
    }
})

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        player.onScreenDisplay.setActionBar(`Coins: ${player.coins}`)
    }
}, 1)

import("./coins.js")