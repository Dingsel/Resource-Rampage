import { ImpulseParticlePropertiesBuilder } from "utilities/import.js";

const map = new ImpulseParticlePropertiesBuilder(5);
export const force1 = map.variableMap;
export const force2 = map.setSpeed(20).setDynamicMotion(4).setLifeTime(3).variableMap;

export {};