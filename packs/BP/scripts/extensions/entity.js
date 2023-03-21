import { Entity, Player, MolangVariableMap, GameMode } from '@minecraft/server';

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
    }
});
