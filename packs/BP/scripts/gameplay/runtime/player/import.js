import { MinecraftEntityTypes, DynamicPropertiesDefinition } from '@minecraft/server';
import { PlayerDynamicProperties } from 'resources';

export * from './default.js';
export * from './sidebar.js';
//export * from './gameStart.js';

events.worldInitialize.subscribe((ev)=>{
    const propertyDefinition = new DynamicPropertiesDefinition();
    for (const key of Object.getOwnPropertyNames(PlayerDynamicProperties)){
        propertyDefinition.defineNumber(PlayerDynamicProperties[key]);
    }
    ev.propertyRegistry.registerEntityTypeDynamicProperties(propertyDefinition,MinecraftEntityTypes.player);
    //for (const p of world.getPlayers()) for (const prop of Object.getOwnPropertyNames(PlayerDynamicProperties)) p.setDynamicProperty(PlayerDynamicProperties[prop],0);
});