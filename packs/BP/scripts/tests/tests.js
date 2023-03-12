import { MinecraftBlockTypes, ScriptEventCommandMessageEvent } from "@minecraft/server";
import { ActionFormData } from '@minecraft/server-ui';
import { path } from "gameplay/building/index.js";
import { x_enchantments } from "gameplay/initializations/enchantments_load";

//please use sneak_case format for test names

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
    place_blocks(data) {
        const e = data.sourceEntity, dim = e.dimension;
        const { x: x1, y: y1, z: z1 } = e.location;
        for (let index = 0; index < 10; index++) {
            for (const { x: x, y: y, z: z, rotated } of path({ x: x1, y: y1 + index, z: z1 }, { x: x1 + 17, y: y1 + 3 + index, z: z1 + 4 })) {
                dim.setBlock({ x, y, z }, MinecraftBlockTypes.stone);
                if (!rotated) {
                    dim.setBlock({ x: x + 1, y, z }, MinecraftBlockTypes.blackstone);
                    dim.setBlock({ x: x - 1, y, z }, MinecraftBlockTypes.blackstone);
                } else {
                    dim.setBlock({ x, y, z: z - 1 }, MinecraftBlockTypes.blackstone);
                    dim.setBlock({ x, y, z: z + 1 }, MinecraftBlockTypes.blackstone);
                }
            }
        }
        return true;
    },
    add_enchantment(data) {
        const { sourceEntity } = data,
            item = sourceEntity.mainhand.getItem(),
            { enchantments: ench } = item
        ench.addEnchantment(x_enchantments['mending'][10])
        item.enchantments = ench
        sourceEntity.mainhand = item
        return true;
    }
}