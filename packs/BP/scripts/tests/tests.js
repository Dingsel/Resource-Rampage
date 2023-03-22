import { MinecraftBlockTypes, MinecraftEnchantmentTypes, ScriptEventCommandMessageEvent } from "@minecraft/server";
import { ActionFormData } from '@minecraft/server-ui';
import { buildWall, path } from "gameplay/building/index.js";
import { x_enchantments } from "gameplay/initializations/enchantments_load";
import { level_1 } from "resources";

//please use sneak_case format for test names

/**@type {{[any:string]:(d:ScriptEventCommandMessageEvent)=>boolean}} */
export const tests = {
    async show_end_form(data) {
        let form = new ActionFormData();
        form.title("§0§1§rThe Title") //§0§1 is prefix for conditional rendering
        form.body("The details multiline")
        form.button("The Close Button");
        await nextTick;
        form.show(data.sourceEntity);
        return true;
    },
    async place_blocks(data) {
        const e = data.sourceEntity, dim = e.dimension;
        const { x: x1, y: y1, z: z1 } = e.location;
        console.warn("run");
        await buildWall({ x: x1, y: y1, z: z1 }, { x: x1 + 30, y: y1 + 40, z: z1 - 200},level_1, dim);
        return true;
    },
    add_enchantment(data) {
        const { sourceEntity } = data, item = sourceEntity.mainhand.getItem(), { enchantments: ench } = item, results = {}, lvl = 7;
        for (const key in x_enchantments) {
            if (ench.addEnchantment(x_enchantments[key][lvl])) results['§aadded§r'] ? results['§aadded§r'] += `, ${key} ${lvl}` : results['§aadded§r'] = `${key} ${lvl}`;
            else results['§cinvalid§r'] ? results['§cinvalid§r'] += `, ${key} ${lvl}` : results['§cinvalid§r'] = `${key} ${lvl}`;
        } print(JSON.stringify(results, 0, 3))
        item.enchantments = ench;
        sourceEntity.mainhand = item;
        return true;
    }
}