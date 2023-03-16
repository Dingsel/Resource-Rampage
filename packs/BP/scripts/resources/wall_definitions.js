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
    polishedBlackstoneBrickStairs
} = MinecraftBlockTypes;


export const wall_1_patterns = 
{
    top:{
        right:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs],
        middle:MinecraftBlockTypes.warpedPlanks,
        left:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs]
    },
    body:{
        right:[MinecraftBlockTypes.deepslateBricks],
        middle:MinecraftBlockTypes.deepslateBricks,
        left:[MinecraftBlockTypes.deepslateBricks]
    },
    bottom:{
        right:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs],
        middle:MinecraftBlockTypes.stonebrick,
        left:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs]
    }
};
export const level_1 = new WallDefiniton()
    .setDownLayers(new LayersDefinitionBuilder()
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setMiddle("bedrock")
        )
    )
    .setUpLayers(new LayersDefinitionBuilder()
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setMiddle(crimsonPlanks)
            .setSide([
                deepslateBricks,
                polishedBlackstoneBricks,
                new BlockDefinition(polishedBlackstoneBrickStairs, {weirdo_direction:3, upside_down_bit:true})
            ])
        )
    )
    .setBody(new LayerOverloadDefinitionBuilder()
        .addOverloads(new LayerMirrorDefinitonBuiler()
            .setMiddle(polishedBlackstoneBricks)
            .setSide([
                polishedBlackstoneBricks
            ])
        )
    )
/*{
    step_overloads:[wall_1_patterns,
        {
            top:{
                right:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs],
                middle:MinecraftBlockTypes.warpedPlanks,
                left:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs]
            },
            body:{
                right:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.cherryLog],
                middle:MinecraftBlockTypes.deepslateBricks,
                left:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.cherryLog]
            },
            bottom:{
                right:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs],
                middle:MinecraftBlockTypes.stonebrick,
                left:[MinecraftBlockTypes.deepslateBricks,MinecraftBlockTypes.polishedBlackstoneBricks,MinecraftBlockTypes.polishedBlackstoneBrickStairs]
            }
        }
    ]
};*/

export const definitions = {
    level_1
};