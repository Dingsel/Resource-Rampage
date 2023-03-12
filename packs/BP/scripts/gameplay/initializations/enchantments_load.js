import { system, world } from "@minecraft/server";

const x_enchantments = {},
    getDimension = world.getDimension.bind(world),
    overworld = getDimension('overworld'),
    { events: {
        entitySpawn
    } } = world,
    runCommand = overworld.runCommandAsync.bind(overworld);

export function loadEnchantments() {
    runCommand('tickingarea add circle 0 0 0 0 loadEnchant')
    return new Promise( res => {
        (async function load() {
            const {successCount} = await runCommand('structure load x_enchantments 0 0 0 0_degrees none true false')
            if (!successCount) return load()
            res(successCount)
            runCommand('tickingarea remove loadEnchant')
        })()
    })
};
loadEnchantments()
const evId = entitySpawn.subscribe(({ entity }) => {
    const { typeId } = entity
    print(typeId)
    if ('dest:database' !== typeId) return
    const { inventory: { container: inv, inventorySize: size } } = entity
    entity.triggerEvent('despawn')
    entitySpawn.unsubscribe(evId)
    for (let i = 0; i < size; i++) {
        const item = inv.getItem(i)
        if (item?.typeId !== 'minecraft:enchanted_book') continue
        const { enchantments: ench } = item
        for (const E of ench) {
            const { type: { id }, level } = E
            x_enchantments[id] ? x_enchantments[id][level] = E : x_enchantments[id] = { [level]: E }
        }
    }
});


export { x_enchantments };