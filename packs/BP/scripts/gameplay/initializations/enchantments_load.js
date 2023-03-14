import { system, world } from "@minecraft/server";

let x_enchantments = {}, databaseId = 'dest:database';

export function loadEnchantments() {
    const q = { location: { x: 0.5, y: 0, z: 0.5 }, maxDistance: 1, type: databaseId }
    return new Promise(async res => {
        await runCommand('tickingarea add circle 0 0 0 0 loadEnchant true');
        await runCommand('structure load x_enchantments 0 0 0 0_degrees none true false');
        (async function load() {
            const entities = [...world.overworld.getEntities(q)];
            if (!entities[0]) return system.run(load);
            let { length } = entities;
            x_enchantments = {};
            for (let i = 0; i < length; i++) {
                const entity = entities[i];
                const { inventory: { container: inv, inventorySize: size } } = entity;
                for (let j = 0; j < size; j++) {
                    const item = inv.getItem(j);
                    if (item?.typeId !== 'minecraft:enchanted_book') continue;
                    const { enchantments: ench } = item;
                    for (const E of ench) {
                        i == length ? null : i = length;
                        const { type: { id }, level } = E;
                        x_enchantments[id] ? x_enchantments[id][level] = E : x_enchantments[id] = { [level]: E };
                    }
                } entity.triggerEvent('despawn');
            } res(runCommand('tickingarea remove loadEnchant'));

        })();
    });
}; loadEnchantments();

export { x_enchantments };