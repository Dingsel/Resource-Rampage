import { MinecraftBlockTypes } from "@minecraft/server";

export const wall_1_patterns = 
{
    top:{
        right:[MinecraftBlockTypes.spruceLog],
        middle:MinecraftBlockTypes.stonebrick,
        left:[MinecraftBlockTypes.spruceLog]
    },
    body:{
        right:[],
        middle:MinecraftBlockTypes.basalt,
        left:[]
    },
    bottom:{
        right:[MinecraftBlockTypes.bedrock],
        middle:MinecraftBlockTypes.stonebrick,
        left:[MinecraftBlockTypes.bedrock]
    }
};
export const level_1 = {
    step_overloads:[wall_1_patterns,wall_1_patterns,wall_1_patterns,
        {
            top:{
                right:[MinecraftBlockTypes.spruceLog],
                middle:MinecraftBlockTypes.stonebrick,
                left:[MinecraftBlockTypes.spruceLog]
            },
            body:{
                right:[MinecraftBlockTypes.blackstone],
                middle:MinecraftBlockTypes.basalt,
                left:[MinecraftBlockTypes.blackstoneWall]
            },
            bottom:{
                right:[MinecraftBlockTypes.bedrock],
                middle:MinecraftBlockTypes.stonebrick,
                left:[MinecraftBlockTypes.bedrock]
            }
        }
    ]
};

export const definitions = {
    level_1
};