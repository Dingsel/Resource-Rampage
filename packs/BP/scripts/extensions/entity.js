import { Entity, Player } from '@minecraft/server';

Object.defineProperties(Entity.prototype, {
    toString    : { value() { return `[Entity: ${this.typeId}]`; } },
    inventory   : { get() { return this.getComponent('minecraft:inventory') } },
    container   : { get() { return this.getComponent('minecraft:inventory')?.container } },
    health      : { get() { return this.getComponent('minecraft:health')?.current }, set(n) { this.getComponent('minecraft:health').setCurrent(n) } },
    maxHealth   : { get() { return this.getComponent('minecraft:health')?.value } },
    viewBlock   : { get() { return this.getBlockFromViewDirection({ maxDisatnce: 10, includePassableBlocks: true }); } },
    viewEntities: { get() { return this.getEntitiesFromViewDirection({ maxDisatnce: 10 }); } },
    scores: {
        get() {
            const entity = this
            return new Proxy({}, {
                get(_, property) {
                    try {
                        return world.scoreboard.getObjective(property).getScore(entity.scoreboard)
                    } catch {
                        return NaN
                    }
                },
                set(_, property, value) {
                    entity.runCommandAsync(`scoreboard players set @s "${property}" ${value}`)
                }
            })
        }
    }
});
Object.defineProperties(Player.prototype, {
    toString: { value() { return `[Player: ${this.name}]`; } },
    mainhand: { get() { return this.container.getSlot(this.selectedSlot); } },
    coins: {
        get() {
            return this.getDynamicProperty("coins")
        },
        set(value) {
            this.setDynamicProperty("coins", value)
        }
    }
});