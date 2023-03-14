import { Block, ItemStack } from '@minecraft/server';

const { defineProperties: setProperties } = Object;
setProperties(ItemStack.prototype, {
    enchantments: {
        get() { return this.getComponent('enchantments').enchantments; },
        set(enchs) { return this.getComponent('enchantments').enchantments = enchs; }
    }
});
setProperties(Block.prototype, {
    canBeWaterlogged: { get() { return this.type.canBeWaterlogged } },
    inventory: { get() { return this.getComponent('minecraft:inventory') } },
    container: { get() { return this.getComponent('minecraft:inventory')?.container; } }
});