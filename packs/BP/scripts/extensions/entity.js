import { Entity, Player, MolangVariableMap, world, GameMode } from '@minecraft/server';

const applyDamage = Entity.prototype.applyDamage, map = new MolangVariableMap()

Object.defineProperties(Entity.prototype, {
    toString: { value() { return `[Entity: ${this.typeId}]`; } },
    inventory: { get() { return this.getComponent('minecraft:inventory') } },
    container: { get() { return this.getComponent('minecraft:inventory')?.container } },
    armor: {get(){return this.getComponent('equipment_inventory');} },
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
        get() { return this.armor.getEquipmentSlot("mainhand"); },
        set(s) { this.armor.setEquipment("mainhand", s); return s; }
    },
    gamemode: {
        get(){
            for (const mode of [GameMode.survival,GameMode.creative,GameMode.spectator,GameMode.adventure]) {
                if(world.getPlayers({name:this.name,gameMode:mode}).length) return mode;
            }
            return "defualt";
        },
        set(mode){
            this.runCommandAsync("gamemode " + mode);
        }
    }
});

Entity.prototype.cd = 0