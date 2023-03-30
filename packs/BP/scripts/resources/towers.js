import { ArcherTowerLevelStructure, MageTowerLevelStructure } from "./pack";

export const TowerTypes = {
    Mage: "mage",
    Archer: "archer"
}
export const TowerNames = {
    [TowerTypes.Mage]: "tower.type.mage.name",
    [TowerTypes.Archer]: "tower.type.archer.name"
}
export const TowerStructureDefinitions = {
    [TowerTypes.Mage]: MageTowerLevelStructure,
    [TowerTypes.Archer]: ArcherTowerLevelStructure
}
export const TowerAbilityInformations = {
    [TowerTypes.Mage]:{
        getInterval(i){return 260 - (i * 40)},
        getDamage(d){return d * 2},
        getRange(r){return r * 4 + 5},
        getKnockback(k){return k * 0.2},
        getPower(p){return p + ((p - 1)* 0.5)}
    },
    [TowerTypes.Archer]:{
        getInterval(i){return 30 - (i * 8)},
        getDamage(d){return d * 4},
        getRange(r){return r * 10 + 10},
        getKnockback(k){return k * 0.3},
        getPower(p){return p * 0.5}
    }
}
export const TowerDefaultAbilities = {
    [TowerTypes.Mage]:{
        interval:1,
        damage:0,
        knockback:0,
        power:1,
        range:1
    },
    [TowerTypes.Archer]:{
        interval:1,
        damage:1,
        knockback:1,
        power:1,
        range:1
    }
}
export const MaxTowerLevels = {
    [TowerTypes.Mage]: 3,
    [TowerTypes.Archer]: 3
}
export const TowerUpgradableProperties = {
    [TowerTypes.Mage]:{
        interval:1,
        damage:1,
        knockback:1,
        power:1
    },
    [TowerTypes.Archer]:{
        interval:1,
        damage:1,
        knockback:1
    }
}
export const TowerUpgradeCost = {
    [TowerTypes.Mage]:{
        interval:5,
        damage:5,
        knockback:4,
        power:3
    },
    [TowerTypes.Archer]:{
        interval:5,
        damage:5,
        knockback:3
    }
}
export const TowerMaxAbilityDefinition = {
    [TowerTypes.Mage]:{
        interval: 4,
        damage:3,
        knockback: 3,
        power: 4,
        range:3
    },
    [TowerTypes.Archer]:{
        interval: 5,
        damage:3,
        knockback: 3,
        power: 4,
        range:3
    }
}
export const TowerCost = {
    [TowerTypes.Mage]: 250,
    [TowerTypes.Archer]: 230
}

export class TowerAbilities{
    #level;
    get level(){return this.#level};
    set level(level){return this.#level = level};
    get maxLevel(){return 9;}
    constructor(level = 1){
        this.#level = level;
    }
    getInterval(){return 250;}
    getDamage(){return 5;}
    getRange(){return 15;}
    getKnockback(){return (this.level / this.maxLevel) / 2; }
    getCriticalDamageChance(){return this.level/(this.maxLevel*2);}
    getCriticalDamageFactor(){return this.level/this.maxLevel;}
    getUpgradeCost(){return {coins:this.level*50+235,stone:this.level*10 + 50,wood:this.level*11 + 60}}
    getStructureLevel(){return ~~((this.level/(this.maxLevel+1))*3)}
}
export class MageTowerAbilities extends TowerAbilities{
    getInterval(){return this.maxLevel*35 - this.level * 15}
    getDamage(){return this.level;}
    getRange(){return this.level * 2.5 + 5;}
    getKnockback(){return super.getKnockback() / 1.5; }
    getPower(){return 2*this.level/this.maxLevel;}
    getCriticalDamageFactor(){return super.getCriticalDamageFactor() + 1;}
}
export class ArcherTowerAbilities extends TowerAbilities{
    getInterval(){return (this.maxLevel - this.level) * 15 + 10}
    getDamage(){return this.level * 1.5 + 7;}
    getRange(){return this.level * 3.5 + 10;}
    getKnockback(){return super.getKnockback(); }
    getMaxTargets(){return ~~(this.level / 3) + 1}
    getCriticalDamageFactor(){return super.getCriticalDamageFactor()*2 + 1;}
}