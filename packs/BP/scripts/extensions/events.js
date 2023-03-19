import { Events, SystemEvents, system } from "@minecraft/server";
import { EventSignal } from "utilities/EventSignal.js";

const gameInitialize = new EventSignal();
const tickEvent = new EventSignal();

Object.defineProperties(SystemEvents.prototype,{
    gameInitialize:{get(){return gameInitialize;}},
    tick:{get(){return tickEvent;}}
});


system.runInterval(()=>tickEvent.trigger({currentTick:system.currentTick,deltaTime:system.deltaTime}));