import { Enchantment } from "@minecraft/server";
import { promise } from "./base.js";
let x_enchantments = Enchantment.Custom, databaseId = 'dest:database';
const q = { location: { x: 0.5, y: -64, z: 0.5 }, maxDistance: 10, type: databaseId };

export async function loadEnchantments() {
    await promise;
    const {successCount} = await world.overworld.runCommandAsync('structure load x_enchantments 0 -64 0');
    let entities = world.overworld.getEntities(q);
    while(entities.length<=0){
        await sleep(5);
        entities = overworld.getEntities(q);
    }
    const entity = entities[0];
    if((!entity) && successCount) return console.error("error when loading enchantments",entity,successCount,entities.length);
    const { inventory: { container: inv, inventorySize: size } } = entity;
    for (let j = 0; j < size; j++) {
        const item = inv.getItem(j);
        if (item?.typeId !== 'minecraft:enchanted_book') break;
        const { enchantments: ench } = item;
        for (const E of ench) {
            const { type: { id }, level } = E;
            x_enchantments[id] ? x_enchantments[id][level] = E : x_enchantments[id] = { [level]: E };
        }
    }
    for (const e of entities){
        e.triggerEvent("dest:despawn");
    }
    for (const key of Object.getOwnPropertyNames(Enchantment.Custom)) await (Enchantment.Custom[key][1] = new Enchantment(Enchantment.Custom[key][2].type,1))
    return Enchantment.Custom;
}; 
const promise = loadEnchantments();

export { x_enchantments, promise };