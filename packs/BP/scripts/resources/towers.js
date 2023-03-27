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
        getInterval(i){return 60 - (i * 8)},
        getDamage(d){return d * 4},
        getRange(r){return r * 6 + 6},
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
export class TowerUpgrades{
    static getMenuDataTemplate(tower){

    }
    static canUpgrade(tower){
        const type = tower.get('type')??TowerTypes.Mage;
        const {interval,damage,knockback,power,range,level} = this.getTowerData(tower);
        const maxAbilities = TowerMaxAbilityDefinition[type];
        return level == MaxTowerLevels[type]
        && maxAbilities.interval == interval
        && maxAbilities.damage == damage
        && maxAbilities.knockback == knockback
        && maxAbilities.power == power
        && maxAbilities.range == range;
    }
    static getTowerData(tower){
        const {location={x:0,y:0,z:0},damage,knockback,range,level=1,power,interval,type=TowerTypes.Mage} = Object.setPrototypeOf(tower.getData(),TowerDefaultAbilities[tower.get('type')??TowerTypes.Mage]);
        return {location,damage,knockback,level,power,interval,range,type};
    }
}