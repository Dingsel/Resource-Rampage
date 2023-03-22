import { ImpulseParticlePropertiesBuilder } from "utilities/import.js";

const TowerLevelDefinition = {
    maxLevel: 3,
    rangePerLevel: 5,
    rangeOffset: 2,
    intervalLevelInflation: 30,
    baseIntervalDelay: 450,
    impulseLevelDelay: 10,
    1:{
        maxPower:5,
        maxKnockback:2,
        maxDamage:0,
        maxInterval:3
    },
    2:{
        maxPower:6,
        maxKnockback:3,
        maxDamage:2,
        maxInterval:3
    },
    3:{
        maxPower:7,
        maxKnockback:5,
        maxDamage:4,
        maxInterval:3
    }
}
const InfoMapProperties = {
    coins:"coins",
    level:"level",
    kills:"kills"
}

export {TowerLevelDefinition,InfoMapProperties};