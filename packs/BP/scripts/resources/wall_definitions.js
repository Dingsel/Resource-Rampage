import { MinecraftBlockTypes, BlockPermutation } from "@minecraft/server";
import * as UT from "utilities/import.js";

const {
    WallDefiniton, 
    LayersDefinitionBuilder, 
    LayerMirrorDefinitonBuiler, 
    BlockDefinition,
    LayerOverloadDefinitionBuilder,
    LayerDefinition
} = UT;
const {
    crimsonPlanks,
    deepslateBricks, deepslateTileWall,
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
            .addLayer(new LayerOverloadDefinitionBuilder()
                .addOverload(new LayerMirrorDefinitonBuiler().setSide([air, deepslateTileWall, polishedBlackstoneBricks]))
                .addOverload(new LayerMirrorDefinitonBuiler().setSide([air, air, polishedBlackstoneBricks]),3))
            .addLayer(new LayerOverloadDefinitionBuilder()
                .addOverload(new LayerMirrorDefinitonBuiler().setSide([air, deepslateTileWall, polishedBlackstoneBrickStairs]))
                .addOverload(new LayerDefinition())
                .addOverload(new LayerMirrorDefinitonBuiler().setSide([air, air, polishedBlackstoneBrickStairs]))
                .addOverload(new LayerDefinition()))
            .addLayer(new LayerOverloadDefinitionBuilder()
                .addOverload(new LayerMirrorDefinitonBuiler().setSide([air, deepslateTileWall]))
                .addOverload(new LayerDefinition(),3),4)
        
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
export const WallLevels = [
    level_1
]