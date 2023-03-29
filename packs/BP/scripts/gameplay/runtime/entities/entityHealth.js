import { MolangVariableMap } from "@minecraft/server";
import { EntityKillReward, InfoMapProperties } from "resources";

const map = new MolangVariableMap();
const infoMap = () => global.infoMap;
const maxChars = 20; //Move into global pls there are like 3 different files for it and idk which one to choose
const { coins, kills, level, woods, stones } = InfoMapProperties;
const { overworld: ovw } = world;
const getEntities = ovw.getEntities.bind(ovw);
const getEntity = world.getEntity.bind(world)



function updateName(entity) {
    const { typeId: type } = entity;
    if (!getEntities({ type, families: ['enemy'] }).length) return;
    if (/centipede_(body|tail)/.test(type) && entity.hasTag('centipede')) {
        const tag = entity.getTags()[1];
        const head = getEntity(tag);
        const { health, maxHealth } = head
        const fullChars = maxChars - ~~((health > 0 ? health : 0.01) / maxHealth * maxChars);
        return getEntities({ tags: [tag] }).forEach(limb => {
            return limb.nameTag = "§4|".repeat(maxChars - fullChars) + "§8|".repeat(fullChars);
        })
    }
    const {current:health,value:maxHealth} = entity.getComponent('health') ??{}
    const fullChars = maxChars - ~~((health > 0 ? health : 0) / maxHealth * maxChars);
    entity.nameTag = "§4|".repeat(maxChars - fullChars) + "§8|".repeat(fullChars);
}
events.entitySpawn.subscribe(ev => updateName(ev.entity));
events.entityHurt.subscribe(ev => updateName(ev.hurtEntity));
events.entityDie.subscribe(({ deadEntity: entity }) => {
    const { location, typeId } = entity
    if (/minecraft:|start_round/.test(typeId)) return;
    entity.nameTag = "§8|".repeat(maxChars);
    overworld.spawnParticle("dest:coin", location, map);
    infoMap().relative(coins, EntityKillReward[typeId] ?? 1);
    if (!/centipede_(body|tail)/.test(typeId)) infoMap().relative(kills, 1);
});