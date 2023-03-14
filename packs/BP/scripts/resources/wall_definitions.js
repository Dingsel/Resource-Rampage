import { MinecraftBlockTypes, BlockPermutation } from "@minecraft/server";
import { BlockDefinition, LayerDefinitionBuilder, LayerMirrorDefinitonBuiler, LayerOverloadDefinitionBuilder, LayersDefinition, LayersDefinitionBuilder, WallDefiniton } from "utilities/import.js";

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
    .setUpLayers(new LayersDefinitionBuilder()
        .addLayer(new LayerMirrorDefinitonBuiler()
            .setMiddle(MinecraftBlockTypes.crimsonPlanks)
            .setSide([
                MinecraftBlockTypes.deepslateBricks,
                MinecraftBlockTypes.polishedBlackstoneBricks,
                new BlockDefinition(MinecraftBlockTypes.polishedBlackstoneBrickStairs, {weirdo_direction:0})
            ])
        )
    )
    .setBody(new LayerOverloadDefinitionBuilder()
        .addOverloads(new LayerMirrorDefinitonBuiler()

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