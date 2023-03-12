import {Block, ContainerSlot, ItemStack} from '@minecraft/server';

Object.defineProperties(ItemStack.prototype,{
    enchantments: {
        get(){return this.getComponent('enchantments').enchantments;},
        set(enchs){return this.getComponent('enchantments').enchantments = enchs;}
    }
});
Object.defineProperties(Block.prototype,{
    canBeWaterlogged:{get(){return this.type.canBeWaterlogged}},
    inventory   : { get() { return this.getComponent('minecraft:inventory') } },
    container:{ get(){return this.getComponent('minecraft:inventory')?.container;} }
});