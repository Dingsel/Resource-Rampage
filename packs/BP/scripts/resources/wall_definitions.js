import { MinecraftBlockTypes, BlockPermutation } from "@minecraft/server";
import * as UT from "utilities/import.js";

const {
    WallDefiniton, 
    LayersDefinitionBuilder, 
    LayerMirrorDefinitonBuiler, 
    BlockDefinition,
    LayerOverloadDefinitionBuilder
} = UT;
const {
    crimsonPlanks,
    deepslateBricks,
    polishedBlackstoneBricks,
    polishedBlackstoneBrickStairs,
    blackstone,
    cherryLog, air
} = MinecraftBlockTypes;

export const level_1 = new WallDefiniton()
    .setDownLayers(new LayersDefinitionBuilder()
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setMiddle("bedrock"))
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setSide([
                deepslateBricks,
                blackstone,
                new BlockDefinition(polishedBlackstoneBrickStairs, {weirdo_direction:3})
            ]))
    )
    .setUpLayers(new LayersDefinitionBuilder()
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setMiddle(crimsonPlanks)
            .setSide([
                deepslateBricks,
                polishedBlackstoneBricks,
                new BlockDefinition(polishedBlackstoneBrickStairs, {weirdo_direction:3, upside_down_bit:true})
            ]))
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setSide([air,air, polishedBlackstoneBricks]))
    )
    .setBody(new LayerOverloadDefinitionBuilder()
        .addOverload(new LayerMirrorDefinitonBuiler()
            .setMiddle(polishedBlackstoneBricks)
            .setSide([polishedBlackstoneBricks]))
        .addOverload(new LayerMirrorDefinitonBuiler()
            .setMiddle(polishedBlackstoneBricks)
            .setSide([deepslateBricks,cherryLog]))
    )
export const definitions = {
    level_1
};