import { Vector, system, world } from '@minecraft/server';

export * from './entities/import.js';
export * from './player/import.js';
export * from './towers/import.js';

world.overworld.runCommandAsync("/function onStart").catch(errorHandle);