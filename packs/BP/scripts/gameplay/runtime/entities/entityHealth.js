import { Entity, MolangVariableMap, Player } from "@minecraft/server";
import { EntityKillReward, InfoMapProperties } from "resources";

const map = new MolangVariableMap();
const infoMap = () => global.infoMap;
const maxChars = 20; //Move into global pls there are like 3 different files for it and idk which one to choose
const { coins, kills, level, woods, stones } = InfoMapProperties;
const { overworld: ovw } = world;
const getEntities = ovw.getEntities.bind(ovw);
const getEntity = world.getEntity.bind(world)

const { full, empty } = { full: '\uE113', empty: '\uE114' }
Entity.prototype.updateHealths = function () { updateName(this); }
/**@param {import('@minecraft/server').Entity} entity*/
function updateName(entity) {
    let { typeId: type } = entity;
    if (!getEntities({ type, families: ['enemy'] }).length) return;
    let entities = [entity], nameTag = e => {
        if (!e) return empty.repeat(maxChars);
        const {current:health,value:maxHealth} = e.getComponent('health'),
        fullChars = maxChars - ~~((health > 0 ? health : 0)
        / maxHealth * maxChars);
        return full.repeat(maxChars - fullChars) + empty.repeat(fullChars)
    }
    if (/centipede_(body|tail)/.test(type) && entity.hasTag('centipede')) {
        const tag = entity.getTags()[1], head = getEntity(tag);
        nameTag = nameTag(head), entities = getEntities({ tags: [tag] });
    } else nameTag = nameTag(entity);
    for (const e of entities) e.nameTag = nameTag;
}

events.entitySpawn.subscribe(ev => ev.entity.updateHealths());
events.entityHurt.subscribe(ev => ev.hurtEntity.updateHealths());
events.entityDie.subscribe(({ deadEntity: entity,damageSource }) => {
    const { location, typeId } = entity;
    if (/minecraft:|start_round/.test(typeId) || typeId == "dest:arrow") return;
    entity.nameTag = empty.repeat(maxChars);
    overworld.spawnParticle("dest:coin", location, map);
    infoMap().relative(coins, EntityKillReward[typeId] ?? 2);
    if(damageSource.damagingEntity instanceof Player){
        damageSource.damagingEntity.blueXp += (EntityKillReward[typeId] ?? 1)*3.58;
    }
    if (!/centipede_(body|tail)/.test(typeId)) infoMap().relative(kills, 1);
});