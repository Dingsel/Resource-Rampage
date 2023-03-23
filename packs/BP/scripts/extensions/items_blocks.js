import { Block, BlockPermutation, Enchantment, ItemStack } from '@minecraft/server';

const { defineProperties: setProperties } = Object;
const _setCanDestroy = ItemStack.prototype.setCanDestroy;
setProperties(ItemStack.prototype, {
    enchantments: {
        get() { return this.getComponent('enchantments').enchantments; },
        set(enchs) { return this.getComponent('enchantments').enchantments = enchs; }
    },
    setNameTag:{value(n){this.nameTag = n;return this;}},
    setLockMode:{value(n){this.lockMode = n;return this;}},
    setKeepOnDeath:{value(n){this.keepOnDeath = n;return this;}},
    setCanDestroy:{value(canDestroy){_setCanDestroy.call(this,canDestroy); return this;}}
});
Enchantment.Custom = Enchantment.Custom??{};
setProperties(Block.prototype, {
    canBeWaterlogged: { get() { return this.type.canBeWaterlogged } },
    inventory: { get() { return this.getComponent('minecraft:inventory') } },
    container: { get() { return this.getComponent('minecraft:inventory')?.container; } },
    setTo:{value(type){
        if(type instanceof BlockPermutation) this.setPermutation(type);
        else this.setType(type);
    }}
});