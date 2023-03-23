import { Entity, Player, MolangVariableMap, GameMode } from '@minecraft/server';
import { ActionFormData, MessageFormData } from '@minecraft/server-ui';

const applyDamage = Entity.prototype.applyDamage, map = new MolangVariableMap(), { scoreboard } = world,
    { defineProperties, values } = Object, { from } = Array;

Entity.prototype.cd = 0
defineProperties(Entity.prototype, {
    toString: { value() { return `[Entity: ${this.typeId}]`; } },
    inventory: { get() { return this.getComponent('inventory') } },
    container: { get() { return this.getComponent('inventory')?.container } },
    armor: { get() { return this.getComponent('equipment_inventory'); } },
    health: { get() { return this.getComponent('health')?.current }, set(n) { this.getComponent('health').setCurrent(n) } },
    maxHealth: { get() { return this.getComponent('health')?.value } },
    viewBlock: { get() { return this.getBlockFromViewDirection({ maxDisatnce: 10, includePassableBlocks: true }); } },
    viewEntities: { get() { return this.getEntitiesFromViewDirection({ maxDisatnce: 10 }); } },
    applyDamage: { value(amount, source) { applyDamage.call(this, amount, source); } },
    // cd:{value: 0,enumerable: true},
    scores: {
        get() {
            const entity = this, { scoreboard: sbId } = this;
            return new Proxy({}, {
                get(_, o) { try { return sbId.getScore(objectives[o]); } catch { return 0 } },
                set(_, o, n) {
                    if (!sbId) return entity.runCommand(`scoreboard players set @s "${o}" ${n}`);
                    return o = objectives[o] ?? (objectives[o] = o), scoreboard.setScore(o, sbId, n);
                }
            })
        }
    }
});

defineProperties(Player.prototype, {
    toString: { value() { return `[Player: ${this.name}]`; } },
    mainhand: {
        get() { return this.armor.getEquipmentSlot("mainhand"); },
        set(s) { this.armor.setEquipment("mainhand", s); return s; }
    },
    gamemode: {
        get(name) {
            return (name = this.name),
                values(GameMode).find(gameMode => world.getPlayers({ name, gameMode }).length) ?? 'default';
        },
        set(mode) {
            this.runCommandAsync("gamemode " + mode);
        }
    },
    confirm:{async value(body,title="form.confirm.title"){
        const confirm = new MessageFormData();
        confirm.body(body??"")
        confirm.title(title)
        confirm.button2("form.close");
        confirm.button1("form.confirm.button");
        const {output, canceled} = await confirm.show(this);
        return (!canceled)&&(output==1);
    }},
    info:{async value(body,title="form.info.title"){
        const info = new ActionFormData();
        info.body(body??"")
        info.title(title)
        info.button("form.ok");
        return info.show(this);
    }},
    isOnline:{get(){return this[isJoined];}}
});
const isJoined = Symbol('joined');
Player.prototype[isJoined] = true;
const joinedPlayers = new Map();
world.events.playerSpawn.subscribe(({player,initialSpawn})=>{if(initialSpawn) { player[isJoined] = true; joinedPlayers.set(player.id,player);}});
world.events.playerLeave.subscribe(({playerId})=>{
    const player = joinedPlayers.get(playerId);
    player[isJoined] = false;
    joinedPlayers.delete(playerId);
});