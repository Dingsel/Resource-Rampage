import { MinecraftEntityTypes, DynamicPropertiesDefinition } from '@minecraft/server';
import { PlayerDynamicProperties } from 'resources';

export * from './default.js';
export * from './sidebar.js';

events.worldInitialize.subscribe((ev)=>{
    const propertyDefinition = new DynamicPropertiesDefinition();
    for (const key of Object.getOwnPropertyNames(PlayerDynamicProperties)){
        propertyDefinition.defineNumber(PlayerDynamicProperties[key]);
    }
    ev.propertyRegistry.registerEntityTypeDynamicProperties(propertyDefinition,MinecraftEntityTypes.player)
});