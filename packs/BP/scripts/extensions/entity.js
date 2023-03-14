import { Entity, Player, MolangVariableMap } from '@minecraft/server';

const applyDamage = Entity.prototype.applyDamage, map = new MolangVariableMap()

Object.defineProperties(Entity.prototype, {
    toString: { value() { return `[Entity: ${this.typeId}]`; } },
    inventory: { get() { return this.getComponent('minecraft:inventory') } },
    container: { get() { return this.getComponent('minecraft:inventory')?.container } },
    health: { get() { return this.getComponent('minecraft:health')?.current }, set(n) { this.getComponent('minecraft:health').setCurrent(n) } },
    maxHealth: { get() { return this.getComponent('minecraft:health')?.value } },
    viewBlock: { get() { return this.getBlockFromViewDirection({ maxDisatnce: 10, includePassableBlocks: true }); } },
    viewEntities: { get() { return this.getEntitiesFromViewDirection({ maxDisatnce: 10 }); } },
    applyDamage: { value(amount, source) { applyDamage.call(this, amount, source); } },
    scores: {
        get() {
            const entity = this;
            return new Proxy({}, {
                get(_, property) {
                    try {
                        return world.scoreboard.getObjective(property).getScore(entity.scoreboard);
                    } catch { return NaN; }
                },
                set(_, property, value) {
                    entity.runCommandAsync(`scoreboard players set @s "${property}" ${value}`);
                }
            })
        }
    }
});
Object.defineProperties(Player.prototype, {
    toString: { value() { return `[Player: ${this.name}]`; } },
    mainhand: {
        get() { const { container, selectedSlot } = this; return container.getSlot(selectedSlot); },
        set(s) { const { container, selectedSlot } = this; container.setItem(selectedSlot, s); return s; }
    },
});