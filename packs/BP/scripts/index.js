import './extensions/import.js';
import "./global.js"
import './gameplay/index.js';
import './tests/import.js';
import './gameplay/building/index.js'
import { world, system, DynamicPropertiesDefinition } from "@minecraft/server"

worldInitialize.subscribe(({ propertyRegistry }) => {
    const propertyDefinitions = new DynamicPropertiesDefinition()
    propertyDefinitions.defineNumber("coins")
    propertyDefinitions.defineString("db", 9800)
    propertyRegistry.registerWorldDynamicProperties(propertyDefinitions)
})

setInterval(() => {
    for (const player of world.getPlayers()) player.onScreenDisplay.setActionBar(`Coins: ${coins}`)
}, 1)

//iblqzed
//conmaster
//m9