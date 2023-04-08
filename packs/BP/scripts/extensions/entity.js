import { Entity, Player, MolangVariableMap, GameMode, Container } from '@minecraft/server';
import { ActionFormData, MessageFormData } from '@minecraft/server-ui';
import { PlayerDynamicProperties } from 'resources';

const applyDamage = Entity.prototype.applyDamage, map = new MolangVariableMap(), { scoreboard } = world,
    { defineProperties, values } = Object, { from } = Array;

Entity.prototype.cd = 0
Object.assign(Entity.prototype,{
    updateHealths(){}
});
Container.prototype[Symbol.iterator] = function*(){
    for (let i = 0; i < this.emptySlotsCount; i++) yield this.getSlot(i);
}
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
    isValidHandle: {get(){ try { this.id; return true; } catch {return false;}}},
    scale:{get(){return this.getComponent('scale').value},set(v){return this.getComponent('scale').value=v}},
    // cd:{value: 0,enumerable: true},
    scores: {
        get() {
            const entity = this, { scoreboard: sbId } = this;
            return new Proxy({}, {
                get(_, o) { try { return sbId.getScore(objectives(o)); } catch { return 0 } },
                set(_, o, n) {
                    if (!sbId) return entity.runCommand(`scoreboard players set @s "${o}" ${n}`);
                    return o = objectives(o), scoreboard.setScore(o, sbId, n);
                }
            })
        }
    }
});
Object.assign(Player.prototype,{
    getGameMode() {return Object.getOwnPropertyNames(GameMode).find(gameMode => world.getPlayers({ name:this.name, gameMode }).length)??"defualt"},
    setGameMode(mode) {return this.runCommandAsync("gamemode " + mode);},
    setCameraPermission(bool) {return this.runCommandAsync("inputpermission set @s camera " + (bool?"enabled":"disabled"));},
    setMovementPermission(bool) {return this.runCommandAsync("inputpermission set @s movement  " + (bool?"enabled":"disabled"));},
    async confirm(body,title="form.confirm.title"){
        const confirm = new MessageFormData();
        confirm.body(body??"")
        confirm.title(title)
        confirm.button2("form.close");
        confirm.button1("form.confirm.button");
        const {output, canceled} = await confirm.show(this);
        return (!canceled)&&(output==1);
    },
    async info(body,title="form.info.title"){
        const info = new ActionFormData();
        info.body(body??"")
        info.title(title)
        info.button("form.ok");
        return info.show(this);
    },
    sendTip(message,timeout = 160){
        if(!this[_tips]) this[_tips] = [];
        this[_tips].push({content:message,timeout});
    },
    getTips(){return this[_tips]??[];},
    setTips(tips){if(Array.isArray(tips)) this[_tips] = tips;},
});
defineProperties(Player.prototype, {
    toString:{value() { return `[Player: ${this.name}]`;}},
    mainhand: {
        get() { return this.armor.getEquipmentSlot("mainhand"); },
        set(s) { this.armor.setEquipment("mainhand", s); return s; }
    },
    blueXp: {
        get(){return this.getDynamicProperty(PlayerDynamicProperties.BlueXp)??0},
        set(v){return this.setDynamicProperty(PlayerDynamicProperties.BlueXp,v)}
    },
    armorLevel: {
        get(){return this.getDynamicProperty(PlayerDynamicProperties.Armor)??0},
        set(v){return this.setDynamicProperty(PlayerDynamicProperties.Armor,v)}
    },
    swordLevel: {
        get(){return this.getDynamicProperty(PlayerDynamicProperties.Sword)??0},
        set(v){return this.setDynamicProperty(PlayerDynamicProperties.Sword,v)}
    },
    toolsLevel: {
        get(){return this.getDynamicProperty(PlayerDynamicProperties.Tools)??0},
        set(v){return this.setDynamicProperty(PlayerDynamicProperties.Tools,v)}
    },
    shieldLevel: {
        get(){return this.getDynamicProperty(PlayerDynamicProperties.Shield)??0},
        set(v){return this.setDynamicProperty(PlayerDynamicProperties.Shield,v)}
    },
    isOnline:{get(){return this[isJoined];}},
});

const isJoined = Symbol('joined');
const _tips = Symbol('tips');
Player.prototype[isJoined] = true;
const joinedPlayers = new Map();
world.events.playerSpawn.subscribe(({player,initialSpawn})=>{if(initialSpawn) { player[isJoined] = true; joinedPlayers.set(player.id,player);}});
world.events.playerLeave.subscribe(({playerId})=>{
    const player = joinedPlayers.get(playerId);
    player[isJoined] = false;
    joinedPlayers.delete(playerId);
});